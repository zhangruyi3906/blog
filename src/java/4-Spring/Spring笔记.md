---
title: Spring笔记
date: 2023-05-12 00:12:55
category:
  - Java
  - Spring
tag:
  - Java
  - Spring
---

> Spring官网https://spring.io
>
> 框架图：
>
> ![image-20230513214826206](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305132148269.png)

## 为什么要使用Spring

原先代码中存在的问题如下：

+ 业务层：

```java
public class BookServiceImpl implements BookService {
    //业务层中使用new的方式创建的dao对象
    private BookDao bookDao = new BookDaoImpl();

    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
    }
}
```

+ 数据层：

```java
public class BookDaoImpl implements BookDao {
    public void save() {
        System.out.println("book dao save ...");
    }
}

public class BookDaoImpl2 implements BookDao {
    public void save() {
        System.out.println("book dao save ...");
    }
}
```

> 1. 业务层需要调用数据层的方法，就需要在业务层new数据层的对象，
> 2. 如果数据层的实现类发生变化，那么业务层的代码也需要跟着改变，发生变更后，都需要进行编译打包和重部署。

如何解决？将业务层代码的new去掉，即

```java
public class BookServiceImpl implements BookService {
    //业务层中使用new的方式创建的dao对象
    private BookDao bookDao;//这里去掉了new

    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
    }
}
```

但是如果不创建对象，就会出现空指针异常，怎么办呢？这时候就需要交给Spring来做了，让Spring来创建对象。

## IOC控制反转

一些概念：

+ `IOC（Inversion of Control）`控制反转：自己不再使用`new`来创建对象，而是交给`IOC容器`来创建对象，这样就反转了控制数据层对象的创建权，所以叫控制反转。
+ IOC容器：负责对象的创建、初始化等一系列工作，其中包含了数据层和业务层的类对象
+ Bean：被创建或被管理的对象在IOC容器中统称为Bean
+ `DIDependency Injection`
  依赖注入：IOC容器中创建好service和dao对象后，程序不能正确执行，因为service运行需要依赖dao对象，但是service对象和dao对象没有任何关系，需要把dao对象交给service,也就是说要绑定service和dao对象之间的关系；这种在容器中建立bean与bean之间的依赖关系的整个过程，称为依赖注入。

### 案例

1. 创建maven项目
2. 添加jar包

```xml

<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.2.10.RELEASE</version>
    </dependency>
</dependencies>
```

3. 添加需要的类：

```java
public interface BookDao {
    public void save();
}

public class BookDaoImpl implements BookDao {
    public void save() {
        System.out.println("book dao save ...");
    }
}

public interface BookService {
    public void save();
}

public class BookServiceImpl implements BookService {
    private BookDao bookDao = new BookDaoImpl();

    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
    }
}
```

4. 添加Sprng配置文件`applicationContext.xml`,在resources下面

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--bean标签标示配置bean id属性标示给bean起名字 class属性表示给bean定义类型 -->
    <bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl"/>
    <bean id="bookService" class="com.itheima.service.impl.BookServiceImpl"/>
</beans>
```

5. 获取IOC容器,调用方法

```java
public class App {
    public static void main(String[] args) {
        //获取IOC容器
        ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
//        BookDao bookDao = (BookDao) ctx.getBean("bookDao");
//        bookDao.save();
        BookService bookService = (BookService) ctx.getBean("bookService");
        bookService.save();
    }
}
```

此时就完成了bookDao这个bean的创建，但是在Service里面还需要依赖BookDao，里面还存在一个new操作，此时就需要DI依赖注入了。

## DI依赖注入

DI依赖注入就是在Service层里面注入一个bookDao对象，从而不用再去主动new 一个bookDao对象了。具体操作如下：

1. 删除new操作

```java
public class BookServiceImpl implements BookService {
    //删除业务层中使用new的方式创建的dao对象
    private BookDao bookDao;

    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
    }
}
```

2. 给属性提供setter方法

```java
public class BookServiceImpl implements BookService {
    //删除业务层中使用new的方式创建的dao对象
    private BookDao bookDao;

    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
    }

    //提供对应的set方法
    public void setBookDao(BookDao bookDao) {
        this.bookDao = bookDao;
    }
}
```

3. 编辑配置文件完成注入

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--bean标签标示配置bean id属性标示给bean起名字 class属性表示给bean定义类型 -->
    <bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl"/>
    <bean id="bookService" class="com.itheima.service.impl.BookServiceImpl"/>
    <bean id="bookService" class="com.itheima.service.impl.BookServiceImpl">
        <!--配置server与dao的关系-->
        <!--property标签表示配置当前bean的属性
        		name属性表示配置哪一个具体的属性
        		ref属性表示参照哪一个bean-->
        <property name="bookDao" ref="bookDao"/>
    </bean>
</beans>
```

