
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarCollapsed, isDarkMode, isMobileSidebarOpen, toggleMobileSidebar } = useTheme();

  return (
    <div className={`min-h-screen ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.5)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      {/* Fixed Navbar at the top */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container-table mx-auto mt-16 mb-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
          {/* Sidebar Column */}
          <div className="border-r z-0 border-gray-200 dark:border-gray-800">
            <Sidebar />
          </div>

          {/* Main Content Column */}
          <div className="flex-1 relative z-10 flex flex-col">
            {/* Page Content */}
            <main className="flex-1 p-6 overflow-auto">
              <div className="w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMobileSidebar}></div>
            <div className="fixed top-0 left-0 w-80 h-full z-60">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Mobile Main Content */}
        <div className="pt-16 min-h-screen bg-white dark:bg-gray-900">
          <main className="p-4">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
