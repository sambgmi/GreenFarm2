import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const autoPlayRef = useRef();

  const images = [
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=2070&q=80'
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    autoPlayRef.current = nextImage;
  });

  useEffect(() => {
    const play = () => {
      autoPlayRef.current();
    };
    const timer = setInterval(play, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      width: '100%',
      height: { xs: '300px', sm: '400px', md: '500px', lg: '600px' },
      position: 'relative',
      bgcolor: 'white',
      overflow: 'hidden',
      mt: { xs: 7, sm: 8 }
    }}>
      {images.map((img, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transition: 'all 0.5s ease',
            transform: `translateX(${(index - currentImage) * 100}%)`,
          }}
        >
          <img
            src={img}
            alt={`Banner ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {/* Text overlay removed */}
        </Box>
      ))}

      <IconButton
        onClick={prevImage}
        sx={{
          position: 'absolute',
          left: { xs: 5, md: 20 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'white',
          '&:hover': { bgcolor: 'white' },
          width: { xs: 30, md: 40 },
          height: { xs: 30, md: 40 },
          opacity: 0.8
        }}
      >
        <KeyboardArrowLeft />
      </IconButton>

      <IconButton
        onClick={nextImage}
        sx={{
          position: 'absolute',
          right: { xs: 5, md: 20 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'white',
          '&:hover': { bgcolor: 'white' },
          width: { xs: 30, md: 40 },
          height: { xs: 30, md: 40 },
          opacity: 0.8
        }}
      >
        <KeyboardArrowRight />
      </IconButton>

      <Box sx={{
        position: 'absolute',
        bottom: { xs: 10, md: 20 },
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: { xs: 0.5, md: 1 }
      }}>
        {images.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: 8, md: 10 },
              height: { xs: 8, md: 10 },
              borderRadius: '50%',
              bgcolor: currentImage === index ? '#00a152' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              mx: 0.5
            }}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Hero;