> 注意：
>
> * name="bookDao"中`bookDao`的作用是让Spring的IOC容器在获取到名称后，将首字母大写，前面加set找对应的`setBookDao()`
    方法进行对象注入
> * ref="bookDao"中`bookDao`的作用是让Spring能在IOC容器中找到id为`bookDao`的Bean对象给`bookService`进行注入

## IOC相关内容

### Bean注意事项

```xml

<bean id="" class="" name="" scope=""/>
```

> + class不可以写接口的类全名，因为接口无法创建对象
> + id必须唯一，name可以多个
> + scope：为bean设置作用范围，可选值为单例singloton，非单例prototype

### Bean创建方式

#### 无参构造方法

Spring底层使用的是类的无参构造方法。使用反射，默认就是这个无参构造

#### 静态工厂实例化

通过工厂创建对象如下：

```java
public interface OrderDao {
    public void save();
}

public class OrderDaoImpl implements OrderDao {
    public void save() {
        System.out.println("order dao save ...");
    }
}


//静态工厂创建对象
public class OrderDaoFactory {
    public static OrderDao getOrderDao() {
        return new OrderDaoImpl();
    }
}

public class AppForInstanceOrder {
    public static void main(String[] args) {
        //通过静态工厂创建对象
        OrderDao orderDao = OrderDaoFactory.getOrderDao();
        orderDao.save();
    }
}
```

使用Spring中的静态工厂：

```xml

<bean id="orderDao" class="com.itheima.factory.OrderDaoFactory" factory-method="getOrderDao"/>
```

#### 实例工厂实例化

通过实例工厂创建对象如下：

```java
public interface UserDao {
    public void save();
}

public class UserDaoImpl implements UserDao {

    public void save() {
        System.out.println("user dao save ...");
    }
}

public class UserDaoFactory {
    public UserDao getUserDao() {
        return new UserDaoImpl();
    }
}

public class AppForInstanceUser {
    public static void main(String[] args) {
        //创建实例工厂对象
        UserDaoFactory userDaoFactory = new UserDaoFactory();
        //通过实例工厂对象创建对象
        UserDao userDao = userDaoFactory.getUserDao();
        userDao.save();
    }
```

使用Spring：

```xml

<bean id="userFactory" class="com.itheima.factory.UserDaoFactory"/>
<bean id="userDao" factory-method="getUserDao" factory-bean="userFactory"/>
```

#### 使用FactoryBean创建

```java
public class UserDaoFactoryBean implements FactoryBean<UserDao> {
    //代替原始实例工厂中创建对象的方法
    public UserDao getObject() throws Exception {
        return new UserDaoImpl();
    }

    //返回所创建类的Class对象
    public Class<?> getObjectType() {
        return UserDao.class;
    }
}
```

配置文件：

```xml

<bean id="userDao" class="com.itheima.factory.UserDaoFactoryBean"/>
```

### Bean生命周期

代码如下：

```java
public interface BookDao {
    public void save();
}

public class BookDaoImpl implements BookDao {
    public void save() {
        System.out.println("book dao save ...");
    }

    //表示bean初始化对应的操作
    public void init() {
        System.out.println("init...");
    }

    //表示bean销毁前对应的操作
    public void destory() {
        System.out.println("destory...");
    }
}

public interface BookService {
    public void save();
}

public class BookServiceImpl implements BookService {
    private BookDao bookDao;

    public void setBookDao(BookDao bookDao) {
        this.bookDao = bookDao;
    }

    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
    }
}
```

Spring配置文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl" init-method="init" destroy-method="destory"/>
</beans>
```

此时就可以执行到init方法，但是destroy方法没有执行，具体可以将ApplicationContext更换成ClassPathXmlApplicationContext

```java
ClassPathXmlApplicationContext ctx=new ClassPathXmlApplicationContext("applicationContext.xml");
        ctx.close();
//ctx.registerShutdownHook();//也可以用这个
```

#### 实现接口完成生命周期

```java
public class BookServiceImpl implements BookService, InitializingBean, DisposableBean {
    private BookDao bookDao;

