import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';
import { servicesAPI } from '../services/api';

const MyServices = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchMyServices();
    }
  }, [currentUser]);

  const fetchMyServices = async () => {
    try {
      const response = await servicesAPI.getMyServices(currentUser.uid);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await servicesAPI.delete(id);
        setServices(services.filter(s => s._id !== id));
        toast.success('Service deleted successfully');
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service');
      }
    }
  };

  return (
    <MyServicesWrapper $isDark={isDarkMode}>
      <div className="container">
        <div className="header">
          <h1>My Services</h1>
          <button className="btn-add" onClick={() => navigate('/add-service')}>
            Add New Service
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : services.length === 0 ? (
          <div className="empty-state">
            <h2>No services yet</h2>
            <p>Start by adding your first service</p>
            <button className="btn-add-large" onClick={() => navigate('/add-service')}>
              Add Service
            </button>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                className="service-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="service-image">
                  <img src={service.image} alt={service.name} />
                  <div className={`status ${service.available ? 'available' : 'unavailable'}`}>
                    {service.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
                <div className="service-content">
                  <h3>{service.name}</h3>
                  <p className="category">{service.category}</p>
                  <p className="description">{service.description}</p>
                  <div className="service-stats">
                    <div className="price">${service.price}/hr</div>
                    <div className="bookings">{service.bookingCount || 0} bookings</div>
                  </div>
                  <div className="actions">
                    <button className="btn-edit" onClick={() => navigate(`/services/${service._id}`)}>
                      <FaEdit /> View
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(service._id)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MyServicesWrapper>
  );
};

const MyServicesWrapper = styled.div`
  min-height: calc(100vh - 200px);
  padding: 3rem 0;
  background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }

    h1 {
      font-size: 2.5rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    .btn-add {
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #4700B0, #764ba2);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;

    h2 {
      font-size: 2rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      margin-bottom: 1rem;
    }

    p {
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .btn-add-large {
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #4700B0, #764ba2);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
    }
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .service-card {
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    .service-image {
      position: relative;
      height: 200px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .status {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;

        &.available {
          background: rgba(46, 213, 115, 0.9);
          color: white;
        }

        &.unavailable {
          background: rgba(255, 71, 87, 0.9);
          color: white;
        }
      }
    }

    .service-content {
      padding: 1.5rem;

      h3 {
        font-size: 1.4rem;
        margin-bottom: 0.3rem;
        color: ${props => props.$isDark ? '#fff' : '#212529'};
      }

      .category {
        color: #4700B0;
        font-weight: 600;
        text-transform: capitalize;
        margin-bottom: 0.8rem;
      }

      .description {
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
        margin-bottom: 1rem;
      }

      .service-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        padding: 1rem 0;
        border-top: 1px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};

        .price {
          font-size: 1.3rem;
          font-weight: 700;
          color: #4700B0;
        }

        .bookings {
          color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
          font-weight: 600;
        }
      }

      .actions {
        display: flex;
        gap: 1rem;

        button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .btn-edit {
          background: linear-gradient(135deg, #4700B0, #764ba2);
          color: white;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }
        }

        .btn-delete {
          background: ${props => props.$isDark ? '#2d2d44' : '#f8f9fa'};
          color: #ff4757;

          &:hover {
            background: #ff4757;
            color: white;
          }
        }
      }
    }
  }
`;

export default MyServices;

