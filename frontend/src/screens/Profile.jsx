import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/profile.css';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/PrivatePage';

function Profile() {

  const users = useSelector(state => state.users)
  return (
    <>
      <ProtectedRoute>

        <div className="profile-container">
          <Navbar currentPage="profile" />
          <div className="profile-container-body">
            <div className="profile-container-heading">
              <h2>Profile Page</h2>
              <h3>(Manage your profile details)</h3>
            </div>

            <div className="profile-container-content">
              <div className="form-group">
                <label htmlFor="name">Name: {users?.userdata?.name}</label>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email: {users?.userdata?.email}</label>
              </div>
              <div className="form-group">
                <label htmlFor="email">Role: {users?.userdata?.role}</label>
              </div>
              {
                users?.userdata?.role === "doctor" ?
                  <div className="form-group">
                    <label htmlFor="specialization">Specialization: {users?.userdata?.specialisation}</label>
                  </div> : null
              }

            </div>
          </div>
        </div>
      </ProtectedRoute>

    </>

  );
}

export default Profile;
