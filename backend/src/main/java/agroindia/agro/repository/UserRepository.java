package agroindia.agro.repository;

import agroindia.agro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(User.Role role);
    Optional<User> findByName(String name);

    Optional<User> findByPhoneNumber(String phoneNumber);
    //
    // Changed from findByUsername to findByName

}