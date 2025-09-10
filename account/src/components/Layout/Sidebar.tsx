
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { sidebarConfig, MenuItem } from '../../config/sidebarConfig';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { toggleMobileSidebar } = useTheme();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isActiveItem = (itemPath: string) => {
    return location.pathname === itemPath || (itemPath === '/dashboard' && location.pathname === '/');
  };

  const toggleSubMenu = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      toggleMobileSidebar();
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.type === 'heading') {
      return (
        <div key={item.id} className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-t border-gray-200 dark:border-gray-700 mt-4 first:mt-0 first:border-t-0">
          {item.text}
        </div>
      );
    }

    const isExpanded = expandedItems.includes(item.id);
    const hasActiveSubItem = item.subMenuItems?.some(subItem => isActiveItem(subItem.path));

    return (
      <div key={item.id}>
        <div
          className={`
            flex items-center justify-between px-4 py-3 mx-2 my-1 rounded-lg
            transition-all duration-200 ease-in-out
            hover:bg-orange-50 dark:hover:bg-gray-800
            ${item.isActive || hasActiveSubItem
              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-l-4 border-orange-500' 
              : 'text-gray-700 dark:text-gray-300'
            }
            ${item.hasSubMenu ? 'cursor-pointer' : ''}
          `}
          onClick={() => {
            if (item.hasSubMenu) {
              toggleSubMenu(item.id);
            } else if (item.onClick) {
              item.onClick();
            }
            handleItemClick();
          }}
        >
          <div className="flex items-center">
            <span className="text-xl mr-3 flex items-center">
              {item.icon}
            </span>
            <span className="font-medium text-sm whitespace-nowrap">
              {item.text}
            </span>
            {item.badge && (
              <span className="ml-2 px-2 py-1 text-xs bg-orange-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          {item.hasSubMenu && (
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>

        {/* Sub Menu Items */}
        {item.hasSubMenu && isExpanded && item.subMenuItems && (
          <div className="ml-6 space-y-1">
            {item.subMenuItems.map((subItem) => (
              <Link
                key={subItem.path}
                to={subItem.path}
                onClick={() => {
                  if (subItem.onClick) {
                    subItem.onClick();
                  }
                  handleItemClick();
                }}
                className={`
                  flex items-center px-4 py-2 mx-2 rounded-lg text-sm
                  transition-all duration-200 ease-in-out
                  hover:bg-orange-50 dark:hover:bg-gray-800
                  ${isActiveItem(subItem.path)
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    : 'text-gray-600 dark:text-gray-400'
                  }
                `}
              >
                {subItem.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
      transition-all duration-300 ease-in-out
      w-64
      lg:relative lg:block
      shadow-lg
    `}>

      {/* Mobile Header with Close Button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-orange-600 dark:text-orange-400">BonziCart</h2>
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Sidebar Content */}
      <nav className="h-full overflow-y-auto pb-6">
        {sidebarConfig.map(renderMenuItem)}
      </nav>
    </div>
  );
};

export default Sidebar;
