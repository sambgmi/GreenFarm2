import React, { useState, useEffect } from 'react';
import { 
    Box, TextField, Button, Container, Typography, Paper, Alert,
    RadioGroup, FormControlLabel, Radio, FormControl, FormLabel,
    InputAdornment, IconButton, Select, MenuItem
} from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import axiosInstance from '../utils/axiosConfig';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  '&.Mui-checked': {
    color: '#00a152',
  },
}));

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'FARMER',
        location: '',
        district: ''
    });
    const [districts, setDistricts] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await axiosInstance.get('/public/locations/active');
                const uniqueDistricts = [...new Set(response.data.map(loc => loc.district))];
                setDistricts(uniqueDistricts);
            } catch (err) {
                console.error('Error fetching districts:', err);
            }
        };
        fetchDistricts();
    }, []);

    useEffect(() => {
        const fetchLocations = async () => {
            if (formData.district) {
                try {
                    const response = await axiosInstance.get(`/public/locations/district/${formData.district}`);
                    setLocations(response.data);
                } catch (err) {
                    console.error('Error fetching locations:', err);
                }
            }
        };
        fetchLocations();
    }, [formData.district]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/auth/register', formData);
            setSuccess('Registration successful!');
            setError('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Registration failed. Please try again.');
            setSuccess('');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
                display: 'flex',
                alignItems: 'center',
                py: 4
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
                            Create Account
                        </Typography>

                        {(error || success) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                            </motion.div>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="name"
                                label="Full Name"
                                autoFocus
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ color: '#00a152' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="email"
                                label="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#00a152' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#00a152' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <FormControl 
                                component="fieldset" 
                                sx={{ 
                                    mt: 3,
                                    width: '100%',
                                    '& .MuiFormLabel-root': {
                                        color: '#2B3445',
                                        fontWeight: 500
                                    }
                                }}
                            >
                                <FormLabel component="legend">I want to register as</FormLabel>
                                <RadioGroup
                                    row
                                    name="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    sx={{
                                        justifyContent: 'space-around',
                                        mt: 1
                                    }}
                                >
                                    <FormControlLabel 
                                        value="FARMER" 
                                        control={<StyledRadio />} 
                                        label="Farmer"
                                        sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                                    />
                                    <FormControlLabel 
                                        value="BUYER" 
                                        control={<StyledRadio />} 
                                        label="Buyer"
                                        sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                                    />
                                </RadioGroup>
                            </FormControl>

                            {formData.role === 'FARMER' && (
                                <>
                                    <FormControl fullWidth margin="normal" required>
                                        <Select
                                            name="district"
                                            value={formData.district}
                                            onChange={(e) => setFormData({...formData, district: e.target.value, location: ''})}
                                            displayEmpty
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <LocationOn sx={{ color: '#00a152' }} />
                                                </InputAdornment>
                                            }
                                        >
                                            <MenuItem value="">
                                                <em>Select District</em>
                                            </MenuItem>
                                            {districts.map((district) => (
                                                <MenuItem key={district} value={district}>
                                                    {district}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth margin="normal" required>
                                        <Select
                                            name="location"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            displayEmpty
                                            disabled={!formData.district}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <LocationOn sx={{ color: '#00a152' }} />
                                                </InputAdornment>
                                            }
                                        >
                                            <MenuItem value="">
                                                <em>Select Location</em>
                                            </MenuItem>
                                            {locations.map((location) => (
                                                <MenuItem key={location.id} value={location.name}>
                                                    {location.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </>
                            )}

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
                                Register
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        textTransform: 'none',
                                        color: '#00a152',
                                        '&:hover': {
                                            bgcolor: 'transparent',
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    Already have an account? Sign in
                                </Button>
                            </Box>
                        </Box>
                    </StyledPaper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Register;