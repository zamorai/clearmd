// app/ThemeRegistry.tsx

'use client';

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E3A8A', // Navy Blue
    },
    secondary: {
      main: '#4F46E5', // Indigo
    },
    background: {
      default: '#F9FAFB', // Light Grey
    },
    text: {
      primary: '#111827', // Dark Grey
      secondary: '#6B7280', // Medium Grey
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    // Add more typography settings as needed
  },
  components: {
    // Customize components
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