    public void setBookDao(BookDao bookDao) {
        this.bookDao = bookDao;
    }

    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
    }

    public void destroy() throws Exception {
        System.out.println("service destroy");
    }

    public void afterPropertiesSet() throws Exception {
        System.out.println("service init");
    }
}
```

## DI依赖注入

### setter注入

#### 引用类型

使用的是`<property name="" ref=""/>`

提供setter方法：

```java
public class BookServiceImpl implements BookService {
    private BookDao bookDao;
    private UserDao userDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    public void setBookDao(BookDao bookDao) {
        this.bookDao = bookDao;
    }

    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
        userDao.save();
    }
}
```

spring配置

```xml

<bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl"/>
<bean id="userDao" class="com.itheima.dao.impl.UserDaoImpl"/>
<bean id="bookService" class="com.itheima.service.impl.BookServiceImpl">
<property name="bookDao" ref="bookDao"/>
<property name="userDao" ref="userDao"/>
</bean>
```

#### 简单数据类型

ref是指向Spring的IOC容器中的另一个bean对象的，对于简单数据类型，没有对应的bean对象，使用property标签注入

```java
public class BookDaoImpl implements BookDao {

    private String databaseName;
    private int connectionNum;

    public void setConnectionNum(int connectionNum) {
        this.connectionNum = connectionNum;
    }

    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }

    public void save() {
        System.out.println("book dao save ..." + databaseName + "," + connectionNum);
    }
}
```

配置文件

```xml

<bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl">
    <property name="databaseName" value="mysql"/>
    <property name="connectionNum" value="10"/>
</bean>
```

### 构造器注入

#### 引用类型

提供构造方法：

```java
public class BookServiceImpl implements BookService {
    private BookDao bookDao;

    public BookServiceImpl(BookDao bookDao) {
        this.bookDao = bookDao;
    }

    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
    }
}
```

配置文件

```xml

<bean id="bookService" class="com.itheima.service.impl.BookServiceImpl">
    <constructor-arg name="bookDao" ref="bookDao"/>
</bean>
```

> name属性对应的值为构造函数中方法形参的参数名，必须要保持一致。

#### 简单数据类型

```java
public class BookDaoImpl implements BookDao {
    private String databaseName;
    private int connectionNum;

    public BookDaoImpl(String databaseName, int connectionNum) {
        this.databaseName = databaseName;
        this.connectionNum = connectionNum;
    }

    public void save() {
        System.out.println("book dao save ..." + databaseName + "," + connectionNum);
    }
}
```

配置文件：

```xml

<bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl">
    <constructor-arg name="databaseName" value="mysql"/>
    <constructor-arg name="connectionNum" value="666"/>
</bean>
```

> 上面都是按name注入的，name名字必须一致，这样会导致耦合，一个名字改了，配置文件也要改。
>
>可以使用下面方式解耦合：
>
>1. 按类型注入：
>
>```xml
><bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl">
>    <constructor-arg type="int" value="10"/>
>    <constructor-arg type="java.lang.String" value="mysql"/>
></bean>
>```
>
>2. 按索引注入
>
>```xml
><bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl">
>    <constructor-arg index="1" value="100"/>
>    <constructor-arg index="0" value="mysql"/>
></bean>
>```
>
>实际推荐setter注入

### 自动装配

原本在service注入dao

```xml

<bean id="bookService" class="com.itheima.service.impl.BookServiceImpl">
    <property name="bookDao" ref="bookDao"/>
</bean>
```

使用autowire

```xml
  <!--autowire属性：开启自动装配，通常使用按类型装配-->
<bean id="bookService" class="com.itheima.service.impl.BookServiceImpl" autowire="byType"/>
```

> * 需要注入属性的类中对应属性的setter方法不能省略
> * 被注入的对象必须要被Spring的IOC容器管理
> * 按类型不可以找到多个对象，如果有，需要按名称注入
>
> ```xml
> <!--autowire属性：开启自动装配，通常使用按类型装配-->
> <bean id="bookService" class="com.itheima.service.impl.BookServiceImpl" autowire="byName"/>
> ```
>
> 例如service里面要注入dao
>
> ```java
> public void setBookDao(BookDao bookDao){}
> ```
>
> 规则是去掉set，首字母小写，即变成 bookDao

### 集合注入

```java
public class BookDaoImpl implements BookDao {

    private int[] array;

    private List<String> list;

    private Set<String> set;

    private Map<String, String> map;

    private Properties properties;

