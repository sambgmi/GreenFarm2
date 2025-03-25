import React, { useState, useEffect } from 'react';
import { 
    Container, Grid, Card, CardContent, CardMedia, Typography, 
    Button, TextField, Box, Chip, Snackbar
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import './ProductPage.css';
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { createTheme, ThemeProvider } from '@mui/material';

const ProductPage = () => {
    // Add states for sorting and district filtering
    const [sortOrder, setSortOrder] = useState('none');
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [availableDistricts, setAvailableDistricts] = useState([]);

    // Add sorting function
    const sortProducts = (productsToSort) => {
        if (sortOrder === 'none') return productsToSort;
        return [...productsToSort].sort((a, b) => {
            const minPriceA = Math.min(...(a.farmers?.map(f => f.bargainPrice) || []));
            const minPriceB = Math.min(...(b.farmers?.map(f => f.bargainPrice) || []));
            return sortOrder === 'asc' ? minPriceA - minPriceB : minPriceB - minPriceA;
        });
    };
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL_PRODUCTS');
    const [farmerProducts, setFarmerProducts] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const categories = ['ALL_PRODUCTS', 'VEGETABLES', 'FRUITS', 'SEEDS'];

    useEffect(() => {
        fetchProducts();
        fetchFarmerProducts();
    }, [selectedCategory, selectedDistrict]);

    // Extract unique districts from farmer products
    useEffect(() => {
        const districts = [...new Set(farmerProducts
            .filter(fp => fp.location && fp.location.district)
            .map(fp => fp.location.district))];
        setAvailableDistricts(districts);
    }, [farmerProducts]);

    const fetchProducts = async () => {
        try {
            const url = selectedCategory === 'ALL_PRODUCTS'
                ? 'http://localhost:8081/api/farmer/products/public/all'
                : `http://localhost:8081/api/farmer/products/public/category/${selectedCategory}`;
            const response = await axios.get(url);
            
            // Map and filter products based on selected district
            const productsWithLocation = response.data.map(product => {
                if (product.farmers && product.farmers.length > 0) {
                    return {
                        ...product,
                        location: product.farmers[0].location || product.location
                    };
                }
                return product;
            });

            // Filter products by selected district
            const filteredProducts = selectedDistrict === 'all'
                ? productsWithLocation
                : productsWithLocation.filter(product =>
                    product.farmers?.some(farmer =>
                        farmer.location?.district === selectedDistrict
                    )
                );
            
            setProducts(filteredProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchFarmerProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/cart/public/farmer-products/details');
            setFarmerProducts(response.data);
        } catch (error) {
            console.error('Error fetching farmer products:', error);
        }
    };

    const handleAddToCart = async (productDetails, farmerId, bargainPrice, quantity = 1) => {
        try {
            // First get the farmer product details
            const farmerProductsResponse = await axios.get('http://localhost:8081/api/cart/public/farmer-products/details');
            const farmerProducts = farmerProductsResponse.data;
            
            // Find the matching farmer product
            const farmerProduct = farmerProducts.find(fp => 
                fp.productId === productDetails.productId && 
                fp.farmerId === farmerId && 
                Number(fp.bargainPrice) === Number(bargainPrice)
            );

            if (!farmerProduct) {
                throw new Error('Could not find matching farmer product');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setSnackbar({
                    open: true,
                    message: 'Please login to add items to cart',
                    severity: 'warning'
                });
                return;
            }

            // Add to cart using the correct farmerProductId
            await axios.post(`http://localhost:8081/api/cart/add`, null, {
                params: {
                    farmerProductId: farmerProduct.farmerProductId,
                    quantity: quantity
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            setSnackbar({
                open: true,
                message: 'Product added to cart successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Add to cart error details:', error);
            setSnackbar({
                open: true,
                message: 'Error adding to cart. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleInputChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:8081/api/products/add', newProduct);
            setOpen(false);
            fetchProducts();
            setNewProduct({
                name: '',
                description: '',
                price: '',
                quantity: '',
                category: '',
                imageUrl: ''
            });
        } catch (error) {
            console.error('Error adding product:', error);
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

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
                {/* Hero Section - Enhanced with responsive design */}
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: { xs: 2, sm: 3, md: 4 },
                    pt: { xs: 3, sm: 4, md: 5 },
                    background: 'linear-gradient(45deg, #00a152, #2B3445)',
                    borderRadius: { xs: 2, sm: 3, md: 4 },
                    p: { xs: 2, sm: 4, md: 6 },
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'url(https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3)',
                        backgroundSize: 'cover',
                        opacity: 0.1,
                        zIndex: 0
                    }
                }}>
                    <Typography 
                        variant="h2" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 800, 
                            mb: { xs: 2, md: 3 },
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            position: 'relative',
                            zIndex: 1
                        }}
                    >
                        Fresh From The Farm
                    </Typography>

                    {/* Categories - Enhanced with responsive design */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: { xs: 1, sm: 2 }, 
                        flexWrap: 'wrap',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {categories.map((category) => (
                            <Button
                                key={category}
                                onClick={() => setSelectedCategory(category.toUpperCase())}
                                variant={selectedCategory === category.toUpperCase() ? "contained" : "outlined"}
                                size={window.innerWidth < 600 ? "small" : "medium"}
                                sx={{
                                    bgcolor: selectedCategory === category.toUpperCase() ? 'white' : 'transparent',
                                    color: selectedCategory === category.toUpperCase() ? '#00a152' : 'white',
                                    borderColor: 'white',
                                    borderWidth: '2px',
                                    borderRadius: '25px',
                                    px: { xs: 2, sm: 3 },
                                    py: { xs: 0.5, sm: 1 },
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                    '&:hover': { 
                                        bgcolor: 'white', 
                                        color: '#00a152',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {category.replace('_', ' ')}
                            </Button>
                        ))}
                    </Box>
                </Box>

                {/* Sort Controls - Updated to colorful dropdown */}
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    gap: 2,
                    bgcolor: 'white',
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    flexWrap: 'wrap'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon sx={{ mr: 1, color: '#00a152' }} />
                            <select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                style={{
                                    padding: '12px 20px',
                                    borderRadius: '30px',
                                    border: '2px solid #00a152',
                                    backgroundColor: '#f8f9fa',
                                    color: '#2B3445',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    minWidth: '200px'
                                }}
                            >
                                <option value="all">All Districts</option>
                                {availableDistricts.map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ 
                            mr: { xs: 0, sm: 2 },
                            fontWeight: 500,
                            color: '#2B3445',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <FilterListIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            Sort by:
                        </Typography>
                        
                        <Box sx={{ 
                            position: 'relative',
                            minWidth: { xs: '100%', sm: '200px' },
                            mt: { xs: 1, sm: 0 }
                        }}>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 20px',
                                    borderRadius: '30px',
                                    border: '2px solid #00a152',
                                    backgroundColor: '#f8f9fa',
                                    color: '#2B3445',
                                    fontWeight: '500',
                                    appearance: 'none',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 4px 12px rgba(0,161,82,0.15)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <option value="none">Featured</option>
                                <option value="asc">Price: Low to High</option>
                                <option value="desc">Price: High to Low</option>
                            </select>
                            <Box sx={{
                                position: 'absolute',
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                pointerEvents: 'none',
                                color: '#00a152',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(0, 161, 82, 0.1)'
                            }}>
                                ▼
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    {sortProducts(products).map((product) => {
                        // Group farmers by their bargain price
                        const farmersByPrice = product.farmers?.reduce((acc, farmer) => {
                            const price = farmer.bargainPrice;
                            if (!acc[price]) {
                                acc[price] = [];
                            }
                            acc[price].push(farmer);
                            return acc;
                        }, {});

                        // Create cards for unique prices
                        return Object.entries(farmersByPrice || {}).map(([price, farmers]) => (
                            <Grid item key={`${product.productId}-${price}`} xs={12} sm={6} md={3}>
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
                                                    ₹{price}
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
                                                        {farmers.length} Farmer{farmers.length > 1 ? 's' : ''} at this price
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {farmers.map(f => f.name).join(', ')}
                                                    </Typography>
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        mt: 1,
                                                        color: 'text.secondary'
                                                    }}>
                                                        <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: '#00a152' }} />
                                                        <Typography variant="caption">
                                                            {(() => {
                                                                const matchingProduct = farmerProducts.find(fp => 
                                                                    fp.productId === product.productId && 
                                                                    fp.farmerId === farmers[0].farmerId
                                                                );
                                                                const district = matchingProduct?.location?.district;
                                                                return typeof district === 'string' ? district : 'Location not available';
                                                            })()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    startIcon={<ShoppingCartIcon />}
                                                    onClick={() => handleAddToCart(
                                                        product,
                                                        farmers[0].farmerId,
                                                        price
                                                    )}
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
                        ));
                    })}
                </Grid>

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

export default ProductPage;
