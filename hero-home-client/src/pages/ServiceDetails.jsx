import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaStar, FaTimes, FaUser } from 'react-icons/fa';
import Loader from '../components/ui/Loader';
import { servicesAPI, bookingsAPI } from '../services/api';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    bookingTime: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await servicesAPI.getById(id);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Please login to book a service');
      navigate('/login');
      return;
    }

    // Prevent users from booking their own services
    if (currentUser.uid === service.provider.userId) {
      toast.error("You can't book your own service!");
      return;
    }

    try {
      const booking = {
        service: service._id,
        customer: {
          userId: currentUser.uid,
          name: currentUser.displayName || currentUser.email,
          email: currentUser.email
        },
        provider: {
          userId: service.provider.userId,
          name: service.provider.name,
          email: service.provider.email
        },
        bookingDate: new Date(bookingData.bookingDate),
        bookingTime: bookingData.bookingTime,
        location: {
          address: bookingData.address
        },
        price: service.price,
        notes: bookingData.notes
      };

      await bookingsAPI.create(booking);
      toast.success('Service booked successfully!');
      setShowModal(false);
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error booking service:', error);
      toast.error(error.response?.data?.message || 'Failed to book service');
    }
  };

  if (loading) return <Loader />;
  if (!service) return <div>Service not found</div>;

  return (
    <ServiceDetailsWrapper $isDark={isDarkMode}>
      <div className="container">
        <motion.div
          className="details-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="service-image">
            <img src={service.image} alt={service.name} />
            <div className="category-badge">{service.category}</div>
          </div>

          <div className="service-info">
            <h1>{service.name}</h1>
            
            <div className="provider-info">
              <FaUser className="icon" />
              <span>by {service.provider.name}</span>
              {service.provider.verified && <span className="verified">✓ Verified</span>}
            </div>

            <div className="rating">
              <FaStar className="star" />
              <span>{service.rating?.average || 0} ({service.rating?.count || 0} reviews)</span>
            </div>

            <div className="price">
              <span className="amount">${service.price}</span>
              <span className="unit">/hour</span>
            </div>

            <div className="description">
              <h3>Description</h3>
              <p>{service.description}</p>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <label>Category</label>
                <p>{service.category}</p>
              </div>
              <div className="detail-item">
                <label>Availability</label>
                <p>{service.available ? 'Available' : 'Not Available'}</p>
              </div>
              <div className="detail-item">
                <label>Total Bookings</label>
                <p>{service.bookingCount || 0}</p>
              </div>
              <div className="detail-item">
                <label>Provider Email</label>
                <p>{service.provider.email}</p>
              </div>
            </div>

            {service.available && (
              <button 
                onClick={() => setShowModal(true)} 
                className="btn-book"
                disabled={currentUser && currentUser.uid === service.provider.userId}
                style={{
                  opacity: currentUser && currentUser.uid === service.provider.userId ? 0.6 : 1,
                  cursor: currentUser && currentUser.uid === service.provider.userId ? 'not-allowed' : 'pointer'
                }}
              >
                {currentUser && currentUser.uid === service.provider.userId ? 'Your Service' : 'Book Now'}
              </button>
            )}
          </div>
        </motion.div>

        {/* Reviews Section */}
        {service.reviews && service.reviews.length > 0 && (
          <motion.div
            className="reviews-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2>Customer Reviews ({service.reviews.length})</h2>
            <div className="reviews-list">
              {service.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <FaUser className="avatar-icon" />
                      <div>
                        <h4>{review.userName}</h4>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? 'filled' : 'empty'} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              $isDark={isDarkMode}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>

              <h2>Book Service</h2>

              <div className="modal-service-info">
                <h3>{service.name}</h3>
                <p>Provider: {service.provider.name}</p>
                <p className="price">${service.price}/hour</p>
              </div>

              <form onSubmit={handleBooking}>
                <div className="form-group">
                  <label>Your Email (Read-only)</label>
                  <input type="email" value={currentUser?.email || ''} readOnly />
                </div>

                <div className="form-group">
                  <label>Booking Date *</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.bookingDate}
                    onChange={(e) => setBookingData({ ...bookingData, bookingDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Booking Time *</label>
                  <input
                    type="time"
                    value={bookingData.bookingTime}
                    onChange={(e) => setBookingData({ ...bookingData, bookingTime: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Service Address *</label>
                  <textarea
                    rows="3"
                    value={bookingData.address}
                    onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                    placeholder="Enter your address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    rows="3"
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    placeholder="Any special requirements..."
                  />
                </div>

                <button type="submit" className="btn-submit">
                  Confirm Booking
                </button>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </ServiceDetailsWrapper>
  );
};

const ServiceDetailsWrapper = styled.div`
  min-height: calc(100vh - 200px);
  padding: 3rem 0;
  background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .details-card {
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;

    @media (max-width: 968px) {
      grid-template-columns: 1fr;
    }
  }

  .service-image {
    position: relative;
    height: 100%;
    min-height: 400px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .category-badge {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      background: #4700B0;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-weight: 600;
      text-transform: capitalize;
    }
  }

  .service-info {
    padding: 3rem;

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }

    .provider-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};

      .icon {
        color: #4700B0;
      }

      .verified {
        background: #4caf50;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 5px;
        font-size: 0.8rem;
      }
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;

      .star {
        color: #ffc107;
      }

      span {
        color: ${props => props.$isDark ? '#fff' : '#212529'};
        font-weight: 600;
      }
    }

    .price {
      margin-bottom: 2rem;

      .amount {
        font-size: 3rem;
        font-weight: 700;
        color: #4700B0;
      }

      .unit {
        font-size: 1.5rem;
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      }
    }

    .description {
      margin-bottom: 2rem;

      h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: ${props => props.$isDark ? '#fff' : '#212529'};
      }

      p {
        line-height: 1.8;
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      }
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;

      .detail-item {
        label {
          display: block;
          font-size: 0.9rem;
          color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
          margin-bottom: 0.5rem;
        }

        p {
          font-weight: 600;
          color: ${props => props.$isDark ? '#fff' : '#212529'};
          text-transform: capitalize;
        }
      }
    }

    .btn-book {
      width: 100%;
      padding: 1.25rem;
      background: #4700B0;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #3a0088;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(71, 0, 176, 0.4);
      }
    }
  }

  .reviews-section {
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 15px;
    padding: 2rem;
    margin-top: 2rem;

    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .review-card {
        background: ${props => props.$isDark ? '#2d2d44' : '#f8f9fa'};
        border-radius: 12px;
        padding: 1.5rem;
        border-left: 4px solid #4700B0;

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;

          .reviewer-info {
            display: flex;
            gap: 1rem;
            align-items: center;

            .avatar-icon {
              width: 40px;
              height: 40px;
              padding: 10px;
              background: #4700B0;
              color: white;
              border-radius: 50%;
            }

            h4 {
              margin-bottom: 0.3rem;
              color: ${props => props.$isDark ? '#fff' : '#212529'};
              font-size: 1.1rem;
            }

            .review-rating {
              display: flex;
              gap: 0.2rem;

              .filled {
                color: #ffd700;
              }

              .empty {
                color: ${props => props.$isDark ? '#555' : '#ddd'};
              }
            }
          }

          .review-date {
            font-size: 0.9rem;
            color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
          }
        }

        .review-comment {
          color: ${props => props.$isDark ? '#ccc' : '#495057'};
          line-height: 1.6;
          font-size: 1rem;
        }
      }
    }
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  .close-btn {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: ${props => props.$isDark ? '#fff' : '#212529'};
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.2);
    }
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: ${props => props.$isDark ? '#fff' : '#212529'};
  }

  .modal-service-info {
    background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;

    h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }

    p {
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      margin-bottom: 0.3rem;
    }

    .price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #4700B0;
      margin-top: 0.5rem;
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

    input,
    textarea {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
      border-radius: 10px;
      font-size: 1rem;
      background: ${props => props.$isDark ? '#0f0f1e' : 'white'};
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      transition: border-color 0.3s;

      &:focus {
        outline: none;
        border-color: #4700B0;
      }

      &:read-only {
        background: ${props => props.$isDark ? '#2d2d44' : '#f8f9fa'};
        cursor: not-allowed;
      }
    }

    textarea {
      resize: vertical;
    }
  }

  .btn-submit {
    width: 100%;
    padding: 1rem;
    background: #4700B0;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #3a0088;
      transform: translateY(-2px);
    }
  }
`;

export default ServiceDetails;