    public void save() {
        System.out.println("book dao save ...");

        System.out.println("遍历数组:" + Arrays.toString(array));

        System.out.println("遍历List" + list);

        System.out.println("遍历Set" + set);

        System.out.println("遍历Map" + map);

        System.out.println("遍历Properties" + properties);
    }
}
```

在bookDao的bean标签中使用`<property>`进行注入

#### 注入数组类型数据

```xml

<property name="array">
    <array>
        <value>100</value>
        <value>200</value>
        <value>300</value>
    </array>
</property>
```

#### 注入List类型数据

```xml

<property name="list">
    <list>
        <value>itcast</value>
        <value>itheima</value>
        <value>boxuegu</value>
        <value>chuanzhihui</value>
    </list>
</property>
```

#### 注入Set类型数据

```xml

<property name="set">
    <set>
        <value>itcast</value>
        <value>itheima</value>
        <value>boxuegu</value>
        <value>boxuegu</value>
    </set>
</property>
```

#### 注入Map类型数据

```xml

<property name="map">
    <map>
        <entry key="country" value="china"/>
        <entry key="province" value="henan"/>
        <entry key="city" value="kaifeng"/>
    </map>
</property>
```

#### 注入Properties类型数据

```xml

<property name="properties">
    <props>
        <prop key="country">china</prop>
        <prop key="province">henan</prop>
        <prop key="city">kaifeng</prop>
    </props>
</property>
```

## IOC/DI管理第三方Bean

以管理druid为例

导入依赖

```xml

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>
<dependency>
<groupId>com.alibaba</groupId>
<artifactId>druid</artifactId>
<version>1.1.16</version>
</dependency>
```

spring配置

```xml
<!--管理DruidDataSource对象-->
<bean class="com.alibaba.druid.pool.DruidDataSource">
    <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/spring_db"/>
    <property name="username" value="root"/>
    <property name="password" value="root"/>
</bean>
```

#### 读取properties文件

resources下创建一个jdbc.properties文件,并添加对应的属性键值对

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://127.0.0.1:3306/spring_db
jdbc.username=root
jdbc.password=root
```

开启context命名空间

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
            http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/context
            http://www.springframework.org/schema/context/spring-context.xsd">
</beans>
```

加载properties文件

```xml

<context:property-placeholder location="jdbc.properties" system-properties-mode="NEVER"/>
```

注入属性：

```xml

<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
```

## 核心容器ApplicationContext

容器创建：

```java
ApplicationContext ctx=new ClassPathXmlApplicationContext("applicationContext.xml");
```

#### 获取Bean

1. 强制转换

```java
BookDao bookDao=(BookDao)ctx.getBean("bookDao");
```

2. 参数

```java
BookDao bookDao=ctx.getBean("bookDao"，BookDao.class);
```

3. 按类型注入，必须要确保IOC容器中该类型对应的bean对象只能有一个。

```java
BookDao bookDao=ctx.getBean(BookDao.class);
```

#### 使用BeanFactory

```java
public class AppForBeanFactory {
    public static void main(String[] args) {
        Resource resources = new ClassPathResource("applicationContext.xml");
        BeanFactory bf = new XmlBeanFactory(resources);
        BookDao bookDao = bf.getBean(BookDao.class);
        bookDao.save();
    }
}
```

## 注解开发

删掉`<bean>`标签

```xml

<bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl"/>
```

在BookDaoImpl类上添加`@Component`注解

```java

@Component("bookDao")
public class BookDaoImpl implements BookDao {
    public void save() {
        System.out.println("book dao save ...");
    }
}
```

> @Component注解不可以添加在接口上，因为接口是无法创建对象的
>
> @Component注解如果不起名称，会有一个默认值就是`当前类名首字母小写`
>
> @Controller/@Service/@Repository 分别用于表现层，业务层，数据层

配置spring注解扫描：

```xml

<context:component-scan base-package="com.itheima"/>
```

## 纯注解开发

#### @Configuration与@ComponentScan

删除掉applicationContext.xml，使用类来替换

```java

@Configuration//替换applicationContext.xml
@ComponentScan("com.itheima")//替换<context:component-scan base-package=""/>
public class SpringConfig {
}
```

更换加载容器

```java
//加载配置文件初始化容器
ApplicationContext ctx=new ClassPathXmlApplicationContext("applicationContext.xml");
        更换为：
        //加载配置类初始化容器
        ApplicationContext ctx=new AnnotationConfigApplicationContext(SpringConfig.class);
```

#### 设置非单例@Scope

```java

