package agroindia.agro.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FarmerDetailDTO {
    private Long farmerId;
    private String farmerName;
    private Integer stock;
    private BigDecimal bargainPrice;
    private LocationDTO location;  // Add location information
}