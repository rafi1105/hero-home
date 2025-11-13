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
        category: formData.category.toLowerCase(), // Ensure lowercase for enum validation
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

      console.log('Sending service data:', serviceData);
      await servicesAPI.create(serviceData);
      toast.success('Service added successfully!');
      navigate('/my-services');
    } catch (error) {
      console.error('Error adding service:', error);
      console.error('Error response:', error.response?.data);
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

            <div className="button-container">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Adding Service...' : 'Add Service'}
              </button>
            </div>
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
      color: ${props => props.$isDark ? '#fff' : 'transparent'};
      background: ${props => props.$isDark ? 'none' : 'linear-gradient(135deg, #4700B0, #764ba2)'};
      -webkit-background-clip: ${props => props.$isDark ? 'unset' : 'text'};
      -webkit-text-fill-color: ${props => props.$isDark ? '#fff' : 'transparent'};
      background-clip: ${props => props.$isDark ? 'unset' : 'text'};
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
        background: linear-gradient(135deg, #4700B0, #764ba2);
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
        border-color: #4700B0;
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
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234700B0' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
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

  .button-container {
    position: relative;
    padding: 3px;
    background: ${props => props.$isDark 
      ? 'linear-gradient(90deg, #4700B0, #764ba2)' 
      : 'linear-gradient(90deg, #03a9f4, #f441a5)'};
    border-radius: 0.9em;
    transition: all 0.4s ease;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      margin: auto;
      border-radius: 0.9em;
      z-index: -10;
      filter: blur(0);
      transition: filter 0.4s ease;
    }

    &:hover::before {
      background: ${props => props.$isDark 
        ? 'linear-gradient(90deg, #4700B0, #764ba2)' 
        : 'linear-gradient(90deg, #03a9f4, #f441a5)'};
      filter: blur(1.2em);
    }

    &:active::before {
      filter: blur(0.2em);
    }
  }

  .submit-button {
    width: 100%;
    font-size: 1.4em;
    padding: 0.6em 0.8em;
    border-radius: 0.5em;
    border: none;
    background-color: ${props => props.$isDark ? '#1a1a2e' : '#000'};
    color: #fff;
    cursor: pointer;
    box-shadow: 2px 2px 3px #000000b4;
    font-weight: 600;
    transition: all 0.3s ease;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  }
`;

export default AddService;

