import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
import TestLogin from './pages/TestLogin';
import WishlistDetail from './pages/WishlistDetail';

export default function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={currentUser ? '/dashboard' : '/login'} />} />
        <Route path="/test-auth" element={<TestLogin />} />
        
<Route path="/wishlist/:id" element={<WishlistDetail />} />
      </Routes>
    </Router>
  );
}
