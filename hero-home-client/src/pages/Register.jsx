import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import Loader from '../components/ui/Loader';

const Register = () => {
  const { isDarkMode } = useTheme();
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Check for uppercase and lowercase
    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasLowercase = /[a-z]/.test(formData.password);

    if (!hasUppercase || !hasLowercase) {
      toast.error('Password must contain at least one uppercase and one lowercase letter');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.name);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please use a different email or try logging in.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Email/password sign-up is currently disabled. Please contact support or try signing in with Google.');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Google signup error:', error);
      
      // Handle specific Google Sign-In errors
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked by browser. Please allow popups and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User opened another popup, ignore this error
        return;
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error('An account already exists with the same email address but different sign-in credentials.');
      } else {
        toast.error('Failed to sign up with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <RegisterWrapper $isDark={isDarkMode}>
      <motion.div
        className="register-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="register-card">
          <h1>Create Account</h1>
          <p className="subtitle">Join HomeHero today</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

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
                  placeholder="Create a password"
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-register" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button onClick={handleGoogleSignup} className="btn-google" disabled={loading}>
            <FaGoogle />
            <span>Continue with Google</span>
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </motion.div>
    </RegisterWrapper>
  );
};

const RegisterWrapper = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: ${props => props.$isDark 
    ? '#1a0b2e' 
    : '#4700B0'};

  .register-container {
    width: 100%;
    max-width: 450px;
  }

  .register-card {
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
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
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }

    .subtitle {
      text-align: center;
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      margin-bottom: 2rem;
    }
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }

    input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
      border-radius: 10px;
      font-size: 1rem;
      background: ${props => props.$isDark ? '#0f0f1e' : 'white'};
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      &::placeholder {
        color: ${props => props.$isDark ? '#666' : '#999'};
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
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      cursor: pointer;
      font-size: 1.2rem;
      transition: color 0.3s ease;

      &:hover {
        color: #667eea;
      }
    }
  }

  .btn-register {
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
      background: ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }

    span {
      background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
      padding: 0 1rem;
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      font-weight: 600;
    }
  }

  .btn-google {
    width: 100%;
    padding: 1rem;
    background: ${props => props.$isDark ? '#0f0f1e' : 'white'};
    color: ${props => props.$isDark ? '#fff' : '#212529'};
    border: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
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
      background: ${props => props.$isDark ? '#1a1a2e' : '#f8f9fa'};
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .login-link {
    margin-top: 2rem;
    text-align: center;
    color: ${props => props.$isDark ? '#aaa' : '#6c757d'};

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

export default Register;

