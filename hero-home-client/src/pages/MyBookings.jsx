import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaStar, FaTrash, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';
import { bookingsAPI, servicesAPI } from '../services/api';

const MyBookings = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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
  }, [currentUser]);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getUserBookings(currentUser.uid);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId, 'Cancelled by customer', currentUser.email);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  if (loading) return <Loader />;

  return (
    <MyBookingsWrapper $isDark={isDarkMode}>
      <div className="container">
        <motion.div
          className="header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>My Bookings</h1>
          <p className="subtitle">Manage all your service bookings</p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-icon">📅</div>
            <h2>No Bookings Yet</h2>
            <p>You haven't booked any services yet. Start exploring our services!</p>
            <a href="/services" className="btn-explore">Explore Services</a>
          </motion.div>
        ) : (
          <motion.div
            className="table-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Provider</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td>
                      <div className="service-cell">
                        <div className="service-image">
                          <img src={booking.service?.image} alt={booking.service?.name} />
                        </div>
                        <div className="service-details">
                          <span className="service-name">{booking.service?.name}</span>
                          <span className="service-category">{booking.service?.category}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="provider-cell">
                        <span className="provider-name">{booking.provider?.name}</span>
                        <span className="provider-email">{booking.provider?.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="datetime-cell">
                        <div className="date-info">
                          <FaCalendar className="icon" />
                          <span>{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="time-info">
                          <FaClock className="icon" />
                          <span>{formatTime(booking.bookingTime)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="location-cell">
                        <FaMapMarkerAlt className="icon" />
                        <span>{booking.location?.address}</span>
                      </div>
                    </td>
                    <td>
                      <div className="price-cell">
                        <span className="price-amount">${booking.price}</span>
                        <span className="price-unit">/hour</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button
                            className="btn-cancel"
                            onClick={() => handleCancelBooking(booking._id)}
                            title="Cancel Booking"
                          >
                            <FaTrash /> Cancel
                          </button>
                        )}
                        {booking.status === 'completed' && !booking.reviewed && (
                          <button
                            className="btn-review"
                            onClick={() => handleOpenReviewModal(booking)}
                            title="Leave Review"
                          >
                            <FaStar /> Review
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
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
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .header-section {
    margin-bottom: 3rem;
    text-align: center;

    h1 {
      font-size: 3rem;
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
      font-size: 1.2rem;
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
    }
  }

  .empty-state {
    text-align: center;
    padding: 5rem 2rem;
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }

    p {
      font-size: 1.2rem;
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      margin-bottom: 2rem;
    }

    .btn-explore {
      display: inline-block;
      padding: 1rem 2rem;
      background: ${props => props.$isDark 
        ? 'linear-gradient(90deg, #4700B0, #764ba2)' 
        : 'linear-gradient(90deg, #4700B0, #764ba2)'};
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(71, 0, 176, 0.4);
      }
    }
  }

  .table-container {
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
  }

  .bookings-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 1rem;

    thead {
      tr {
        th {
          padding: 1rem;
          text-align: left;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
          border-bottom: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e9ecef'};

          &:first-child {
            padding-left: 1.5rem;
          }

          &:last-child {
            text-align: center;
          }
        }
      }
    }

    tbody {
      tr {
        background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};
        transition: all 0.3s ease;

        &:hover {
          background: ${props => props.$isDark ? '#2d2d44' : '#e9ecef'};
          transform: scale(1.01);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        td {
          padding: 1.5rem 1rem;
          vertical-align: middle;
          border-top: 1px solid ${props => props.$isDark ? '#2d2d44' : '#dee2e6'};
          border-bottom: 1px solid ${props => props.$isDark ? '#2d2d44' : '#dee2e6'};

          &:first-child {
            border-left: 1px solid ${props => props.$isDark ? '#2d2d44' : '#dee2e6'};
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
            padding-left: 1.5rem;
          }

          &:last-child {
            border-right: 1px solid ${props => props.$isDark ? '#2d2d44' : '#dee2e6'};
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
            text-align: center;
          }
        }
      }
    }
  }

  .service-cell {
    display: flex;
    align-items: center;
    gap: 1rem;

    .service-image {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .service-details {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;

      .service-name {
        font-weight: 600;
        font-size: 1rem;
        color: ${props => props.$isDark ? '#fff' : '#212529'};
      }

      .service-category {
        font-size: 0.85rem;
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
        text-transform: capitalize;
      }
    }
  }

  .provider-cell {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    .provider-name {
      font-weight: 600;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }

    .provider-email {
      font-size: 0.85rem;
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
    }
  }

  .datetime-cell {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .date-info,
    .time-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};

      .icon {
        color: #4700B0;
        font-size: 0.85rem;
      }
    }
  }

  .location-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${props => props.$isDark ? '#fff' : '#212529'};
    font-size: 0.9rem;

    .icon {
      color: #4700B0;
      flex-shrink: 0;
    }

    span {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .price-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .price-amount {
      font-size: 1.3rem;
      font-weight: 700;
      color: #4700B0;
    }

    .price-unit {
      font-size: 0.85rem;
      color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
    }
  }

  .status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: capitalize;

    &.status-pending {
      background: ${props => props.$isDark ? '#3d2f00' : '#fff3cd'};
      color: ${props => props.$isDark ? '#ffc107' : '#856404'};
    }

    &.status-confirmed {
      background: ${props => props.$isDark ? '#003d47' : '#d1ecf1'};
      color: ${props => props.$isDark ? '#17a2b8' : '#0c5460'};
    }

    &.status-in-progress {
      background: ${props => props.$isDark ? '#003d66' : '#cce5ff'};
      color: ${props => props.$isDark ? '#0099ff' : '#004085'};
    }

    &.status-completed {
      background: ${props => props.$isDark ? '#1e4620' : '#d4edda'};
      color: ${props => props.$isDark ? '#4caf50' : '#155724'};
    }

    &.status-cancelled {
      background: ${props => props.$isDark ? '#4d1f1f' : '#f8d7da'};
      color: ${props => props.$isDark ? '#ff6b6b' : '#721c24'};
    }
  }

  .actions-cell {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;

    .btn-cancel,
    .btn-review {
      padding: 0.6rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .btn-cancel {
      background: #dc3545;
      color: white;

      &:hover {
        background: #c82333;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
      }
    }

    .btn-review {
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      color: #212529;

      &:hover {
        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
      }
    }
  }

  @media (max-width: 1200px) {
    .bookings-table {
      font-size: 0.9rem;

      thead th,
      tbody td {
        padding: 1rem 0.75rem;
      }
    }

    .service-image {
      width: 50px !important;
      height: 50px !important;
    }

    .location-cell span {
      max-width: 150px !important;
    }
  }

  @media (max-width: 768px) {
    .table-container {
      padding: 1rem;
      overflow-x: scroll;
    }

    .bookings-table {
      min-width: 900px;
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
    color: #4700B0;
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
      background: ${props => props.$isDark ? '#0f0f1e' : 'white'};
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      border-radius: 10px;
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
      transition: border-color 0.3s;

      &:focus {
        outline: none;
        border-color: #4700B0;
      }

      &::placeholder {
        color: ${props => props.$isDark ? '#666' : '#999'};
      }
    }
  }

  .btn-submit {
    width: 100%;
    padding: 1.25rem;
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
      box-shadow: 0 6px 20px rgba(71, 0, 176, 0.4);
    }
  }
`;

export default MyBookings;
