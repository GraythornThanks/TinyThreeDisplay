import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StyledEngineProvider, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AdminProvider } from './contexts/AdminContext';
import AdminLogin from './pages/AdminLogin';
import AdminProfile from './pages/AdminProfile';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// 创建主题
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AdminProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/admin/login" element={<Layout><AdminLogin /></Layout>} />
              <Route
                path="/admin/dashboard"
                element={
                  <Layout>
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  </Layout>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <Layout>
                    <PrivateRoute>
                      <AdminProfile />
                    </PrivateRoute>
                  </Layout>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AdminProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App; 