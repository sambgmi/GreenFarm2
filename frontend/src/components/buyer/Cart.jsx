import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Card, CardMedia,
    Button, IconButton, Box, Grid, Divider, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8081/api/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCartItems(response.data);
            setError(null);
        } catch (err) {
            console.error('Cart Error Details:', err.response?.data);
            setError('Failed to fetch cart items');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axios.put(`http://localhost:8081/api/cart/update/${cartId}`, null, {
                params: { quantity: newQuantity },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchCartItems();
        } catch (err) {
            setError('Failed to update quantity');
            console.error(err);
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            await axios.delete(`http://localhost:8081/api/cart/remove/${cartId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchCartItems();
        } catch (err) {
            setError('Failed to remove item from cart');
            console.error(err);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => 
            total + (item.farmerProduct.bargainPrice * item.quantity), 0
        );
    };

    if (loading) return (
        <Box className="cart-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography>Loading your cart...</Typography>
        </Box>
    );

    return (
        <Box sx={{ 
            width: '100%',
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
            pt: 12,
            pb: 4,
            position: 'relative',
        }}>
            <Container maxWidth="lg">
                <Box sx={{ 
                    borderLeft: '4px solid #00a152',
                    pl: 2,
                    mb: 4
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#2B3445' }}>
                        Shopping Cart
                    </Typography>
                </Box>
                
                {cartItems.length === 0 ? (
                    <Paper sx={{ 
                        p: 6, 
                        textAlign: 'center',
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa'
                    }}>
                        <ShoppingCartIcon sx={{ fontSize: 60, color: '#00a152', mb: 2, opacity: 0.7 }} />
                        <Typography variant="h6" sx={{ color: '#2B3445', mb: 2 }}>Your cart is empty</Typography>
                        <Button 
                            variant="contained" 
                            href="/"
                            sx={{
                                bgcolor: '#00a152',
                                '&:hover': { bgcolor: '#008f49' },
                                borderRadius: '30px',
                                padding: '10px 24px',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(0, 161, 82, 0.2)'
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ 
                                bgcolor: 'white', 
                                borderRadius: 2, 
                                p: 3,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                                {cartItems.map((item) => (
                                    <Card key={item.id} sx={{ 
                                        mb: 2,
                                        borderRadius: 2,
                                        border: '1px solid #eee',
                                        boxShadow: 'none',
                                        overflow: 'visible'
                                    }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            p: 2,
                                            gap: 3,
                                            flexDirection: { xs: 'column', sm: 'row' }
                                        }}>
                                            <Box sx={{
                                                width: { xs: '100%', sm: 150 },
                                                height: { xs: 200, sm: 150 },
                                                position: 'relative',
                                                overflow: 'hidden',
                                                borderRadius: 1
                                            }}>
                                                <img
                                                    src={item.farmerProduct.product.imageUrl || 'https://via.placeholder.com/150'}
                                                    alt={item.farmerProduct.product.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        display: 'block'
                                                    }}
                                                />
                                            </Box>
                                            
                                            <Box sx={{ 
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
                                            }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                                        {item.farmerProduct.product.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                        Farmer: {item.farmerProduct.farmer.name}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ 
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mt: 2,
                                                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                                    gap: 2
                                                }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#00a152' }}>
                                                        ₹{item.farmerProduct.bargainPrice}
                                                    </Typography>
                                                    
                                                    <Box sx={{ 
                                                        display: 'flex',
                                                        gap: 2,
                                                        alignItems: 'center'
                                                    }}>
                                                        <Box sx={{ 
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            border: '1px solid #ddd',
                                                            borderRadius: 1,
                                                            px: 1
                                                        }}>
                                                            <IconButton 
                                                                size="small"
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                sx={{ color: '#00a152' }}
                                                            >
                                                                <RemoveIcon fontSize="small" />
                                                            </IconButton>
                                                            <Typography sx={{ mx: 2 }}>
                                                                {item.quantity}
                                                            </Typography>
                                                            <IconButton 
                                                                size="small"
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                sx={{ color: '#00a152' }}
                                                            >
                                                                <AddIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                        
                                                        <Button 
                                                            onClick={() => removeFromCart(item.id)}
                                                            startIcon={<DeleteIcon />}
                                                            color="error"
                                                            variant="outlined"
                                                            size="small"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Card>
                                ))}
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ 
                                p: 3,
                                position: 'sticky',
                                top: 100,
                                borderRadius: 2,
                                bgcolor: '#fff',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Order Summary
                                </Typography>
                                
                                <Box sx={{ mt: 3 }}>
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 2
                                    }}>
                                        <Typography color="text.secondary">Subtotal</Typography>
                                        <Typography>₹{calculateTotal()}</Typography>
                                    </Box>
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 2
                                    }}>
                                        <Typography color="text.secondary">Shipping</Typography>
                                        <Typography sx={{ color: '#00a152' }}>Free</Typography>
                                    </Box>
                                    
                                    <Divider sx={{ my: 2 }} />
                                    
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 3
                                    }}>
                                        <Typography variant="h6">Total</Typography>
                                        <Typography variant="h6" sx={{ color: '#00a152', fontWeight: 600 }}>
                                            ₹{calculateTotal()}
                                        </Typography>
                                    </Box>
                                    
                                    <Button 
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            py: 1.5,
                                            textTransform: 'none',
                                            fontSize: '1.1rem',
                                            bgcolor: '#00a152',
                                            '&:hover': {
                                                bgcolor: '#008f49'
                                            },
                                            borderRadius: '30px',
                                            boxShadow: '0 4px 12px rgba(0, 161, 82, 0.2)',
                                            fontWeight: 600
                                        }}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default Cart;