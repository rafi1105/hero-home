import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';

const MyBookings = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Mock data - replace with API call
      const mockBookings = [
        {
          _id: '1',
          service: {
            name: 'Professional Plumbing',
            image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500',
            provider: 'John Doe'
          },
          date: '2025-11-20',
          time: '10:00 AM',
          location: '123 Main St, City',
          status: 'upcoming',
          price: 50
        },
        {
          _id: '2',
          service: {
            name: 'House Cleaning',
            image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
            provider: 'Clean Pro'
          },
          date: '2025-11-15',
          time: '2:00 PM',
          location: '456 Oak Ave, City',
          status: 'completed',
          price: 40
        }
      ];

      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // TODO: API call to cancel
        setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
        toast.success('Booking cancelled successfully');
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
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
    <MyBookingsWrapper isDark={isDarkMode}>
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MyBookingsWrapper>
  );
};

const MyBookingsWrapper = styled.div`
  min-height: calc(100vh - 200px);
  padding: 3rem 0;
  background: ${props => props.isDark ? '#0f0f1e' : '#f8f9fa'};

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .header {
    margin-bottom: 3rem;

    h1 {
      font-size: 2.5rem;
      color: ${props => props.isDark ? '#fff' : '#212529'};
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
        background: ${props => props.isDark ? '#1a1a2e' : 'white'};
        color: ${props => props.isDark ? '#fff' : '#212529'};
        border: 2px solid ${props => props.isDark ? '#2d2d44' : '#e0e0e0'};
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
      color: ${props => props.isDark ? '#fff' : '#212529'};
      margin-bottom: 1rem;
    }

    p {
      color: ${props => props.isDark ? '#aaa' : '#6c757d'};
      font-size: 1.1rem;
    }
  }

  .bookings-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .booking-card {
    background: ${props => props.isDark ? '#1a1a2e' : 'white'};
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
          color: ${props => props.isDark ? '#fff' : '#212529'};
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
          color: ${props => props.isDark ? '#aaa' : '#6c757d'};

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
        border-top: 1px solid ${props => props.isDark ? '#2d2d44' : '#e0e0e0'};

        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
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

export default MyBookings;
