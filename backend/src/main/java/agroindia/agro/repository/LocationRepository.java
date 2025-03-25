package agroindia.agro.repository;

import agroindia.agro.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByActiveTrue();
    List<Location> findByStateIgnoreCase(String state);
    List<Location> findByDistrictIgnoreCase(String district);
}