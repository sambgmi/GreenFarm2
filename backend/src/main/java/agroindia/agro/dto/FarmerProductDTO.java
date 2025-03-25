package agroindia.agro.dto;

import agroindia.agro.model.Category;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class FarmerProductDTO {
    private Long productId;
    private String productName;
    private String description;
    private Category category;
    private BigDecimal basePrice;
    private String imageUrl;  // Add this field
    private Integer totalStock;
    private BigDecimal lowestPrice;
    private BigDecimal highestPrice;
    private List<FarmerDetailDTO> farmers;
}

// @Data
// class FarmerDetailDTO {
//     private Long farmerId;
//     private String farmerName;
//     private String email;
//     private String location;
//     private Integer availableStock;
//     private BigDecimal bargainPrice;
//     private String phoneNumber;
// }