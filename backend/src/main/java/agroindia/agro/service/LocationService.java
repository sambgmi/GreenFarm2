package agroindia.agro.service;

import agroindia.agro.model.Location;
import agroindia.agro.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {
    
    private final LocationRepository locationRepository;

    public Location addLocation(Location location) {
        return locationRepository.save(location);
    }

    public Location updateLocation(Long id, Location updatedLocation) {
        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Location not found"));
        
        location.setName(updatedLocation.getName());
        location.setState(updatedLocation.getState());
        location.setDistrict(updatedLocation.getDistrict());
        location.setActive(updatedLocation.isActive());
        
        return locationRepository.save(location);
    }

    public void deleteLocation(Long id) {
        locationRepository.deleteById(id);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public List<Location> getActiveLocations() {
        return locationRepository.findByActiveTrue();
    }

    public Location getLocationById(Long id) {
        return locationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Location not found"));
    }

    public List<Location> getLocationsByState(String state) {
        return locationRepository.findByStateIgnoreCase(state);
    }

    public List<Location> getLocationsByDistrict(String district) {
        return locationRepository.findByDistrictIgnoreCase(district);
    }
}