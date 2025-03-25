package agroindia.agro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "agroindia.agro.repository")
@ComponentScan(basePackages = "agroindia.agro")
public class AgroApplication {  
    public static void main(String[] args) {
        SpringApplication.run(AgroApplication.class, args);
    }
}
