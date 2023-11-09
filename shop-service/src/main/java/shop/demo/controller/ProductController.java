package shop.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import shop.demo.dto.PageDTO;
import shop.demo.dto.ProductDTO;
import shop.demo.dto.ResponseDTO;
import shop.demo.dto.SearchDTO;
import shop.demo.service.ProductService;

import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/admin/product")
public class ProductController {
    @Autowired
    ProductService productService;

    final String UPLOAD_FOLDER = "D:\\BackEnd\\image\\";

    // jackson - ve doc them chuan GRPC, GRAPHQL
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDTO<ProductDTO> add(@ModelAttribute @Valid ProductDTO productDTO)
            throws IllegalStateException, IOException {
        if (productDTO.getFile() != null && !productDTO.getFile().isEmpty()) {

            if (!(new File(UPLOAD_FOLDER).exists())) {
                new File(UPLOAD_FOLDER).mkdirs();
            }

            String filename = productDTO.getFile().getOriginalFilename();
            // lay dinh dang file
            String extension = filename.substring(filename.lastIndexOf("."));
            // tao ten moi
            String newFilename = UUID.randomUUID().toString() + extension;

            File newFile = new File(UPLOAD_FOLDER + newFilename);

            productDTO.getFile().transferTo(newFile);

            productDTO.setImage(newFilename);// save to db
        }

        productService.create(productDTO);
        return ResponseDTO.<ProductDTO>builder().status(200).data(productDTO).build();
    }

    @PutMapping("/")
    public ResponseDTO<Void> update(@ModelAttribute @Valid ProductDTO productDTO)
            throws IllegalStateException, IOException {
        if (productDTO.getFile() != null && !productDTO.getFile().isEmpty()) {

            String filename = productDTO.getFile().getOriginalFilename();
            // lay dinh dang file
            String extension = filename.substring(filename.lastIndexOf("."));
            // tao ten moi
            String newFilename = UUID.randomUUID().toString() + extension;

            File newFile = new File(UPLOAD_FOLDER + newFilename);

            productDTO.getFile().transferTo(newFile);

            productDTO.setImage(newFilename);// save to db
        }

        productService.update(productDTO);
        return ResponseDTO.<Void>builder().status(200).msg("Update Ok").build();
    }

    @PostMapping("/search")
    public PageDTO<ProductDTO> search(
            @RequestBody @Valid SearchDTO searchDTO) {
        return productService.search(searchDTO);
    }

    @DeleteMapping("/{id}") // /1
    public ResponseDTO<Void> delete(@PathVariable("id") int id) {
        productService.delete(id);
        return ResponseDTO.<Void>builder().status(200).build();
    }

    @GetMapping("/{id}")
    public ResponseDTO<ProductDTO> get(@PathVariable("id") int id) {
        return ResponseDTO.<ProductDTO>builder().status(200).data(productService.getById(id)).build();
    }
}
