import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaEdit, FaChartLine, FaDollarSign, FaStar, FaBriefcase, FaCalendar } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usersAPI } from '../services/api';
import Loader from '../components/ui/Loader';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [providerStats, setProviderStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'provider'

  useEffect(() => {
    if (currentUser?.uid) {
      fetchProviderStats();
    }
  }, [currentUser]);

  const fetchProviderStats = async () => {
    try {
      setStatsLoading(true);
      const response = await usersAPI.getProviderStats(currentUser.uid);
      setProviderStats(response.data);
    } catch (error) {
      console.error('Error fetching provider stats:', error);
      // Don't show error toast if user is not a provider
      if (error.response?.status !== 404) {
        toast.error('Failed to load provider statistics');
      }
    } finally {
      setStatsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile({ displayName, photoURL });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#4700B0', '#667eea', '#764ba2', '#ffc107', '#ff6384'];

  const statusData = providerStats ? [
    { name: 'Completed', value: providerStats.bookingsByStatus.completed, color: '#4caf50' },
    { name: 'Confirmed', value: providerStats.bookingsByStatus.confirmed, color: '#2196f3' },
    { name: 'Pending', value: providerStats.bookingsByStatus.pending, color: '#ff9800' },
    { name: 'In Progress', value: providerStats.bookingsByStatus.inProgress, color: '#9c27b0' },
    { name: 'Cancelled', value: providerStats.bookingsByStatus.cancelled, color: '#f44336' }
  ].filter(item => item.value > 0) : [];

  return (
    <ProfileWrapper $isDark={isDarkMode}>
      <div className="container">
        {/* Tab Navigation */}
        {providerStats && providerStats.totalServices > 0 && (
          <div className="tabs">
            <button 
              className={activeTab === 'profile' ? 'active' : ''} 
              onClick={() => setActiveTab('profile')}
            >
              <FaUser /> Profile
            </button>
            <button 
              className={activeTab === 'provider' ? 'active' : ''} 
              onClick={() => setActiveTab('provider')}
            >
              <FaChartLine /> Provider Dashboard
            </button>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            className="profile-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="profile-header">
              <div className="avatar">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" />
                ) : (
                  <FaUser />
                )}
              </div>
              <h1>My Profile</h1>
            </div>

            <div className="profile-content">
              {isEditing ? (
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label htmlFor="displayName">Display Name</label>
                    <input
                      type="text"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="photoURL">Photo URL</label>
                    <input
                      type="url"
                      id="photoURL"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="Enter photo URL"
                    />
                  </div>
                  <div className="button-group">
                    <button type="submit" className="btn-save" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(currentUser?.displayName || '');
                        setPhotoURL(currentUser?.photoURL || '');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="info-item">
                    <FaUser className="icon" />
                    <div>
                      <label>Name</label>
                      <p>{currentUser?.displayName || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaEnvelope className="icon" />
                    <div>
                      <label>Email</label>
                      <p>{currentUser?.email}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaCalendar className="icon" />
                    <div>
                      <label>Last Login</label>
                      <p>{currentUser?.metadata?.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaCalendar className="icon" />
                    <div>
                      <label>Account Created</label>
                      <p>{currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>
                    <FaEdit /> Edit Profile
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Provider Dashboard Tab */}
        {activeTab === 'provider' && (
          <motion.div
            className="provider-dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {statsLoading ? (
              <Loader />
            ) : providerStats ? (
              <>
                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                      <FaBriefcase />
                    </div>
                    <div className="stat-info">
                      <h3>{providerStats.totalServices}</h3>
                      <p>Total Services</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                      <FaCalendar />
                    </div>
                    <div className="stat-info">
                      <h3>{providerStats.totalBookings}</h3>
                      <p>Total Bookings</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
                      <FaDollarSign />
                    </div>
                    <div className="stat-info">
                      <h3>${providerStats.totalRevenue.toFixed(2)}</h3>
                      <p>Total Revenue</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a, #fee140)' }}>
                      <FaStar />
                    </div>
                    <div className="stat-info">
                      <h3>{providerStats.averageRating.toFixed(1)}</h3>
                      <p>Average Rating ({providerStats.totalReviews} reviews)</p>
                    </div>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="charts-grid">
                  {/* Monthly Revenue Chart */}
                  <div className="chart-card">
                    <h3>Monthly Revenue (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={providerStats.monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2d2d44' : '#e0e0e0'} />
                        <XAxis dataKey="month" stroke={isDarkMode ? '#aaa' : '#666'} />
                        <YAxis stroke={isDarkMode ? '#aaa' : '#666'} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#1a1a2e' : 'white',
                            border: `1px solid ${isDarkMode ? '#2d2d44' : '#e0e0e0'}`
                          }}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#4700B0" name="Revenue ($)" />
                        <Bar dataKey="bookings" fill="#667eea" name="Bookings" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Booking Status Distribution */}
                  <div className="chart-card">
                    <h3>Booking Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Top Services Table */}
                  <div className="chart-card full-width">
                    <h3>Top 5 Services by Bookings</h3>
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Service Name</th>
                            <th>Category</th>
                            <th>Bookings</th>
                            <th>Revenue</th>
                            <th>Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {providerStats.topServices.map((service) => (
                            <tr key={service.id}>
                              <td>{service.name}</td>
                              <td><span className="category-badge">{service.category}</span></td>
                              <td>{service.bookingCount}</td>
                              <td>${service.revenue.toFixed(2)}</td>
                              <td>
                                <span className="rating">
                                  <FaStar /> {service.rating.toFixed(1)} ({service.reviewCount})
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Bookings */}
                  <div className="chart-card full-width">
                    <h3>Recent Bookings</h3>
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {providerStats.recentBookings.map((booking) => (
                            <tr key={booking.id}>
                              <td>{booking.customerName}</td>
                              <td>{booking.service}</td>
                              <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                              <td><span className={`status-badge ${booking.status}`}>{booking.status}</span></td>
                              <td>${booking.price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-data">
                <p>No provider statistics available. Start offering services to see your dashboard!</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </ProfileWrapper>
  );
};

const ProfileWrapper = styled.div`
  min-height: calc(100vh - 200px);
  padding: 3rem 0;
  background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    padding: 1rem;
    border-radius: 15px;

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
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      &.active {
        background: linear-gradient(135deg, #4700B0, #764ba2);
        color: white;
      }

      &:hover:not(.active) {
        background: ${props => props.$isDark ? '#2d2d44' : '#f0f0f0'};
      }
    }
  }

  .profile-card {
    background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;

    @media (max-width: 768px) {
      padding: 2rem;
      border-radius: 15px;
    }

    @media (max-width: 480px) {
      padding: 1.5rem;
    }
  }

  .profile-header {
    text-align: center;
    margin-bottom: 3rem;

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4700B0, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 3rem;
      color: white;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    h1 {
      font-size: 2rem;
      color: ${props => props.$isDark ? '#fff' : '#212529'};
    }
  }

  .profile-content {
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem 0;
      border-bottom: 1px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};

      .icon {
        font-size: 1.5rem;
        color: #4700B0;
        margin-top: 0.3rem;
      }

      label {
        display: block;
        font-size: 0.9rem;
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
        margin-bottom: 0.3rem;
      }

      p {
        font-size: 1.1rem;
        font-weight: 600;
        color: ${props => props.$isDark ? '#fff' : '#212529'};
      }
    }

    .btn-edit {
      margin-top: 2rem;
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #4700B0, #764ba2);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
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

    input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
      border-radius: 10px;
      font-size: 1rem;
      background: ${props => props.$isDark ? '#0f0f1e' : 'white'};
      color: ${props => props.$isDark ? '#fff' : '#212529'};
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #4700B0;
      }
    }
  }

  .button-group {
    display: flex;
    gap: 1rem;

    button {
      flex: 1;
      padding: 1rem;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-save {
      background: linear-gradient(135deg, #4700B0, #764ba2);
      color: white;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .btn-cancel {
      background: ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
      color: ${props => props.$isDark ? '#fff' : '#212529'};

      &:hover {
        background: ${props => props.$isDark ? '#3d3d54' : '#d0d0d0'};
      }
    }
  }

  /* Provider Dashboard Styles */
  .provider-dashboard {
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
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
          font-size: 1.8rem;
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

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .chart-card {
      background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

      &.full-width {
        grid-column: 1 / -1;
      }

      h3 {
        font-size: 1.3rem;
        font-weight: 600;
        color: ${props => props.$isDark ? '#fff' : '#212529'};
        margin-bottom: 1.5rem;
      }
    }

    .table-wrapper {
      overflow-x: auto;

      table {
        width: 100%;
        border-collapse: collapse;

        thead {
          background: ${props => props.$isDark ? '#0f0f1e' : '#f8f9fa'};

          th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: ${props => props.$isDark ? '#fff' : '#212529'};
            border-bottom: 2px solid ${props => props.$isDark ? '#2d2d44' : '#e0e0e0'};
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
              padding: 1rem;
              color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
            }
          }
        }

        .category-badge {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          background: ${props => props.$isDark ? '#4700B0' : '#e3f2fd'};
          color: ${props => props.$isDark ? '#fff' : '#1976d2'};
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: #ffc107;
          font-weight: 600;

          svg {
            font-size: 1rem;
          }
        }

        .status-badge {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;

          &.completed {
            background: #c8e6c9;
            color: #2e7d32;
          }

          &.confirmed {
            background: #bbdefb;
            color: #1565c0;
          }

          &.pending {
            background: #ffe0b2;
            color: #e65100;
          }

          &.in-progress {
            background: #e1bee7;
            color: #6a1b9a;
          }

          &.cancelled {
            background: #ffcdd2;
            color: #c62828;
          }
        }
      }
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      background: ${props => props.$isDark ? '#1a1a2e' : 'white'};
      border-radius: 15px;

      p {
        font-size: 1.1rem;
        color: ${props => props.$isDark ? '#aaa' : '#6c757d'};
      }
    }
  }
`;

export default Profile;

