import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Switch from './ui/Switch';
import styled from 'styled-components';
import { useState } from 'react';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <HeaderWrapper $isDark={isDarkMode}>
      <nav className="navbar ">
        <div className="container">
          <Link to="/" className="logo">
            <img src="/mechanic.png" alt="HomeHero Logo" className="logo-image  " />
            <span className="logo-text !mr-9">Home Hero</span>
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
              <Switch className="!px-20" />
              
              {currentUser ? (
                <div className="user-info">
                  <img 
                    src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || currentUser.email)}&background=4700B0&color=fff`} 
                    alt="Profile" 
                    className="profile-image"
                  />
                  <span className="user-name">{currentUser.displayName || currentUser.email}</span>
                  <button onClick={handleLogout} className="btn-logout">
                    <div className="sign">
                      <svg viewBox="0 0 512 512">
                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                      </svg>
                    </div>
                    <div className="text">Logout</div>
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
            </div>
          </div>
        </div>
      </nav>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, #4700B0, #000000)' 
    : 'linear-gradient(90deg, #4700B0, #000)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.$isDark 
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
    gap: 1rem;
    text-decoration: none;
    transition: transform 0.3s ease;
    flex-shrink: 0;

    &:hover {
      transform: scale(1.05);
    }

    .logo-image {
      height: 60px;
      width: auto;
      background: white;
      padding: 8px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .logo-text {
      font-family: 'Agbalumo', cursive;
      font-size: 1.8rem;
      font-weight: 400;
      color: white;
      letter-spacing: 0.5px;
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
      background: ${props => props.$isDark 
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

  .theme-toggle-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;

    svg {
      width: 24px;
      height: 24px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1) rotate(15deg);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
    }

    &:active {
      transform: scale(0.95);
    }

    @media (max-width: 968px) {
      width: 100%;
      border-radius: 10px;
      padding: 0.8rem;
      height: auto;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    @media (max-width: 968px) {
      flex-direction: column;
    }

    .profile-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .user-name {
      color: white;
      font-weight: 500;
      font-size: 0.95rem;
      
      @media (max-width: 968px) {
        display: none;
      }
    }
  }

  .btn-login, .btn-register {
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
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: #4700B0;

    &:hover {
      width: 125px;
      border-radius: 40px;
      transition-duration: 0.3s;
    }

    &:active {
      transform: translate(2px, 2px);
    }

    .sign {
      width: 100%;
      transition-duration: 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 17px;
        
        path {
          fill: white;
        }
      }
    }

    &:hover .sign {
      width: 30%;
      transition-duration: 0.3s;
      padding-left: 20px;
    }

    .text {
      position: absolute;
      right: 0%;
      width: 0%;
      opacity: 0;
      color: white;
      font-size: 1.2em;
      font-weight: 600;
      transition-duration: 0.3s;
    }

    &:hover .text {
      opacity: 1;
      width: 70%;
      transition-duration: 0.3s;
      padding-right: 10px;
    }

    @media (max-width: 968px) {
      width: 125px;
      border-radius: 40px;

      .sign {
        width: 30%;
        padding-left: 20px;
      }

      .text {
        opacity: 1;
        width: 70%;
        padding-right: 10px;
      }
    }
  }

  .theme-toggle {
    @media (max-width: 968px) {
      margin-top: 1rem;
      order: -1;
    }
  }
`;

export default Header;

