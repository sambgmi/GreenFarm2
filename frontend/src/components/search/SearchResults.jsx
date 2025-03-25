import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Container, Grid, Card, CardContent, CardMedia, Typography, 
    Button, Box, Chip, Snackbar
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material';
import axiosInstance from '../../utils/axiosConfig';

const SearchResults = () => {
    const { productId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchProducts();
    }, [productId]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const farmerProductsResponse = await axiosInstance.get('/cart/public/farmer-products/details');
            
            // Find the specific farmer product using farmerProductId from URL
            const farmerProduct = farmerProductsResponse.data.find(fp => 
                String(fp.farmerProductId) === String(productId)
            );

            if (farmerProduct) {
                // Create product object with the specific farmer product
                const productData = {
                    productId: farmerProduct.productId,
                    productName: farmerProduct.productName,
                    imageUrl: farmerProduct.imageUrl,
                    description: farmerProduct.description,
                    category: farmerProduct.category,
                    basePrice: farmerProduct.basePrice,
                    farmers: [{
                        farmerId: farmerProduct.farmerId,
                        farmerName: farmerProduct.farmerName,
                        bargainPrice: farmerProduct.bargainPrice,
                        stock: farmerProduct.stock,
                        farmerProductId: farmerProduct.farmerProductId,
                        location: farmerProduct.location // Make sure to include location
                    }]
                };
                setProducts([productData]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleAddToCart = async (productDetails, farmerId, bargainPrice, quantity = 1) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await axiosInstance.post(`/cart/add`, null, {
                params: {
                    farmerProductId: productDetails.farmers[0].farmerProductId,
                    quantity: quantity
                }
            });

            setSnackbar({
                open: true,
                message: 'Product added to cart successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Add to cart error:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setSnackbar({
                    open: true,
                    message: error.message || 'Error adding to cart',
                    severity: 'error'
                });
            }
        }
    };

    const theme = createTheme({
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: '#f5f5f5',
                    },
                },
            },
        },
    });

    if (loading) {
        return (
            <Container sx={{ mt: 12, textAlign: 'center' }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
                {products.map(product => (
                    <Box key={product.productId}>
                        <Box sx={{ 
                            textAlign: 'center', 
                            mb: 4,
                            background: 'linear-gradient(45deg, #00a152, #2B3445)',
                            borderRadius: 4,
                            p: 6,
                            color: 'white'
                        }}>
                            <Typography variant="h2" component="h1" sx={{ fontWeight: 800 }}>
                                {product.productName}
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            {product.farmers.map((farmer) => (
                                <Grid item key={farmer.farmerProductId} xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        height: '100%',
                                        borderRadius: 3,
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 16px 32px rgba(0,0,0,0.15)'
                                        }
                                    }}>
                                        <CardMedia
                                            component="img"
                                            height="240"
                                            image={product.imageUrl || 'https://via.placeholder.com/200'}
                                            alt={product.productName}
                                            sx={{
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)'
                                                }
                                            }}
                                        />
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {product.productName}
                                            </Typography>
                                            <Chip 
                                                label={product.category} 
                                                color="primary" 
                                                size="small" 
                                                sx={{ mb: 1 }}
                                            />
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {product.description}
                                            </Typography>
                                            <Box sx={{ 
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography 
                                                        variant="body1" 
                                                        sx={{ 
                                                            textDecoration: 'line-through',
                                                            color: 'text.secondary'
                                                        }}
                                                    >
                                                        ₹{product.basePrice}
                                                    </Typography>
                                                    <Typography 
                                                        variant="h6" 
                                                        color="primary" 
                                                        sx={{ fontWeight: 600 }}
                                                    >
                                                        ₹{farmer.bargainPrice}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ 
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    bgcolor: '#f5f5f5',
                                                    p: 1,
                                                    borderRadius: 1
                                                }}>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            Farmer: {farmer.farmerName}
                                                        </Typography>
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            mt: 1,
                                                            color: 'text.secondary'
                                                        }}>
                                                            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: '#00a152' }} />
                                                            <Typography variant="caption">
                                                                {farmer.location || 'Location not available'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        startIcon={<ShoppingCartIcon />}
                                                        onClick={() => handleAddToCart(product, farmer.farmerId, farmer.bargainPrice)}
                                                        sx={{
                                                            bgcolor: '#00a152',
                                                            '&:hover': {
                                                                bgcolor: '#008f49'
                                                            }
                                                        }}
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    message={snackbar.message}
                />
            </Container>
        </ThemeProvider>
    );
};

export default SearchResults;