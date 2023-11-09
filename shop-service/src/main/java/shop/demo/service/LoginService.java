package shop.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import shop.demo.dto.LoginUserDTO;
import shop.demo.entity.Role;
import shop.demo.repository.UserRepo;

@Service
public class LoginService implements UserDetailsService {
	@Autowired
	UserRepo userRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		shop.demo.entity.User st = 
				userRepo.findByUsername(username);

		if (st == null) {
			throw new UsernameNotFoundException("not found");
		}

		List<SimpleGrantedAuthority> list = 
				new ArrayList<SimpleGrantedAuthority>();

		for (Role role : st.getRoles()) {
			list.add(new SimpleGrantedAuthority(role.getName()));
		}

		// tao user cua security
		// user dang nhap hien tai
		LoginUserDTO currentUser = 
				new LoginUserDTO(username, st.getPassword(), list);

		currentUser.setId(st.getId());
		currentUser.setName(st.getName());
		
		//da hinh 
		return currentUser;
	}
}