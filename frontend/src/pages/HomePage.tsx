import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdmin();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          欢迎使用 ThreeDisplay
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          3D模型展示与管理平台
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/admin/dashboard')}
            >
              进入管理后台
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/admin/login')}
            >
              管理员登录
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage; 