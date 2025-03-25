package agroindia.agro.model;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    
    @Enumerated(EnumType.STRING)
    private Category category;
    @Column(length = 1000) 
    private String imageUrl;
    
    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private User farmer;

    private LocalDateTime createdAt;
}
