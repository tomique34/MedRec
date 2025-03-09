import React, { createContext, useContext } from 'react';

// Simple theme context that only supports light mode
interface ThemeContextType {
  theme: 'light';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Remove any dark mode classes if they exist
  document.documentElement.classList.remove('dark');
  
  // Clean up any theme settings in localStorage
  localStorage.removeItem('theme');
  
  return (
    <ThemeContext.Provider value={{ theme: 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
