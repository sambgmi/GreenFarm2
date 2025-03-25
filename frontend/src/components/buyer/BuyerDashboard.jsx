import React from 'react';
import { Box } from '@mui/material';
import Cart from './Cart';

const BuyerDashboard = () => {
    return (
        <Box sx={{ 
            width: '100%',
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
            pt: 2
        }}>
            <Cart />
        </Box>
    );
};

export default BuyerDashboard;