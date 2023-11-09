package shop.demo.service;

import java.util.stream.Collectors;

import javax.persistence.NoResultException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import shop.demo.dto.PageDTO;
import shop.demo.dto.ProductDTO;
import shop.demo.dto.SearchDTO;
import shop.demo.entity.Category;
import shop.demo.entity.Product;
import shop.demo.repository.CategoryRepo;
import shop.demo.repository.ProductRepo;

public interface ProductService {
    void create(ProductDTO productDTO);

    void update(ProductDTO productDTO);

    void delete(int id);

    ProductDTO getById(int id);

    PageDTO<ProductDTO> search(SearchDTO searchDTO);
}

@Service
class ProductServiceImple implements ProductService {
    @Autowired
    ProductRepo productRepo;

    @Autowired
    CategoryRepo categoryRepo;

    @Override
    @Transactional
    @Caching(evict = {@CacheEvict(cacheNames = "product", key = "#productDTO.id"),
            @CacheEvict(cacheNames = "product-search", allEntries = true)})
    public void create(ProductDTO productDTO) {
        Category category = categoryRepo.findById(productDTO.getCategory().getId()).orElseThrow(NoResultException::new);// java8
        // lambda
        Product product = new ModelMapper().map(productDTO, Product.class);
        product.setCategory(category);

        productRepo.save(product);

        // tra ve id sau khi tao
        productDTO.setId(product.getId());
    }

    @Override
    @Transactional
    @Caching(evict = {@CacheEvict(cacheNames = "product", key = "#productDTO.id"),
            @CacheEvict(cacheNames = "product-search", allEntries = true)})
    public void update(ProductDTO productDTO) {
        Product product = productRepo.findById(productDTO.getId()).orElseThrow(NoResultException::new);
        product = new ModelMapper().map(productDTO, Product.class);
        productRepo.save(product);
    }

    @Override
    @Transactional
    @Caching(evict = {@CacheEvict(cacheNames = "product", key = "#id"),
            @CacheEvict(cacheNames = "product-search", allEntries = true)})
    public void delete(int id) {
        productRepo.deleteById(id);
    }

    @Override
    @Cacheable(cacheNames = "product", key = "#id", unless = "#result == null")
    public ProductDTO getById(int id) { // java8, optinal
        Product product = productRepo.findById(id).orElseThrow(NoResultException::new);// java8 lambda
        return new ModelMapper().map(product, ProductDTO.class);
    }

    @Cacheable(cacheNames = "product-search")
    @Override
    public PageDTO<ProductDTO> search(SearchDTO searchDTO) {
        Pageable pageable = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize());

        Page<Product> pageRS = productRepo.searchByName("%" + searchDTO.getKeyword() + "%", pageable);

        return PageDTO.<ProductDTO>builder().totalPages(pageRS.getTotalPages()).totalElements(pageRS.getTotalElements())
                .contents(pageRS.get().map(r -> convert(r)).collect(Collectors.toList())).build();
    }

    private ProductDTO convert(Product product) {
        return new ModelMapper().map(product, ProductDTO.class);
    }

}