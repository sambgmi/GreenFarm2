package agroindia.agro.service;

import agroindia.agro.model.Category;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class CategoryService {
    
    public List<Category> getAllCategories() {
        return Arrays.asList(Category.values());
    }
    
    public boolean isCategoryValid(String category) {
        try {
            Category.valueOf(category.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}