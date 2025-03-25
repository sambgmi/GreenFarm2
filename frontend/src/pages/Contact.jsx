import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  transition: 'transform 0.3s ease-in-out',
}));

const ContactInfoItem = ({ icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
    <Box sx={{ 
      p: 2, 
      borderRadius: '50%', 
      bgcolor: 'rgba(0, 161, 82, 0.1)',
      color: '#00a152'
    }}>
      {icon}
    </Box>
    <Typography variant="body1">{text}</Typography>
  </Box>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: '100vh',
        pt: 12,
        pb: 6,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: '#2B3445',
              mb: 6,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: '#00a152',
                borderRadius: '2px',
              }
            }}
          >
            Contact Us
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <StyledPaper elevation={3}>
                <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 4 }}>
                  Get in Touch
                </Typography>
                <ContactInfoItem 
                  icon={<LocationOnIcon />} 
                  text="123 GreenFarm Street, Bangalore, Karnataka, India" 
                />
                <ContactInfoItem 
                  icon={<PhoneIcon />} 
                  text="+91 123 456 7890" 
                />
                <ContactInfoItem 
                  icon={<EmailIcon />} 
                  text="contact@greenfarm.com" 
                />
              </StyledPaper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <StyledPaper elevation={3} component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={5}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        bgcolor: '#00a152',
                        py: 1.5,
                        '&:hover': {
                          bgcolor: '#008442'
                        }
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </StyledPaper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;