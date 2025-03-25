package agroindia.agro.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "farmer_product")
@Data
public class FarmerProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private User farmer;

    @Column(name = "bargain_price", precision = 10, scale = 2)
    private BigDecimal bargainPrice;

    @Column(name = "quantity")
    private Integer quantity;
}