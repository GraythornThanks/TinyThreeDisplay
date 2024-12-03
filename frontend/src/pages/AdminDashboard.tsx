import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Avatar,
} from '@mui/material';
import {
    Person as PersonIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { admin, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    管理后台
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                >
                    退出登录
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar
                                    src={admin?.avatar_path ? `/uploads/${admin.avatar_path}` : undefined}
                                    sx={{ width: 40, height: 40, mr: 2 }}
                                >
                                    <PersonIcon />
                                </Avatar>
                                <Typography variant="h6">个人信息</Typography>
                            </Box>
                            <Typography color="text.secondary" gutterBottom>
                                昵称: {admin?.nickname || '未设置'}
                            </Typography>
                            <Typography color="text.secondary">
                                简介: {admin?.bio || '未设置'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/admin/profile')}>
                                编辑资料
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboard; 