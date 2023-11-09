package junit.basic;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class HelloJunitTest2 {

	@Test
	public void test1() {
		int a = Math.max(1, 2);
		assertEquals(2, a);
	}

	@Test
	public void test2() {
		int a = Math.max(3, 5);
		assertEquals(5, a);
	}
}
