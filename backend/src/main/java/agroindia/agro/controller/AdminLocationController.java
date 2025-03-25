package agroindia.agro.controller;

import agroindia.agro.model.Location;
import agroindia.agro.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/locations")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminLocationController {

    private final LocationService locationService;

    @PostMapping
    public ResponseEntity<Location> addLocation(@RequestBody Location location) {
        return ResponseEntity.ok(locationService.addLocation(location));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(
            @PathVariable Long id,
            @RequestBody Location location) {
        return ResponseEntity.ok(locationService.updateLocation(id, location));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLocation(@PathVariable Long id) {
        try {
            locationService.deleteLocation(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete location: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
        return ResponseEntity.ok(locationService.getLocationById(id));
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<List<Location>> getLocationsByState(@PathVariable String state) {
        return ResponseEntity.ok(locationService.getLocationsByState(state));
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<Location>> getLocationsByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(locationService.getLocationsByDistrict(district));
    }
}