import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaStar, FaCalendar, FaDollarSign, FaChartLine, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/ui/Loader';
import { servicesAPI, bookingsAPI } from '../services/api';

const MyServices = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services'); // 'services' or 'dashboard'
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    completedBookings: 0,
    avgRating: 0
  });

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both services and bookings in parallel
      const [servicesRes, bookingsRes] = await Promise.all([
        servicesAPI.getMyServices(currentUser.uid),
        bookingsAPI.getProviderBookings(currentUser.uid)
      ]);

      const servicesData = servicesRes.data;
      const bookingsData = bookingsRes.data;

      setServices(servicesData);
      setBookings(bookingsData);

      // Calculate stats
      const totalRevenue = bookingsData
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.price, 0);

      const completedCount = bookingsData.filter(b => b.status === 'completed').length;

      // Calculate average rating from all services
      const totalRatings = servicesData.reduce((sum, s) => sum + (s.rating?.average || 0) * (s.rating?.count || 0), 0);
      const totalReviews = servicesData.reduce((sum, s) => sum + (s.rating?.count || 0), 0);
      const avgRating = totalReviews > 0 ? totalRatings / totalReviews : 0;

      setStats({
        totalBookings: bookingsData.length,
        totalRevenue,
        completedBookings: completedCount,
        avgRating
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyServices = async () => {
    try {
      const response = await servicesAPI.getMyServices(currentUser.uid);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    }
  };

  const fetchProviderBookings = async () => {
    try {
      const response = await bookingsAPI.getProviderBookings(currentUser.uid);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching provider bookings:', error);
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

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus);
      toast.success(`Booking status updated to ${newStatus}`);
      fetchData(); // Refresh all data
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
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

  return (
    <MyServicesWrapper $isDark={isDarkMode}>
      <div className="container">
        {/* Header with Tabs */}
        <div className="header">
          <h1>Provider Portal</h1>
          {services.length > 0 && (
            <div className="tabs">
              <button
                className={activeTab === 'services' ? 'active' : ''}
                onClick={() => setActiveTab('services')}
              >
                My Services
              </button>
              <button
                className={activeTab === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Services Tab */}
            {(activeTab === 'services' || services.length === 0) && (
              <div className="services-section">
                <div className="section-header">
                  <h2>My Services ({services.length})</h2>
                  <button className="btn-add" onClick={() => navigate('/add-service')}>
                    + Add New Service
                  </button>
                </div>

                {services.length === 0 ? (
                  <div className="empty-state">
                    <h3>No services yet</h3>
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
                            <div className="stat">
                              <span className="label">Price:</span>
                              <span className="value">${service.price}/hr</span>
                            </div>
                            <div className="stat">
                              <span className="label">Bookings:</span>
                              <span className="value">{service.bookingCount || 0}</span>
                            </div>
                            <div className="stat">
                              <span className="label">Rating:</span>
                              <span className="value">
                                <FaStar /> {service.rating?.average?.toFixed(1) || 'N/A'}
                              </span>
                            </div>
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
            )}

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && services.length > 0 && (
              <div className="dashboard-section">
                {/* Stats Cards */}
                <div className="stats-grid">
                  <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                      <FaCalendar />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.totalBookings}</h3>
                      <p>Total Bookings</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                      <FaDollarSign />
                    </div>
                    <div className="stat-info">
                      <h3>${stats.totalRevenue.toFixed(2)}</h3>
                      <p>Total Revenue</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
                      <FaChartLine />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.completedBookings}</h3>
                      <p>Completed</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a, #fee140)' }}>
                      <FaStar />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.avgRating.toFixed(1)}</h3>
                      <p>Average Rating</p>
                    </div>
                  </motion.div>
                </div>

                {/* Bookings Table */}
                <motion.div
                  className="bookings-table-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2>Booking Management</h2>
                  {bookings.length === 0 ? (
                    <div className="no-bookings">
                      <p>No bookings yet</p>
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="bookings-table">
                        <thead>
                          <tr>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking._id}>
                              <td>
                                <div className="customer-info">
                                  <FaUser />
                                  <div>
                                    <div className="customer-name">{booking.customer?.name}</div>
                                    <div className="customer-email">{booking.customer?.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{booking.service?.name}</td>
                              <td>{formatDate(booking.bookingDate)}</td>
                              <td className="price">${booking.price}</td>
                              <td>
                                <span className={`status-badge status-${booking.status}`}>
                                  {booking.status}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  {booking.status === 'pending' && (
                                    <button
                                      className="btn-confirm"
                                      onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                    >
                                      Confirm
                                    </button>
                                  )}
                                  {booking.status === 'confirmed' && (
                                    <button
                                      className="btn-progress"
                                      onClick={() => handleUpdateStatus(booking._id, 'in-progress')}
                                    >
                                      Start
                                    </button>
                                  )}
                                  {booking.status === 'in-progress' && (
                                    <button
                                      className="btn-complete"
                                      onClick={() => handleUpdateStatus(booking._id, 'completed')}
                                    >
                                      Complete
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </MyServicesWrapper>
  );
};

const MyServicesWrapper = styled.div`
  min-height: calc(100vh - 200px);
  padding: 3rem 0;
  background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};

  @media (max-width: 768px) {
    padding: 2rem 0;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 0;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;

    @media (max-width: 768px) {
      padding: 0 1.5rem;
    }

    @media (max-width: 480px) {
      padding: 0 1rem;
    }
  }

  .header {
    margin-bottom: 3rem;

    @media (max-width: 768px) {
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 3rem;
      color: ${props => props.$isDark ? '#fff' : 'transparent'};
      background: ${props => props.$isDark ? 'none' : 'linear-gradient(135deg, #4700B0, #764ba2)'};
      -webkit-background-clip: ${props => props.$isDark ? 'unset' : 'text'};
      -webkit-text-fill-color: ${props => props.$isDark ? '#fff' : 'transparent'};
      background-clip: ${props => props.$isDark ? 'unset' : 'text'};
      font-weight: 700;
      margin-bottom: 1.5rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }

      @media (max-width: 480px) {
        font-size: 1.6rem;
      }
    }

    .tabs {
      display: flex;
      gap: 1rem;
      background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
      padding: 0.5rem;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

      @media (max-width: 768px) {
        gap: 0.5rem;
        padding: 0.4rem;
      }

      button {
        flex: 1;
        padding: 1rem 2rem;
        border: none;
        background: transparent;
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        border-radius: 10px;
        transition: all 0.3s ease;

        @media (max-width: 768px) {
          padding: 0.8rem 1rem;
          font-size: 1rem;
        }

        @media (max-width: 480px) {
          padding: 0.7rem 0.8rem;
          font-size: 0.9rem;
        }

        &.active {
          background: ${props => props.$isDark 
            ? 'linear-gradient(90deg, #4700B0, #764ba2)' 
            : 'linear-gradient(90deg, #4700B0, #764ba2)'};
          color: white;
        }

        &:hover:not(.active) {
          background: ${props => props.$isDark ? '#2d2d44' : '#f0f0f0'};
        }
      }
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    h2 {
      font-size: 2rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};

      @media (max-width: 768px) {
        font-size: 1.6rem;
        text-align: center;
      }

      @media (max-width: 480px) {
        font-size: 1.4rem;
      }
    }

    .btn-add {
      padding: 0.875rem 1.5rem;
      background: ${props => props.$isDark 
        ? 'linear-gradient(90deg, #4700B0, #764ba2)' 
        : 'linear-gradient(90deg, #4700B0, #764ba2)'};
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
    padding: 5rem 2rem;
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 20px;

    h3 {
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
      background: ${props => props.$isDark 
        ? 'linear-gradient(90deg, #4700B0, #764ba2)' 
        : 'linear-gradient(90deg, #4700B0, #764ba2)'};
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
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

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
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .service-stats {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding: 1rem 0;
        border-top: 1px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};

        .stat {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .label {
            color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
            font-size: 0.9rem;
          }

          .value {
            font-weight: 700;
            color: ${props => props.$isDark ? '#fff' : '#212529'};
            display: flex;
            align-items: center;
            gap: 0.3rem;

            svg {
              color: #ffc107;
            }
          }
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
          background: ${props => props.$isDark 
            ? 'linear-gradient(90deg, #4700B0, #764ba2)' 
            : 'linear-gradient(90deg, #4700B0, #764ba2)'};
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

  /* Dashboard Section */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .stat-card {
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 15px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      color: white;
    }

    .stat-info {
      h3 {
        font-size: 2rem;
        font-weight: 700;
        color: ${props => props.$isDark ? '#fff' : '#212529'};
        margin-bottom: 0.3rem;
      }

      p {
        font-size: 0.9rem;
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      }
    }
  }

  .bookings-table-section {
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 1.8rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      margin-bottom: 1.5rem;
    }

    .no-bookings {
      text-align: center;
      padding: 3rem;
      
      p {
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
        font-size: 1.1rem;
      }
    }
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .bookings-table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};

      th {
        padding: 1rem;
        text-align: left;
        font-weight: 700;
        color: ${props => props.$isDark ? '#fff' : '#212529'};
        border-bottom: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
        transition: background 0.2s ease;

        &:hover {
          background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};
        }

        td {
          padding: 1.25rem 1rem;
          color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
        }
      }
    }

    .customer-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      svg {
        font-size: 1.2rem;
        color: #4700B0;
      }

      .customer-name {
        font-weight: 600;
        color: ${props => props.$isDark ? '#fff' : '#212529'};
        margin-bottom: 0.2rem;
      }

      .customer-email {
        font-size: 0.85rem;
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      }
    }

    .price {
      font-weight: 700;
      color: #4700B0;
      font-size: 1.1rem;
    }

    .status-badge {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
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

    .action-buttons {
      display: flex;
      gap: 0.5rem;

      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
        }
      }

      .btn-confirm {
        background: #17a2b8;
        color: white;

        &:hover {
          background: #138496;
        }
      }

      .btn-progress {
        background: #0099ff;
        color: white;

        &:hover {
          background: #0077cc;
        }
      }

      .btn-complete {
        background: #4caf50;
        color: white;

        &:hover {
          background: #45a049;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .bookings-table {
      min-width: 900px;
    }
  }
`;

export default MyServices;

