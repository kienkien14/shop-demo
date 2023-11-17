package shop.demo.service;

import org.bouncycastle.crypto.Mac;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import shop.demo.dto.PageDTO;
import shop.demo.dto.SearchDTO;
import shop.demo.dto.UserDTO;
import shop.demo.entity.Role;
import shop.demo.entity.User;
import shop.demo.jobscheduler.JobScheduler;
import shop.demo.repository.RoleRepo;
import shop.demo.repository.UserRepo;

import javax.persistence.NoResultException;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

public interface UserService {
    UserDetails loadUserByUsername(String username);

    void create(UserDTO userDTO);

    void update(UserDTO userDTO);

    void updatePassword(UserDTO userDTO);

    void delete(int id);

    UserDTO getById(int id);

    UserDTO findByUsername(String username);

    List<UserDTO> getAll();

    PageDTO<UserDTO> search(SearchDTO searchDTO);

    boolean forgotPassword(String username);
}

@Service
class UserServiceImple implements UserService {
    @Autowired
    UserRepo userRepo;

    @Autowired
    RoleRepo roleRepo;

    @Autowired
    JobScheduler jobScheduler;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User userEntity = userRepo.findByUsername(username);
        if (userEntity == null) {
            throw new UsernameNotFoundException("Not Found");
        }
        // convert userentity -> userdetails
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        // chuyen vai tro ve quyen (authorities = roles)
        for (Role role : userEntity.getRoles()) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }
        return new org.springframework.security.core.userdetails.User(username, userEntity.getPassword(), authorities);
    }

    @Override
    @Transactional
    public void create(UserDTO userDTO) {
        User user = new ModelMapper().map(userDTO, User.class);

        user.setPassword(new BCryptPasswordEncoder().encode(userDTO.getPassword()));
        userRepo.save(user);

        // tra ve idsau khi tao
        userDTO.setId(user.getId());
    }

    @Override
    @Transactional
    public void update(UserDTO userDTO) {
        User user = userRepo.findById(userDTO.getId()).orElseThrow(NoResultException::new);
        user = new ModelMapper().map(userDTO, User.class);

        user.setPassword(new BCryptPasswordEncoder().encode(userDTO.getPassword()));

        user.setRoles(userDTO.getRoles().stream().map(role -> roleRepo.findById(role.getId()).orElse(null))
                .filter(r -> r != null).collect(Collectors.toList()));

        if (userDTO.getAvatar() != null)
            user.setAvatar(userDTO.getAvatar());

        userRepo.save(user);
    }

    @Override
    @Transactional
    public void updatePassword(UserDTO userDTO) {
        // check
        User currentUser = userRepo.findById(userDTO.getId()).orElse(null);
        if (currentUser != null) {
            currentUser.setPassword(new BCryptPasswordEncoder().encode(userDTO.getPassword()));
            userRepo.save(currentUser);
        }
    }

    @Override
    @Transactional
    public void delete(int id) {
        userRepo.deleteById(id);
    }

    @Override
    public UserDTO getById(int id) { // java8, optinal
        User user = userRepo.findById(id).orElseThrow(NoResultException::new);// java8 lambda
        return new ModelMapper().map(user, UserDTO.class);
    }

    @Override
    public UserDTO findByUsername(String username) { // java8, optinal
        User user = userRepo.findByUsername(username);
        if (user == null)
            throw new NoResultException();
        return new ModelMapper().map(user, UserDTO.class);
    }

    @Override
    public List<UserDTO> getAll() {
        List<User> userList = userRepo.findAll();
        // java 8
        // chuyen tung phan tu userList sang userDTO xog collect ve list
        return userList.stream().map(u -> convert(u)).collect(Collectors.toList());
    }

    @Override
    public PageDTO<UserDTO> search(SearchDTO searchDTO) {
        Sort sortBy = Sort.by("id").ascending(); // sep theo asc
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
        Page<User> page = userRepo.searchByName("%" + searchDTO.getKeyword() + "%", pageRequest);

        // su dung builder
        return PageDTO.<UserDTO>builder().totalPages(page.getTotalPages()).totalElements(page.getTotalElements())
                .contents(page.get().map(r -> convert(r)).collect(Collectors.toList())).build();
    }

    private UserDTO convert(User user) {
        return new ModelMapper().map(user, UserDTO.class);
    }

    @Override
    @Transactional
    public boolean forgotPassword(String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            System.out.println("Không tìm thấy người dùng với email này!");
            return false;
        }
        // set encode mat khau moi
        String newPassword = generateRandomPassword(6);

        // Băm mật khẩu mới trước khi lưu vào cơ sở dữ liệu
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // Cập nhật mật khẩu mới vào cơ sở dữ liệu
        user.setPassword(passwordEncoder.encode(newPassword));

        jobScheduler.newPassword(user.getEmail(), user.getName(), newPassword);

        userRepo.save(user);
        return true;
    }

    // Hàm tạo mật khẩu ngẫu nhiên
    private String generateRandomPassword(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            sb.append(characters.charAt(index));
        }
        return sb.toString();
    }
}