@Repository
//@Scope设置bean的作用范围
@Scope("prototype")
public class BookDaoImpl implements BookDao {

    public void save() {
        System.out.println("book dao save ...");
    }
}
```

#### @PostConstruct和@PreDestroy

```java

@Repository
public class BookDaoImpl implements BookDao {
    public void save() {
        System.out.println("book dao save ...");
    }

    @PostConstruct //在构造方法之后执行，替换 init-method
    public void init() {
        System.out.println("init ...");
    }

    @PreDestroy //在销毁方法之前执行,替换 destroy-method
    public void destroy() {
        System.out.println("destroy ...");
    }
}
```

> 如果找不到包：原因是，从JDK9以后jdk中的javax.annotation包被移除了，这两个注解刚好就在这个包中。
>
> ```xml
> <dependency>
>   <groupId>javax.annotation</groupId>
>   <artifactId>javax.annotation-api</artifactId>
>   <version>1.3.2</version>
> </dependency>
> ```

#### @Autowired

```java

@Service
public class BookServiceImpl implements BookService {
    @Autowired
    private BookDao bookDao;

    //	  public void setBookDao(BookDao bookDao) {
//        this.bookDao = bookDao;
//    }
    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
    }
}
```

> @Autowired可以写在属性上，也可也写在setter方法上
>
> 自动装配基于反射设计创建对象并通过暴力反射为私有属性进行设值,除了获取public修饰的内容还可以获取private修改的内容,所以此处无需提供setter方法

@Autowired是按照类型注入，那么对应BookDao接口如果有多个实现类，就会报错，如何解决：使用按照名称注入

```java

@Repository("bookDao")
public class BookDaoImpl implements BookDao {
    public void save() {
        System.out.println("book dao save ...");
    }
}

@Repository("bookDao2")
public class BookDaoImpl2 implements BookDao {
    public void save() {
        System.out.println("book dao save ...2");
    }
}
```

##### @Qualifier

`@Qualifier`来指定注入哪个名称的bean对象。

```java

@Service
public class BookServiceImpl implements BookService {
    @Autowired
    @Qualifier("bookDao1")
    private BookDao bookDao;
}
```

### @PropertySource

读取properties配置文件

```java

@Configuration
@ComponentScan("com.itheima")
@PropertySource("jdbc.properties")
public class SpringConfig {
}
```

### @Value

使用@Value进行简单类型注入

```java

@Repository("bookDao")
public class BookDaoImpl implements BookDao {
    @Value("itheima")
    private String name;
}
```

使用@Value读取配置文件中的内容

```properties
name=cxk
```

```java

@Repository("bookDao")
public class BookDaoImpl implements BookDao {
    @Value("${name}")
    private String name;

    public void save() {
        System.out.println("book dao save ..." + name);
    }
}
```

## 注解管理第三方Bean

### @Bean

在方法上面添加@Bean,将方法的返回值制作为Spring管理的一个bean对象

```java

@Configuration
public class SpringConfig {
    @Bean
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName("com.mysql.jdbc.Driver");
        ds.setUrl("jdbc:mysql://localhost:3306/spring_db");
        ds.setUsername("root");
        ds.setPassword("root");
        return ds;
    }
}
```

JdbcConfig

```java
public class JdbcConfig {
    @Bean
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName("com.mysql.jdbc.Driver");
        ds.setUrl("jdbc:mysql://localhost:3306/spring_db");
        ds.setUsername("root");
        ds.setPassword("root");
        return ds;
    }
}
```

> 这个配置类如何能被Spring配置类加载到，并创建DataSource对象在IOC容器中?
>
> 1. 不推荐，不知道用到了哪些配置
>
> ```java
> 在Spring的配置类上添加包扫描
> @Configuration
> @ComponentScan("com.itheima.config")
> public class SpringConfig {
> }
> @Configuration
> public class JdbcConfig {}
> ```
>
> 2. 使用`@Import`引入 推荐
>
> ```java
> @Configuration
> @Import({JdbcConfig.class})
> public class SpringConfig {
> }
> ```

### 注入资源@Value

使用@Value为第三方Bean注入资源

```java
public class JdbcConfig {
    @Value("com.mysql.jdbc.Driver")
    private String driver;
    @Value("jdbc:mysql://localhost:3306/spring_db")
    private String url;
    @Value("root")
    private String userName;
    @Value("password")
    private String password;

