
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';
type ColorScheme = 'orange';

const STORAGE_KEYS = {
  theme: 'bonzicart-theme',
  colorScheme: 'bonzicart-color-scheme',
  sidebarCollapsed: 'bonzicart-sidebar-collapsed',
  followSystemTheme: 'bonzicart-follow-system-theme',
};

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

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const useColorScheme = () => {
  const getColorClasses = useCallback((variant: 'primary' | 'secondary' | 'accent' = 'primary') => {
    const colors = {
      primary: 'bg-orange-500 hover:bg-orange-600 text-white',
      secondary: 'bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
      accent: 'border-orange-500 text-orange-500'
    };
    return colors[variant] || colors.primary;
  }, []);

  return { getColorClasses };
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('orange');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [systemPreference, setSystemPreference] = useState<Theme>('light');
  const [followSystemTheme, setFollowSystemThemeState] = useState<boolean>(false);

  const isDarkMode = theme === 'dark';

  // Detect system preference
  const detectSystemPreference = useCallback((): Theme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  // Apply theme and related settings to DOM
  const applySettings = useCallback((
    theme: Theme,
    colorScheme: ColorScheme,
    isSidebarCollapsed: boolean,
    followSystemTheme: boolean
  ) => {
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
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#1F2937' : '#FFFFFF');
      }
    } catch (error) {
      console.warn('Failed to apply theme settings:', error);
    }
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const detectedSystemPreference = detectSystemPreference();
        setSystemPreference(detectedSystemPreference);

        const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) as Theme;
        const savedColorScheme = localStorage.getItem(STORAGE_KEYS.colorScheme) as ColorScheme;
        const savedSidebarCollapsed = localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true';
        const savedFollowSystemTheme = localStorage.getItem(STORAGE_KEYS.followSystemTheme) === 'true';

        const initialTheme = savedFollowSystemTheme 
          ? detectedSystemPreference 
          : savedTheme || detectedSystemPreference;
        
        const initialColorScheme = savedColorScheme || 'orange';

        setThemeState(initialTheme);
        setColorSchemeState(initialColorScheme);
        setIsSidebarCollapsed(savedSidebarCollapsed);
        setFollowSystemThemeState(savedFollowSystemTheme);

        applySettings(initialTheme, initialColorScheme, savedSidebarCollapsed, savedFollowSystemTheme);
      } catch (error) {
        console.warn('Failed to initialize theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, [detectSystemPreference, applySettings]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemPreference: Theme = e.matches ? 'dark' : 'light';
      setSystemPreference(newSystemPreference);
      
      if (followSystemTheme) {
        setThemeState(newSystemPreference);
        applySettings(newSystemPreference, colorScheme, isSidebarCollapsed, followSystemTheme);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [followSystemTheme, colorScheme, isSidebarCollapsed, applySettings]);

  // Update settings when they change
  useEffect(() => {
    if (!isLoading) {
      applySettings(theme, colorScheme, isSidebarCollapsed, followSystemTheme);
    }
  }, [theme, colorScheme, isSidebarCollapsed, followSystemTheme, isLoading, applySettings]);

  const toggleTheme = useCallback(() => {
    if (followSystemTheme) {
      setFollowSystemThemeState(false);
    }
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
  }, [theme, followSystemTheme]);

  // Cycle through modes: light -> dark -> auto (follow system)
  const cycleThemeMode = useCallback(() => {
    if (followSystemTheme) {
      // Auto -> Light
      setFollowSystemThemeState(false);
      setThemeState('light');
      return;
    }

    if (theme === 'light') {
      // Light -> Dark
      setThemeState('dark');
      return;
    }

    // Dark -> Auto
    setFollowSystemThemeState(true);
    setThemeState(systemPreference);
  }, [theme, followSystemTheme, systemPreference]);

  const setTheme = useCallback((newTheme: Theme) => {
    if (followSystemTheme) {
      setFollowSystemThemeState(false);
    }
    setThemeState(newTheme);
  }, [followSystemTheme]);

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

  const setFollowSystemTheme = useCallback((follow: boolean) => {
    setFollowSystemThemeState(follow);
    if (follow) {
      setThemeState(systemPreference);
    }
  }, [systemPreference]);

  const value: ThemeContextType = {
    theme,
    isDarkMode,
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
    setFollowSystemTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
