import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <FooterWrapper isDark={isDarkMode}>
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">
            <span className="logo-icon">🏠</span>
            HomeHero
          </h3>
          <p className="footer-description">
            Connect with trusted local service providers. Quality services at your doorstep.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Services</h4>
          <ul className="footer-links">
            <li><a href="/services?category=plumbing">Plumbing</a></li>
            <li><a href="/services?category=electrical">Electrical</a></li>
            <li><a href="/services?category=cleaning">Cleaning</a></li>
            <li><a href="/services?category=carpentry">Carpentry</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Contact Info</h4>
          <div className="contact-info">
            <div className="contact-item">
              <MdEmail />
              <span>info@homehero.com</span>
            </div>
            <div className="contact-item">
              <MdPhone />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <MdLocationOn />
              <span>123 Service Street, City, State 12345</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HomeHero. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="/privacy">Privacy Policy</a>
          <span>|</span>
          <a href="/terms">Terms of Service</a>
          <span>|</span>
          <a href="/cookies">Cookie Policy</a>
        </div>
      </div>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  background: ${props => props.isDark 
    ? '#1a0b2e' 
    : '#4700B0'};
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }

  .footer-section {
    .footer-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      @media (max-width: 768px) {
        justify-content: center;
      }

      .logo-icon {
        font-size: 2rem;
      }
    }

    .footer-description {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .section-title {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 0.5rem;

        a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;

          &:hover {
            color: white;
            transform: translateX(5px);
          }
        }
      }
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      @media (max-width: 768px) {
        align-items: center;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: rgba(255, 255, 255, 0.8);

        svg {
          font-size: 1.2rem;
          flex-shrink: 0;
        }
      }
    }
  }

  .social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;

    @media (max-width: 768px) {
      justify-content: center;
    }

    a {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-3px);
      }
    }
  }

  .footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem 2rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }

    p {
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
    }

    .footer-bottom-links {
      display: flex;
      gap: 1rem;
      align-items: center;

      a {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: white;
        }
      }

      span {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
`;

export default Footer;
