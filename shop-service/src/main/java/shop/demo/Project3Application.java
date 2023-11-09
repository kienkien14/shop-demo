package shop.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import shop.demo.service.SecurityInterceptor;

@SpringBootApplication
@EnableJpaAuditing	
@EnableScheduling
@EnableCaching 
public class Project3Application implements WebMvcConfigurer {
	
	@Autowired
	SecurityInterceptor securityInterceptor;
	
	public static void main(String[] args) {
		SpringApplication.run(Project3Application.class, args);
	}
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(securityInterceptor);
	}
}
