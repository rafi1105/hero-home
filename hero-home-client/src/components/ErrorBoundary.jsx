import { Component } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${({ theme }) => theme === 'dark' ? '#1a1a1a' : '#f5f5f5'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#333'};
`;

const ErrorTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #dc3545;
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 600px;
`;

const ReloadButton = styled.button`
  padding: 12px 24px;
  background: #4700B0;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #3a0088;
    transform: translateY(-2px);
  }
`;

const ClearDataButton = styled.button`
  padding: 12px 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
    transform: translateY(-2px);
  }
`;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Try to clear potentially corrupted data
    this.clearCorruptedData();
  }

  clearCorruptedData = () => {
    try {
      // Check for corrupted localStorage items
      const itemsToCheck = ['darkMode', 'token'];
      itemsToCheck.forEach(item => {
        try {
          const value = localStorage.getItem(item);
          if (value) {
            JSON.parse(value);
          }
        } catch (e) {
          console.warn(`Corrupted ${item} in localStorage, removing...`);
          localStorage.removeItem(item);
        }
      });
    } catch (e) {
      console.error('Error clearing corrupted data:', e);
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleClearData = () => {
    if (window.confirm('This will clear all app data and reload. Continue?')) {
      try {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      } catch (error) {
        console.error('Error clearing data:', error);
        window.location.reload();
      }
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
          <ErrorTitle>⚠️ Something went wrong</ErrorTitle>
          <ErrorMessage>
            The app encountered an error. This might be due to corrupted browser data.
            Try reloading the page, or clear app data to start fresh.
          </ErrorMessage>
          <div>
            <ReloadButton onClick={this.handleReload}>
              🔄 Reload Page
            </ReloadButton>
            <ClearDataButton onClick={this.handleClearData}>
              🗑️ Clear Data & Reload
            </ClearDataButton>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '2rem', maxWidth: '800px' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '1rem' }}>Error Details</summary>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '1rem', 
                borderRadius: '8px',
                overflow: 'auto',
                color: '#333'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
