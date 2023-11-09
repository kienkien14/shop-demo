package shop.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import shop.demo.dto.*;
import shop.demo.service.BillItemService;

import javax.validation.Valid;

@RestController
@RequestMapping("/admin/billItem")
public class BillItemController {

    @Autowired // DI: dependency inject
    BillItemService billItemService;

    @PostMapping("/") // gia su: khong upload file
    public ResponseDTO<Void> create(@RequestBody @Valid BillItemDTO billItemDTO) {
        billItemService.create(billItemDTO);
        return ResponseDTO.<Void>builder().status(200).msg("Create Ok").build();
    }

    @PutMapping("/")
    public ResponseDTO<Void> update(@RequestBody @Valid BillItemDTO billItemDTO) {
        billItemService.update(billItemDTO);

        return ResponseDTO.<Void>builder().status(200).msg("Update Ok").build();
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<Void> delete(@PathVariable("id") int id) {
        billItemService.delete(id);
        return ResponseDTO.<Void>builder().status(200).msg("Delete Ok").build();
    }

    @PostMapping("/search")
    public PageDTO<BillItemDTO> search(@RequestBody @Valid SearchDTO searchDTO) {
        return billItemService.search(searchDTO);
    }

    @GetMapping("/{id}")
    public ResponseDTO<BillItemDTO> get(@PathVariable("id") int id) {
        return ResponseDTO.<BillItemDTO>builder().status(200).data(billItemService.getById(id)).build();
    }

}