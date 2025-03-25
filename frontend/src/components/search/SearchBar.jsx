import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, IconButton, Popper, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Typography } from '@mui/material';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    setAnchorEl(event.currentTarget);

    if (query.length > 2) {
      try {
        const response = await axios.get(`http://localhost:8081/api/cart/public/farmer-products/details`);
        const filteredResults = response.data.filter(product => 
          product.productName.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleProductClick = (farmerProduct) => {
    setSearchTerm('');
    setSearchResults([]);
    navigate(`/search-results/${farmerProduct.farmerProductId}`);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 500 }}>
      <TextField
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search products..."
        variant="outlined"
        size="small"
        InputProps={{
          endAdornment: (
            <IconButton>
              <FaSearch />
            </IconButton>
          ),
          sx: { 
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              bgcolor: 'white'
            }
          }
        }}
      />
      
      <Popper
        open={searchResults.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ width: anchorEl?.offsetWidth, zIndex: 1300 }}
      >
        <Paper elevation={3} sx={{ mt: 1, maxHeight: 400, overflow: 'auto' }}>
          <List>
            {searchResults.map((product) => (
              <ListItem
                key={product.farmerProductId}
                component="div"
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(0, 161, 82, 0.08)' }
                }}
                onClick={() => handleProductClick(product)}
              >
                <ListItemAvatar>
                  <Avatar src={product.imageUrl} alt={product.productName} />
                </ListItemAvatar>
                <ListItemText
                  primary={product.productName}
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {product.category}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popper>
    </Box>
  );
};

export default SearchBar;