import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#1e88e5' },
      secondary: { main: '#26c6da' },
      ...(mode === 'light'
        ? {
            background: {
              default: '#f3f6fb',
              paper: '#ffffff',
            },
          }
        : {
            background: {
              default: '#0b1120',
              paper: '#020617',
            },
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
          },
        },
      },
    },
  });

export default getTheme;
