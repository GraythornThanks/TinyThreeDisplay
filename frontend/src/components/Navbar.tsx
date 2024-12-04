import React from 'react';
import { 
    AppBar, 
    Toolbar, 
    IconButton, 
    Typography, 
    Avatar, 
    Box, 
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { 
    Person as PersonIcon,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { admin, isAuthenticated, logout } = useAdmin();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/');
    };

    const handleProfileClick = () => {
        handleMenuClose();
        navigate('/admin/profile');
    };

    const handleDashboardClick = () => {
        handleMenuClose();
        navigate('/admin/dashboard');
    };

    // 判断是否在登录页
    const isLoginPage = location.pathname === '/admin/login';

    return (
        <AppBar position="fixed" color="primary" elevation={1}>
            <Toolbar>
                {/* Logo和系统名称 */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ 
                        flexGrow: 1, 
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 0.8
                        }
                    }}
                    onClick={() => navigate('/')}
                >
                    ThreeDisplay
                </Typography>

                {/* 管理员菜单 */}
                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{ p: 0.5 }}
                        >
                            <Avatar
                                alt={admin?.nickname || 'Admin'}
                                src={admin?.avatar_path ? `/uploads/${admin.avatar_path}` : undefined}
                                sx={{ width: 40, height: 40 }}
                            >
                                <PersonIcon />
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            onClick={handleMenuClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleDashboardClick}>
                                <ListItemIcon>
                                    <DashboardIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>管理后台</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleProfileClick}>
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>个人设置</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>退出登录</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    !isLoginPage && (
                        <Button
                            color="inherit"
                            onClick={() => navigate('/admin/login')}
                            startIcon={<PersonIcon />}
                        >
                            登录
                        </Button>
                    )
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 