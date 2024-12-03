import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, StyledEngineProvider } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';

// 创建主题
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null; // 或者显示加载指示器
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
    return (
        <Routes>
            {/* 公共页面 */}
            <Route path="/login" element={<Login />} />

            {/* 受保护的页面 */}
            <Route
                path="/admin"
                element={
                    <PrivateRoute>
                        <AdminDashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/profile"
                element={
                    <PrivateRoute>
                        <AdminProfile />
                    </PrivateRoute>
                }
            />

            {/* 默认重定向 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router future={{ v7_startTransition: true }}>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </Router>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App; 