package junit.basic;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

public class HelloJunitTest {
	@BeforeAll
	public static void setup() {
		System.out.println(123456);
	}

	@AfterAll
	public static void after() {
		System.out.println(123456);
	}

	// test case:
	@Test
	public void test1() {
		// input: 1, 2
		// output: a
		// expect: a = 2
		int a = Math.max(1, 2);
		assertEquals(2, a);
	}

	@Test
	public void test2() {
		int a = Math.max(3, 5);
		assertEquals(3, a);
	}

}