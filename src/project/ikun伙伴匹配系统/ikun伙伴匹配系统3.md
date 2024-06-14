---
title: ikun伙伴匹配系统3
date: 2023-10-21
category:
  - 项目实战
  - ikun伙伴匹配系统
tag:
  - 项目实战
  - ikun伙伴匹配系统
---

# ikun伙伴匹配系统

## 前端开发

### 前端页面跳转传值

1. Query =>url 附加参数，传递的值长度有限
2. 

搜索页传递参数：

```ts
const doSearchResult = () => {
    router.push({
        path: '/user/list',
        query: {
            tags: activeIds.value
        }
    })
}
```

搜索结果页面获取参数：

```ts
const route = useRoute();
const {tags} = route.query;
```

数据库新增一列个人简介：

![image-20231021120837707](https://s2.loli.net/2023/10/21/1Ohdg7kpmHZWl3D.webp)

增加搜索接口：

```java
    @GetMapping("/search/tags")
    public Result<List<User>> searchUsersByTags(@RequestParam(required = false) List<String> tagNameList) {
        if (CollectionUtils.isEmpty(tagNameList)) {
            throw new BussinessException(Code.PARAMS_ERROR);
        }
        List<User> users = userService.searchUsersByTags(tagNameList);
        return ResultUtils.success(users);
    }
```



### 前端整合axios

https://axios.nodejs.cn/docs/intro

```bash
yarn add axios
```

配置请求：

```ts
import axios from "axios";

const request = axios.create({
    baseURL: "http://localhost:8080/api"
});

request.interceptors.request.use(function (config) {
    console.log("发送请求")
    return config;
}, function (error) {
    return Promise.reject(error);
});

request.interceptors.response.use(function (response) {
    console.log("响应请求")
    return response;
}, function (error) {
    return Promise.reject(error);
});
export default request;

```

发送请求：
```ts
onMounted(async () => {
    const userListData = await request.get('/user/search/tags', {
        params: {tagNameList: tags},
        paramsSerializer: params => {
            return qs.stringify(params, {indices: false})
        }
    }).then(function (response) {
        return response.data?.data;
    }).catch(function (error) {
    })
    if (userListData) {
        userListData.forEach(user => {
            if (user.tags) {
                user.tags = JSON.parse(user.tags);
            }
        })
        userList.value = userListData;
    }
})
```

结果：

![image-20231021144315604](https://s2.loli.net/2023/10/21/HGtsA1BRhF37EmP.webp)



## 分布式Session

jwt缺点：https://zhuanlan.zhihu.com/p/263410154

种Session的时候注意范围 cookie.domain

服务器A登录之后，请求发到服务器B，不认识该用户



解决方案：共享存储？

1. MySql
2. 文件服务器 ceph
3. Redis（基于内存的K/V数据库） 因为用户信息读取/是否登录的判断极其频繁



引入Redis

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
```

配置application.yml

```yaml
spring:
  redis:
    port: 6379
    host: localhost
    database: 0
    password: 123456
```



引入Spring session redis

使得自动将session存储到redis中

```xml
        <dependency>
            <groupId>org.springframework.session</groupId>
            <artifactId>spring-session-data-redis</artifactId>
        </dependency>
```

修改配置：

```yml
spring:
  session:
    timeout: 86400
    store-type: redis
```

测试

允许多个实例：

![image-20231021152050412](https://s2.loli.net/2023/10/21/3mbrNQPMoxya179.webp)

修改端口为8081

![image-20231021152121076](https://s2.loli.net/2023/10/21/EWqkKGQLsmnYz5N.webp)

在端口为8080的页面进行登录：

![image-20231021151311737](https://s2.loli.net/2023/10/21/6nfZDemvPMEqKuG.webp)

成功加入到redis中

![image-20231021151038415](https://s2.loli.net/2023/10/21/lmqnSLBau6DVTj2.webp)

此时在8081的端口查看登录信息：

![image-20231021151332505](https://s2.loli.net/2023/10/21/hpKyqnFILQYbDMu.webp)





## 主页推荐

后端推荐算法

```java
    @GetMapping("/recommend")
    public Result<List<User>> recommendUser(HttpServletRequest request){
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        List<User> userList = userService.list(queryWrapper);
        List<User> users = userList.stream().map(user -> userService.getSafetyUser(user)).collect(Collectors.toList());
        return ResultUtils.success(users);
    }
```

前端和搜索结果页的卡片一致，可以封装卡片组件：

```vue
<template>
    <van-card
        v-for="user in props.userList"
        :desc="user.profile"
        :title="`${user.username}（${user.ikunCode}）`"
        :thumb="user.avatarUrl"
    >
        <template #tags>
            <van-tag plain type="primary" v-for="tag in user.tags"
                     style="margin-right: 5px;margin-top: 5px;">
                {{ tag }}
            </van-tag>
        </template>
        <template #footer>
            <van-button size="mini" type="default">联系我</van-button>
        </template>
    </van-card>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";

interface UsercardListProps {
    userList: UserType[]
}
const props = defineProps<UsercardListProps>()

</script>

<style scoped>

</style>

```

使用：

```vue
<user-card-list :user-list="userList"/>
```

效果如下：

![image-20231022142652721](https://s2.loli.net/2023/10/22/zQOjUmDaeNJoW4c.webp)

## 模拟1000万数据

导入数据：

1. 可视化界面：适合一次性导入，数据量可控
2. 写程序：for循环，建议分批 ，要保证可控
3. 执行SQL语句，适用于小数据



### 编写一次性任务

#### 普通插入

```java
    @Test
    public void doInsertUsers() {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        final int NUM = 10;
        for (int i = 0; i < NUM; i++) {
            User user = new User();
            user.setUsername("假ikun");
            user.setUserAccount("fakeIkun");
            user.setAvatarUrl("https://s2.loli.net/2023/10/16/QRiUYmDLB2vZuE6.webp");
            user.setGender(0);
            user.setUserPassword("12345678");
            user.setPhone("123");
            user.setEmail("123@qq.com");
            user.setUserStatus(0);
            user.setUserRole(0);
            user.setIkunCode("1212121");
            user.setTags("[]");
            userMapper.insert(user);
        }
        stopWatch.stop();
        System.out.println("总时间：" + stopWatch.getTotalTimeMillis());
    }
```

![image-20231022145404843](https://s2.loli.net/2023/10/22/vwLksW4ytPdIqf7.webp)

耗时比较大，主要花在数据库链接上

#### 优化，分批插入

```java
    public void doInsertUsers() {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        final int NUM = 1000;
        List<User> userList = new ArrayList<>();
        for (int i = 0; i < NUM; i++) {
            User user = new User();
            user.setUsername("假ikun");
            user.setUserAccount("fakeIkun");
            user.setAvatarUrl("https://s2.loli.net/2023/10/16/QRiUYmDLB2vZuE6.webp");
            user.setGender(0);
            user.setUserPassword("12345678");
            user.setPhone("123");
            user.setEmail("123@qq.com");
            user.setUserStatus(0);
            user.setUserRole(0);
            user.setIkunCode("1212121");
            user.setTags("[]");
            userList.add(user);
        }
        userService.saveBatch(userList,100);
        stopWatch.stop();
        System.out.println("总时间：" + stopWatch.getTotalTimeMillis());
    }
```

![image-20231022150102289](https://s2.loli.net/2023/10/22/SVvRW7gCleA8Bnh.webp)

这次插入了1000条数据，耗时只有1秒多



测试十万条：14s

![image-20231022150538228](https://s2.loli.net/2023/10/22/T9DGEWPJ7dsphyb.webp)





#### 并发执行

十万条为：9s

![image-20231022151327498](https://s2.loli.net/2023/10/22/58KMnrbu26Pif93.webp)



修改BatchSize为10000时：6s

![image-20231022151647078](https://s2.loli.net/2023/10/22/nEapUGXSeMrsY4l.webp)

其他办法：

```java
package com.yunfei.ikunfriend.once;

import com.yunfei.ikunfriend.mapper.UserMapper;
import com.yunfei.ikunfriend.model.domain.User;
import com.yunfei.ikunfriend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.StopWatch;

import javax.annotation.Resource;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class InsertUsersTest {
    @Resource
    private UserMapper userMapper;

    @Resource
    private UserService userService;

    private ExecutorService executorService = new ThreadPoolExecutor(60, 1000, 10000,
            TimeUnit.MINUTES, new ArrayBlockingQueue<>(10000));


    /**
     * 批量插入用户
     */
    @Test
    public void doInsertUsers() {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        final int NUM = 100000;
        int batchSize = 5000;
        //分10组
        int j = 0;
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            List<User> userList = new ArrayList<>();
            while (true) {
                j++;
                User user = new User();
                user.setUsername("假ikun");
                user.setUserAccount("fakeIkun");
                user.setAvatarUrl("https://s2.loli.net/2023/10/16/QRiUYmDLB2vZuE6.webp");
                user.setGender(0);
                user.setUserPassword("12345678");
                user.setPhone("123");
                user.setEmail("123@qq.com");
                user.setUserStatus(0);
                user.setUserRole(0);
                user.setIkunCode("1212121");
                user.setTags("[]");
                userList.add(user);
                if (j % batchSize == 0) break;
            }
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                System.out.println("Thread name:" + Thread.currentThread().getName());
                userService.saveBatch(userList, batchSize);
            }, executorService);
            futures.add(future);
        }
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[]{})).join();
        stopWatch.stop();
        System.out.println("总时间：" + stopWatch.getTotalTimeMillis());
    }
}
```

## 分页查询

```java
    @GetMapping("/recommend")
    public Result<Page<User>> recommendUser(int pageSize, int pageNum, HttpServletRequest request) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        Page<User> userList = userService.page(new Page<>(pageNum, pageSize), queryWrapper);
        return ResultUtils.success(userList);
    }
```



数据库查询慢？预先把数据 查出来，放到一个更快读取的地方，不用再查数据库了（缓存）

预加载缓存，定时更新缓存

多个机器都要执行任务？分布式锁，控制同一时间只有一台机器去执行定时任务，其他机器不用重复执行了
