---
title: SpringBoot使用Redis
date: 2023-11-02
category:
  - Java
  - 中间件
  - Redis
tag:
  - Java
  - 中间件
  - Redis
---
# Redis基础教程
## Redis介绍
官方网站：[https://redis.io/](https://redis.io/)
Redis是一种键值型的NoSql数据库，这里有两个关键字：
- 键值型：Redis中存储的数据都是以key、value对的形式存储
- NoSql：相对于传统关系型数据库而言，有很大差异的一种数据库。（not only sql,非关系型数据库）

NoSql则对数据库格式没有严格约束，往往形式松散，自由。
对比传统数据库：
![kZP40dQ.png](https://s2.loli.net/2023/11/02/bcEjS2Cdy5fRAKM.webp)
关系型数据库（RDBMS）和非关系型数据库（NoSQL数据库）是两种不同类型的数据库管理系统，它们在数据存储、数据模型和适用场景等方面存在显著的区别。
1. 数据模型：
    - 关系型数据库：使用表格（表）来组织数据，数据之间的关系通过外键建立。数据存储在结构化表格中，每行代表一个记录，每列代表一个属性。
    - 非关系型数据库：使用不同的数据模型，如文档、键值对、列族、图形等。这些数据库通常更自由灵活，不需要固定的模式，允许存储不同结构的数据。
2. 查询语言：
    - 关系型数据库：通常使用SQL（Structured Query Language）来查询和操作数据，支持复杂的查询和事务。
    - 非关系型数据库：使用不同的查询语言或API，通常是根据数据库类型而变化的。有些NoSQL数据库支持查询，但通常不如SQL数据库灵活。
3. 扩展性：
    - 关系型数据库：通常采用垂直扩展（增加服务器性能）或水平分区来提高性能，但有一定限制。
    - 非关系型数据库：通常更容易水平扩展，可以更好地处理大规模数据。
4. 一致性：
    - 关系型数据库：强调ACID（原子性、一致性、隔离性和持久性）事务特性，确保数据的一致性和完整性。
    - 非关系型数据库：一些NoSQL数据库可能牺牲ACID属性以获得更高的性能和可用性，而强调CAP（一致性、可用性和分区容忍性）理论。
5. 适用场景：
    - 关系型数据库：适用于需要强一致性和复杂事务处理的应用，如金融系统、ERP系统等。
    - 非关系型数据库：适用于需要高度可扩展性和灵活性的应用，如大数据、社交媒体、物联网、日志存储等。
## Macos安装Redis
[https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/](https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/)<br />安装redis
```bash
brew install redis
```

查看安装信息：
```bash
brew info redis
```
前台启动redis:
```bash
redis-server
```
后台启动redis:
```bash
brew services start redis
```
查看信息：
```bash
brew services info redis
```
停止：
```bash
brew services stop redis
```
### 配置
打开`/opt/homebrew/etc/redis.conf`配置文件 <br />修改密码
```bash
requirepass 123456
```
前台启动的时候可以加 配置文件
```bash
cd /opt/homebrew/etc/
redis-server redis.conf
```

在后台启动redis,这个时候不需要加配置文件
```bash
brew services start redis
```

登录redis
```bash
redis-cli -h localhost -p 6379 -a 123456
```

### 启动问题
后台启动的时候报错：
![image.png](https://s2.loli.net/2023/11/02/ousU24SNRIEdwla.webp)
解决办法：
```bash
cd /opt/homebrew/Library/Taps/homebrew
rm -rf homebrew-services
brew tap homebrew/services
```
### 客户端工具
可以选择 another redis desktop
https://goanother.com/cn/#download


## Redis中的数据结构

Redis是键值对结构，即key-value，我们需要保证key不冲突，
常见的方式为：
```
	项目名:业务名:类型:id
```
例如：
- user相关的key：**heima:user:1**
- product相关的key：**heima:product:1**
如果Value是一个Java对象，例如一个User对象，则可以将对象序列化为JSON字符串后存储：

### 字符串
String类型，也就是字符串类型，是Redis中最简单的存储类型。
String结构是将对象序列化为JSON字符串后存储，当需要修改对象某个字段时很不方便
| **KEY**         | **VALUE**                                  |
| --------------- | ------------------------------------------ |
| heima:user:1    | {"id":1,  "name": "Jack", "age": 21}       |
| heima:product:1 | {"id":1,  "name": "小米11", "price": 4999} |

#### 常用命令
`SET key value` ：设置
`GET key` ：获取
`SETEX key seconds value` ：设置指定key过期时间，单位s
`SETNX key vvalue `：只有在key不存在时才设置
![x2zDBjf.png](https://s2.loli.net/2023/11/02/v1ClAIJmukZLhGK.webp)

### 哈希
Hash结构可以将对象中的每个字段独立存储，可以针对单个字段做CRUD：

#### 常用命令
`HSET key fiele value ` 将key设置为value
`HGET key field` 获取
`HDEL key field` 删除 
`HKEYS key `获取所有字段
`HVALS key` 获取所有值
![VF2EPt0.png](https://s2.loli.net/2023/11/02/scnRGrMmhlZSEof.webp)

### 列表

Redis中的List类型与Java中的LinkedList类似，可以看做是一个双向链表结构。既可以支持正向检索和也可以支持反向检索。
常用来存储一个有序数据，例如：朋友圈点赞列表，评论列表等。

#### 常用命令
`LPUSH key value1[value2] `插入到头部 左侧
`LRANGE key start stop` 获取指定范围达到元素
`RPOP key` 移除并获取列表最后一个元素 右侧
`LLEN key` 获取列表长度

### 集合

Redis的Set结构与Java中的HashSet类似，可以看做是一个value为null的HashMap。因为也是一个hash表，因此具备与HashSet类似的

#### 常用命令
`SADD key number1 [number2] `插入一个成员
`SMEMBERS key `返回集合中所有成员
`SCARD key` 获取成员数
`SINTER key1[key2] `返回定义所哟集合的交集
`SUNION key1 [key2]` 返回所有集合的并集
`SREM key number1[numer2]` 删除集合中成员

### 有序集合

Redis的SortedSet是一个可排序的set集合，与Java中的TreeSet有些类似，但底层数据结构却差别很大。SortedSet中的每一个元素都带有一个score属性，可以基于score属性对元素排序，底层的实现是一个跳表（SkipList）加 hash表。

因为SortedSet的可排序特性，经常被用来实现排行榜这样的功能。

#### 常用命令
`ZADD key score1 member1 [score2 member2] `向有序集合添加一个成员
`ZRANGE key start stop [WITHSCORES] `通过索引区间返回有序集合指定区间内的成员
`ZINCRBY key increment member` 对指定成员分数加上增量increment
`ZREM key member [member..]`  删除成员

### 通用命令

`KEYS pattern`： 查找所有符合给定模式的key
`EXISTS key`： 检查给定key是否存在
`TYPE key`： 返回key 所存储的值的类型
`DEL key` ：在key存在时删除key
`EXPIRE`：给一个key设置有效期，到期会被自动删除

## Redis的Java客户端Jedis

### 入门
引入依赖：
```xml
<!--jedis-->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.7.0</version>
</dependency>
<!--单元测试-->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.7.0</version>
    <scope>test</scope>
</dependency>
```

建立连接，存数据，以及取数据，最后释放连接测试：
```java
public class TestJedis {

    private Jedis jedis;

    @BeforeEach
    void setup() {
        // 1.建立连接
        jedis = new Jedis("localhost", 6379);
        // 2.设置密码
        jedis.auth("123456");
        // 3.选择库
        jedis.select(0);
    }

    @Test
    void testString() {
        // 存入数据
        String result = jedis.set("name", "cxk");
        System.out.println("result=" + result);
        // 获取数据
        String name = jedis.get("name");
        System.out.println("name=" + name);
    }

    @Test
    void testHash() {
        jedis.hset("user:1", "name", "cxk");
        jedis.hset("user:1", "age", "18");

        Map<String, String> map = jedis.hgetAll("user:1");
        System.out.println(map);

    }

    @AfterEach
    void tearDown() {
        // 关闭连接
        jedis.close();
    }
}

```

### 连接池
Jedis本身是线程不安全的，并且频繁的创建和销毁连接会有性能损耗，因此我们推荐使用Jedis连接池代替Jedis的直连方式。
创建factory
```java
public class JedisConnectionFactory {

    private static JedisPool jedisPool;

    static {
        // 配置连接池
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(8);
        poolConfig.setMaxIdle(8);
        poolConfig.setMinIdle(0);
        poolConfig.setMaxWaitMillis(1000);
        jedisPool = new JedisPool(poolConfig, "localhost",
                6379, 1000, "123321");
    }

    public static Jedis getJedis() {
        return jedisPool.getResource();
    }
}
```

创建对象：
```java
    @BeforeEach
    void setup() {
        // 1.建立连接
//        jedis = new Jedis("localhost", 6379);
        jedis= JedisConnectionFactory.getJedis();
        // 2.设置密码
        jedis.auth("123456");
        // 3.选择库
        jedis.select(0);
    }
```

## SpringBoot中使用Redis

SpringData是Spring中数据操作的模块，包含对各种数据库的集成，其中对Redis的集成模块就叫做SpringDataRedis，官网地址：[https://spring.io/projects/spring-data-redis](https://spring.io/projects/spring-data-redis)
- 提供了对不同Redis客户端的整合（Lettuce和Jedis）
- 提供了RedisTemplate统一API来操作Redis
- 支持Redis的发布订阅模型
- 支持Redis哨兵和Redis集群
- 支持基于Lettuce的响应式编程
- 支持基于JDK、JSON、字符串、Spring对象的数据序列化及反序列化
- 支持基于Redis的JDKCollection实现
### 入门

导入依赖
pool是连接池
```xml
        <!--redis依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <!--common-pool-->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-pool2</artifactId>
        </dependency>
        <!--Jackson依赖-->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
        </dependency>
```
配置Redis
配置redis，以及连接池设置
```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password: 123456
    lettuce: # 连接池
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: 1000ms
```
编写配置类
RedisTemplate可以接收任意Object作为值写入Redis，写入前会把Object序列化为字节形式，默认是采用JDK序列化，
缺点：
- 可读性差
- 内存占用较大
可以自定义序列化方式
### 自定义序列化方式
```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        //创建RedisTemplate<String, Object>对象
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        //设置RedisTemplate的连接工厂
        template.setConnectionFactory(redisConnectionFactory);
        //创建json格式序列化对象
        GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        //设置key和hashKey的序列化方式
        template.setKeySerializer(RedisSerializer.string());
        template.setHashKeySerializer(RedisSerializer.string());
        //设置value的序列化
        template.setValueSerializer(genericJackson2JsonRedisSerializer);
        template.setHashValueSerializer(genericJackson2JsonRedisSerializer);
        return template;
    }
}
```
测试：
```java
@SpringBootTest
class RedisDemoApplicationTests {

    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    void testString() {
        // 写入一条String数据
        redisTemplate.opsForValue().set("name", "蔡徐坤");
        // 获取string数据
        Object name = redisTemplate.opsForValue().get("name");
        System.out.println("name = " + name);
    }
}
```

测试写入一个Pojo类
```java
    @Test
    void testPojo(){
        User user = new User("蔡徐坤", 18);
        redisTemplate.opsForValue().set("user", user);
        Object user1 = redisTemplate.opsForValue().get("user");
        System.out.println("user1 = " + user1);
    }
```

结果如下：
![image.png](https://s2.loli.net/2023/11/02/bhpdDUSol1IemEj.webp)

整体可读性有了很大提升，并且能将Java对象自动的序列化为JSON字符串，并且查询时能自动把JSON反序列化为Java对象。不过，其中记录了序列化时对应的class名称，目的是为了查询时实现自动反序列化。这会带来额外的内存开销。
### 使用StringRedisTemplate
为了节省内存空间，我们可以不使用JSON序列化器来处理value，而是统一使用String序列化器，要求只能存储String类型的key和value。当需要存储Java对象时，手动完成对象的序列化和反序列化。


```java
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    //json格式化工具
    private static final ObjectMapper mapper = new ObjectMapper();

    @Test
    void testSaveUser() throws Exception{
        User user = new User("蔡徐坤", 18);
        //手动序列化
        String userJson = mapper.writeValueAsString(user);
        stringRedisTemplate.opsForValue().set("user:1",userJson);
        String jsonUser = stringRedisTemplate.opsForValue().get("user:1");
        //手动反序列化
        User user1 = mapper.readValue(jsonUser, User.class);
        System.out.println("user1 = " + user1);
    }
```

其他的类型一些测试：
```java
@SpringBootTest
class RedisConfigurationTest {

    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    public void testString() {
        ValueOperations valueOperations = redisTemplate.opsForValue();
        valueOperations.set("name", "cxk");
        String name = (String) valueOperations.get("name");
        System.out.println(name);
        valueOperations.set("code", "1234", 3, TimeUnit.HOURS); //3小时后过期
        valueOperations.setIfAbsent("code1", "1234"); //如果不存在则设置
    }

    @Test
    public void testHash() {
        HashOperations hashOperations = redisTemplate.opsForHash();
        hashOperations.put("user", "name", "cxk");
        hashOperations.put("user", "age", "18");
        String name = (String) hashOperations.get("user", "name");
        System.out.println(name);

        Set user = hashOperations.keys("user");
        System.out.println(user);

        List user1 = hashOperations.values("user");
        System.out.println(user1);

        hashOperations.delete("user", "name");
    }

    @Test
    public void testList() {
        ListOperations listOperations = redisTemplate.opsForList();
        listOperations.leftPushAll("list", "a", "b", "c");
        listOperations.leftPush("list", "d");

        List list = listOperations.range("list", 0, -1);
        System.out.println(list);

        listOperations.rightPop("list");

        Long size = listOperations.size("list");
        System.out.println(size);
    }

    @Test
    public void testSet() {
        SetOperations setOperations = redisTemplate.opsForSet();
        setOperations.add("set", "a", "b", "c", "d", "e");
        Set set = setOperations.members("set");
        System.out.println(set);

        setOperations.remove("set", "a", "b");
        set = setOperations.members("set");
        System.out.println(set);


        setOperations.add("set2", "a", "b", "c", "d", "e");
        Set union = setOperations.union("set", "set2");
        Set intersect = setOperations.intersect("set", "set2");
        Set difference = setOperations.difference("set", "set2");
        System.out.println(union);
        System.out.println(intersect);
        System.out.println(difference);
    }
    
    @Test
    public void testZset(){
        ZSetOperations zSetOperations = redisTemplate.opsForZSet();
        zSetOperations.add("zset", "a", 1);
        zSetOperations.add("zset", "b", 2);
        zSetOperations.add("zset", "c", 3);

        Set zset = zSetOperations.range("zset", 0, -1);
        System.out.println(zset);
        
        zSetOperations.incrementScore("zset", "a", 1);
        zSetOperations.remove("zset", "a");
    }
    @Test
    public void testCommon(){
        Set keys = redisTemplate.keys("*");
        System.out.println(keys);

        Boolean name = redisTemplate.hasKey("name");

        for (Object key : keys) {
            DataType type = redisTemplate.type(key);
            System.out.println(type.name());
        }
        redisTemplate.delete("name");
    }
}
```
