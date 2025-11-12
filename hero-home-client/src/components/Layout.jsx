import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const Layout = () => {
  const { isDarkMode } = useTheme();

  return (
    <LayoutWrapper isDark={isDarkMode}>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.isDark 
    ? 'linear-gradient(to bottom, #0f0f1e, #1a1a2e)' 
    : 'linear-gradient(to bottom, #f8f9fa, #e9ecef)'};
  color: ${props => props.isDark ? '#ffffff' : '#212529'};
  transition: all 0.3s ease;

  .main-content {
    flex: 1;
    width: 100%;
  }
`;

export default Layout;
