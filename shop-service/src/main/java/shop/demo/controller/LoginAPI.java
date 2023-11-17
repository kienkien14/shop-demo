package shop.demo.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import shop.demo.dto.ResponseDTO;
import shop.demo.dto.UserDTO;
import shop.demo.service.JwtTokenService;
import shop.demo.service.UserService;

@RestController
@RequestMapping("/")
public class LoginAPI {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenService jwtTokenService;

    @Autowired
    UserService userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseDTO<UserDTO> me(Principal principal) {
        String username = principal.getName();

        return ResponseDTO.<UserDTO>builder().status(200)
                .data(userService.findByUsername(username)).build();
    }

    @PostMapping("/login")
        public ResponseDTO<String> login(
            @RequestParam("username") String username,
            @RequestParam("password") String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        // refreshToken = UUID.randomUUID().toString();
        // save refresh token - table(refresh_token)(username, refreshtoken,expired)
        // class TokenDTO(refreshToken,accesstoken)
        String jwt = jwtTokenService.createToken(username);
        return ResponseDTO.<String>builder().status(200).data(jwt).build();
    }

    @PutMapping("/forgot-pass")
	public ResponseDTO<Void> forgotPassword(
			@RequestParam("email") String email) {
		boolean userFound = userService.forgotPassword(email);

		if (userFound) {
			return ResponseDTO.<Void>builder().status(200).msg("Forgot Password Ok").build();
		} else {
			// Trả về một ResponseDTO chứa mã lỗi và thông báo lỗi
			return ResponseDTO.<Void>builder().status(404).msg("User not found").build();
		}

	}
}