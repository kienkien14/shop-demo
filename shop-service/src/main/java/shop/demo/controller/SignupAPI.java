package shop.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import shop.demo.dto.ResponseDTO;
import shop.demo.dto.RoleDTO;
import shop.demo.dto.UserDTO;
import shop.demo.service.UserService;

import javax.validation.Valid;
import java.io.IOException;
import java.util.Arrays;

@RestController
@RequestMapping("/")
public class SignupAPI {
    @Autowired
    UserService userService;

    final String UPLOAD_FOLDER = "D:\\BackEnd\\image\\";

    @PostMapping("/signup")
    public ResponseDTO<UserDTO> createMember(@RequestBody @Valid UserDTO userDTO) throws IllegalStateException, IOException {
        userDTO.setRoles(Arrays.asList(new RoleDTO(3)));
        userService.create(userDTO);
        return ResponseDTO.<UserDTO>builder().status(200).data(userDTO).build();
    }
}
