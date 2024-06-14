---
title: SpringMvc笔记
date: 2023-05-14 09:50:02
category: 
  - Java
  - Spring
tag: 
  - Java
  - Spring
---

三层架构：

* web层主要由servlet来处理，负责页面请求和数据的收集以及响应结果给前端
* service层主要负责业务逻辑的处理
* dao层主要负责数据的增删改查操作

MVC设计模式：将其设计为`controller`、`view`和`Model`

* controller负责请求和数据的接收，接收后将其转发给service进行业务处理
* service根据需要会调用dao对数据进行增删改查
* dao把数据处理完后将结果交给service,service再交给controller
* controller根据需求组装成Model和View,Model和View组合起来生成页面转发给前端浏览器
* 这样做的好处就是controller可以处理多个请求，并对请求进行分发，执行不同的业务操作。

## 项目创建

1. 导入jar包

```xml
  <dependencies>
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <version>3.1.0</version>
      <scope>provided</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>5.2.10.RELEASE</version>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.tomcat.maven</groupId>
        <artifactId>tomcat7-maven-plugin</artifactId>
        <version>2.1</version>
        <configuration>
          <port>80</port>
          <path>/</path>
        </configuration>
      </plugin>
    </plugins>
  </build>
```

2. 创建配置类

```java
@Configuration
@ComponentScan("com.itheima.controller")
public class SpringMvcConfig {
}
```

3. 创建Controller类

```java
@Controller
public class UserController {
    
    @RequestMapping("/save")
    @ResponseBody  //不加默认是去找页面，找不到会报404，设置当前控制器方法响应内容为当前返回值，无需解析
    public String save(){
        System.out.println("user save ...");
        return "{'info':'springmvc'}";
    }
}

```

4. 使用配置类代替web.xml

```java
public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
    //加载springmvc配置类
    protected WebApplicationContext createServletApplicationContext() {
        //初始化WebApplicationContext对象
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        //加载指定配置类
        ctx.register(SpringMvcConfig.class);
        return ctx;
    }

    //设置由springmvc控制器处理的请求映射路径
    protected String[] getServletMappings() {
        return new String[]{"/"};//代表所拦截请求的路径规则，只有被拦截后才能交给SpringMVC来处理请求
    }

    //加载spring配置类
    protected WebApplicationContext createRootApplicationContext() {
        return null;
    }
}
```

> 问题：controller、service和dao这些类都需要被容器管理成bean对象，那么到底是该让SpringMVC加载还是让Spring加载呢?
>
> + SpringMVC加载其相关bean(表现层bean),也就是controller包下的类
> + Spring控制的bean
>   * 业务bean(Service)
>   * 功能bean(DataSource,SqlSessionFactoryBean,MapperScannerConfigurer等)
>
> 在SpringMvcConfig中扫描到的包为：@ComponentScan("com.itheima.controller")
>
> 在SpringConfig中扫描到的包为：@ComponentScan("com.itheima")
>
> 我们发现Spring会多把SpringMVC的controller类也扫描到，有如下解决方式：
>
> * 方式一:Spring加载的bean设定扫描范围为精准范围，例如service包、dao包等
>
> ```java
> @Configuration
> @ComponentScan({"com.itheima.service","comitheima.dao"})
> public class SpringConfig {
> }
> ```
>
> * 方式二:Spring加载的bean设定扫描范围为com.itheima,排除掉controller包中的bean
>
> ```java
> @Configuration
> @ComponentScan(value="com.itheima",
>     excludeFilters=@ComponentScan.Filter(
>     	type = FilterType.ANNOTATION,
>         classes = Controller.class
>     )
> )
> public class SpringConfig {
> }
> ```
>
> * 方式三:不区分Spring与SpringMVC的环境，加载到同一个环境中[了解即可]

有了Spring的配置类，要想在tomcat服务器启动将其加载，我们需要修改ServletContainersInitConfig

