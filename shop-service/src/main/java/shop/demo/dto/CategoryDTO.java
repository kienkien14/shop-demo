package shop.demo.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class CategoryDTO {
	private Integer id;
	
	@NotBlank
	@Size(min = 5, max = 20)
	private String name;
}
