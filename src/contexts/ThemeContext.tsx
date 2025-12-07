
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';
type ColorScheme = 'orange';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  cycleThemeMode: () => void;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  isLoading: boolean;
  systemPreference: Theme;
  followSystemTheme: boolean;
  setFollowSystemTheme: (follow: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  theme: 'affiliate-theme',
  colorScheme: 'affiliate-colorScheme',
  sidebarCollapsed: 'affiliate-sidebarCollapsed',
  followSystemTheme: 'affiliate-followSystemTheme',
} as const;

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('orange');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Start open for desktop, will be handled for mobile
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Mobile sidebar overlay state
  const [isLoading, setIsLoading] = useState(true);
  const [systemPreference, setSystemPreference] = useState<Theme>('dark');
  const [followSystemTheme, setFollowSystemTheme] = useState(false);

  // Detect system theme preference
  const getSystemTheme = useCallback((): Theme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) as Theme;
      const savedColorScheme = localStorage.getItem(STORAGE_KEYS.colorScheme) as ColorScheme;
      const savedSidebarState = localStorage.getItem(STORAGE_KEYS.sidebarCollapsed);
      const savedFollowSystem = localStorage.getItem(STORAGE_KEYS.followSystemTheme);
      
      const systemTheme = getSystemTheme();
      setSystemPreference(systemTheme);
      
      const shouldFollowSystem = savedFollowSystem === 'true';
      setFollowSystemTheme(shouldFollowSystem);
      
      if (shouldFollowSystem) {
        setThemeState(systemTheme);
      } else if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        setThemeState(savedTheme);
      } else {
        setThemeState('light'); // Default to light mode
      }
      
      // Always use orange color scheme
      setColorSchemeState('orange');
      
      if (savedSidebarState) {
        setIsSidebarCollapsed(savedSidebarState === 'true');
      }
    } catch (error) {
      console.warn('Error loading theme preferences:', error);
      setThemeState(getSystemTheme());
    } finally {
      setIsLoading(false);
    }
  }, [getSystemTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        setSystemPreference(newSystemTheme);
        
        if (followSystemTheme) {
          setThemeState(newSystemTheme);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [followSystemTheme]);

  // Apply theme changes to document
  useEffect(() => {
    if (isLoading) return;

    try {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.theme, theme);
      localStorage.setItem(STORAGE_KEYS.colorScheme, colorScheme);
      localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, isSidebarCollapsed.toString());
      localStorage.setItem(STORAGE_KEYS.followSystemTheme, followSystemTheme.toString());
      
      // Apply theme to document
      const root = document.documentElement;
      
      // Theme class
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Color scheme attribute
      root.setAttribute('data-color-scheme', colorScheme);
      
      // CSS custom properties for consistent theming
      const colors = {
        orange: { 
          primary: '#F15A2B', 
          primaryHover: '#E04A1B', 
          primaryLight: '#FFF5F2',
          primaryDark: '#D13A0B'
        }
      };
      
      const currentColors = colors[colorScheme];
      root.style.setProperty('--color-primary', currentColors.primary);
      root.style.setProperty('--color-primary-hover', currentColors.primaryHover);
      root.style.setProperty('--color-primary-light', currentColors.primaryLight);
      root.style.setProperty('--color-primary-dark', currentColors.primaryDark);
      
      // Meta theme color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#ffffff');
      }
      
    } catch (error) {
      console.warn('Error applying theme:', error);
    }
  }, [theme, colorScheme, isSidebarCollapsed, followSystemTheme, isLoading]);

  const toggleTheme = useCallback(() => {
    setFollowSystemTheme(false);
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  // Cycle through modes: light -> dark -> auto (follow system)
  const cycleThemeMode = useCallback(() => {
    if (followSystemTheme) {
      // Auto -> Light
      setFollowSystemTheme(false);
      setThemeState('light');
      return;
    }

    if (theme === 'light') {
      // Light -> Dark
      setThemeState('dark');
      return;
    }

    // Dark -> Auto
    setFollowSystemTheme(true);
    setThemeState(systemPreference);
  }, [theme, followSystemTheme, systemPreference]);

  const setTheme = useCallback((newTheme: Theme) => {
    setFollowSystemTheme(false);
    setThemeState(newTheme);
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const setMobileSidebarOpen = useCallback((open: boolean) => {
    setIsMobileSidebarOpen(open);
  }, []);

  const handleFollowSystemTheme = useCallback((follow: boolean) => {
    setFollowSystemTheme(follow);
    if (follow) {
      setThemeState(systemPreference);
    }
  }, [systemPreference]);

  const contextValue: ThemeContextType = {
    theme,
    isDarkMode: theme === 'dark',
    toggleTheme,
    cycleThemeMode,
    setTheme,
    colorScheme,
    setColorScheme,
    isSidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
    isMobileSidebarOpen,
    toggleMobileSidebar,
    setMobileSidebarOpen,
    isLoading,
    systemPreference,
    followSystemTheme,
    setFollowSystemTheme: handleFollowSystemTheme,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="rounded-full h-12 w-12 border-b-2 border-orange-primary"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for color scheme specific styles
export const useColorScheme = () => {
  const { colorScheme } = useTheme();
  
  const getColorClasses = (type: 'primary' | 'hover' | 'light' | 'text' = 'primary') => {
    const colorMap = {
      orange: {
        primary: 'bg-orange-primary',
        hover: 'hover:bg-orange-hover',
        light: 'bg-orange-light',
        text: 'text-orange-primary',
      },
    };
    
    return colorMap[colorScheme][type];
  };
  
  return { colorScheme, getColorClasses };
};
