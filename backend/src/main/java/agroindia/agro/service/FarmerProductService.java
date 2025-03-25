package agroindia.agro.service;



import agroindia.agro.dto.FarmerDetailDTO;
import agroindia.agro.dto.FarmerProductDTO;
import agroindia.agro.dto.LocationDTO;
import agroindia.agro.model.Category;
import agroindia.agro.model.FarmerProduct;
import agroindia.agro.model.Product;
import agroindia.agro.model.User;
import agroindia.agro.repository.FarmerProductRepository;
import agroindia.agro.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class FarmerProductService {
    @Autowired
    private FarmerProductRepository farmerProductRepository;
    
    @Autowired
    private ProductRepository productRepository;

    public List<FarmerProduct> getFarmerProducts(User farmer) {

        return farmerProductRepository.findByFarmer(farmer);
    }

    public List<FarmerProduct> getFarmerProductsByCategory(User farmer, Category category) {
        return farmerProductRepository.findByFarmerAndProduct_Category(farmer, category);
    }

    public FarmerProduct addFarmerProduct(User farmer, Long productId, Integer quantity, BigDecimal bargainPrice) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        FarmerProduct farmerProduct = new FarmerProduct();
        farmerProduct.setFarmer(farmer);
        farmerProduct.setProduct(product);
        farmerProduct.setQuantity(quantity);
        farmerProduct.setBargainPrice(bargainPrice);

        return farmerProductRepository.save(farmerProduct);
    }

    public FarmerProduct updateStock(User farmer, Long productId, Integer quantity) {
        FarmerProduct farmerProduct = farmerProductRepository.findByFarmerAndProduct_Id(farmer, productId);
        if (farmerProduct == null) {
            throw new RuntimeException("Farmer product not found");
        }
        farmerProduct.setQuantity(quantity);
        return farmerProductRepository.save(farmerProduct);
    }

    public FarmerProduct updateBargainPrice(User farmer, Long productId, BigDecimal bargainPrice) {
        FarmerProduct farmerProduct = farmerProductRepository.findByFarmerAndProduct_Id(farmer, productId);
        if (farmerProduct == null) {
            throw new RuntimeException("Farmer product not found");
        }
        farmerProduct.setBargainPrice(bargainPrice);
        return farmerProductRepository.save(farmerProduct);
    }

    public List<FarmerProductDTO> getAllProductsWithFarmerDetails() {
        List<FarmerProduct> farmerProducts = farmerProductRepository.findAllWithProductAndFarmer();
        return convertToProductDTOs(farmerProducts);
    }

    public FarmerProductDTO getProductWithFarmerDetails(Long productId) {
        List<FarmerProduct> farmerProducts = farmerProductRepository.findAllByProductIdWithFarmer(productId);
        if (farmerProducts.isEmpty()) {
            throw new RuntimeException("Product not found");
        }
        return convertToProductDTO(farmerProducts);
    }

    public List<FarmerProductDTO> convertToProductDTOs(List<FarmerProduct> farmerProducts) {
        Map<Long, FarmerProductDTO> productMap = new HashMap<>();

        for (FarmerProduct fp : farmerProducts) {
            Product product = fp.getProduct();
            productMap.computeIfAbsent(product.getId(), k -> {
                FarmerProductDTO dto = new FarmerProductDTO();
                dto.setProductId(product.getId());
                dto.setProductName(product.getName());
                dto.setDescription(product.getDescription());
                dto.setCategory(product.getCategory());
                dto.setBasePrice(product.getPrice());
                dto.setFarmers(new ArrayList<>());
                dto.setImageUrl(product.getImageUrl());
                return dto;
            });

            FarmerDetailDTO farmerDetail = new FarmerDetailDTO();
            farmerDetail.setFarmerId(fp.getFarmer().getId());
            farmerDetail.setFarmerName(fp.getFarmer().getName());
            farmerDetail.setStock(fp.getQuantity());
            farmerDetail.setBargainPrice(fp.getBargainPrice());
            
            // Add location information
            if (fp.getFarmer().getLocation() != null) {
                LocationDTO locationDTO = new LocationDTO();
                locationDTO.setId(fp.getFarmer().getLocation().getId());
                locationDTO.setName(fp.getFarmer().getLocation().getName());
                locationDTO.setState(fp.getFarmer().getLocation().getState());
                locationDTO.setDistrict(fp.getFarmer().getLocation().getDistrict());
                farmerDetail.setLocation(locationDTO);
            }
            
            productMap.get(product.getId()).getFarmers().add(farmerDetail);
        }

        return new ArrayList<>(productMap.values());
    }

    private FarmerProductDTO convertToProductDTO(List<FarmerProduct> farmerProducts) {
        return convertToProductDTOs(farmerProducts).get(0);
    }

    public List<FarmerProductDTO> getPublicProductsByCategory(Category category) {
        List<FarmerProduct> farmerProducts = farmerProductRepository.findByProduct_Category(category);
        return convertToProductDTOs(farmerProducts);
    }

    public void deleteFarmerProduct(User farmer, Long farmerProductId) {
        FarmerProduct farmerProduct = farmerProductRepository.findById(farmerProductId)
            .orElseThrow(() -> new RuntimeException("Farmer product not found"));
            
        if (!farmerProduct.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("Not authorized to delete this product");
        }
        
        farmerProductRepository.delete(farmerProduct);
    }

    public FarmerProduct findByProductAndFarmerAndPrice(Long productId, Long farmerId, BigDecimal bargainPrice) {
        return farmerProductRepository.findByProduct_IdAndFarmer_IdAndBargainPrice(productId, farmerId, bargainPrice)
            .orElseThrow(() -> new RuntimeException("Farmer product not found"));
    }

    public List<FarmerProduct> getAllFarmerProducts() {
        return farmerProductRepository.findAll();
    }

    public FarmerProduct getFarmerProductById(Long id) {
        return farmerProductRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Farmer product not found"));
    }

    public List<FarmerProductDTO> searchFarmerProducts(String query) {
        List<FarmerProduct> farmerProducts = farmerProductRepository.findByProduct_NameContainingIgnoreCaseOrProduct_DescriptionContainingIgnoreCase(query, query);
        return convertToProductDTOs(farmerProducts);
    }

    public FarmerProductDTO getFarmerProductDetails(Long farmerProductId) {
        FarmerProduct farmerProduct = farmerProductRepository.findById(farmerProductId)
            .orElseThrow(() -> new RuntimeException("Farmer product not found"));
            
        FarmerProductDTO dto = new FarmerProductDTO();
        dto.setProductId(farmerProduct.getProduct().getId());
        dto.setProductName(farmerProduct.getProduct().getName());
        dto.setDescription(farmerProduct.getProduct().getDescription());
        dto.setCategory(farmerProduct.getProduct().getCategory());
        dto.setBasePrice(farmerProduct.getProduct().getPrice());
        dto.setImageUrl(farmerProduct.getProduct().getImageUrl());
        
        List<FarmerDetailDTO> farmers = new ArrayList<>();
        FarmerDetailDTO farmerDetail = new FarmerDetailDTO();
        farmerDetail.setFarmerId(farmerProduct.getFarmer().getId());
        farmerDetail.setFarmerName(farmerProduct.getFarmer().getName());
        farmerDetail.setStock(farmerProduct.getQuantity());
        farmerDetail.setBargainPrice(farmerProduct.getBargainPrice());
        farmers.add(farmerDetail);
        
        dto.setFarmers(farmers);
        
        return dto;
    }
}