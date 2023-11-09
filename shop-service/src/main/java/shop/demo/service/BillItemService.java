package shop.demo.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import shop.demo.dto.BillItemDTO;
import shop.demo.dto.PageDTO;
import shop.demo.dto.SearchDTO;
import shop.demo.entity.BillItem;
import shop.demo.repository.BillItemRepo;

import javax.persistence.NoResultException;
import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

public interface BillItemService {
    void create(BillItemDTO billItemDTO);

    void update(BillItemDTO billItemDTO);

    void delete(int id);

    PageDTO<BillItemDTO> search(SearchDTO searchDTO);

    BillItemDTO getById(int id);
}

@Service
class BillItemServiceImple implements BillItemService {
    @Autowired
    BillItemRepo billItemRepo;


    @Override
    @Transactional
    public void create(BillItemDTO billItemDTO) {
        BillItem billItem = new ModelMapper().map(billItemDTO, BillItem.class);
        billItemRepo.save(billItem);

    }

    @Override
    @Transactional
    public void update(BillItemDTO billItemDTO) {
        BillItem billItem = billItemRepo.findById(billItemDTO.getId()).orElseThrow(NoResultException::new);
        billItem = new ModelMapper().map(billItemDTO, BillItem.class);
        billItemRepo.save(billItem);
    }

    @Override
    @Transactional
    public void delete(int id) {
        billItemRepo.deleteById(id);
    }

    @Override
    public PageDTO<BillItemDTO> search(SearchDTO searchDTO) {
        Pageable pageable = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize());

        Page<BillItem> pageRS = billItemRepo.findAll(pageable);

        PageDTO<BillItemDTO> pageDTO = new PageDTO<>();
        pageDTO.setTotalPages(pageRS.getTotalPages());
        pageDTO.setTotalElements(pageRS.getTotalElements());

        // java 8 : lambda, stream
        List<BillItemDTO> billItemDTOs = pageRS.get().map(b -> new ModelMapper().map(b, BillItemDTO.class)).collect(Collectors.toList());

        pageDTO.setContents(billItemDTOs);// set vao pagedto
        return pageDTO;
    }

    @Override
    public BillItemDTO getById(int id) {
        BillItem billItem = billItemRepo.findById(id).orElseThrow(NoResultException::new);// java8 lambda
        return new ModelMapper().map(billItem, BillItemDTO.class);
    }


}
