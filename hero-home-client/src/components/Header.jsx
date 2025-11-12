import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Switch from './ui/Switch';
import styled from 'styled-components';
import { useState } from 'react';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <HeaderWrapper isDark={isDarkMode}>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">HomeHero</span>
          </Link>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <NavLink to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/services" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Services
            </NavLink>
            
            {currentUser && (
              <>
                <NavLink to="/my-services" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  My Services
                </NavLink>
                <NavLink to="/add-service" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Add Service
                </NavLink>
                <NavLink to="/my-bookings" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  My Bookings
                </NavLink>
                <NavLink to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </NavLink>
              </>
            )}

            <div className="auth-section">
              {currentUser ? (
                <div className="user-info">
                  <span className="user-name">{currentUser.displayName || currentUser.email}</span>
                  <button onClick={handleLogout} className="btn-logout">
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <NavLink to="/login" className="btn-login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </NavLink>
                  <NavLink to="/register" className="btn-register" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </NavLink>
                </>
              )}
              <div className="theme-toggle">
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
  background: ${props => props.isDark 
    ? 'rgba(71, 0, 176, 0.8)' 
    : 'rgba(71, 0, 176, 0.8)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.2)'};
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;

  .navbar {
    padding: 1rem 0;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    transition: transform 0.3s ease;
    flex-shrink: 0;

    &:hover {
      transform: scale(1.05);
    }

    .logo-icon {
      font-size: 1.8rem;
    }

    .logo-text {
      color: #fff;
    }
  }

  .mobile-menu-btn {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;

    span {
      width: 25px;
      height: 3px;
      background: white;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    @media (max-width: 968px) {
      display: flex;
    }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex: 1;
    justify-content: center;

    @media (max-width: 968px) {
      position: fixed;
      top: 80px;
      left: -100%;
      width: 100%;
      height: calc(100vh - 80px);
      background: ${props => props.isDark 
        ? 'rgba(71, 0, 176, 0.95)' 
        : 'rgba(71, 0, 176, 0.95)'};
      backdrop-filter: blur(10px);
      flex-direction: column;
      justify-content: flex-start;
      padding: 2rem;
      gap: 1.5rem;
      transition: left 0.3s ease;

      &.active {
        left: 0;
      }
    }
  }

  .nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
    font-size: 1rem;
    white-space: nowrap;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    &.active {
      background: rgba(255, 255, 255, 0.2);
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 30px;
        height: 2px;
        background: white;
        border-radius: 2px;
      }
    }

    @media (max-width: 968px) {
      width: 100%;
      text-align: center;
    }
  }

  .auth-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;

    @media (max-width: 968px) {
      flex-direction: column;
      width: 100%;
      margin-top: 1rem;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    @media (max-width: 968px) {
      flex-direction: column;
    }

    .user-name {
      color: white;
      font-weight: 500;
      font-size: 0.95rem;
    }
  }

  .btn-login, .btn-register, .btn-logout {
    padding: 0.5rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.8);
    cursor: pointer;
    white-space: nowrap;

    @media (max-width: 968px) {
      width: 100%;
      text-align: center;
    }
  }

  .btn-login {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);

    &:hover {
      background: white;
      color: #4700B0;
    }
  }

  .btn-register {
    background: rgba(255, 255, 255, 0.9);
    color: #4700B0;
    border-color: transparent;

    &:hover {
      background: white;
      transform: translateY(-2px);
    }
  }

  .btn-logout {
    background: rgba(255, 71, 87, 0.8);
    color: white;
    border-color: transparent;

    &:hover {
      background: #ff4757;
      transform: translateY(-2px);
    }
  }

  .theme-toggle {
    @media (max-width: 968px) {
      margin-top: 1rem;
    }
  }
`;

export default Header;