```java
public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
    protected WebApplicationContext createServletApplicationContext() {
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(SpringMvcConfig.class);
        return ctx;
    }
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
    protected WebApplicationContext createRootApplicationContext() {
      AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(SpringConfig.class);
        return ctx;
    }
}
```

上面这个代码有更简单的方式替代：

```java
public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {

    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{SpringConfig.class};
    }

    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{SpringMvcConfig.class};
    }

    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
}
```



## 请求与响应：

### 设置请求映射路径

对于Book模块的save,将其访问路径设置`http://localhost/book/save`

对于User模块的save,将其访问路径设置`http://localhost/user/save`

```java
@Controller
public class UserController {

    @RequestMapping("/user/save")
    @ResponseBody
    public String save(){
        System.out.println("user save ...");
        return "{'module':'user save'}";
    }
}

@Controller
public class BookController {
    @RequestMapping("/book/save")
    @ResponseBody
    public String save(){
        System.out.println("book save ...");
        return "{'module':'book save'}";
    }
}
```

这样太麻烦了，可以简单一点：

```java
@Controller
@RequestMapping("/user")
public class UserController {
    @RequestMapping("/save")
    @ResponseBody
    public String save(){
        System.out.println("user save ...");
        return "{'module':'user save'}";
    }
}

@Controller
@RequestMapping("/book")
public class BookController {
    @RequestMapping("/save")
    @ResponseBody
    public String save(){
        System.out.println("book save ...");
        return "{'module':'book save'}";
    }
}
```

### 请求参数

GET/POST请求发送单个参数: `http://localhost/commonParam?name=itcast`

```java
@Controller
public class UserController {
    @RequestMapping("/commonParam")
    @ResponseBody
    public String commonParam(String name){
        System.out.println("普通参数传递 name ==> "+name);
        return "{'module':'commonParam'}";
    }
}
```

GET请求发送多个请求参数：`http://localhost/commonParam?name=itcast&age=15`

```java
@Controller
public class UserController {
    @RequestMapping("/commonParam")
    @ResponseBody
    public String commonParam(String name,int age){
        System.out.println("普通参数传递 name ==> "+name);
        System.out.println("普通参数传递 age ==> "+age);
        return "{'module':'commonParam'}";
    }
}
```

> 如果GET请求参数中有中文,乱码解决：Tomcat8.5以后的版本已经处理了中文乱码的问题
>
> ```xml
> <build>
>     <plugins>
>       <plugin>
>         <groupId>org.apache.tomcat.maven</groupId>
>         <artifactId>tomcat7-maven-plugin</artifactId>
>         <version>2.1</version>
>         <configuration>
>           <port>80</port><!--tomcat端口号-->
>           <path>/</path> <!--虚拟目录-->
>           <uriEncoding>UTF-8</uriEncoding><!--访问路径编解码字符集-->
>         </configuration>
>       </plugin>
>     </plugins>
>   </build>
> ```
>
> 如果POST请求出现中文乱码：需要配置过滤器：
>
> ```java
> public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
>     protected Class<?>[] getRootConfigClasses() {
>         return new Class[0];
>     }
> 
>     protected Class<?>[] getServletConfigClasses() {
>         return new Class[]{SpringMvcConfig.class};
>     }
> 
>     protected String[] getServletMappings() {
>         return new String[]{"/"};
>     }
> 
>     //乱码处理
>     @Override
>     protected Filter[] getServletFilters() {
>         CharacterEncodingFilter filter = new CharacterEncodingFilter();
>         filter.setEncoding("UTF-8");
>         return new Filter[]{filter};
>     }
> }
> ```

### 五种类型参数传递

#### 普通参数

url地址传参，地址参数名与形参变量名相同，定义形参即可接收参数。

请求：`http://localhost/commonParamDifferentName?name=张三&age=18`

后台：

```java
@RequestMapping("/commonParamDifferentName")
@ResponseBody
public String commonParamDifferentName(String userName , int age){
    System.out.println("普通参数传递 userName ==> "+userName);
    System.out.println("普通参数传递 age ==> "+age);
    return "{'module':'common param different name'}";
}
```

