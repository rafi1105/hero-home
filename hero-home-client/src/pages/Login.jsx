import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import Loader from '../components/ui/Loader';

const Login = () => {
  const { isDarkMode } = useTheme();
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <LoginWrapper isDark={isDarkMode}>
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p className="subtitle">Login to access your account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-footer">
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button onClick={handleGoogleLogin} className="btn-google" disabled={loading}>
            <FaGoogle />
            <span>Continue with Google</span>
          </button>

          <p className="signup-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </LoginWrapper>
  );
};

const LoginWrapper = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: ${props => props.isDark 
    ? '#1a0b2e' 
    : '#4700B0'};

  .login-container {
    width: 100%;
    max-width: 450px;
  }

  .login-card {
    background: ${props => props.isDark ? '#1a1a2e' : 'white'};
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

    @media (max-width: 768px) {
      padding: 2rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0.5rem;
      color: ${props => props.isDark ? '#fff' : '#212529'};
    }

    .subtitle {
      text-align: center;
      color: ${props => props.isDark ? '#aaa' : '#6c757d'};
      margin-bottom: 2rem;
    }
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: ${props => props.isDark ? '#fff' : '#212529'};
    }

    input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid ${props => props.isDark ? '#2d2d44' : '#e0e0e0'};
      border-radius: 10px;
      font-size: 1rem;
      background: ${props => props.isDark ? '#0f0f1e' : 'white'};
      color: ${props => props.isDark ? '#fff' : '#212529'};
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      &::placeholder {
        color: ${props => props.isDark ? '#666' : '#999'};
      }
    }
  }

  .password-input {
    position: relative;

    input {
      padding-right: 3rem;
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: ${props => props.isDark ? '#aaa' : '#6c757d'};
      cursor: pointer;
      font-size: 1.2rem;
      transition: color 0.3s ease;

      &:hover {
        color: #667eea;
      }
    }
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1.5rem;

    .forgot-password {
      color: #667eea;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: color 0.3s ease;

      &:hover {
        color: #764ba2;
      }
    }
  }

  .btn-login {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .divider {
    margin: 2rem 0;
    text-align: center;
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: ${props => props.isDark ? '#2d2d44' : '#e0e0e0'};
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }

    span {
      background: ${props => props.isDark ? '#1a1a2e' : 'white'};
      padding: 0 1rem;
      color: ${props => props.isDark ? '#aaa' : '#6c757d'};
      font-weight: 600;
    }
  }

  .btn-google {
    width: 100%;
    padding: 1rem;
    background: ${props => props.isDark ? '#0f0f1e' : 'white'};
    color: ${props => props.isDark ? '#fff' : '#212529'};
    border: 2px solid ${props => props.isDark ? '#2d2d44' : '#e0e0e0'};
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    transition: all 0.3s ease;

    svg {
      font-size: 1.3rem;
      color: #ea4335;
    }

    &:hover:not(:disabled) {
      border-color: #667eea;
      background: ${props => props.isDark ? '#1a1a2e' : '#f8f9fa'};
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .signup-link {
    margin-top: 2rem;
    text-align: center;
    color: ${props => props.isDark ? '#aaa' : '#6c757d'};

    a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;

      &:hover {
        color: #764ba2;
      }
    }
  }
`;

export default Login;
