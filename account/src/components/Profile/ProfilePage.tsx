import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import BasicInformation from './BasicInformation';
import ContactDetails from './ContactDetails';
import ProfilePicture from './ProfilePicture';
import BioPreferences from './BioPreferences';
import ProfileAnalytics from './Analytics';

interface ProfilePageProps {
  userRole?: 'customer' | 'affiliate' | 'admin';
  initialSection?: string;
  onBack?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userRole = 'customer', initialSection = 'basic', onBack }) => {
  const { isDarkMode, colorScheme } = useTheme();
  const [activeSection, setActiveSection] = useState(initialSection);

  const sections = [
    { id: 'basic', name: 'Basic Information', icon: '👤', description: 'Personal details and basic info' },
    { id: 'contact', name: 'Contact Details', icon: '📞', description: 'Contact information and addresses' },
    { id: 'picture', name: 'Profile Picture', icon: '📷', description: 'Manage your profile photo' },
    { id: 'bio', name: 'Bio & Preferences', icon: '⚙️', description: 'Bio, interests, and account preferences' },
    { id: 'analytics', name: 'Analytics', icon: '📊', description: 'View your account analytics and performance' }
  ];

  const getAccentColor = () => {
    switch (colorScheme) {
      case 'blue': return 'text-blue-600 dark:text-blue-400 border-blue-500';
      case 'green': return 'text-green-600 dark:text-green-400 border-green-500';
      case 'purple': return 'text-purple-600 dark:text-purple-400 border-purple-500';
      case 'red': return 'text-red-600 dark:text-red-400 border-red-500';
      default: return 'text-blue-600 dark:text-blue-400 border-blue-500';
    }
  };

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'basic':
        return <BasicInformation />;
      case 'contact':
        return <ContactDetails />;
      case 'picture':
        return <ProfilePicture />;
      case 'bio':
        return <BioPreferences />;
        case 'analytics':
            return <ProfileAnalytics userRole={userRole} />;
      default:
        return <BasicInformation />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Profile Management
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Manage your personal information, preferences, and account settings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm p-6`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Profile Sections
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? `${getAccentColor().split(' ')[0]} ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-4 ${getAccentColor().split(' ')[2]}`
                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{section.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{section.name}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Profile Summary Card */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm p-6 mt-6`}>
              <div className="text-center">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="Profile"
                  className="w-16 h-16 rounded-full mx-auto border-4 border-gray-200 dark:border-gray-600"
                />
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-3`}>
                  John Doe
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Premium Member
                </p>
                <div className="flex items-center justify-center mt-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ))}
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ml-1`}>5.0</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Profile Completion</span>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>85%</span>
                </div>
                <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div className={`h-2 rounded-full ${getAccentColor().includes('blue') ? 'bg-blue-600' : getAccentColor().includes('green') ? 'bg-green-600' : getAccentColor().includes('purple') ? 'bg-purple-600' : 'bg-red-600'}`} style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;