此时的userName与前端不对应，需要使用@RequestParam注解

```java
@RequestMapping("/commonParamDifferentName")
    @ResponseBody
    public String commonParamDifferentName(@RequestPaam("name") String userName , int age){
        System.out.println("普通参数传递 userName ==> "+userName);
        System.out.println("普通参数传递 age ==> "+age);
        return "{'module':'common param different name'}";
    }
```



#### POJO参数

User类

```java
public class User {
    private String name;
    private int age;
}
```

前端请求：

![image-20230514122607238](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305141226289.png)

后端：

```java
//POJO参数：请求参数与形参对象中的属性对应即可完成参数传递
@RequestMapping("/pojoParam")
@ResponseBody
public String pojoParam(User user){
    System.out.println("pojo参数传递 user ==> "+user);
    return "{'module':'pojo param'}";
}
```

> 请求参数key的名称要和POJO中属性的名称一致，否则无法封装。

#### 嵌套POJO类型参数

Adress类和User类

```java
public class Address {
    private String province;
    private String city;
}
public class User {
    private String name;
    private int age;
    private Address address;
}
```

前端请求：

![image-20230514122743477](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305141227509.png)

后端：

```java
//POJO参数：请求参数与形参对象中的属性对应即可完成参数传递
@RequestMapping("/pojoParam")
@ResponseBody
public String pojoParam(User user){
    System.out.println("pojo参数传递 user ==> "+user);
    return "{'module':'pojo param'}";
}
```

#### 数组类型参数

前端：

![image-20230514122855885](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305141231983.png)

后端：

```java
  //数组参数：同名请求参数可以直接映射到对应名称的形参数组对象中
    @RequestMapping("/arrayParam")
    @ResponseBody
    public String arrayParam(String[] likes){
        System.out.println("数组参数传递 likes ==> "+ Arrays.toString(likes));
        return "{'module':'array param'}";
    }
```

#### 集合类型参数

前端：

![image-20230514123303906](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305141233951.png)

后端：

```java
//集合参数：同名请求参数可以使用@RequestParam注解映射到对应名称的集合对象中作为数据
@RequestMapping("/listParam")
@ResponseBody
public String listParam(List<String> likes){
    System.out.println("集合参数传递 likes ==> "+ likes);
    return "{'module':'list param'}";
}
```

这样做会报错，因为SpringMVC会将List看做是POJO对象，但是List接口无法创建对象，可以使用@RequestParam注解

```java
//集合参数：同名请求参数可以使用@RequestParam注解映射到对应名称的集合对象中作为数据
@RequestMapping("/listParam")
@ResponseBody
public String listParam(@RequestParam List<String> likes){
    System.out.println("集合参数传递 likes ==> "+ likes);
    return "{'module':'list param'}";
}
```

### JSON格式数据传输

#### JSON普通数组

1. SpringMVC默认使用的是jackson来处理json的转换，所以需要在pom.xml添加jackson依赖

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.9.0</version>
</dependency>
```

2. 开启SpringMVC注解支持

```java
@Configuration
@ComponentScan("com.itheima.controller")
//开启json数据类型自动转换
@EnableWebMvc
public class SpringMvcConfig {
}
```

3. 参数前添加@RequestBody

```java
//使用@RequestBody注解将外部传递的json数组数据映射到形参的集合对象中作为数据
@RequestMapping("/listParamForJson")
@ResponseBody
public String listParamForJson(@RequestBody List<String> likes){
    System.out.println("list common(json)参数传递 list ==> "+likes);
    return "{'module':'list common for json param'}";
}
```

![image-20230514125100513](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305141251554.png)

#### JSON对象数据

前端：

![image-20230514125233054](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305141252081.png)

后端：

```java
@RequestMapping("/pojoParamForJson")
@ResponseBody
public String pojoParamForJson(@RequestBody User user){
    System.out.println("pojo(json)参数传递 user ==> "+user);
    return "{'module':'pojo for json param'}";
}
```

#### JSON对象数组

前端：

![image-20230514125427497](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305141254528.png)

后端：

```java
@RequestMapping("/listPojoParamForJson")
@ResponseBody
public String listPojoParamForJson(@RequestBody List<User> list){
    System.out.println("list pojo(json)参数传递 list ==> "+list);
    return "{'module':'list pojo for json param'}";
}
```

### 日期参数传递

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date)
    System.out.println("参数传递 date ==> "+date);
    return "{'module':'data param'}";
}
```

