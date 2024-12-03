import React, { useState, useRef } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    IconButton,
    Alert,
} from '@mui/material';
import { PhotoCamera, Save } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { AdminUpdateForm } from '../types/auth';

const AdminProfile: React.FC = () => {
    const { admin, updateProfile, updateAvatar } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<AdminUpdateForm>({
        nickname: admin?.nickname || '',
        bio: admin?.bio || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            setSuccess('个人资料更新成功！');
            setError(null);
        } catch (error) {
            setError('更新失败，请重试！');
            setSuccess(null);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await updateAvatar(file);
                setSuccess('头像更新成功！');
                setError(null);
            } catch (error) {
                setError('头像更新失败，请重试！');
                setSuccess(null);
            }
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    个人资料
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={admin?.avatar_path ? `/uploads/${admin.avatar_path}` : undefined}
                            sx={{ width: 100, height: 100, cursor: 'pointer' }}
                            onClick={handleAvatarClick}
                        />
                        <IconButton
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                },
                            }}
                            onClick={handleAvatarClick}
                        >
                            <PhotoCamera />
                        </IconButton>
                        <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </Box>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="nickname"
                        label="昵称"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        id="bio"
                        label="个人简介"
                        name="bio"
                        multiline
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        startIcon={<Save />}
                    >
                        保存更改
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminProfile; 