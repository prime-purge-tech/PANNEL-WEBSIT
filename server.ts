import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  const PTERO_URL = process.env.PTERODACTYL_URL;
  const PTERO_KEY = process.env.PTERODACTYL_API_KEY;

  if (!PTERO_URL || !PTERO_KEY) {
    console.error("CRITICAL ERROR: PTERODACTYL_URL or PTERODACTYL_API_KEY is missing in .env file!");
  }

  const pteroApi = axios.create({
    baseURL: PTERO_URL,
    headers: {
      "Authorization": `Bearer ${PTERO_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });

  // Add axios request interceptor to catch invalid URL errors early
  pteroApi.interceptors.request.use((config) => {
    if (!config.baseURL) {
      throw new Error("PTERODACTYL_URL is not defined in environment variables.");
    }
    try {
      new URL(config.baseURL);
    } catch (e) {
      throw new Error(`Invalid PTERODACTYL_URL: "${config.baseURL}". It must be a full URL (e.g., https://panel.example.com)`);
    }
    return config;
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/config", (req, res) => {
    res.json({ panelUrl: process.env.PTERODACTYL_URL });
  });

  // Fetch all nests and their eggs
  app.get("/api/nests", async (req, res) => {
    try {
      const response = await pteroApi.get("/api/application/nests?include=eggs");
      res.json(response.data);
    } catch (error: any) {
      console.error("Failed to fetch nests:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch server types from panel." });
    }
  });

  // Connect existing account and fetch servers
  app.post("/api/users/connect", async (req, res) => {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ error: "Identifier is required." });

    try {
      // Try finding by email first
      let usersRes = await pteroApi.get(`/api/application/users?filter[email]=${identifier}`);
      
      // If not found, try by username
      if (usersRes.data.data.length === 0) {
        usersRes = await pteroApi.get(`/api/application/users?filter[username]=${identifier}`);
      }

      if (usersRes.data.data.length === 0) {
        return res.status(404).json({ error: "No account found with this identifier on the panel." });
      }

      const user = usersRes.data.data[0].attributes;
      const userId = user.id;
      const isAdmin = user.root_admin === true;

      // Fetch user's servers
      const userServersRes = await pteroApi.get(`/api/application/users/${userId}?include=servers`);
      const serversData = userServersRes.data.attributes.relationships.servers.data.map((s: any) => ({
        id: s.attributes.id.toString(),
        identifier: s.attributes.identifier,
        name: s.attributes.name,
        type: s.attributes.egg_name || 'Server',
        cpu: s.attributes.limits.cpu,
        ram: s.attributes.limits.memory,
        disk: s.attributes.limits.disk,
        status: s.attributes.suspended ? 'suspended' : 'active',
        createdAt: s.attributes.created_at
      }));

      res.json({
        success: true,
        user: {
          username: user.username,
          email: user.email,
          isAdmin: isAdmin
        },
        servers: serversData
      });

    } catch (error: any) {
      console.error("Error connecting account:", error.response?.data || error.message);
      res.status(500).json({ error: "Error connecting to Pterodactyl panel." });
    }
  });

  // Create User and Server
  app.post("/api/servers/create", async (req, res) => {
    const { username, email, password, serverName, eggId, nestId, cpu, ram, disk } = req.body;

    if (!username || !serverName || !eggId || !nestId) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const parsedRam = ram ? parseInt(ram) : 0;
    const parsedDisk = disk ? parseInt(disk) : 0;
    const parsedCpu = cpu ? parseInt(cpu) : 0;

    const userEmail = email || `${username}@freepanelsservers.local`;

    try {
      // 1. Check if user exists or create them
      let userId;
      const usersRes = await pteroApi.get(`/api/application/users?filter[email]=${userEmail}`);
      
      if (usersRes.data.data.length > 0) {
        const user = usersRes.data.data[0].attributes;
        userId = user.id;
        const isAdmin = user.root_admin === true;
        
        // Check server limit (Max 2 for non-admins on free plans)
        const userServers = await pteroApi.get(`/api/application/users/${userId}?include=servers`);
        const serverCount = userServers.data.attributes.relationships.servers.data.length;
        const isPaidPlan = parsedRam > 512 || parsedCpu > 100 || parsedDisk > 2048 || parsedRam === 0;
        
        if (!isAdmin && serverCount >= 2 && !isPaidPlan) {
          return res.status(403).json({ error: "You have reached the maximum limit of 2 free servers." });
        }
      } else {
        if (!password) {
          return res.status(400).json({ error: "A password is required to create a new account." });
        }
        // Create new user
        const newUser = await pteroApi.post("/api/application/users", {
          email: userEmail,
          username: username,
          first_name: username,
          last_name: "User",
          password: password
        });
        userId = newUser.data.attributes.id;
      }

      // 2. Fetch Egg details to get startup script, docker image, and default env vars
      const eggRes = await pteroApi.get(`/api/application/nests/${nestId}/eggs/${eggId}?include=variables`);
      const eggData = eggRes.data.attributes;
      
      const environment: Record<string, string> = {};
      eggData.relationships.variables.data.forEach((v: any) => {
        environment[v.attributes.env_variable] = v.attributes.default_value;
      });

      // 3. Create the server
      const serverPayload = {
        name: serverName,
        user: userId,
        egg: parseInt(eggId),
        nest: parseInt(nestId),
        docker_image: eggData.docker_image,
        startup: eggData.startup,
        environment: environment,
        limits: {
          memory: parsedRam,
          swap: 0,
          disk: parsedDisk,
          io: 500,
          cpu: parsedCpu
        },
        feature_limits: {
          databases: 0,
          backups: 0,
          allocations: 0
        },
        deploy: {
          locations: [1], // Assuming location ID 1 is your default node location
          dedicated_ip: false,
          port_range: []
        }
      };

      const newServer = await pteroApi.post("/api/application/servers", serverPayload);

      res.json({ 
        success: true, 
        message: "Server created successfully!", 
        server: newServer.data.attributes 
      });

    } catch (error: any) {
      console.error("Error creating server:", error.response?.data || error.message);
      res.status(500).json({ 
        error: "Failed to create server. Please check panel configuration.",
        details: error.response?.data?.errors
      });
    }
  });

  // Delete Server
  app.delete("/api/servers/:id", async (req, res) => {
    const serverId = req.params.id;
    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required." });
    }

    try {
      await pteroApi.delete(`/api/application/servers/${serverId}`);
      res.json({ success: true, message: "Server deleted successfully." });
    } catch (error: any) {
      console.error("Error deleting server:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to delete server from Pterodactyl." });
    }
  });

  // Power Server
  app.post("/api/servers/:identifier/power", async (req, res) => {
    const { identifier } = req.params;
    const { signal } = req.body;
    const clientApiKey = process.env.PTERODACTYL_CLIENT_API_KEY;
    
    if (!clientApiKey) {
      return res.status(400).json({ error: "Client API key is required for power actions." });
    }

    try {
      await axios.post(`${PTERO_URL}/api/client/servers/${identifier}/power`, { signal }, {
        headers: {
          "Authorization": `Bearer ${clientApiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending power signal:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to send power signal." });
    }
  });

  // Suspend Server
  app.post("/api/servers/:id/suspend", async (req, res) => {
    try {
      await pteroApi.post(`/api/application/servers/${req.params.id}/suspend`);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error suspending server:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to suspend server." });
    }
  });

  // Unsuspend Server
  app.post("/api/servers/:id/unsuspend", async (req, res) => {
    try {
      await pteroApi.post(`/api/application/servers/${req.params.id}/unsuspend`);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error unsuspending server:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to unsuspend server." });
    }
  });

  // Upgrade Server
  app.post("/api/servers/:id/upgrade", async (req, res) => {
    const { cpu, memory, disk } = req.body;

    try {
      const serverRes = await pteroApi.get(`/api/application/servers/${req.params.id}`);
      const s = serverRes.data.attributes;
      
      const payload = {
        allocation: s.allocation,
        memory: memory !== undefined ? memory : s.limits.memory,
        swap: s.limits.swap,
        disk: disk !== undefined ? disk : s.limits.disk,
        io: s.limits.io,
        cpu: cpu !== undefined ? cpu : s.limits.cpu,
        threads: s.limits.threads,
        feature_limits: s.feature_limits
      };

      await pteroApi.patch(`/api/application/servers/${req.params.id}/build`, payload);
      res.json({ success: true, limits: payload });
    } catch (error: any) {
      console.error("Error upgrading server:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to upgrade server." });
    }
  });

  // Get Server Resources
  app.get("/api/servers/:identifier/resources", async (req, res) => {
    const identifier = req.params.identifier;
    const clientApiKey = process.env.PTERODACTYL_CLIENT_API_KEY;

    if (!identifier) {
      return res.status(400).json({ error: "Server identifier is required." });
    }

    if (!clientApiKey) {
      // Return mocked data if no client API key is provided
      return res.json({
        success: true,
        resources: {
          current_state: "running",
          is_suspended: false,
          resources: {
            memory_bytes: Math.floor(Math.random() * 512 * 1024 * 1024),
            cpu_absolute: Math.floor(Math.random() * 50),
            disk_bytes: Math.floor(Math.random() * 1024 * 1024 * 1024),
            network_rx_bytes: 0,
            network_tx_bytes: 0
          }
        }
      });
    }

    try {
      const response = await axios.get(`${PTERO_URL}/api/client/servers/${identifier}/resources`, {
        headers: {
          "Authorization": `Bearer ${clientApiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      res.json({ success: true, resources: response.data.attributes });
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Server is suspended, installing, or transferring
        return res.json({
          success: true,
          resources: {
            current_state: "offline",
            is_suspended: true,
            resources: {
              memory_bytes: 0,
              cpu_absolute: 0,
              disk_bytes: 0,
              network_rx_bytes: 0,
              network_tx_bytes: 0
            }
          }
        });
      }
      console.error(`Error fetching resources for ${identifier}:`, error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch server resources." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
