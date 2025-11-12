import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import SearchInput from '../components/ui/SearchInput';
import { motion } from 'framer-motion';
import Loader from '../components/ui/Loader';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'plumbing', 'electrical', 'cleaning', 'carpentry', 'HVAC', 'painting'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Mock data - replace with API call
      const mockServices = [
        {
          _id: '1',
          name: 'Professional Plumbing',
          category: 'plumbing',
          description: 'Expert plumbing services for all your needs. Repairs, installations, and maintenance.',
          price: 50,
          image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500',
          rating: 4.8,
          provider: { name: 'John Doe', verified: true }
        },
        {
          _id: '2',
          name: 'Electrical Services',
          category: 'electrical',
          description: 'Certified electricians for home and office electrical work.',
          price: 60,
          image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500',
          rating: 4.9,
          provider: { name: 'Jane Smith', verified: true }
        },
        {
          _id: '3',
          name: 'House Cleaning',
          category: 'cleaning',
          description: 'Professional cleaning services for homes and offices.',
          price: 40,
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
          rating: 4.7,
          provider: { name: 'Clean Pro', verified: true }
        },
        {
          _id: '4',
          name: 'Carpentry Work',
          category: 'carpentry',
          description: 'Custom carpentry, furniture repair, and woodworking services.',
          price: 55,
          image: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=500',
          rating: 4.6,
          provider: { name: 'Wood Master', verified: true }
        },
        {
          _id: '5',
          name: 'HVAC Services',
          category: 'HVAC',
          description: 'Heating and cooling system installation and maintenance.',
          price: 70,
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
          rating: 4.8,
          provider: { name: 'Cool Air', verified: true }
        },
        {
          _id: '6',
          name: 'Painting Services',
          category: 'painting',
          description: 'Interior and exterior painting with quality finishes.',
          price: 45,
          image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
          rating: 4.5,
          provider: { name: 'Color Experts', verified: true }
        }
      ];

      setTimeout(() => {
        setServices(mockServices);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ServicesWrapper isDark={isDarkMode}>
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
            />
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
                        <span>{service.rating}</span>
                      </div>
                      <div className="service-price">${service.price}/hr</div>
                    </div>
                    <button onClick={() => navigate(`/services/${service._id}`)} className="book-btn">
                      View Details
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
    background: ${props => props.isDark 
      ? '#1a0b2e' 
      : '#4700B0'};
    color: white;
    padding: 4rem 0;
    text-align: center;

    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .search-filter-section {
    margin: 3rem 0;
  }

  .search-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .categories {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;

    .category-btn {
      padding: 0.7rem 1.5rem;
      border: 2px solid ${props => props.isDark ? '#2d2d44' : '#e0e0e0'};
      background: ${props => props.isDark ? '#1a1a2e' : 'white'};
      color: ${props => props.isDark ? '#fff' : '#212529'};
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: #667eea;
        transform: translateY(-2px);
      }

      &.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-color: transparent;
      }
    }
  }

  .results-count {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    color: ${props => props.isDark ? '#aaa' : '#6c757d'};
    font-weight: 600;
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
    background: ${props => props.isDark ? '#1a1a2e' : 'white'};
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
        color: ${props => props.isDark ? '#fff' : '#212529'};
      }

      .provider-name {
        font-size: 0.9rem;
        color: #667eea;
        margin-bottom: 0.8rem;
        font-weight: 600;
      }

      .description {
        color: ${props => props.isDark ? '#aaa' : '#6c757d'};
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
          color: #667eea;
        }
      }

      .book-btn {
        width: 100%;
        padding: 0.8rem;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      }
    }
  }

  .no-results {
    text-align: center;
    padding: 4rem 2rem;
    color: ${props => props.isDark ? '#aaa' : '#6c757d'};

    h3 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: ${props => props.isDark ? '#fff' : '#212529'};
    }

    p {
      font-size: 1.1rem;
    }
  }
`;

export default Services;
