package agroindia.agro.controller;

import agroindia.agro.model.Location;
import agroindia.agro.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/locations")
@RequiredArgsConstructor
public class PublicLocationController {

    private final LocationService locationService;

    @GetMapping("/active")
    public ResponseEntity<List<Location>> getActiveLocations() {
        return ResponseEntity.ok(locationService.getActiveLocations());
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