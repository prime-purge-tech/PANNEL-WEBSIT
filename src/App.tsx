import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Help from './pages/Help';
import MobilePay from './pages/MobilePay';
import MiniPay from './pages/MiniPay';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/donate/mobilepay" element={<MobilePay />} />
        <Route path="/donate/minipay" element={<MiniPay />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}
