package shop.demo.dto;

import lombok.Data;

@Data
public class SearchDTO {
	private String keyword;
	private Integer currentPage;
	private Integer size;// mac dinh
	private String sortedField;
}