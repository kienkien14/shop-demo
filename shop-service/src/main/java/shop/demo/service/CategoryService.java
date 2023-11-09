package shop.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.NoResultException;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import shop.demo.dto.CategoryDTO;
import shop.demo.dto.PageDTO;
import shop.demo.dto.SearchDTO;
import shop.demo.entity.Category;
import shop.demo.repository.CategoryRepo;

public interface CategoryService {
    void create(CategoryDTO categoryDTO);

    void update(CategoryDTO categoryDTO);

    void delete(int id);

    CategoryDTO getById(int id);

    PageDTO<CategoryDTO> search(SearchDTO searchDTO);

    List<CategoryDTO> getAll();
}


@Service
class CategoryServiceImple implements CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    @Override
    @Transactional
    @CacheEvict(cacheNames = "category-search", allEntries = true)
    public void create(CategoryDTO categoryDTO) {
        // convert departmentDTO --> department
        Category category = new ModelMapper().map(categoryDTO, Category.class);
        categoryRepo.save(category);

        //tra ve idsau khi tao
        categoryDTO.setId(category.getId());
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "categories", key = "#categoryDTO.id"),
            @CacheEvict(cacheNames = "category-search", allEntries = true)
    })
    public void update(CategoryDTO categoryDTO) {
        Category category = categoryRepo.findById(categoryDTO.getId()).orElseThrow(NoResultException::new);
        category.setName(categoryDTO.getName());
        categoryRepo.save(category);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "categories", key = "#id"),
            @CacheEvict(cacheNames = "category-search", allEntries = true)
    })

    public void delete(int id) {
        categoryRepo.deleteById(id);
    }

    @Override
    @Cacheable(cacheNames = "category-search")
    public PageDTO<CategoryDTO> search(SearchDTO searchDTO) {
        Pageable pageable = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize());

        Page<Category> pageRS = categoryRepo.searchByName("%" + searchDTO.getKeyword() + "%", pageable);

        return PageDTO.<CategoryDTO>builder()
                .totalPages(pageRS.getTotalPages())
                .totalElements(pageRS.getTotalElements())
                .contents(pageRS.get()
                        .map(r -> convert(r)).collect(Collectors.toList()))
                .build();
    }

    @Override
    @Cacheable(cacheNames = "categories", key = "#id", unless = "#result == null")
    public CategoryDTO getById(int id) { // java8, optinal
        Category category = categoryRepo.findById(id).orElseThrow(NoResultException::new);// java8 lambda
        return convert(category);
    }

    @Override
    public List<CategoryDTO> getAll() {
        List<Category> courseList = categoryRepo.findAll();
        // java 8
        // chuyen tung phan tu userList sang userDTO xog collect ve list
        return courseList.stream().map(u -> convert(u)).collect(Collectors.toList());
    }

    private CategoryDTO convert(Category category) {
        return new ModelMapper().map(category, CategoryDTO.class);
    }

}