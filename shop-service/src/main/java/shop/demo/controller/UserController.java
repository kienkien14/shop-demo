package shop.demo.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import shop.demo.dto.*;
import shop.demo.entity.Role;
import shop.demo.service.BillService;
import shop.demo.service.UserService;


@RestController
@RequestMapping("/admin/user")
public class UserController {
	@Autowired
	UserService userService;
	
	@Autowired
	BillService billService;
	
	final String UPLOAD_FOLDER = "D:\\BackEnd\\image\\";

	@PostMapping("/")
	public ResponseDTO<UserDTO> create(@ModelAttribute @Valid UserDTO userDTO) throws IllegalStateException, IOException {
		if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
			if (!(new File(UPLOAD_FOLDER).exists())) {
				new File(UPLOAD_FOLDER).mkdirs();
			}
			String filename = userDTO.getFile().getOriginalFilename();
			// lay dinh dang file
			String extension = filename.substring(filename.lastIndexOf("."));
			// tao ten moi
			String newFilename = UUID.randomUUID().toString() + extension;

			File newFile = new File(UPLOAD_FOLDER + newFilename);

			userDTO.getFile().transferTo(newFile);
			
			userDTO.setAvatar(newFilename);// save to db

		}

		userService.create(userDTO);
		return ResponseDTO.<UserDTO>builder().status(200).data(userDTO).build();
	}

	/// /user/download/abc.jpg
//	@GetMapping("/download/{filename}")
//	public void download(@PathVariable("filename") String filename, HttpServletResponse response)
//			throws IOException {
//		File file = new File(UPLOAD_FOLDER + filename);
//		Files.copy(file.toPath(), response.getOutputStream());
//	}

	@PostMapping("/search")
	public PageDTO<UserDTO> search(
			@RequestBody @Valid SearchDTO searchDTO) {
		return userService.search(searchDTO);
	}

	@GetMapping("/{id}") // 10
	public ResponseDTO<UserDTO> get(@PathVariable("id") int id) {
		UserDTO userDTO = userService.getById(id);
		return ResponseDTO.<UserDTO>builder().status(200).data(userDTO).build();
	}

	@DeleteMapping("/{id}") // /1
	public ResponseDTO<Void> delete(@PathVariable("id") int id) {
		userService.delete(id);
		return ResponseDTO.<Void>builder().status(200).build();
	}

	@PutMapping("/")
	public ResponseDTO<Void> update(@ModelAttribute @Valid UserDTO userDTO) throws IllegalStateException, IOException {
		if (userDTO.getFile() != null && !userDTO.getFile().isEmpty()) {
			// lay ten file anh tu doi tuong UserDTO
			String filename = userDTO.getFile().getOriginalFilename();
			// lay dinh dang file 
			String extension = filename.substring(filename.lastIndexOf("."));
			// tao ten moi
			String newFilename = UUID.randomUUID().toString() + extension;
			// luu lai file vao o cung may chu	
			File newFile = new File(UPLOAD_FOLDER + newFilename);
			// di chuyen file anh duoc tai len vao doi tuong newFile
			userDTO.getFile().transferTo(newFile);

			userDTO.setAvatar(newFilename);// save to db
		}

		userService.update(userDTO);
		return ResponseDTO.<Void>builder().status(200).msg("Update Ok").build();
	}

	@PutMapping("/password")
	public ResponseDTO<Void> updatePassword(
			@RequestBody @Valid UserDTO userDTO) {
		userService.updatePassword(userDTO);
		return ResponseDTO.<Void>builder().status(200).msg("Update Password Ok").build();
	}
	
//	@PutMapping("/forgot-pass")
//	public ResponseDTO<Void> forgotPassword(
//			@RequestParam("username") String username) {
//		boolean userFound = userService.forgotPassword(username);
//
//		if (userFound) {
//			return ResponseDTO.<Void>builder().status(200).msg("Forgot Password Ok").build();
//		} else {
//			// Trả về một ResponseDTO chứa mã lỗi và thông báo lỗi
//			return ResponseDTO.<Void>builder().status(404).msg("User not found").build();
//		}
//
////		userService.forgotPassword(username);
////		return ResponseDTO.<Void>builder().status(200).msg("Forgot Password Ok").build();
//	}
}