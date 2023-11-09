package shop.demo.dto;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotBlank;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
public class UserDTO {
	private Integer id;
	@NotBlank
	private String name;
	private String avatar;// URL
	private String email;
	private String username;
	private String password;
	
	@JsonFormat(pattern = "dd/MM/yyyy", timezone = "Asia/Ho_Chi_Minh")
	@DateTimeFormat(pattern = "dd/MM/yyyy")
	private Date birthdate;

	@JsonIgnore
	private MultipartFile file;

	@JsonFormat(pattern = "dd/MM/yyyy", timezone = "Asia/Ho_Chi_Minh")
	private Date createdAt;
	
	private List<RoleDTO> roles;//roles[0].id=1
}
