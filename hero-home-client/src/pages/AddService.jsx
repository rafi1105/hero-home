import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Checkbox from '../components/ui/Checkbox';

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
    imageUrl: '',
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
      // TODO: Replace with actual API call
      // await axios.post('http://localhost:5000/api/services', {
      //   ...formData,
      //   providerId: currentUser.uid
      // });
      
      console.log('Service data:', formData);
      toast.success('Service added successfully!');
      navigate('/my-services');
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddServiceWrapper isDark={isDarkMode}>
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
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
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

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Adding Service...' : 'Add Service'}
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
  background: ${props => props.isDark ? '#0f0f1e' : '#f8f9fa'};

  .container {
    max-width: 700px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .form-card {
    background: ${props => props.isDark ? '#1a1a2e' : 'white'};
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      padding: 2rem;
    }

    h1 {
      font-size: 2rem;
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

    input,
    select,
    textarea {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid ${props => props.isDark ? '#2d2d44' : '#e0e0e0'};
      border-radius: 10px;
      font-size: 1rem;
      background: ${props => props.isDark ? '#0f0f1e' : 'white'};
      color: ${props => props.isDark ? '#fff' : '#212529'};
      font-family: inherit;
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

    textarea {
      resize: vertical;
      min-height: 120px;
    }

    select {
      cursor: pointer;
    }
  }

  .checkbox-group {
    margin-bottom: 2rem;
  }

  .btn-submit {
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
`;

export default AddService;
