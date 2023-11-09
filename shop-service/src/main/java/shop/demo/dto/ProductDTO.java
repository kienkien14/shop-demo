package shop.demo.dto;

import java.util.Date;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
public class ProductDTO {
	private Integer id;
	//product variants
	@NotBlank
	private String name;
	private String image;// URL
	private String description;
	@Min(0)
	private double price;

	@JsonIgnore
	private MultipartFile file;

	@JsonFormat(pattern = "dd/MM/yyyy HH:mm")
	private Date createdAt;

	private CategoryDTO category;
}
