package shop.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.NoResultException;

import shop.demo.dto.PageDTO;
import shop.demo.dto.RoleDTO;
import shop.demo.dto.SearchDTO;
import shop.demo.entity.Role;
import shop.demo.repository.RoleRepo;

public interface RoleService {
    void create(RoleDTO roleDTO);

    void update(RoleDTO roleDTO);

    void delete(int id);

    RoleDTO getById(int id);

    PageDTO<RoleDTO> search(SearchDTO searchDTO);

    List<RoleDTO> getAll();
}


@Service
class RoleServiceImpl implements RoleService {

    @Autowired
    RoleRepo roleRepo;

    @Override
    @Transactional
    public void create(RoleDTO roleDTO) {
        Role role = new ModelMapper().map(roleDTO, Role.class);
        roleRepo.save(role);
        // tra ve idsau khi tao
        roleDTO.setId(role.getId());
    }

    @Override
    @Transactional
    public void update(RoleDTO roleDTO) {
        Role role = roleRepo.findById(roleDTO.getId()).orElseThrow(NoResultException::new);
        role.setName(roleDTO.getName());

        roleRepo.save(role);
    }

    @Override
    @Transactional
    public void delete(int id) {
        roleRepo.deleteById(id);
    }

    @Override
    public PageDTO<RoleDTO> search(SearchDTO searchDTO) {
        Sort sortBy = Sort.by("id").ascending(); //sep theo asc
        // check null
        if (StringUtils.hasText(searchDTO.getSortedField())) {
            sortBy = Sort.by(searchDTO.getSortedField()).ascending();
        }

        if (searchDTO.getCurrentPage() == null) {
            searchDTO.setCurrentPage(0);
        }

        if (searchDTO.getSize() == null) {
            searchDTO.setSize(5);
        }

        if (searchDTO.getKeyword() == null) {
            searchDTO.setKeyword("");
        }

        PageRequest pageRequest = PageRequest.of(searchDTO.getCurrentPage(), searchDTO.getSize(), sortBy);
        Page<Role> page = roleRepo.searchByName("%" + searchDTO.getKeyword() + "%", pageRequest);

        // su dung builder
        return PageDTO.<RoleDTO>builder()
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .contents(page.get()
                        .map(r -> convert(r)).collect(Collectors.toList()))
                .build();
//		c2
//		PageDTO<List<CourseDTO>> pageDTO = new PageDTO<>();
//		pageDTO.setTotalPages(page.getTotalPages());
//		pageDTO.setTotalElements(page.getTotalElements());
//
//		List<CourseDTO> courseDTOs = page.get().map(u -> convert(u)).collect(Collectors.toList());
//		pageDTO.setData(courseDTOs);
//		return pageDTO;
    }

    private RoleDTO convert(Role role) {
        return new ModelMapper().map(role, RoleDTO.class);
    }

    @Override
    public RoleDTO getById(int id) {
        Role role = roleRepo.findById(id).orElseThrow(NoResultException::new);
        return convert(role);
    }

    @Override
    public List<RoleDTO> getAll() {
        List<Role> courseList = roleRepo.findAll();
        // java 8
        // chuyen tung phan tu userList sang userDTO xog collect ve list
        return courseList.stream().map(u -> convert(u)).collect(Collectors.toList());
    }

}