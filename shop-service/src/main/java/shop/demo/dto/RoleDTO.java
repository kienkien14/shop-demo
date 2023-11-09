package shop.demo.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoleDTO {
	private Integer id;
	
	@NotBlank
	@Size(min = 6, max = 20)
	private String name;

	public RoleDTO(Integer id) {
		this.id = id;
	}
}
