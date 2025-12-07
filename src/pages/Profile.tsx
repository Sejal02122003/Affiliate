
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showToast } from '../utils/toast';
import {
  fetchUserProfile,
  updatePersonalInfo,
  updateBusinessDetails,
  updatePreferences,
  updateProfileImage,
  changePassword,
  clearError,
} from '../store/slices/profileSlice';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    profileData, 
    loading, 
    updateLoading, 
    passwordLoading, 
    imageLoading, 
    error 
  } = useAppSelector((state) => state.profile);

  const [editMode, setEditMode] = useState(false);

  const [activeTab, setActiveTab] = useState('personal');
  const [personalForm, setPersonalForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
    country: '',
    state: '',
    city: '',
    address1: '',
    address2: '',
    pin_code: '',
    alt_phone_number: '',
  });
  const [businessForm, setBusinessForm] = useState({
    company_name: '',
    website: '',
    tax_id: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    industry: '',
    company_size: '',
  });
  const [preferencesForm, setPreferencesForm] = useState({
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    theme: 'light',
    dashboard_widgets: ['earnings_summary', 'recent_referrals'],
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const tabs = [
    { id: 'personal', name: 'Personal Info' },
    { id: 'business', name: 'Business Details' },
    { id: 'preferences', name: 'Preferences' },
    { id: 'password', name: 'Change Password' },
  ];

  // Fetch profile data on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

 
  // Update forms when profile data is loaded
  useEffect(() => {
    if (profileData) {
      setPersonalForm({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        gender: profileData.gender || '',
        country: profileData.country || '',
        state: profileData.state || '',
        city: profileData.city || '',
        address1: profileData.address1 || '',
        address2: profileData.address2 || '',
        pin_code: profileData.pin_code || '',
        alt_phone_number: profileData.alt_phone_number || '',
        email: profileData.email || '',
        phone: profileData.phone_number || '',
      });

      // Set default values for business form (since API doesn't provide these yet)
      setBusinessForm({
        company_name: '',
        website: '',
        tax_id: '',
        address: {
          street: profileData.address1 || '',
          city: profileData.city || '',
          state: profileData.state || '',
          zip: profileData.pin_code || '',
          country: profileData.country || '',
        },
        industry: '',
        company_size: '',
      });

      // Set default values for preferences (since API doesn't provide these yet)
      setPreferencesForm({
        language: 'en',
        timezone: 'America/New_York',
        currency: 'USD',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        theme: 'light',
        dashboard_widgets: ['earnings_summary'],
      });
    }
  }, [profileData]);

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData = {
        first_name: personalForm.first_name,
        last_name: personalForm.last_name,
        email: personalForm.email,
        phone_number: personalForm.phone,
        gender: personalForm.gender,
        country: personalForm.country,
        state: personalForm.state,
        city: personalForm.city,
        address1: personalForm.address1,
        address2: personalForm.address2,
        pin_code: personalForm.pin_code,
        alt_phone_number: personalForm.alt_phone_number,
      };
      await dispatch(updatePersonalInfo(updateData)).unwrap();
      showToast.success('Personal information updated successfully!');
    } catch (error) {
      console.error('Failed to update personal info:', error);
      showToast.error(
        error instanceof Error ? error.message : 'Failed to update personal information. Please try again.'
      );
    }
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateBusinessDetails(businessForm)).unwrap();
      showToast.success('Business details updated successfully!');
    } catch (error) {
      console.error('Failed to update business details:', error);
      showToast.error(
        error instanceof Error ? error.message : 'Failed to update business details. Please try again.'
      );
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updatePreferences(preferencesForm)).unwrap();
      showToast.success('Preferences updated successfully!');
    } catch (error) {
      console.error('Failed to update preferences:', error);
      showToast.error(
        error instanceof Error ? error.message : 'Failed to update preferences. Please try again.'
      );
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      showToast.error('Passwords do not match');
      return;
    }
    
    if (passwordForm.new_password.length < 8) {
      showToast.error('Password must be at least 8 characters long');
      return;
    }
    
    try {
      await dispatch(changePassword(passwordForm)).unwrap();
      showToast.success('Your password has been updated successfully.');
      setPasswordForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      showToast.error(
        error instanceof Error ? error.message : 'Failed to change password. Please try again.'
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast.error('Image file size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast.error('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          await dispatch(updateProfileImage({ profile_image: base64String })).unwrap();
          showToast.success('Profile image updated successfully!');
        } catch (error) {
          console.error('Failed to update profile image:', error);
          showToast.error(
            error instanceof Error ? error.message : 'Failed to update profile image. Please try again.'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              ×
            </button>
          </div>
        </div>
      )}



      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'personal' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h3>
          
          {/* Profile Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {(profileData?.profile_image || profileData?.profile_image_url) ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-orange-200 shadow-md">
                    <img
                      src={profileData.profile_image || profileData.profile_image_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                      <label htmlFor="profile-image-upload" className="cursor-pointer w-full h-full flex items-center justify-center">
                        <span className="text-white opacity-0 hover:opacity-100">Change</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-orange-200 shadow-md">
                    <span className="text-gray-500 dark:text-gray-400 text-2xl">👤</span>
                  </div>
                )}
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageLoading}
                  className="hidden"
                />
                <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-md hover:bg-orange-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
              {imageLoading && <span className="text-sm text-gray-500 ml-4">Uploading...</span>}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
            <button 
              type="button" 
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handlePersonalSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={personalForm.first_name}
                    onChange={(e) => setPersonalForm({...personalForm, first_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {personalForm.first_name || 'Not provided'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={personalForm.last_name}
                    onChange={(e) => setPersonalForm({...personalForm, last_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {personalForm.last_name || 'Not provided'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                {editMode ? (
                  <input
                    type="email"
                    value={personalForm.email}
                    onChange={(e) => setPersonalForm({...personalForm, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {personalForm.email || 'Not provided'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    value={personalForm.phone}
                    onChange={(e) => setPersonalForm({...personalForm, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {personalForm.phone || 'Not provided'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                {editMode ? (
                  <select
                    value={personalForm.gender}
                    onChange={(e) => setPersonalForm({...personalForm, gender: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {personalForm.gender ? personalForm.gender.charAt(0).toUpperCase() + personalForm.gender.slice(1) : 'Not provided'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={personalForm.country}
                  onChange={(e) => setPersonalForm({...personalForm, country: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={personalForm.state}
                  onChange={(e) => setPersonalForm({...personalForm, state: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={personalForm.city}
                  onChange={(e) => setPersonalForm({...personalForm, city: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address 1
                </label>
                <input
                  type="text"
                  value={personalForm.address1}
                  onChange={(e) => setPersonalForm({...personalForm, address1: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address 2
                </label>
                <input
                  type="text"
                  value={personalForm.address2}
                  onChange={(e) => setPersonalForm({...personalForm, address2: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={personalForm.pin_code}
                  onChange={(e) => setPersonalForm({...personalForm, pin_code: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  value={personalForm.alt_phone_number}
                  onChange={(e) => setPersonalForm({...personalForm, alt_phone_number: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            {editMode && (
              <button 
                type="submit" 
                disabled={updateLoading}
                className="mt-6 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </form>
        </div>
      )}

      {activeTab === 'business' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Details</h3>
            <button 
              type="button" 
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {editMode ? 'Cancel' : 'Edit Details'}
            </button>
          </div>
          <form onSubmit={handleBusinessSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={businessForm.company_name}
                    onChange={(e) => setBusinessForm({...businessForm, company_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {businessForm.company_name || 'Not provided'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                {editMode ? (
                  <input
                    type="url"
                    value={businessForm.website}
                    onChange={(e) => setBusinessForm({...businessForm, website: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {businessForm.website || 'Not provided'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax ID
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={businessForm.tax_id}
                    onChange={(e) => setBusinessForm({...businessForm, tax_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {businessForm.tax_id || 'Not provided'}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Street
                  </label>
                  {editMode ? (
                  <input
                    type="text"
                    value={businessForm.address.street}
                    onChange={(e) => setBusinessForm({
                      ...businessForm, 
                      address: {...businessForm.address, street: e.target.value}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {businessForm.address.street || 'Not provided'}
                  </div>
                )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  {editMode ? (
                  <input
                    type="text"
                    value={businessForm.address.city}
                    onChange={(e) => setBusinessForm({
                      ...businessForm, 
                      address: {...businessForm.address, city: e.target.value}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {businessForm.address.city || 'Not provided'}
                  </div>
                )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  {editMode ? (
                  <input
                    type="text"
                    value={businessForm.address.state}
                    onChange={(e) => setBusinessForm({
                      ...businessForm, 
                      address: {...businessForm.address, state: e.target.value}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {businessForm.address.state || 'Not provided'}
                  </div>
                )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP Code
                  </label>
                  {editMode ? (
                  <input
                    type="text"
                    value={businessForm.address.zip}
                    onChange={(e) => setBusinessForm({
                      ...businessForm, 
                      address: {...businessForm.address, zip: e.target.value}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {businessForm.address.zip || 'Not provided'}
                  </div>
                )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={businessForm.industry}
                    onChange={(e) => setBusinessForm({...businessForm, industry: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {businessForm.industry || 'Not provided'}
                  </div>
                )}
              </div>
            </div>
            {editMode && (
              <button 
                type="submit" 
                disabled={updateLoading}
                className="mt-6 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </form>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h3>
          </div>
          <form onSubmit={handlePreferencesSubmit}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates about your account</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setPreferencesForm({
                    ...preferencesForm,
                    notifications: {
                      ...preferencesForm.notifications,
                      email: !preferencesForm.notifications.email
                    }
                  })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent focus:outline-none ${
                    preferencesForm.notifications.email ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                    preferencesForm.notifications.email ? 'translate-x-5' : 'translate-x-0'
                  }`}></span>
                </button>

              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">SMS Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive SMS updates</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferencesForm({
                    ...preferencesForm,
                    notifications: {
                      ...preferencesForm.notifications,
                      sms: !preferencesForm.notifications.sms
                    }
                  })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent focus:outline-none ${
                    preferencesForm.notifications.sms ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                    preferencesForm.notifications.sms ? 'translate-x-5' : 'translate-x-0'
                  }`}></span>
                </button>

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={preferencesForm.language}
                    onChange={(e) => setPreferencesForm({...preferencesForm, language: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={preferencesForm.currency}
                    onChange={(e) => setPreferencesForm({...preferencesForm, currency: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={updateLoading}
              className="mt-6 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {updateLoading ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
            <button 
              type="button" 
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {editMode ? 'Cancel' : 'Change Password'}
            </button>
          </div>
          {editMode ? (
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                  minLength={8}
                />
                {passwordForm.new_password && passwordForm.new_password.length < 8 && (
                  <p className="text-red-500 text-xs mt-1">Password must be at least 8 characters long</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.new_password_confirmation}
                  onChange={(e) => setPasswordForm({...passwordForm, new_password_confirmation: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
                {passwordForm.new_password_confirmation && passwordForm.new_password !== passwordForm.new_password_confirmation && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
            </div>
            <button 
              type="submit" 
              disabled={passwordLoading}
              className="mt-6 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
          ) : (
            <div className="text-gray-600 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              For security reasons, your password is hidden. Click the "Change Password" button to update it.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
