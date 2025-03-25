import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff, Email } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password
      });
      
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        await login(response.data.user);
        navigate(response.data.user.role === 'ADMIN' ? '/admin' : '/');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response?.status === 400) {
        setError('Invalid email or password');
      } else if (error.response?.status === 404) {
        setError('User not found');
      } else {
        setError('Login failed. Please try again later.');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container component="main" maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <StyledPaper>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{
                mb: 4,
                fontWeight: 700,
                color: '#2B3445',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '4px',
                  background: '#00a152',
                  borderRadius: '2px',
                }
              }}
            >
              Welcome Back
            </Typography>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              </motion.div>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#00a152' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  bgcolor: '#00a152',
                  '&:hover': {
                    bgcolor: '#008442',
                  },
                }}
              >
                Sign In
              </Button>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Button
                    onClick={() => navigate('/register')}
                    sx={{
                      textTransform: 'none',
                      color: '#00a152',
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Typography>
              </Box>
            </Box>
          </StyledPaper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;