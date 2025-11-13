import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import SearchInput from '../components/ui/SearchInput';
import { motion } from 'framer-motion';
import Loader from '../components/ui/Loader';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { toast } from 'react-toastify';

const Services = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categories = ['all', 'plumbing', 'electrical', 'cleaning', 'carpentry', 'HVAC', 'painting'];

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, priceRange.min, priceRange.max]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        search: searchTerm || undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined
      };
      const response = await servicesAPI.getAll(params);
      // Handle both response formats (services array or data.services)
      setServices(response.data.services || response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceFilter = () => {
    // Removed - now filtering happens automatically via useEffect
  };

  const clearPriceFilter = () => {
    setPriceRange({ min: '', max: '' });
    setTimeout(fetchServices, 0);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ServicesWrapper $isDark={isDarkMode}>
      <div className="services-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Browse Services</h1>
            <p>Find the perfect professional for your needs</p>
          </motion.div>
        </div>
      </div>

      <div className="container">
        <div className="search-filter-section">
          <div className="search-wrapper">
            <SearchInput
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  fetchServices();
                }
              }}
            />
          </div>

          <div className="price-filter">
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              min="0"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              min="0"
            />
            {(priceRange.min || priceRange.max) && (
              <button className="clear-btn" onClick={clearPriceFilter}>Clear Filter</button>
            )}
          </div>

          <div className="categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="results-count">
              {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
            </div>

            <div className="services-grid">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  className="service-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="service-image">
                    <img src={service.image} alt={service.name} />
                    <div className="service-category">{service.category}</div>
                  </div>
                  <div className="service-content">
                    <h3>{service.name}</h3>
                    <p className="provider-name">by {service.provider.name}</p>
                    <p className="description">{service.description}</p>
                    <div className="service-footer">
                      <div className="service-rating">
                        <FaStar />
                        <span>{service.rating?.average?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <div className="service-price">${service.price}/hr</div>
                    </div>
                    <button onClick={() => navigate(`/services/${service._id}`)} className="book-btn">
                      <span style={{ position: 'relative', zIndex: 1 }}>View Details</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="no-results">
                <h3>No services found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </ServicesWrapper>
  );
};

const ServicesWrapper = styled.div`
  min-height: calc(100vh - 200px);
  padding-bottom: 3rem;

  .services-header {
    background: ${props => props.$isDark 
      ? '#1a0b2e' 
      : '#4700B0'};
    color: white;
    padding: 4rem 0;
    text-align: center;

    @media (max-width: 768px) {
      padding: 3rem 0;
    }

    @media (max-width: 480px) {
      padding: 2rem 0;
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }

      @media (max-width: 480px) {
        font-size: 1.5rem;
      }
    }

    p {
      font-size: 1.2rem;
      opacity: 0.9;

      @media (max-width: 768px) {
        font-size: 1rem;
      }

      @media (max-width: 480px) {
        font-size: 0.9rem;
      }
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;

    @media (max-width: 768px) {
      padding: 0 1.5rem;
    }

    @media (max-width: 480px) {
      padding: 0 1rem;
    }
  }

  .search-filter-section {
    margin: 3rem 0;
  }

  .search-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .price-filter {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    input {
      padding: 0.7rem 1rem;
      border: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
      background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      border-radius: 8px;
      font-size: 1rem;
      width: 140px;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #4700B0;
      }

      &::placeholder {
        color: ${props => props.$isDark ? '#666' : '#999'};
      }
    }

    span {
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      font-weight: 600;
    }

    .filter-btn,
    .clear-btn {
      padding: 0.7rem 1.5rem;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-btn {
      background: linear-gradient(135deg, #4700B0, #764ba2);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
    }

    .clear-btn {
      background: ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
      color: ${props => props.$isDark ? '#fff' : '#212529'};

      &:hover {
        background: ${props => props.$isDark ? '#3d3d54' : '#d0d0d0'};
      }
    }

    @media (max-width: 768px) {
      input {
        width: 120px;
      }
    }
  }

  .categories {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;

    .category-btn {
      position: relative;
      padding: 0.7rem 1.5rem;
      border: 2px solid transparent;
      background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
      color: ${props => props.$isDark ? '#fff' : '#4700B0'};
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      background-clip: padding-box;
      
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 20px;
        padding: 2px;
        background: linear-gradient(
          90deg,
          #4700B0,
          #764ba2,
          #4700B0,
          #4700B0
        );
        background-size: 200% 100%;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.3s ease;
        animation: moveBorder 3s linear infinite;
      }

      &:hover::before {
        opacity: 1;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(71, 0, 176, 0.2);
      }

      &.active {
        background: linear-gradient(135deg, #4700B0, #764ba2);
        color: white;
        border-color: transparent;
        
        &::before {
          opacity: 0;
        }
      }
    }
  }

  @keyframes moveBorder {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 200% 50%;
    }
  }

  .results-count {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
    font-weight: 600;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  .service-card {
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .service-image {
      position: relative;
      height: 250px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      &:hover img {
        transform: scale(1.1);
      }

      .service-category {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(102, 126, 234, 0.9);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: capitalize;
      }
    }

    .service-content {
      padding: 1.5rem;

      h3 {
        font-size: 1.4rem;
        margin-bottom: 0.3rem;
        color: ${props => props.$isDark ? '#fff' : '#212529'};
      }

      .provider-name {
        font-size: 0.9rem;
        color: ${props => props.$isDark ? '#fff' : '#4700B0'};
        margin-bottom: 0.8rem;
        font-weight: 600;
      }

      .description {
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
        margin-bottom: 1rem;
        line-height: 1.5;
      }

      .service-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        .service-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: #ffc107;
          font-weight: 600;

          svg {
            font-size: 1.1rem;
          }
        }

        .service-price {
          font-size: 1.3rem;
          font-weight: 700;
          color: ${props => props.$isDark ? '#fff' : '#4700B0'};
        }
      }

      .book-btn {
        position: relative;
        overflow: hidden;
        height: 3rem;
        padding: 0 2rem;
        border-radius: 1.5rem;
        background: ${props => props.$isDark ? '#3d3a4e' : '#f5f5f5'};
        color: ${props => props.$isDark ? '#fff' : '#333'};
        border: none;
        cursor: pointer;
        font-size: 18px;
        font-weight: 500;
        width: 100%;
        transition: color 0.3s;

        &:hover {
          color: #fff;
        }

        &:hover::before {
          transform: scaleX(1);
        }

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          transform: scaleX(0);
          transform-origin: 0 50%;
          width: 100%;
          height: inherit;
          border-radius: inherit;
          background: linear-gradient(
            82.3deg,
            #4700B0 10.8%,
            #7b4dff 94.3%
          );
          transition: all 0.475s;
          z-index: 0;
        }

        span {
          position: relative;
          z-index: 1;
        }
      }
    }
  }

  .no-results {
    text-align: center;
    padding: 4rem 2rem;
    color: ${props => props.$isDark ? '#aaa' : '#6c757d'};

    h3 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }

    p {
      font-size: 1.1rem;
    }
  }
`;

export default Services;

