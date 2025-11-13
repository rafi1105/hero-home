import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { servicesAPI } from '../services/api';
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';
import { FaStar, FaCheckCircle, FaUsers, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [topRatedServices, setTopRatedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopRatedServices();
  }, []);

  const fetchTopRatedServices = async () => {
    try {
      const response = await servicesAPI.getTopRated(6);
      setTopRatedServices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching top rated services:', error);
      toast.error('Failed to load top rated services');
      setTopRatedServices([]);
    } finally {
      setLoading(false);
    }
  };

  const heroSlides = [
    {
      image: '/banner/banner1.jpg',
      title: 'Find Trusted Service Providers',
      description: 'Connect with verified professionals for all your home service needs',
      buttonText: 'Explore Services'
    },
    {
      image: '/banner/banner2.jpg',
      title: 'Quality Services at Your Doorstep',
      description: 'Book appointments with top-rated electricians, plumbers, and more',
      buttonText: 'Get Started'
    },
    {
      image: '/banner/banner3.jpg',
      title: 'Your Home, Our Priority',
      description: 'Professional services with guaranteed satisfaction',
      buttonText: 'Browse Now'
    },
    {
      image: '/banner/banner4.jpg',
      title: 'Expert Home Solutions',
      description: 'Trusted professionals ready to help with any home service',
      buttonText: 'Book Now'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent service! Found a great plumber through HomeHero. Highly recommended!',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      comment: 'Quick and professional. The electrician was very knowledgeable.',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: 'Emily Davis',
      rating: 4,
      comment: 'Great platform for finding reliable home service providers.',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  return (
    <HomeWrapper $isDark={isDarkMode}>
      {/* Hero Section */}
      <section className="hero-section">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop={true}
          className="hero-swiper"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="hero-slide">
                <div className="hero-image" style={{ backgroundImage: `url(${slide.image})` }} />
                <div className="hero-overlay" />
                <motion.div
                  className="hero-content"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                  <button onClick={() => navigate('/services')} className="hero-btn">
                    <span style={{ position: 'relative', zIndex: 1 }}>{slide.buttonText}</span>
                  </button>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Services Section - Top Rated */}
      <section className="services-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>⭐ Top Rated Services</h2>
            <p>Highest rated services based on customer reviews</p>
          </motion.div>

          {loading ? (
            <Loader />
          ) : topRatedServices.length === 0 ? (
            <div className="no-services">
              <p>No rated services available yet. Be the first to book and review!</p>
            </div>
          ) : (
            <div className="services-grid">
              {topRatedServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  className="service-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <div className="service-image">
                    <img src={service.image} alt={service.name} />
                    <div className="service-category">{service.category}</div>
                    <div className="top-rated-badge">⭐ Top Rated</div>
                  </div>
                  <div className="service-content">
                    <h3>{service.name}</h3>
                    <p className="provider-name">by {service.provider.name}</p>
                    <p>{service.description}</p>
                    <div className="service-footer">
                      <div className="service-rating">
                        <FaStar />
                        <span>{service.rating?.average?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <div className="service-price">${service.price}/hr</div>
                    </div>
                    <button onClick={() => navigate(`/services/${service._id}`)} className="book-btn">
                      <span style={{ position: 'relative', zIndex: 1 }}>Book Now</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>Why Choose Home Hero?</h2>
            <p>We make finding trusted service providers simple and reliable</p>
          </motion.div>

          <div className="features-grid">
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="feature-icon">
                <FaCheckCircle />
              </div>
              <h3>Verified Professionals</h3>
              <p>All service providers are thoroughly vetted and verified for your safety</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Trusted Community</h3>
              <p>Join thousands of satisfied customers who found their perfect service match</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Secure Payments</h3>
              <p>Your transactions are protected with industry-standard security</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>Customer Testimonials</h2>
            <p>Hear what our customers have to say</p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="testimonial-header">
                  <img src={testimonial.avatar} alt={testimonial.name} className="avatar" />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <div className="stars">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
};

const HomeWrapper = styled.div`
  /* Hero Section */
  .hero-section {
    height: 600px;
    position: relative;

    @media (max-width: 768px) {
      height: 400px;
    }
  }

  .hero-swiper {
    height: 100%;
  }

  .hero-slide {
    height: 600px;
    position: relative;

    @media (max-width: 768px) {
      height: 400px;
    }
  }

  .hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.$isDark 
      ? 'rgba(26, 11, 46, 0.45)' 
      : 'rgba(0, 0, 0, 0.45)'};
  }

  .hero-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    padding: 2rem;

    @media (max-width: 480px) {
      padding: 1.5rem 1rem;
    }

    h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

      @media (max-width: 768px) {
        font-size: 2rem;
      }

      @media (max-width: 480px) {
        font-size: 1.6rem;
        margin-bottom: 0.8rem;
      }
    }

    p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      max-width: 600px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

      @media (max-width: 768px) {
        font-size: 1.1rem;
      }

      @media (max-width: 480px) {
        font-size: 1rem;
        margin-bottom: 1.5rem;
        max-width: 90%;
      }
    }

    .hero-btn {
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
      transition: color 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: 480px) {
        height: 2.5rem;
        padding: 0 1.5rem;
        font-size: 16px;
      }

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
    }
  }

  /* Services Section */
  .services-section {
    padding: 5rem 0;
    background: ${props => props.$isDark ? '#1a1a2e' : '#f8f9fa'};

    @media (max-width: 768px) {
      padding: 3rem 0;
    }

    @media (max-width: 480px) {
      padding: 2rem 0;
    }
  }

  .no-services {
    text-align: center;
    padding: 3rem;
    background: ${props => props.$isDark ? '#0f0f1e' : 'white'};
    border-radius: 15px;
    
    p {
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      font-size: 1.1rem;
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

  .section-header {
    text-align: center;
    margin-bottom: 3rem;

    @media (max-width: 768px) {
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};

      @media (max-width: 768px) {
        font-size: 1.8rem;
      }

      @media (max-width: 480px) {
        font-size: 1.5rem;
      }
    }

    p {
      font-size: 1.1rem;
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};

      @media (max-width: 768px) {
        font-size: 1rem;
      }

      @media (max-width: 480px) {
        font-size: 0.95rem;
      }
    }
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
      gap: 1rem;
    }
  }

  .service-card {
    background: ${props => props.$isDark ? '#0f0f1e' : 'white'};
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

      @media (max-width: 480px) {
        height: 200px;
      }

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

      .top-rated-badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: #212529;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 700;
        box-shadow: 0 2px 10px rgba(255, 215, 0, 0.4);
      }
    }

    .service-content {
      padding: 1.5rem;

      @media (max-width: 480px) {
        padding: 1.25rem;
      }

      h3 {
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
        color: ${props => props.$isDark ? '#fff' : '#212529'};

        @media (max-width: 480px) {
          font-size: 1.15rem;
        }
      }

      .provider-name {
        color: #4700B0;
        font-weight: 600;
        font-size: 0.95rem;
        margin-bottom: 0.5rem;

        @media (max-width: 480px) {
          font-size: 0.9rem;
        }
      }

      p {
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
        margin-bottom: 1rem;

        @media (max-width: 480px) {
          font-size: 0.95rem;
        }
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
          font-size: 1.2rem;
          font-weight: 700;
          color: #4700B0;
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

  /* Why Choose Us Section */
  .why-choose-section {
    padding: 5rem 0;
    background: ${props => props.$isDark ? '#0f0f1e' : 'white'};

    @media (max-width: 768px) {
      padding: 3rem 0;
    }

    @media (max-width: 480px) {
      padding: 2rem 0;
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .feature-card {
    text-align: center;
    padding: 2rem;
    background: ${props => props.$isDark ? '#1a1a2e' : '#f8f9fa'};
    border-radius: 15px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
    }

    .feature-icon {
      font-size: 3rem;
      color: #4700B0;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }

    p {
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      line-height: 1.6;
    }
  }

  /* Testimonials Section */
  .testimonials-section {
    padding: 5rem 0;
    background: ${props => props.$isDark ? '#1a1a2e' : '#f8f9fa'};

    @media (max-width: 768px) {
      padding: 3rem 0;
    }

    @media (max-width: 480px) {
      padding: 2rem 0;
    }
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .testimonial-card {
    background: ${props => props.$isDark ? '#0f0f1e' : 'white'};
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    .testimonial-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }

      h4 {
        margin-bottom: 0.3rem;
        color: ${props => props.$isDark ? '#fff' : '#212529'};
      }

      .stars {
        display: flex;
        gap: 0.2rem;
        color: #ffc107;
      }
    }

    .testimonial-comment {
      font-style: italic;
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      line-height: 1.6;
    }
  }
`;

export default Home;


