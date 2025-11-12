import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile({ displayName });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileWrapper isDark={isDarkMode}>
      <div className="container">
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
                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  <FaEdit /> Edit Profile
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </ProfileWrapper>
  );
};

const ProfileWrapper = styled.div`
  min-height: calc(100vh - 200px);
  padding: 3rem 0;
  background: ${props => props.isDark ? '#0f0f1e' : '#f8f9fa'};

  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .profile-card {
    background: ${props => props.isDark ? '#1a1a2e' : 'white'};
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      padding: 2rem;
    }
  }

  .profile-header {
    text-align: center;
    margin-bottom: 3rem;

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
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
      color: ${props => props.isDark ? '#fff' : '#212529'};
    }
  }

  .profile-content {
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem 0;
      border-bottom: 1px solid ${props => props.isDark ? '#2d2d44' : '#e0e0e0'};

      .icon {
        font-size: 1.5rem;
        color: #667eea;
        margin-top: 0.3rem;
      }

      label {
        display: block;
        font-size: 0.9rem;
        color: ${props => props.isDark ? '#aaa' : '#6c757d'};
        margin-bottom: 0.3rem;
      }

      p {
        font-size: 1.1rem;
        font-weight: 600;
        color: ${props => props.isDark ? '#fff' : '#212529'};
      }
    }

    .btn-edit {
      margin-top: 2rem;
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
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
      color: ${props => props.isDark ? '#fff' : '#212529'};
    }

    input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid ${props => props.isDark ? '#2d2d44' : '#e0e0e0'};
      border-radius: 10px;
      font-size: 1rem;
      background: ${props => props.isDark ? '#0f0f1e' : 'white'};
      color: ${props => props.isDark ? '#fff' : '#212529'};
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #667eea;
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
      background: linear-gradient(135deg, #667eea, #764ba2);
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
      background: ${props => props.isDark ? '#2d2d44' : '#e0e0e0'};
      color: ${props => props.isDark ? '#fff' : '#212529'};

      &:hover {
        background: ${props => props.isDark ? '#3d3d54' : '#d0d0d0'};
      }
    }
  }
`;

export default Profile;
