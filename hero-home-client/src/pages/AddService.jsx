import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Checkbox from '../components/ui/Checkbox';
import { servicesAPI } from '../services/api';

const AddService = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'plumbing',
    description: '',
    price: '',
    image: '',
    available: true
  });

  const categories = ['plumbing', 'electrical', 'cleaning', 'carpentry', 'HVAC', 'painting'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const serviceData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image || 'https://via.placeholder.com/400x300',
        available: formData.available,
        provider: {
          userId: currentUser.uid,
          name: currentUser.displayName || currentUser.email,
          email: currentUser.email,
          verified: false
        }
      };

      await servicesAPI.create(serviceData);
      toast.success('Service added successfully!');
      navigate('/my-services');
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error(error.response?.data?.message || 'Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddServiceWrapper $isDark={isDarkMode}>
      <div className="container">
        <motion.div
          className="form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Add New Service</h1>
          <p className="subtitle">Create a new service listing</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Service Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Professional Plumbing"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service..."
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price per Hour ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="50"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="checkbox-group">
              <Checkbox
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                label="Service is currently available"
              />
            </div>

            <button type="submit" className="Btn" disabled={loading}>
              <span className="btn-text">{loading ? 'Adding Service...' : 'Add Service'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AddServiceWrapper>
  );
};

const AddServiceWrapper = styled.div`
  min-height: calc(100vh - 200px);
  padding: 3rem 0;
  background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .form-card {
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 25px;
    padding: 3.5rem;
    box-shadow: ${props => props.$isDark 
      ? '0 20px 60px rgba(0, 0, 0, 0.4)' 
      : '0 20px 60px rgba(0, 0, 0, 0.08)'};

    @media (max-width: 768px) {
      padding: 2rem 1.5rem;
    }

    h1 {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    .subtitle {
      text-align: center;
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      margin-bottom: 3rem;
      font-size: 1.1rem;
    }
  }

  .form-group {
    margin-bottom: 2rem;

    label {
      display: block;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &::before {
        content: '';
        width: 4px;
        height: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 2px;
      }
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 1rem 1.25rem;
      border: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
      border-radius: 12px;
      font-size: 1rem;
      background: ${props => props.$isDark ? '#0f0f1e' : '#fafbfc'};
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      font-family: inherit;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #667eea;
        background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        transform: translateY(-2px);
      }

      &::placeholder {
        color: ${props => props.$isDark ? '#666' : '#999'};
      }

      &:hover {
        border-color: ${props => props.$isDark ? '#3d3d54' : '#d0d0d0'};
      }
    }

    textarea {
      resize: vertical;
      min-height: 140px;
      line-height: 1.6;
    }

    select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667eea' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      padding-right: 3rem;
    }
  }

  .checkbox-group {
    margin-bottom: 2.5rem;
    padding: 1.5rem;
    background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};
    border-radius: 12px;
    border: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
  }

  .Btn {
    width: 100%;
    height: 56px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(to right, #77530a, #ffd277, #77530a, #77530a, #ffd277, #77530a);
    background-size: 250%;
    background-position: left;
    color: #ffd277;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition-duration: 1s;
    overflow: hidden;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 1px;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      
      &:hover {
        background-position: left;
        transform: none;
      }

      &::before {
        background-position: left;
      }
    }

    .btn-text {
      position: relative;
      z-index: 2;
      color: #ffd277;
      display: flex;
      align-items: center;
      justify-content: center;
      transition-duration: 1s;
    }

    &::before {
      position: absolute;
      content: "";
      color: #ffd277;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 97%;
      height: 90%;
      border-radius: 10px;
      transition-duration: 1s;
      background-color: rgba(0, 0, 0, 0.842);
      background-size: 200%;
      z-index: 1;
    }

    &:hover:not(:disabled) {
      background-position: right;
      transition-duration: 1s;
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(255, 210, 119, 0.3);
    }

    &:hover:not(:disabled)::before {
      background-position: right;
      transition-duration: 1s;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  }
`;

export default AddService;