默认这种格式可以：``http://localhost/dataParam?date=2088/08/08``

其他格式：

前端：`http://localhost/dataParam?date=2088/08/08&date1=2088-08-08`

后端：

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date,Date date1)
    System.out.println("参数传递 date ==> "+date);
    return "{'module':'data param'}";
}
```

此时会报错，需要进行日期格式的转换：

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date, @DateTimeFormat(pattern="yyyy-MM-dd") Date date1)
    System.out.println("参数传递 date ==> "+date);
	System.out.println("参数传递 date1(yyyy-MM-dd) ==> "+date1);
    return "{'module':'data param'}";
}
```

携带时间的日期：

前端：`http://localhost/dataParam?date=2088/08/08&date1=2088-08-08&date2=2088/08/08 8:08:08`

后端：

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date,
                        @DateTimeFormat(pattern="yyyy-MM-dd") Date date1,
                        @DateTimeFormat(pattern="yyyy/MM/dd HH:mm:ss") Date date2)
    System.out.println("参数传递 date ==> "+date);
	System.out.println("参数传递 date1(yyyy-MM-dd) ==> "+date1);
	System.out.println("参数传递 date2(yyyy/MM/dd HH:mm:ss) ==> "+date2);
    return "{'module':'data param'}";
}
```

### 响应

#### 响应页面

不加@ResponseBody，默认是返回jsp页面

```java
@Controller
public class UserController {
    
    @RequestMapping("/toJumpPage")
    //注意
    //1.此处不能添加@ResponseBody,如果加了该注入，会直接将page.jsp当字符串返回前端
    //2.方法需要返回String
    public String toJumpPage(){
        System.out.println("跳转页面");
        return "page.jsp";
    }
}
```

返回文本数据：

```java
@Controller
public class UserController {
    
   	@RequestMapping("/toText")
	//注意此处该注解就不能省略，如果省略了,会把response text当前页面名称去查找，如果没有回报404错误
    @ResponseBody
    public String toText(){
        System.out.println("返回纯文本数据");
        return "response text";
    }
}
```

响应JSON数据：

```java
@Controller
public class UserController {
    
    @RequestMapping("/toJsonPOJO")
    @ResponseBody
    public User toJsonPOJO(){
        System.out.println("返回json对象数据");
        User user = new User();
        user.setName("itcast");
        user.setAge(15);
        return user;
    } 
}
```

> 需要依赖@ResponseBody注解和@EnableWebMvc注解

响应POJO集合对象

```java
@Controller
public class UserController {
    
    @RequestMapping("/toJsonList")
    @ResponseBody
    public List<User> toJsonList(){
        System.out.println("返回json集合数据");
        User user1 = new User();
        user1.setName("传智播客");
        user1.setAge(15);

        User user2 = new User();
        user2.setName("黑马程序员");
        user2.setAge(12);

        List<User> userList = new ArrayList<User>();
        userList.add(user1);
        userList.add(user2);

        return userList;
    }   
}
```

> 此处使用到了类型转换，内部还是通过Converter接口的实现类完成的,它还可以实现:
>
> * 对象转Json数据(POJO -> json)
> * 集合转Json数据(Collection -> json)

## REST风格

按照不同的请求方式代表不同的操作类型。

* 发送GET请求是用来做查询
* 发送POST请求是用来做新增
* 发送PUT请求是用来做修改
* 发送DELETE请求是用来做删除

UserController

```java
@Controller
public class UserController {
	@RequestMapping("/save")
    @ResponseBody
    public String save(@RequestBody User user) {
        System.out.println("user save..."+user);
        return "{'module':'user save'}";
    }

