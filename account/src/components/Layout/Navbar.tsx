
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  SunIcon, 
  MoonIcon, 
  BellIcon, 
  UserCircleIcon,
  Bars3Icon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const { 
    isDarkMode, 
    toggleTheme, 
    toggleMobileSidebar,
    followSystemTheme,
    setFollowSystemTheme
  } = useTheme();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New account update!', message: 'Your profile has been updated', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment processed', message: 'Your payment has been confirmed', time: '1 hour ago', unread: true },
    { id: 3, title: 'Welcome bonus', message: 'Complete your profile for bonus', time: '2 hours ago', unread: false },
  ];

  return (
    <nav className="fixed top-0 w-full z-[0] border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-0 shadow-md">
      <div className="container mx-auto px-2 sm:px-4" style={{ maxWidth: '1300px' }}>
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Logo and Page Title */}
            <div className="flex items-center">
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-orange-600 dark:text-white">
                  BonziCart
                </h1>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Theme Controls */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? (
                  <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <SunIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Theme Menu */}
              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-elevation-3 border border-gray-200 dark:border-gray-700 py-3">
                  <div className="px-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Appearance Settings
                    </h3>
                  </div>
                  
                  {/* Theme Toggle */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setFollowSystemTheme(!followSystemTheme)}
                          className={`text-xs px-2 py-1 rounded-lg ${
                            followSystemTheme 
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          Auto
                        </button>
                        <button
                          onClick={toggleTheme}
                          className={`relative w-11 h-6 rounded-full ${
                            isDarkMode 
                              ? 'bg-orange-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full ${
                            isDarkMode ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <BellIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                {/* Notification Badge */}
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 text-white text-2xs sm:text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-elevation-3 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <button className="text-xs text-orange-500 dark:text-orange-400 hover:underline">
                        Mark all read
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                          notification.unread ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? 'bg-orange-500' : 'bg-transparent'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full text-sm text-orange-500 dark:text-orange-400 hover:underline">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-semibold">JD</span>
                </div>
                <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-elevation-3 border border-gray-200 dark:border-gray-700 py-2">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm sm:text-base font-semibold">JD</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          John Doe
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          john.doe@example.com
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${location.pathname === "/profile" ? "bg-orange-100 dark:bg-gray-700/50" : ""}`} onClick={()=>{
                      navigation("/profile")
                    }}>
                      <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm">Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <Cog6ToothIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm" onClick={()=>{
                         navigation("/settings")
                      }}>Settings</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                      <ArrowRightOnRectangleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm" onClick={()=>{
                        window.location.href = "https://bonzicart.vercel.app/auth/login";
                      }}>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
