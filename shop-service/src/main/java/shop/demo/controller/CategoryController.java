package shop.demo.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import shop.demo.dto.CategoryDTO;
import shop.demo.dto.PageDTO;
import shop.demo.dto.ResponseDTO;
import shop.demo.dto.SearchDTO;
import shop.demo.service.CategoryService;


@RestController
@RequestMapping("/admin/category")
public class CategoryController  {

	@Autowired // DI: dependency inject
	CategoryService categoryService;

	@PostMapping("/") // gia su: khong upload file
	public ResponseDTO<Void> create(@RequestBody @Valid CategoryDTO categoryDTO) {
		categoryService.create(categoryDTO);
		return ResponseDTO.<Void>builder().status(200).msg("Create Ok").build();
	}

	@PutMapping("/")
	public ResponseDTO<Void> edit(@RequestBody @Valid CategoryDTO categoryDTO) {
		categoryService.update(categoryDTO);
		return ResponseDTO.<Void>builder().status(200).msg("Update Ok").build();
	}

	@DeleteMapping("/{id}")
	public ResponseDTO<Void> delete(@PathVariable("id") int id) {
		categoryService.delete(id);
		return ResponseDTO.<Void>builder().status(200).msg("Delete Ok").build();
	}

	@GetMapping("/{id}")
	// @ResponseStatus(code = HttpStatus.OK)
	public ResponseDTO<CategoryDTO> get(@PathVariable("id") int id) {
		return ResponseDTO.<CategoryDTO>builder().status(200)
				.data(categoryService.getById(id)).build();
	}

	@PostMapping("/search")
	public PageDTO<CategoryDTO> search(@RequestBody @Valid SearchDTO searchDTO) {
		return categoryService.search(searchDTO);
	}

	@GetMapping("/list")
	public ResponseDTO<List<CategoryDTO>> list() {
		List<CategoryDTO> categoryDTOs = categoryService.getAll();
		return ResponseDTO.<List<CategoryDTO>>builder().status(200)
				.data(categoryDTOs).build();
	}
}