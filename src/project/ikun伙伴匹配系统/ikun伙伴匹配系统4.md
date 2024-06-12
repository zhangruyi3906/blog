---
title: ikun伙伴匹配系统4
date: 2023-10-22
category:
   - 项目实战
   - ikun伙伴匹配系统
tag:
   - 项目实战
   - ikun伙伴匹配系统
---

# ikun伙伴匹配系统

mysql数据查询慢怎么办？

用缓存：提前把数据取出来保存好，利于存在内存里

缓存的实现：

+ redis 分布式
+ memcached 分布式
+ ehcache 单机
+ 本地缓存 Java Map
+ caffeine Java内存缓存，性能高
+ Google guava



## Redis缓存预热

Spirng Data Redis

设计缓存Key：

不同用户看到的数据不同

systemId:moduledId:func不要和别人冲突

Ikon:user:recommend:userid

```java
    @GetMapping("/recommend")
    public Result<Page<User>> recommendUser(int pageSize, int pageNum, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        String redisKey=String.format("ikun:user:recommend:%s",loginUser.getId());
        ValueOperations valueOperations = redisTemplate.opsForValue();
        Page<User> userPage = (Page<User>) valueOperations.get(redisKey);
        if (userPage!=null){
            log.info("get recommend user from redis");
            return ResultUtils.success(userPage);
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        Page<User> userList = userService.page(new Page<>(pageNum, pageSize), queryWrapper);
        try {
            valueOperations.set(redisKey,userList);
        } catch (Exception e) {
            log.error("redis set error:{}",e.getMessage());
        }
        return ResultUtils.success(userList);
    }
```



问题：第一个用户访问还是很慢怎么办？

缓存预热：

1. 定时
2. 模拟触发（手动）

定时任务的实现：

1. Spring Scheduler springboot默认整合
2. Quartz 独立于Spring存在的定时任务框架



用定时任务：每天刷新所有用户的推荐

注意点：

1. 缓存预热的意义：新增少，总用户多
2. 缓存的空间不能太大，要预留给其他缓存空间
3. 缓存数据的周期 ， 



定时任务：

```java
package com.yunfei.Job;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sun.corba.se.spi.ior.ObjectKey;
import com.yunfei.ikunfriend.model.domain.User;
import com.yunfei.ikunfriend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.List;

/**
 * 缓存预热任务
 */
@Component
@Slf4j
public class PreCacheJob {

    @Resource
    private UserService userService;

    @Resource
    private RedisTemplate<String, ObjectKey> redisTemplate;

    private List<Long> mainUserList= Arrays.asList(1L);

    //每天的23点59执行
    @Scheduled(cron = "0 59 23 * *  *")
    public void doCacheRecommendUser(){
        for (Long userId : mainUserList) {
            QueryWrapper<User> queryWrapper = new QueryWrapper<>();
            Page<User> page = userService.page(new Page<>(1, 10), queryWrapper);
            String redisKey=String.format("ikun:user:recommend:%s",userId);
            ValueOperations valueOperations = redisTemplate.opsForValue();
            try {
                valueOperations.set(redisKey,page.getRecords());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```



## 分布式锁

控制定时任务的执行？

1. 浪费资源，比如10000台服务器同时执行
2. 脏数据，比如重复插入

有些定时任务要控制同一时间只有一个服务器能执行，

怎么做？

1. 分离定时任务和主程序，只在一个服务器运行定时任务。成本太大

2. 写死配置，每个服务器都执行定时任务，但是只有ip符合配置的服务器才执行真实业务，其他的直接返回，成本最低。问题：ip是不固定的

3. 动态配置，

   1. 数据库
   2. Redis
   3. 配置中心（nacos，Apollo，Spring Cloud Config）

   问题：服务器多了，IP不可控还是很麻烦。

4. 分布式锁 ，只有抢到锁的服务器才能执行业务逻辑

锁：有限的资源情况下，控制同一时间只有某些线程能访问到资源

Java实现锁：synchronized关键字，并发包的类

问题：只对单个JVM有效



### 分布式锁实现的关键

##### 抢锁机制 

怎么保证同一时间只有一个服务器能抢到锁？

