import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { adminApi } from '../services/api';

interface PasswordChangeDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 验证新密码
        if (newPassword.length < 6) {
            setError('新密码长度不能少于6个字符');
            return;
        }

        // 验证确认密码
        if (newPassword !== confirmPassword) {
            setError('两次输入的新密码不一致');
            return;
        }

        try {
            await adminApi.updatePassword(oldPassword, newPassword);
            onSuccess();
            handleClose();
        } catch (error: any) {
            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else {
                setError('修改密码失败，请重试');
            }
        }
    };

    const handleClose = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>修改密码</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        margin="dense"
                        label="当前密码"
                        type={showOldPassword ? 'text' : 'password'}
                        fullWidth
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        edge="end"
                                    >
                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="新密码"
                        type={showNewPassword ? 'text' : 'password'}
                        fullWidth
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="确认新密码"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button type="submit" variant="contained">
                        确认修改
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PasswordChangeDialog; 