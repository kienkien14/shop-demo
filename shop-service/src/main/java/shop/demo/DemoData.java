package shop.demo;

import java.util.Arrays;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;
import shop.demo.entity.Role;
import shop.demo.entity.User;
import shop.demo.repository.RoleRepo;
import shop.demo.repository.UserRepo;

@Component
@Slf4j
public class DemoData implements ApplicationRunner {

	@Autowired
	UserRepo userRepo;

	@Autowired
	RoleRepo roleRepo;

	@Override
	public void run(ApplicationArguments args) throws Exception {
		// insert data demo into data
		log.info("BEGIN INSERT ROLE DUMP");
		Role role = new Role();
		role.setName("ROLE_ADMIN");
		if (roleRepo.findByName(role.getName()) == null) {
			try {
				log.info("INSERT DUMP");
				roleRepo.save(role);
				User user = new User();
				user.setUsername("sysadmin");
				user.setPassword(new BCryptPasswordEncoder().encode("123456"));
				user.setName("SYS ADMIN");
				user.setEmail("admin@gmail.com");
				user.setBirthdate(new Date());
				user.setRoles(Arrays.asList(role));

				userRepo.save(user);

			} catch (Exception e) {

			}
		}
	}
}
