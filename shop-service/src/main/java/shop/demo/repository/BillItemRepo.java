package shop.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import shop.demo.entity.BillItem;

public interface BillItemRepo extends JpaRepository<BillItem, Integer> {

}
