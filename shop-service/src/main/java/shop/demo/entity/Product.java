package shop.demo.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Product extends TimeAuditable{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	private String name;
	private String image;
	private String description;
	private double price;
	
	@OneToMany(mappedBy = "product" ,cascade = CascadeType.ALL)
	private List<ProductColor> productColors;
	//1 san pham - nhieu mau (color) - quantity
	
	@ManyToOne
	private Category category;
}