    @RequestMapping("/delete")
    @ResponseBody
    public String delete(Integer id) {
        System.out.println("user delete..." + id);
        return "{'module':'user delete'}";
    }

    @RequestMapping("/update")
    @ResponseBody
    public String update(@RequestBody User user) {
        System.out.println("user update..." + user);
        return "{'module':'user update'}";
    }

    @RequestMapping("/getById")
    @ResponseBody
    public String getById(Integer id) {
        System.out.println("user getById..." + id);
        return "{'module':'user getById'}";
    }

    @RequestMapping("/findAll")
    @ResponseBody
    public String getAll() {
        System.out.println("user getAll...");
        return "{'module':'user getAll'}";
    }
}
```

将上面代码更换RESTful风格如下：

新增：请求路径更改为`/users`,请求方式为POST

```java
	//设置当前请求方法为POST，表示REST风格中的添加操作
    @RequestMapping(value = "/users",method = RequestMethod.POST)
    @ResponseBody
    public String save() {
        System.out.println("user save...");
        return "{'module':'user save'}";
    }
```

删除：这里在删除时需要携带路径参数，例如`http://localhost/users/1`

+ 修改@RequestMapping的value属性，将其中修改为`/users/{id}`，目的是和路径匹配
+ 在方法的形参前添加@PathVariable注解

```java
@Controller
public class UserController {
    //设置当前请求方法为DELETE，表示REST风格中的删除操作
	@RequestMapping(value = "/users/{id}",method = RequestMethod.DELETE)
    @ResponseBody
    public String delete(@PathVariable Integer id) {
        System.out.println("user delete..." + id);
        return "{'module':'user delete'}";
    }
}
```

多个参数：例如：`http://localhost/users/1/tom`

```java
@Controller
public class UserController {
    //设置当前请求方法为DELETE，表示REST风格中的删除操作
	@RequestMapping(value = "/users/{id}/{name}",method = RequestMethod.DELETE)
    @ResponseBody
    public String delete(@PathVariable Integer id,@PathVariable String name) {
        System.out.println("user delete..." + id+","+name);
        return "{'module':'user delete'}";
    }
}
```

还可以更简单,如下进行增删改查操作：

```java
@RestController //@Controller + ReponseBody
@RequestMapping("/books")
public class BookController {
    @PostMapping
    public String save(@RequestBody Book book){
        System.out.println("book save..." + book);
        return "{'module':'book save'}";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id){
        System.out.println("book delete..." + id);
        return "{'module':'book delete'}";
    }

    @PutMapping
    public String update(@RequestBody Book book){
        System.out.println("book update..." + book);
        return "{'module':'book update'}";
    }

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println("book getById..." + id);
        return "{'module':'book getById'}";
    }
    @GetMapping
    public String getAll(){
        System.out.println("book getAll...");
        return "{'module':'book getAll'}";
    }    
}
```





## SpringMVC放行静态资源：

```java
@Configuration
public class SpringMvcSupport extends WebMvcConfigurationSupport {
    //设置静态资源访问过滤，当前类需要设置为配置类，并被扫描加载
    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        //当访问/pages/????时候，从/pages目录下查找内容
        registry.addResourceHandler("/pages/**").addResourceLocations("/pages/");
        registry.addResourceHandler("/js/**").addResourceLocations("/js/");
        registry.addResourceHandler("/css/**").addResourceLocations("/css/");
        registry.addResourceHandler("/plugins/**").addResourceLocations("/plugins/");
    }
}
```

然后进行扫描到这个类：

```java
@Configuration
@ComponentScan({"com.itheima.controller","com.itheima.config"})
@EnableWebMvc
public class SpringMvcConfig {
}

或者

@Configuration
@ComponentScan("com.itheima")
@EnableWebMvc
public class SpringMvcConfig {
}
```

