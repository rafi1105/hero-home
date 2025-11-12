import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const NotFound = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <NotFoundWrapper $isDark={isDarkMode}>
      <motion.div
        className="content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-home">
          Back to Home
        </button>
      </motion.div>
    </NotFoundWrapper>
  );
};

const NotFoundWrapper = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.$isDark ? '#1a1a2e' : '#f8f9fa'};
  padding: 2rem;

  .content {
    text-align: center;
    max-width: 600px;

    .error-code {
      font-size: 10rem;
      font-weight: 700;
      color: #4700B0;
      line-height: 1;
      margin-bottom: 1rem;

      @media (max-width: 768px) {
        font-size: 6rem;
      }
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      margin-bottom: 1rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    p {
      font-size: 1.2rem;
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      margin-bottom: 2rem;
    }

    .btn-home {
      padding: 1rem 2.5rem;
      background: #4700B0;
      color: white;
      border: none;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(71, 0, 176, 0.3);

      &:hover {
        background: #3a0088;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(71, 0, 176, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
`;

export default NotFound;

