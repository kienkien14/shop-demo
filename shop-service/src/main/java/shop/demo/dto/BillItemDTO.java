package shop.demo.dto;

import javax.validation.constraints.Min;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
public class BillItemDTO {
	private Integer id;

//	@JsonBackReference
	//Ignore kh lay thuoc tinh billItems nua
	@JsonIgnoreProperties("billItems")
	private BillDTO billDTO;

	private ProductDTO product;

	@Min(0)
	private int quantity;
	@Min(0)
	private double price;
}