核心思想是：先来的人吧数据改为自己的表示，后来的人发现标识已经存在，就抢锁失败，继续等待。

等先来的人执行方法结束，把标识清空，其他的人继续抢锁。

##### 实现

Mysql数据库：select for update 行级锁 最简单

乐观锁

Redis实现：内存数据库，读写速度快 ，支持setnx，lua脚本，方便

zookeeper实现 （不推荐 企业中很少用 ）

#### 注意事项

1. 用户要释放

2. 锁一定要 加过期时间

3. 如果方法执行时间过长，锁提前过起？

   问题：

   1. 连锁效应：释放掉别人的锁
   2. 这样还是会存在多个方法同时执行 的情况

解决方案：

+ 续期 

```java
boolean end=false;
new Thread(()->{
  if(!end){
    续期
  }
})
```

4. 释放锁的时候，有可能先判断出是自己的锁，但这个时候锁过期了，最后还是释放了别人的锁

```java
//原子操作
if (get lock==A){
  del lock
}
```

Redis+lua脚本实现

### Redisson实现分布式锁

是一个Java操作Redis的客户端，提供了大量的分布式数据集来简化对Redis的操作和使用，可以让开发者像使用本地集合一样使用Redis，完全感知不到Redis的存在

#### 2种引入方式

1. springboot-starter

```xml
     <dependency>
         <groupId>org.redisson</groupId>
         <artifactId>redisson-spring-boot-starter</artifactId>
         <version>3.24.2</version>
     </dependency>
```

2. 直接引入

```xml
<dependency>
   <groupId>org.redisson</groupId>
   <artifactId>redisson</artifactId>
   <version>3.24.2</version>
</dependency>  
```

配置类：

```java
package com.yunfei.ikunfriend.config;

import lombok.Data;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.api.RedissonReactiveClient;
import org.redisson.api.RedissonRxClient;
import org.redisson.config.Config;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Redisson配置类
 */
@Configuration
@ConfigurationProperties(prefix = "spring.redis")
@Data
public class RedissonConfig {
    private String host;
    private String port;
    private String password;

    private String database;

    @Bean
    public RedissonClient redissonClient() {
        System.out.println(host);
        //配置
        Config config = new Config();
        String redisAddress = String.format("redis://%s:%s", host, port);
        config.useSingleServer().setAddress(redisAddress).setDatabase(3).setPassword(password);
        //创建实例
        RedissonClient redisson = Redisson.create(config);
        return redisson;
    }
}

```

测试 ：

```java
package com.yunfei.ikunfriend.service.impl;

import org.junit.jupiter.api.Test;
import org.redisson.api.RList;
import org.redisson.api.RedissonClient;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class RedissonTest {


    @Resource
    private RedissonClient redissonClient;

    @Test
    void test() {
        List<String> ls=new ArrayList<>();
        ls.add("cxk");
        System.out.println("list:"+ls);

        RList<String> list = redissonClient.getList("test-list");
        list.add("cxk");
        System.out.println("redis:"+list);
        list.get(0);
    }
}

```



定时任务+锁

1. waitTime设置为0，只抢一次，抢不到就放弃
2. 注意释放锁要写在finally中

看门狗机制

redisson中提供的续期机制

开一个监听线程，如果方法还没执行完，就帮你重置redis锁的过期时间。

原理：

1. 监听当前线程，每10s续期一次
2. 如果线程挂掉（debug模式也会被当成服务器宕机）则不会过期

```java
    @Resource
    private RedissonClient redissonClient;

    //每天的23点59执行
    @Scheduled(cron = "0 59 23 * *  *")
    public void doCacheRecommendUser() {
        String redisKey1 = "ikun:precacheJob:docache:lock";
        RLock lock = redissonClient.getLock(redisKey1);
        try {
            if (lock.tryLock(0, 30000, TimeUnit.MICROSECONDS)) {
                for (Long userId : mainUserList) {
                    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
                    Page<User> page = userService.page(new Page<>(1, 10), queryWrapper);
                    String redisKey = String.format("ikun:user:recommend:%s", userId);
                    ValueOperations valueOperations = redisTemplate.opsForValue();
                    try {
                        valueOperations.set(redisKey, page.getRecords());
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }

            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            //只能释放自己的锁
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
```















