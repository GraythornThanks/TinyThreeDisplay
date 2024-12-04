import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Avatar,
    Alert,
    Snackbar,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useAdmin } from '../hooks/useAdmin';
import { adminApi } from '../services/api';
import PasswordChangeDialog from '../components/PasswordChangeDialog';

const AdminProfile: React.FC = () => {
    const { admin, updateAdmin } = useAdmin();
    const [nickname, setNickname] = useState(admin?.nickname || '');
    const [bio, setBio] = useState(admin?.bio || '');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const updatedAdmin = await adminApi.updateMe({ nickname, bio });
            updateAdmin(updatedAdmin);
            setSuccess('个人资料更新成功');
        } catch (error) {
            setError('更新个人资料失败，请重试');
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const updatedAdmin = await adminApi.updateAvatar(file);
                updateAdmin(updatedAdmin);
                setSuccess('头像更新成功');
            } catch (error) {
                setError('上传头像失败，请重试');
            }
        }
    };

    const handlePasswordSuccess = () => {
        setSuccess('密码修改成功');
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    个人资料
                </Typography>

                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="avatar-upload"
                        type="file"
                        onChange={handleAvatarChange}
                    />
                    <label htmlFor="avatar-upload">
                        <Avatar
                            src={admin?.avatar_path ? `/uploads/${admin.avatar_path}` : undefined}
                            sx={{
                                width: 100,
                                height: 100,
                                cursor: 'pointer',
                                '&:hover': {
                                    opacity: 0.8,
                                },
                            }}
                        >
                            <PersonIcon sx={{ fontSize: 60 }} />
                        </Avatar>
                    </label>
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            点击头像更换图片
                        </Typography>
                    </Box>
                </Box>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="昵称"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="个人简介"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button type="submit" variant="contained">
                            保存修改
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setIsPasswordDialogOpen(true)}
                        >
                            修改密码
                        </Button>
                    </Box>
                </form>
            </Paper>

            <PasswordChangeDialog
                open={isPasswordDialogOpen}
                onClose={() => setIsPasswordDialogOpen(false)}
                onSuccess={handlePasswordSuccess}
            />

            <Snackbar
                open={!!error || !!success}
                autoHideDuration={6000}
                onClose={() => {
                    setError(null);
                    setSuccess(null);
                }}
            >
                <Alert
                    severity={error ? 'error' : 'success'}
                    sx={{ width: '100%' }}
                >
                    {error || success}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminProfile; 