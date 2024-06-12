---
title: Mybatis-Plus
date: 2023-11-17
category:
  - Java
  - Mybatis-plus
tag:
  - Java
  - Mybatis-Plus
---
# Mybatis-Plus

官网：[Mybatis-plus官网](https://baomidou.com/)

## 快速入门

引入依赖，替换掉mybatis
```xml
<!--        <dependency>-->
<!--            <groupId>org.mybatis.spring.boot</groupId>-->
<!--            <artifactId>mybatis-spring-boot-starter</artifactId>-->
<!--            <version>2.3.1</version>-->
<!--        </dependency>-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.5.3.2</version>
        </dependency>
```

让我们原来的mapper即成mybatis的baseMapper
```java
public interface UserMapper extends BaseMapper<User>
```

测试：
```java
@SpringBootTest
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    void testInsert() {
        User user = new User();
        user.setId(5L);
        user.setUsername("Lucy");
        user.setPassword("123");
        user.setPhone("18688990011");
        user.setBalance(200);
        user.setInfo("{\"age\": 24, \"intro\": \"英文老师\", \"gender\": \"female\"}");
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        userMapper.insert(user);
    }

    @Test
    void testSelectById() {
        User user = userMapper.selectById(5L);
        System.out.println("user = " + user);
    }


    @Test
    void testQueryByIds() {
        List<User> users = userMapper.selectBatchIds(List.of(1L, 2L, 3L, 4L));
        users.forEach(System.out::println);
    }

    @Test
    void testUpdateById() {
        User user = new User();
        user.setId(5L);
        user.setBalance(20000);
        userMapper.updateById(user);
    }

    @Test
    void testDeleteUser() {
        userMapper.deleteById(5L);
    }
}
```

### 常见注解

#### @TableName
> 用来标注表名和实体类名的对应关系

| 属性             | 类型     | 必须指定 | 默认值 | 描述                                                         |
| ---------------- | -------- | -------- | ------ | ------------------------------------------------------------ |
| value            | String   | 否       | ""     | 表名                                                         |
| schema           | String   | 否       | ""     | schema                                                       |
| keepGlobalPrefix | boolean  | 否       | false  | 是否保持使用全局的 tablePrefix 的值（当全局 tablePrefix 生效时） |
| resultMap        | String   | 否       | ""     | xml 中 resultMap 的 id（用于满足特定类型的实体类对象绑定）   |
| autoResultMap    | boolean  | 否       | false  | 是否自动构建 resultMap 并使用（如果设置 resultMap 则不会进行 resultMap 的自动构建与注入） |
| excludeProperty  | String[] | 否       | {}     | 需要排除的属性名 @since 3.3.1                                |

![image-20231117142810737](https://s2.loli.net/2023/11/17/AGuJURB3OsSTx65.webp)

#### @TableId

> 用来标识实体类中的主键，如上图中的 id

#### @TableField

> 普通字段注解和 数据库对应,一般不需要加 ，一些特殊情况需要：
>
> - 成员变量名与数据库字段名不一致
> - 成员变量是以`isXXX`命名，按照`JavaBean`的规范，`MybatisPlus`识别字段时会把`is`去除，这就导致与数据库不符。
> - 成员变量名与数据库一致，但是与数据库的关键字冲突。使用`@TableField`注解给字段名添加转义字符：````

### 常用配置

连接：https://www.baomidou.com/pages/56bac0/#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE

```yaml
mybatis-plus:
  type-aliases-package: com.itheima.mp.domain.po
  mapper-locations: "classpath*:/mapper/**/*.xml" # Mapper.xml文件地址，当前这个是默认值。
  global-config:
    db-config:
      id-type: auto # 全局id类型为自增长
```

> + type-aliases-package:  MyBaits 别名包扫描路径，通过该属性可以给包中的类注册别名，注册后在 Mapper 对应的 XML 文件中可以直接使用类名，而不用使用全限定的类名(即 XML 中调用的时候不用包含包名)
> + mapper-locations ：MyBatis Mapper 所对应的 XML 文件位置，如果您在 Mapper 中有自定义方法(XML 中有自定义实现)，需要进行该配置，告诉 Mapper 所对应的 XML 文件位置

## 核心功能

### 条件构造器

#### QueryWrapper

+ 例子：查询出名字中带`o`的，存款大于等于1000元的人。
  手写sql如下：

  ```sql
  select id, username, info, balance
  from tb_user
  where username like '%o%'
    and balance > 1000
  ```

  使用querywrapper
  ```java
      @Test
      void testQueryWrapper() {
          QueryWrapper<User> queryWrapper = new QueryWrapper<>();
          queryWrapper.select("id", "username", "info", "balance")
                  .like("username", "o")
                  .ge("balance", 1000);
          List<User> users = userMapper.selectList(queryWrapper);
          users.forEach(System.out::println);
      }
  ```

+ 更新用户名为jack的用户的余额为2000
  手写sql：

  ```sql
  update  tb_user set  balance =2000 where  username ='jack'
  ```

  使用querywrapper
  ```java
      @Test
      void testUpdateByQueryWrapper(){
          User user = new User();
          user.setBalance(2000);
          QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
          userQueryWrapper.eq("username","jack");
          userMapper.update(user,userQueryWrapper);
      }
  ```

#### UpdateWrapper

> 基于baseMapper中的update方法更新指南直接赋值，对复杂的需求难以实现

+ 需求：更新id为`1,2,4`的用户的余额，扣200
  手写sql：

  ```sql
  update tb_user
  set balance =balance - 200
  where id in (1, 2, 4)
  ```

  Java代码：

  ```java
      @Test
      void testUpdateWrapper() {
          List<Long> ids = List.of(1L, 2L, 4L);
          UpdateWrapper<User> userUpdateWrapper = new UpdateWrapper<>();
          userUpdateWrapper.setSql("balance=balance-200")
                  .in("id", ids);
          userMapper.update(null, userUpdateWrapper);
      }
  ```

#### LambdaQueryWrapper

> QueryWrapper和UpdateWrapper在构造条件的时候都需要写死字段名称，会出现字符串`魔法值`
>
> 可以利用基于变量的getter方法和反射技术实现

```java
    @Test
    void testLambdaWrapper() {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.select(User::getId, User::getUsername, User::getInfo, User::getBalance)
                .like(User::getUsername, "o")
                .ge(User::getBalance, 1000);
        List<User> users = userMapper.selectList(queryWrapper);
        users.forEach(System.out::println);
    }
```

### 自定义SQL

利用自定义sql可以构造一些复杂的where条件
Java代码：

```java
    @Test
    void testCustomSqlUpdate() {
        List<Long> ids = List.of(1L, 2L, 4L);
        int amount = 200;
        QueryWrapper<User> wrapper = new QueryWrapper<User>().in("id", ids);
        //调用自定义的sql方法
        userMapper.updateBalanceByIds(wrapper,amount);
    }
```

Mapper代码：

> . @Param(Constants.WRAPPER) 里面必须为“ew”

```java
    void updateBalanceByIds(@Param(Constants.WRAPPER) QueryWrapper<User> wrapper, int amount);

```

xml文件中：
```xml
    <update id="updateBalanceByIds">
        update  tb_user set balance= balance- #{amount} ${ew.customSqlSegment}
    </update>
```

### IService接口

![image-20231117153940630](https://s2.loli.net/2023/11/17/GLV2K5UCsrFAIxc.webp)

通用接口为`IService`，默认实现为`ServiceImpl`，其中封装的方法可以分为以下几类：

- `save`：新增
- `remove`：删除
- `update`：更新
- `get`：查询单个结果
- `list`：查询集合结果
- `count`：计数
- `page`：分页查询

用法：
创建service接口：

```java
public interface UserService extends IService<User> {
}
```

实现类：
```java
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
        implements UserService {
}
```

测试：
```java
@SpringBootTest
class UserServiceImplTest {

    @Resource
    private UserService userService;

    @Test
    void testAddUser() {
        User user = new User();
        user.setUsername("Lucy");
        user.setPassword("123");
        user.setPhone("18688990011");
        user.setBalance(200);
        user.setInfo("{\"age\": 24, \"intro\": \"英文老师\", \"gender\": \"female\"}");
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        userService.save(user);
    }

    @Test
    void testQuery(){
        List<Integer> ids = List.of(1, 2, 4);
        List<User> users = userService.listByIds(ids);
        users.forEach(System.out::println);
    }
}
```

具体到实际请求编写：
控制器：

```java

@RestController
@Api(tags = "用户管理接口")
@RequestMapping("/user")
@RequiredArgsConstructor // 需要的构造函数
public class UserController {
    private  final UserService userService;

    @PostMapping
    @ApiOperation("新增用户")
    public void saveUser(@RequestBody UserFormDTO userFormDTO) {
        userService.save(BeanUtil.copyProperties(userFormDTO, User.class));
    }

    @DeleteMapping("/{id}")
    @ApiOperation("删除用户")
    public void removeById(@PathVariable("id") Long userId) {
        userService.removeById(userId);
    }

    @GetMapping("/{id}")
    @ApiOperation("根据id查询用户")
    public UserVO queryUserById(@PathVariable("id") Long userId) {
        User user = userService.getById(userId);
        return BeanUtil.copyProperties(user, UserVO.class);
    }

    @GetMapping
    @ApiOperation("根据id集合查询用户")
    public List<UserVO> queryUserByIds(@RequestParam("ids") List<Long> ids) {
        List<User> users = userService.listByIds(ids);
        return BeanUtil.copyToList(users, UserVO.class);
    }
    @PutMapping("{id}/deduction/{money}")
    @ApiOperation("扣减用户余额")
    public void deductBalance(@PathVariable("id") Long id, @PathVariable("money")Integer money){
        userService.deductBalance(id, money);
    }
}
```

业务逻辑：
```java
    @Resource
    private UserMapper userMapper;
    @Override
    public void deductBalance(Long id, Integer money) {
        User user = this.getById(id);
        if (user==null||user.getStatus()==2){
            throw new RuntimeException("用户状态异常");
        }
        if (user.getBalance()<money){
            throw new RuntimeException("用户余额不足");
        }
        userMapper.deductMoneyById(id,money);
    }
```

Mapper:
```java
@Update("update  tb_user set balance=balance-#{money} where id=#{id}")
void deductMoneyById(@Param("id") Long id,@Param("money") Integer money);
```

#### 使用lambda方法：

> 实现一个根据复杂条件查询用户的接口，查询条件如下：
>
> - name：用户名关键字，可以为空
> - status：用户状态，可以为空
> - minBalance：最小余额，可以为空
> - maxBalance：最大余额，可以为空

```java
    /**
    * 使用LambdaQueryWrapper
    */
    @GetMapping("/list")
    @ApiOperation("根据id集合查询用户")
    public List<UserVO> queryUsers(UserQuery query) {
        String username = query.getName();
        Integer status = query.getStatus();
        Integer minBalance = query.getMinBalance();
        Integer maxBalance = query.getMaxBalance();
        LambdaQueryWrapper<User> wrapper = new QueryWrapper<User>().lambda()
                .like(username != null, User::getUsername, username)
                .eq(status != null, User::getStatus, status)
                .ge(minBalance != null, User::getBalance, minBalance)
                .le(maxBalance != null, User::getBalance, maxBalance);
        List<User> users = userService.list(wrapper);
        return BeanUtil.copyToList(users, UserVO.class);
    }
```

例如like的第一个参数都是条件判断，当条件成立时才会添加这个查询条件，类似Mybatis的mapper.xml文件中的`<if>`标签。这样就实现了动态查询条件效果了。
Service中对`LambdaQueryWrapper`和`LambdaUpdateWrapper`的用法进一步做了简化。我们无需自己通过`new`的方式来创建`Wrapper`，而是直接调用`lambdaQuery`和`lambdaUpdate`方法：

```java
    /**
     * 直接调用lambdaQuery
     */
    @GetMapping("/list")
    @ApiOperation("根据id集合查询用户")
    public List<UserVO> queryUsers(UserQuery query) {
        String username = query.getName();
        Integer status = query.getStatus();
        Integer minBalance = query.getMinBalance();
        Integer maxBalance = query.getMaxBalance();
        List<User> users = userService.lambdaQuery()
                .like(username != null, User::getUsername, username)
                .eq(status != null, User::getStatus, status)
                .ge(minBalance != null, User::getBalance, minBalance)
                .le(maxBalance != null, User::getBalance, maxBalance)
                .list();
        return BeanUtil.copyToList(users, UserVO.class);
    }
```

可以发现lambdaQuery方法中除了可以构建条件，还需要在链式编程的最后添加一个`list()`，这是在告诉MP我们的调用结果需要是一个list集合。这里不仅可以用`list()`，可选的方法有：

- `.one()`：最多1个结果
- `.list()`：返回集合结果
- `.count()`：返回计数结果

MybatisPlus会根据链式编程的最后一个方法来判断最终的返回结果。

#### 使用lambdaUpdate

> 改造根据id修改用户余额的接口，要求如下
>
> - 如果扣减后余额为0，则将用户status修改为冻结状态（2）

```java
    @Override
    @Transactional
    public void deductBalance(Long id, Integer money) {
        User user = this.getById(id);
        if (user == null || user.getStatus() == 2) {
            throw new RuntimeException("用户状态异常");
        }
        if (user.getBalance() < money) {
            throw new RuntimeException("用户余额不足");
        }
        int remainBalance = user.getBalance() - money;
        this.lambdaUpdate()
                .set(User::getBalance, remainBalance)
                .set(remainBalance == 0, User::getStatus, 2)
                .eq(User::getId, id)
                .eq(User::getBalance, user.getBalance()) //乐观锁
                .update();
    }
```

> 乐观锁：
>
> 这段代码使用了一个条件，即在更新数据库记录时，要求数据库中的记录必须满足两个条件才能成功更新：
>
> 1. `User::getId` 等于给定的 `id`：这是为了确保我们只更新指定用户的记录。
> 2. `User::getBalance` 等于原始用户对象中的余额值 `user.getBalance()`：这是乐观锁的关键条件。
>
> 乐观锁是一种并发控制机制，用于处理多个并发事务同时访问相同数据的情况。在这种机制下，不是使用传统的悲观锁（例如数据库锁定整个记录），而是在数据记录中添加一个版本号或时间戳字段，用于标识数据的版本。在进行数据更新时，每个事务都会检查这个版本号或时间戳字段，以确保在它们之间没有其他并发事务对同一数据记录进行了更改。
>
> 在代码中，乐观锁的实现方式是检查用户的余额是否与初始查询时的余额相同。如果余额不同，说明在查询和更新之间有其他事务修改了用户的余额，那么当前事务会失败，不会执行更新操作。这就是乐观锁的核心思想：通过检查某个数据的版本或状态来判断是否可以执行更新操作，而不是锁定整个数据记录。
>
> 使用乐观锁可以提高系统的并发性能，因为不需要在整个事务期间锁定数据记录，而只是在更新时检查数据的版本或状态。但是需要注意，如果有多个并发事务同时尝试更新同一条数据，其中一个事务会成功，而其他事务可能需要重新尝试或处理更新失败的情况。

#### 批量新增

如果一个一个新增，耗时为24s左右：
```java
    @Test
    void testSaveOneByOne() {
        long b = System.currentTimeMillis();
        for (int i = 1; i <= 100000; i++) {
            userService.save(buildUser(i));
        }
        long e = System.currentTimeMillis();
        System.out.println("耗时：" + (e - b));
    }

    private User buildUser(int i) {
        User user = new User();
        user.setUsername("user_" + i);
        user.setPassword("123");
        user.setPhone("" + (18688190000L + i));
        user.setBalance(2000);
        user.setInfo("{\"age\": 24, \"intro\": \"英文老师\", \"gender\": \"female\"}");
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(user.getCreateTime());
        return user;
    }
```

![image-20231117213214348](https://s2.loli.net/2023/11/17/X3uyvCs7RJISxjr.webp)

使用批量删除,耗时在8s左右

```java
    @Test
    void testSaveBatch() {
        // 准备10万条数据
        List<User> list = new ArrayList<>(1000);
        long b = System.currentTimeMillis();
        for (int i = 1; i <= 100000; i++) {
            list.add(buildUser(i));
            // 每1000条批量插入一次
            if (i % 1000 == 0) {
                userService.saveBatch(list);
                list.clear();
            }
        }
        long e = System.currentTimeMillis();
        System.out.println("耗时：" + (e - b));
    }
```

![image-20231117213606274](https://s2.loli.net/2023/11/17/ROA7wkE26SrxzJH.webp)

MyBatis Plus 的批处理确实是基于 Prepared Statement 的预编译模式，并且它将多个插入操作一起批量提交给数据库。这种批处理方式可以减少与数据库的通信次数，从而提高数据插入的效率
```sql
Preparing: INSERT INTO user ( username, password, phone, info, balance, create_time, update_time ) VALUES ( ?, ?, ?, ?, ?, ?, ? )
Parameters: user_1, 123, 18688190001, "", 2000, 2023-07-01, 2023-07-01
Parameters: user_2, 123, 18688190002, "", 2000, 2023-07-01, 2023-07-01
Parameters: user_3, 123, 18688190003, "", 2000, 2023-07-01, 2023-07-01
```

如果想要得到最佳性能，最好是将多条SQL合并为一条
```sql
INSERT INTO user ( username, password, phone, info, balance, create_time, update_time )
VALUES 
(user_1, 123, 18688190001, "", 2000, 2023-07-01, 2023-07-01),
(user_2, 123, 18688190002, "", 2000, 2023-07-01, 2023-07-01),
(user_3, 123, 18688190003, "", 2000, 2023-07-01, 2023-07-01),
(user_4, 123, 18688190004, "", 2000, 2023-07-01, 2023-07-01);
```

可以在客户端连接的时候加上一个参数`rewriteBatchedStatements` 连接：[链接](https://security.feishu.cn/link/safety?target=https%3A%2F%2Fdev.mysql.com%2Fdoc%2Fconnector-j%2F8.0%2Fen%2Fconnector-j-connp-props-performance-extensions.html%23cj-conn-prop_rewriteBatchedStatements&scene=ccm&logParams=%7B%22location%22%3A%22ccm_docs%22%7D&lang=zh-CN)
```yml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/demo?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai&rewriteBatchedStatements=true
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 12345678
```

此时只需要4s

![image-20231117214417782](https://s2.loli.net/2023/11/17/2TEiMOGUB5AkVNv.webp)

## 扩展功能

### 代码生成器

按照mybatisplus插件：

![image-20231117215107420](https://s2.loli.net/2023/11/17/DbuaEwpYG4AxKrd.webp)

连接数据库：

![image-20231117215157671](https://s2.loli.net/2023/11/17/YxSoURwvXLWEz23.webp)

生成代码：

![image-20231117221832311](https://s2.loli.net/2023/11/17/52QwA3Y6LMvinFB.webp)



### Db静态工具

> Service之间也会相互调用，为了避免出现循环依赖问题，MybatisPlus提供一个静态工具类：`Db`，其中的一些静态方法与`IService`中方法签名基本一致，也可以帮助我们实现CRUD功能
>
>  需求：改造根据id用户查询的接口，查询用户的同时返回用户收货地址列表

```java
    @GetMapping("/{id}")
    @ApiOperation("根据id查询用户")
    public UserVO queryUserById(@PathVariable("id") Long userId) {
        // 1.查询用户
        User user = userService.getById(userId);
        if (user == null) {
            return null;
        }
        // 2.查询收货地址
        List<Address> addresses = Db.lambdaQuery(Address.class)
                .eq(Address::getUserId, userId)
                .list();
        // 3.处理vo
        UserVO userVO = BeanUtil.copyProperties(user, UserVO.class);
        userVO.setAddressVO(BeanUtil.copyToList(addresses, AddressVO.class));
        return userVO;
    }
```

> 在查询地址时，我们采用了Db的静态方法，因此避免了注入AddressService，减少了循环依赖的风险(Address里面注入userService)

>根据id批量查询用户，并查询出用户对应的所有地址

```java
    @GetMapping
    @ApiOperation("根据id集合查询用户")
    public List<UserVO> queryUserByIds(@RequestParam("ids") List<Long> ids) {
        List<User> users = userService.listByIds(ids);
        if (CollUtil.isEmpty(users)) {
            return Collections.emptyList();
        }
        List<Long> userIds = users.stream().map(User::getId).collect(Collectors.toList());
        List<Address> addresses = Db.lambdaQuery(Address.class).in(Address::getId, userIds).list();
        List<AddressVO> addressVOList = BeanUtil.copyToList(addresses, AddressVO.class);
        //用户地址分组，相同用户的放在一个集合中
        Map<Long, List<AddressVO>> addressMap = new HashMap<>(0);
        if (CollUtil.isNotEmpty(addressVOList)) {
            addressMap = addressVOList.stream().collect(Collectors.groupingBy(AddressVO::getUserId));
        }

        //转为VO返回
        ArrayList<UserVO> list = new ArrayList<>(users.size());
        for (User user : users) {
            UserVO userVO = BeanUtil.copyProperties(user, UserVO.class);
            list.add(userVO);
            userVO.setAddressVO(addressMap.get(user.getId()));
        }
        return list;
    }
```

### 逻辑删除

逻辑删除是一种数据库管理和数据保留的方法，与物理删除不同，它不会立即从数据库中删除数据记录，而是通过标记数据记录为已删除或不可见的状态，以便稍后可以恢复或保留数据。

> 一般设置一个字段 例如is_delete :0-未删除，1-删除

配置：
```yml
mybatis-plus:
  type-aliases-package: com.itheima.mp.domain.po
  mapper-locations: "classpath*:/mapper/**/*.xml" # Mapper.xml文件地址，当前这个是默认值。
  global-config:
    db-config:
      id-type: auto # 全局id类型为自增长
      logic-delete-field: deleted # 全局逻辑删除的实体字段名(since 3.3.0,配置后可以忽略不配置步骤2)
      logic-delete-value: 1 # 逻辑已删除值(默认为 1)
      logic-not-delete-value: 0 # 逻辑未删除值(默认为 0)
```

```java
    @Test
    void testDeleteByLogic() {
        // 删除方法与以前没有区别
        addressService.removeById(59L);
        List<Address> addresses = addressService.list();
        addresses.forEach(System.out::println);
    }
```



### 枚举处理器

定义一个枚举类：

```java
@Getter
public enum UserStatus {
    NORMAL(1, "正常"),
    FREEZE(2, "冻结")
    ;
    @EnumValue //意思是这个根数据库对应
    private final int value;
    @JsonValue //给前端的是这个值， 正常/冻结
    private final String desc;

    UserStatus(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }
}
```

> 上面需要加EnumValue 注解，表示这个字段的值和数据库对应

修改用户类型：

```java
    /**
     * 使用状态（1正常 2冻结）
     */
    private UserStatus status;
```

配置：
```yml
mybatis-plus:
  configuration:
    default-enum-type-handler: com.baomidou.mybatisplus.core.handlers.MybatisEnumTypeHandler
```

### JSON类型处理器

数据库的user表的info字段是json格式，实体类中是String格式

![image-20231117230454185](https://s2.loli.net/2023/11/17/bWTMIVwsv2uFURp.webp)

+ 读取info中的属性时就非常不方便。如果要方便获取，info的类型最好是一个`Map`或者实体类。
+ 如果把`info`改为`对象`类型，就需要在写入数据库时手动转为`String`，再读取数据库时，手动转换为`对象`，这会非常麻烦。
+ MybatisPlus提供了很多特殊类型字段的类型处理器，解决特殊字段类型与数据库类型转换的问题。例如处理JSON就可以使用`JacksonTypeHandler`处理器。

创建UserInfo类：
```java
@Data
@NoArgsConstructor
@AllArgsConstructor(staticName = "of")
public class UserInfo {
    private Integer age;
    private String intro;
    private String gender;
}
```

开启自动结果映射：

```java
@Data
@TableName(value = "tb_user",autoResultMap = true)
public class User {
    @TableField(typeHandler = JacksonTypeHandler.class)
    private UserInfo info;

}

```

1. autoResultMap = true
2.  @TableField(typeHandler = JacksonTypeHandler.class)

## 插件功能

MybatisPlus提供了很多的插件功能，进一步拓展其功能。目前已有的插件有：

- `PaginationInnerInterceptor`：自动分页
- `TenantLineInnerInterceptor`：多租户
- `DynamicTableNameInnerInterceptor`：动态表名
- `OptimisticLockerInnerInterceptor`：乐观锁
- `IllegalSQLInnerInterceptor`：sql 性能规范
- `BlockAttackInnerInterceptor`：防止全表更新与删除

### 分页插件

创建配置类：

```java
@Configuration
public class MybatisConfig {

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        // 初始化核心插件
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 添加分页插件
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```

测试：

```java
    @Test
    void testPageQuery() {
        // 1.分页查询，new Page()的两个参数分别是：页码、每页大小
        int current = 2;
        int size = 2;
        Page<User> page = Page.of(current, size);
        page.addOrder(new OrderItem("balance", true));
        page.addOrder(new OrderItem("id", true));
        page = userService.page(page);
        long total = page.getTotal();
        System.out.println("total = " + total);
        long pages = page.getPages();
        System.out.println("pages = " + pages);
        List<User> records = page.getRecords();
        records.forEach(System.out::println);
    }	
```



### 通用分页实体

请求：

```java
@Data
@ApiModel(description = "分页查询实体")
public class PageQuery {
    @ApiModelProperty("页码")
    private Integer pageNo;
    @ApiModelProperty("页码")
    private Integer pageSize;
    @ApiModelProperty("排序字段")
    private String sortBy;
    @ApiModelProperty("是否升序")
    private Boolean isAsc;
}
```

用户请求，继承PageQuery

```java
@EqualsAndHashCode(callSuper = true)
// 生成equals和hashCode方法时，会调用父类的equals和hashCode方法
@Data
@ApiModel(description = "用户查询条件实体")
public class UserQuery extends PageQuery {
    @ApiModelProperty("用户名关键字")
    private String name;
    @ApiModelProperty("用户状态：1-正常，2-冻结")
    private Integer status;
    @ApiModelProperty("余额最小值")
    private Integer minBalance;
    @ApiModelProperty("余额最大值")
    private Integer maxBalance;
}
```

分页返回结果：

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "分页结果")
public class PageDTO<T> {
    @ApiModelProperty("总条数")
    private Long total;
    @ApiModelProperty("总页数")
    private Long pages;
    @ApiModelProperty("集合")
    private List<T> list;
}
```

定义控制器：

```java
@GetMapping("/page")
public PageDTO<UserVO> queryUsersPage(UserQuery query){
    return userService.queryUsersPage(query);
}
```

业务实现：
```java
    @Override
    public PageDTO<UserVO> queryUsersPage(UserQuery query) {
        String name = query.getName();
        Integer status = query.getStatus();
        Page<User> page = Page.of(query.getPageNo(), query.getPageSize());
        if (query.getSortBy() != null) {
            page.addOrder(new OrderItem(query.getSortBy(), query.getIsAsc()));
        } else {
            page.addOrder(new OrderItem("update_time", false));
        }

        //查询
        Page<User> p = this.lambdaQuery()
                .like(name != null, User::getUsername, name)
                .eq(status != null, User::getStatus, status)
                .page(page);
        //封装Vo结果
        PageDTO<UserVO> dto = new PageDTO<>();
        dto.setTotal(p.getTotal());
        dto.setPages(p.getPages());
        List<User> records = page.getRecords();
        if (CollUtil.isEmpty(records)) {
            dto.setList(Collections.emptyList());
        }
        List<UserVO> list = BeanUtil.copyToList(records, UserVO.class);
        dto.setList(list);
        return dto;
    }
```

在上述代码中，从PageQuery转到MybatisPlus的Page对象比较麻烦，可以自己定义工具进行转化：

```java
@Data
public class PageQuery {
    private Integer pageNo;
    private Integer pageSize;
    private String sortBy;
    private Boolean isAsc;

    public <T> Page<T> toMpPage(OrderItem... orders) {
        // 1.分页条件
        Page<T> p = Page.of(pageNo, pageSize);
        // 2.排序条件
        // 2.1.先看前端有没有传排序字段
        if (sortBy != null) {
            p.addOrder(new OrderItem(sortBy, isAsc));
            return p;
        }
        // 2.2.再看有没有手动指定排序字段
        if (orders != null) {
            p.addOrder(orders);
        }
        return p;
    }

    public <T> Page<T> toMpPage(String defaultSortBy, boolean isAsc) {
        return this.toMpPage(new OrderItem(defaultSortBy, isAsc));
    }

    public <T> Page<T> toMpPageDefaultSortByCreateTimeDesc() {
        return toMpPage("create_time", false);
    }

    public <T> Page<T> toMpPageDefaultSortByUpdateTimeDesc() {
        return toMpPage("update_time", false);
    }
}
```

改造PageDTO实体

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDTO<V> {
    private Long total;
    private Long pages;
    private List<V> list;

    /**
     * 返回空分页结果
     * @param p MybatisPlus的分页结果
     * @param <V> 目标VO类型
     * @param <P> 原始PO类型
     * @return VO的分页对象
     */
    public static <V, P> PageDTO<V> empty(Page<P> p){
        return new PageDTO<>(p.getTotal(), p.getPages(), Collections.emptyList());
    }

    /**
     * 将MybatisPlus分页结果转为 VO分页结果
     * @param p MybatisPlus的分页结果
     * @param voClass 目标VO类型的字节码
     * @param <V> 目标VO类型
     * @param <P> 原始PO类型
     * @return VO的分页对象
     */
    public static <V, P> PageDTO<V> of(Page<P> p, Class<V> voClass) {
        // 1.非空校验
        List<P> records = p.getRecords();
        if (records == null || records.size() <= 0) {
            // 无数据，返回空结果
            return empty(p);
        }
        // 2.数据转换
        List<V> vos = BeanUtil.copyToList(records, voClass);
        // 3.封装返回
        return new PageDTO<>(p.getTotal(), p.getPages(), vos);
    }

    /**
     * 将MybatisPlus分页结果转为 VO分页结果，允许用户自定义PO到VO的转换方式
     * @param p MybatisPlus的分页结果
     * @param convertor PO到VO的转换函数
     * @param <V> 目标VO类型
     * @param <P> 原始PO类型
     * @return VO的分页对象
     */
    public static <V, P> PageDTO<V> of(Page<P> p, Function<P, V> convertor) {
        // 1.非空校验
        List<P> records = p.getRecords();
        if (records == null || records.size() <= 0) {
            // 无数据，返回空结果
            return empty(p);
        }
        // 2.数据转换
        List<V> vos = records.stream().map(convertor).collect(Collectors.toList());
        // 3.封装返回
        return new PageDTO<>(p.getTotal(), p.getPages(), vos);
    }
}
```

业务层更换：
```java
    @Override
    public PageDTO<UserVO> queryUsersPage(UserQuery query) {
        String name = query.getName();
        Integer status = query.getStatus();
        Page<User> page = query.toMpPageDefaultSortByCreateTimeDesc();
        //查询
        Page<User> p = this.lambdaQuery()
                .like(name != null, User::getUsername, name)
                .eq(status != null, User::getStatus, status)
                .page(page);
        //封装Vo结果

//        return PageDTO.of(p, UserVO.class);
        return PageDTO.of(p, user -> {
            //拷贝属性
            UserVO vo = BeanUtil.copyProperties(user, UserVO.class);
            //其他特殊逻辑
            vo.setUsername(user.getUsername() + "123");
            return vo;
        });
    }
```

