import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const About = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      sx={{
        minHeight: '100vh',
        pt: 12,
        pb: 6,
        background: 'linear-gradient(145deg, #f0f2f5 0%, #e8f5e9 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("/pattern.svg")',
          opacity: 0.1,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        >
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: '#1a237e',
              mb: 8,
              position: 'relative',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '5px',
                background: 'linear-gradient(90deg, #00a152 0%, #69f0ae 100%)',
                borderRadius: '10px',
              }
            }}
          >
            Welcome to GreenFarm
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <StyledPaper elevation={3}>
                <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                  Our Mission
                </Typography>
                <Typography variant="body1" paragraph>
                  To empower farmers and provide fresh, quality agricultural products to consumers while promoting sustainable farming practices.
                </Typography>
              </StyledPaper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <StyledPaper elevation={3}>
                <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                  What We Do
                </Typography>
                <Typography variant="body1" paragraph>
                  We bridge the gap between farmers and consumers, ensuring fair prices and quality products for everyone.
                </Typography>
              </StyledPaper>
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <StyledPaper elevation={3}>
                <Typography variant="h4" gutterBottom color="primary" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1a237e 30%, #00a152 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4
                }}>
                  Our Values
                </Typography>
                <Grid container spacing={3}>
                  {['Quality Assurance', 'Farmer Empowerment', 'Sustainable Agriculture', 'Fair Trade Practices'].map((value, index) => (
                    <Grid item xs={12} sm={6} md={3} key={value}>
                      <Box
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                          borderRadius: '16px',
                          boxShadow: '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff',
                          transition: 'all 0.4s ease',
                          '&:hover': {
                            transform: 'scale(1.05) translateY(-5px)',
                            boxShadow: '12px 12px 20px #d1d1d1, -12px -12px 20px #ffffff',
                          }
                        }}
                      >
                        <Typography 
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1a237e',
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: '-8px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '40px',
                              height: '3px',
                              background: '#00a152',
                              borderRadius: '2px',
                            }
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </StyledPaper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;