    @Bean
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName(driver);
        ds.setUrl(url);
        ds.setUsername(userName);
        ds.setPassword(password);
        return ds;
    }
}
```

也可以读取jdbc.properties进行注入

注入引用类型数据，例如在构建DataSource对象的时候，需要用到BookDao对象

```java
public class JdbcConfig {
    @Bean
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName("com.mysql.jdbc.Driver");
        ds.setUrl("jdbc:mysql://localhost:3306/spring_db");
        ds.setUsername("root");
        ds.setPassword("root");
        return ds;
    }
}
```

步骤：

1. 在SpringConfig中扫描BookDao,也就是说要让IOC容器中有一个bookDao对象

```java

@Configuration
@ComponentScan("com.itheima.dao")
@Import({JdbcConfig.class})
public class SpringConfig {
}
```

2. 在JdbcConfig方法里面加参数,容器会按类型自动装配

```java
@Bean
public DataSource dataSource(BookDao bookDao){
        System.out.println(bookDao);
        DruidDataSource ds=new DruidDataSource();
        ds.setDriverClassName(driver);
        ds.setUrl(url);
        ds.setUsername(userName);
        ds.setPassword(password);
        return ds;
        }
```

## Spring整合

### Spring整合Mybatis

1. 导包

```xml

<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.2.10.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>1.1.16</version>
    </dependency>

    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.6</version>
    </dependency>

    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.47</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>5.2.10.RELEASE</version>
    </dependency>

    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>1.3.0</version>
    </dependency>

</dependencies>
```

2. Spring配置类

```java
//配置类注解
@Configuration
//包扫描，主要扫描的是项目中的AccountServiceImpl类
@ComponentScan("com.itheima")
public class SpringConfig {
}
```

3. 创建数据源

```java
public class JdbcConfig {
    @Value("${jdbc.driver}")
    private String driver;
    @Value("${jdbc.url}")
    private String url;
    @Value("${jdbc.username}")
    private String userName;
    @Value("${jdbc.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName(driver);
        ds.setUrl(url);
        ds.setUsername(userName);
        ds.setPassword(password);
        return ds;
    }
}
```

4. 读取properties配置

```java

@Configuration
@ComponentScan("com.itheima")
@PropertySource("classpath:jdbc.properties")
@Import(JdbcConfig.class)
public class SpringConfig {
}
```

5. 创建Mybatis配置类并配置SqlSessionFactory

```java
public class MybatisConfig {
    //定义bean，SqlSessionFactoryBean，用于产生SqlSessionFactory对象
    @Bean
    public SqlSessionFactoryBean sqlSessionFactory(DataSource dataSource) {
        SqlSessionFactoryBean ssfb = new SqlSessionFactoryBean();
        //设置模型类的别名扫描
        ssfb.setTypeAliasesPackage("com.itheima.domain");
        //设置数据源
        ssfb.setDataSource(dataSource);
        return ssfb;
    }

    //定义bean，返回MapperScannerConfigurer对象
    @Bean
    public MapperScannerConfigurer mapperScannerConfigurer() {
        MapperScannerConfigurer msc = new MapperScannerConfigurer();
        msc.setBasePackage("com.itheima.dao");
        return msc;
    }
}
```

6. 导入Mybatis配置

```java

@Configuration
@ComponentScan("com.itheima")
@PropertySource("classpath:jdbc.properties")
@Import({JdbcConfig.class, MybatisConfig.class})
public class SpringConfig {
}
```

7. 测试

```java
public class App2 {
    public static void main(String[] args) {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
        AccountService accountService = ctx.getBean(AccountService.class);
        Account ac = accountService.findById(1);
        System.out.println(ac);
    }
}

```

### Spring整合Junit

1. 依赖

```xml

<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
    <scope>test</scope>
</dependency>

<dependency>
<groupId>org.springframework</groupId>
<artifactId>spring-test</artifactId>
<version>5.2.10.RELEASE</version>
</dependency>
```

2. 测试

```java
//设置类运行器
@RunWith(SpringJUnit4ClassRunner.class)
//设置Spring环境对应的配置类
@ContextConfiguration(classes = {SpringConfiguration.class}) //加载配置类
//@ContextConfiguration(locations={"classpath:applicationContext.xml"})//加载配置文件
public class AccountServiceTest {
    //支持自动装配注入bean
    @Autowired
    private AccountService accountService;

    @Test
    public void testFindById() {
        System.out.println(accountService.findById(1));

    }

    @Test
    public void testFindAll() {
        System.out.println(accountService.findAll());
    }
}
```



