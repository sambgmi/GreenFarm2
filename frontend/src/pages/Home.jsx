import React from 'react';
import { Box, Container } from '@mui/material';
import Hero from '../components/hero/Hero';
import ProductPage from '../components/products/ProductPage';

const Home = () => {
  return (
    <Box sx={{ 
      bgcolor: 'white', 
      minHeight: '100vh',
      position: 'relative',
      paddingTop: '64px' // Add padding to account for navbar height
    }}>
      <Hero />
      {/* Reduced vertical padding and removed Container to eliminate extra spacing */}
      <Box id="products-section" sx={{ mt: -2 }}>
        <ProductPage />
      </Box>
    </Box>
  );
};

export default Home;