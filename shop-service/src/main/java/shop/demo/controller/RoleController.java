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

import shop.demo.dto.PageDTO;
import shop.demo.dto.ResponseDTO;
import shop.demo.dto.RoleDTO;
import shop.demo.dto.SearchDTO;
import shop.demo.service.RoleService;

@RestController
@RequestMapping("/admin/role")
public class RoleController {

	@Autowired // DI: dependency inject
	RoleService roleService;

	@PostMapping("/") // gia su: khong upload file
	public ResponseDTO<Void> create(@RequestBody @Valid RoleDTO roleDTO) {
		roleService.create(roleDTO);
		return ResponseDTO.<Void>builder().status(200).msg("Create Ok").build();
	}

	@PutMapping("/")
	public ResponseDTO<Void> edit(@RequestBody @Valid RoleDTO roleDTO) {
		roleService.update(roleDTO);

		return ResponseDTO.<Void>builder().status(200).msg("Update Ok").build();
	}

	@DeleteMapping("/{id}")
	public ResponseDTO<Void> delete(@PathVariable("id") int id) {
		roleService.delete(id);
		return ResponseDTO.<Void>builder().status(200).msg("Delete Ok").build();
	}

	@GetMapping("/{id}")
	// @ResponseStatus(code = HttpStatus.OK)
	public ResponseDTO<RoleDTO> get(@PathVariable("id") int id) {
		return ResponseDTO.<RoleDTO>builder().status(200).data(roleService.getById(id)).build();
	}

	@PostMapping("/search")
	public PageDTO<RoleDTO> search(@RequestBody @Valid SearchDTO searchDTO) {
		return roleService.search(searchDTO);
	}

	@GetMapping("/list")
	public ResponseDTO<List<RoleDTO>> list() {
		List<RoleDTO> roleDTOs = roleService.getAll();
		return ResponseDTO.<List<RoleDTO>>builder().status(200).data(roleDTOs).build();
	}
}
