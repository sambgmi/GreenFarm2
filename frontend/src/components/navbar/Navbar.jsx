import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { GiShoppingCart } from "react-icons/gi";
import SearchBar from '../search/SearchBar';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Add this to track current route
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [authState, setAuthState] = useState(!!user);

  useEffect(() => {
    setAuthState(!!user);
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuthState(false);
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <img src="/logo.png" alt="Agro India" />
          <span></span>
        </div>
        
        <div className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Mobile Cart Icon for Buyers */}
        {user?.role === 'BUYER' && (
          <div className="mobile-cart-icon">
            <Link to="/buyer" className={`cartIcon ${isActive('/buyer') ? 'active' : ''}`}>
              <GiShoppingCart size={24} />
            </Link>
          </div>
        )}

        <div className={`nav-content ${isMenuOpen ? 'active' : ''}`}>
          <div className="search-bar">
            <SearchBar />
          </div>
    
          <div className="nav-links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
            <Link to="/products" className={isActive('/products') ? 'active' : ''}>Products</Link>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact Us</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className={`dashboard-btn ${isActive('/admin') ? 'active' : ''}`}>
                Dashboard
              </Link>
            )}
            {user?.role === 'FARMER' && (
              <Link to="/farmer" className={`dashboard-btn ${isActive('/farmer') ? 'active' : ''}`}>
                Dashboard
              </Link>
            )}
            {/* Desktop Cart Icon - Only visible on larger screens */}
            {user?.role === 'BUYER' && (
              <Link to="/buyer" className={`cartIcon desktop-only ${isActive('/buyer') ? 'active' : ''}`}>
                <GiShoppingCart size={24} style={{ verticalAlign: 'middle' }} />
              </Link>
            )}

            {authState ? (
              <button 
                className="login-btn logout"
                onClick={handleLogout}
                style={{ 
                  marginLeft: 'auto', 
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '30px',
                  padding: '8px 20px',
                  border: 'none',
                  boxShadow: '0 4px 8px rgba(231, 76, 60, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {user?.email ? `Logout (${user.email})` : 'Logout'}
              </button>
            ) : (
              <button 
                className="login-btn"
                onClick={handleLogin}
                style={{ 
                  marginLeft: 'auto',
                  backgroundColor: '#00a152',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '30px',
                  padding: '8px 20px',
                  border: 'none',
                  boxShadow: '0 4px 8px rgba(0, 161, 82, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;