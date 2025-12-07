
import React, { useState, useRef, useEffect } from 'react';
import { useTheme, useColorScheme } from '../../contexts/ThemeContext';
import { showToast } from '../../utils/toast';
import { useNavigate ,useLocation} from 'react-router-dom';
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
    cycleThemeMode,
    toggleMobileSidebar, 
    colorScheme, 
    setColorScheme,
    followSystemTheme,
    setFollowSystemTheme,
    theme,
    setTheme
  } = useTheme();
  const { getColorClasses } = useColorScheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const themeMenuRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  const colorOptions = [
    { name: 'Orange', value: 'orange' as const, color: 'bg-orange-primary' },
  ];

  const notifications = [
    { id: 1, title: 'New referral bonus!', message: 'You earned ₹25 from John Doe', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment processed', message: 'Your earnings have been transferred', time: '1 hour ago', unread: true },
    { id: 3, title: 'Welcome bonus', message: 'Complete your profile for ₹10 bonus', time: '2 hours ago', unread: false },
  ];

  // Close all dropdowns when clicking outside
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(target)) {
        setShowThemeMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

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
                <h1 className="text-lg sm:text-xl font-bold text-orange-600 dark:text-white select-none">
                  Bonzicart
                </h1>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Small theme toggle button next to user menu */}
            <div className="hidden sm:block" ref={themeMenuRef}>
              <button
                onClick={() => {
                  const nextMode = isDarkMode ? 'Light' : 'Dark';
                  // toggleTheme will disable follow-system and flip theme
                  toggleTheme();
                  showToast.success(`Appearance: ${nextMode}`);
                }}
                title="Toggle theme"
                aria-label="Toggle theme"
                className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? (
                  <SunIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>

            {/* Notifications */}
            <div className="relative hidden" ref={notificationsRef}>
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
                      <button className="text-xs text-orange-primary dark:text-orange-hover hover:underline">
                        Mark all read
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                          notification.unread ? 'bg-orange-light dark:bg-orange-dark/20' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? 'bg-orange-primary' : 'bg-transparent'
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
                    <button className="w-full text-sm text-orange-primary dark:text-orange-hover hover:underline">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-primary to-orange-hover rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-semibold">BP</span>
                </div>
                <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-elevation-3 border border-gray-200 dark:border-gray-700 py-2">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-primary to-orange-hover rounded-full flex items-center justify-center">
                        <span className="text-white text-sm sm:text-base font-semibold">BP</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                         Bharat Prajapat
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          prajapat.bharat@gmail.com
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
                        window.location.href ="https://bonzicart.vercel.app/auth/login";
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
