package shop.demo.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.NoResultException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cache")
public class CacheController {

	@Autowired
	CacheManager cacheManager;

	@GetMapping("/")
	public List<String> getCache() {
		List<String> cacheNames = cacheManager.getCacheNames()
				.stream().collect(Collectors.toList());
		return cacheNames;
	}

	@GetMapping("/{name}/keys")
	public Set<String> getCache(@PathVariable("name") String name) {
		Cache cache = cacheManager.getCache(name);

		if (cache == null)
			throw new NoResultException();

		@SuppressWarnings("unchecked")
		Set<String> keySet = ((Map<String, Object>) cache.getNativeCache()).keySet();

		return keySet;
	}

	@DeleteMapping("/{name}")
	public void deleteCache(@PathVariable("name") String name) {
		Cache cache = cacheManager.getCache(name);
		if (cache != null)
			cache.clear();
	}
}