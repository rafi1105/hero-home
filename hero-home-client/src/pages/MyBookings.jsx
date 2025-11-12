import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaStar, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';
import { bookingsAPI, servicesAPI } from '../services/api';

const MyBookings = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser, filter]);

  const fetchBookings = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await bookingsAPI.getUserBookings(currentUser.uid, params);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingsAPI.cancel(id, 'Cancelled by customer', currentUser.uid);
        toast.success('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error('Failed to cancel booking');
      }
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setReviewData({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewData.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      await servicesAPI.addReview(selectedBooking.service._id || selectedBooking.service, {
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        bookingId: selectedBooking._id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });

      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      fetchBookings();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const hasReviewed = (booking) => {
    // Check if user has already reviewed this booking
    return booking.reviewed || false;
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return '#667eea';
      case 'completed':
        return '#2ed573';
      case 'cancelled':
        return '#ff4757';
      default:
        return '#aaa';
    }
  };

  return (
    <MyBookingsWrapper $isDark={isDarkMode}>
      <div className="container">
        <div className="header">
          <h1>My Bookings</h1>
          <div className="filters">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'upcoming' ? 'active' : ''}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button
              className={filter === 'cancelled' ? 'active' : ''}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <h2>No bookings found</h2>
            <p>You haven't made any bookings yet</p>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                className="booking-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="booking-image">
                  <img src={booking.service.image} alt={booking.service.name} />
                </div>
                <div className="booking-content">
                  <div className="booking-header">
                    <div>
                      <h3>{booking.service.name}</h3>
                      <p className="provider">by {booking.service.provider}</p>
                    </div>
                    <div 
                      className="status-badge" 
                      style={{ background: getStatusColor(booking.status) }}
                    >
                      {booking.status}
                    </div>
                  </div>
                  <div className="booking-details">
                    <div className="detail-item">
                      <FaCalendar />
                      <span>{booking.date}</span>
                    </div>
                    <div className="detail-item">
                      <FaClock />
                      <span>{booking.time}</span>
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                  <div className="booking-footer">
                    <div className="price">${booking.price}</div>
                    <div className="action-buttons">
                      {booking.status === 'completed' && !hasReviewed(booking) && (
                        <button 
                          className="btn-review"
                          onClick={() => handleOpenReviewModal(booking)}
                        >
                          <FaStar /> Leave Review
                        </button>
                      )}
                      {booking.status === 'upcoming' && (
                        <button 
                          className="btn-cancel"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReviewModal(false)}
          >
            <ModalContent
              $isDark={isDarkMode}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>
                <FaTimes />
              </button>

              <h2>Leave a Review</h2>
              <p className="service-name">{selectedBooking?.service?.name || 'Service'}</p>

              <form onSubmit={handleSubmitReview}>
                <div className="rating-input">
                  <label>Rating</label>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= reviewData.rating ? 'filled' : 'empty'}
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    placeholder="Share your experience with this service..."
                    rows="5"
                    required
                  />
                </div>

                <button type="submit" className="btn-submit">
                  Submit Review
                </button>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </MyBookingsWrapper>
  );
};

const MyBookingsWrapper = styled.div`
  min-height: calc(100vh - 200px);
  padding: 3rem 0;
  background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .header {
    margin-bottom: 3rem;

    h1 {
      font-size: 2.5rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      margin-bottom: 1.5rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    .filters {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      button {
        padding: 0.7rem 1.5rem;
        background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
        color: ${props => props.$isDark ? '#fff' : '#212529'};
        border: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          border-color: #667eea;
        }

        &.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
        }
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
      font-size: 1.1rem;
    }
  }

  .bookings-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .booking-card {
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    display: flex;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    .booking-image {
      width: 250px;
      flex-shrink: 0;

      @media (max-width: 768px) {
        width: 100%;
        height: 200px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .booking-content {
      flex: 1;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;

      .booking-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
        gap: 1rem;

        h3 {
          font-size: 1.4rem;
          color: ${props => props.$isDark ? '#fff' : '#212529'};
          margin-bottom: 0.3rem;
        }

        .provider {
          color: #667eea;
          font-weight: 600;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: capitalize;
          white-space: nowrap;
        }
      }

      .booking-details {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1rem;

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: ${props => props.$isDark ? '#aaa' : '#6c757d'};

          svg {
            font-size: 1.1rem;
            color: #667eea;
          }
        }
      }

      .booking-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
        flex-wrap: wrap;
        gap: 1rem;

        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-review {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #212529;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
          }
        }

        .btn-cancel {
          padding: 0.75rem 1.5rem;
          background: transparent;
          color: #ff4757;
          border: 2px solid #ff4757;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: #ff4757;
            color: white;
          }
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
  max-width: 500px;
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
    margin-bottom: 0.5rem;
    color: ${props => props.$isDark ? '#fff' : '#212529'};
  }

  .service-name {
    color: #667eea;
    font-weight: 600;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .rating-input {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }

    .stars {
      display: flex;
      gap: 0.5rem;
      font-size: 2rem;

      svg {
        cursor: pointer;
        transition: all 0.2s;

        &.filled {
          color: #ffd700;
        }

        &.empty {
          color: ${props => props.$isDark ? '#444' : '#ddd'};
        }

        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }

    textarea {
      width: 100%;
      padding: 1rem;
      border: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
      background: ${props => props.$isDark ? '#2d2d44' : 'white'};
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      border-radius: 10px;
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
      transition: border-color 0.3s;

      &:focus {
        outline: none;
        border-color: #667eea;
      }

      &::placeholder {
        color: ${props => props.$isDark ? '#666' : '#999'};
      }
    }
  }

  .btn-submit {
    width: 100%;
    padding: 1.25rem;
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
      box-shadow: 0 6px 20px rgba(71, 0, 176, 0.4);
    }
  }
`;

export default MyBookings;

