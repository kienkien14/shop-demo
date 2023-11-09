package junit.basic;

import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;

@Suite
@SelectClasses({HelloJunitTest.class, HelloJunitTest2.class, CategoryIntegrationTest.class})
public class TestSuite {

}
