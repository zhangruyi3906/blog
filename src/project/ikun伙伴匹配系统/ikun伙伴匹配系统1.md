---
title: ikun伙伴匹配系统1
date: 2023-10-20
category:
  - 项目实战
  - ikun伙伴匹配系统
tag:
   - 项目实战
   - ikun伙伴匹配系统
---

# ikun伙伴匹配系统

介绍：帮助大家找到志同道合的ikun

## 需求分析

1. 用户去添加标签，标签的分类（要有哪些标签，怎么把标签进行分类） 学习方向 java/c++，工作/大学
2. 主动搜索，允许用户根据标签去搜索其他用户
   1. Redis缓存
3. 组队
   1. 创建队伍
   2. 加入队伍
   3. 根据标签查询队伍
   4. 邀请其他人
4. 允许用户去修改标签
5. 推荐
   1. 相似度计算算法+本地式分布式计算

## 技术栈

### 前端

1. Vue3 开发框架 
2. Vant UI （基于Vue的移动组件库） （React版Zent）
3. Vite
4. nginx来单机部署

### 后端

1. Java+Springboot框架
2. SpringMVC+Mybatis+MybatisPlus
3. MySQL数据库
4. Redis缓存
5. Swagger+Knife4j接口文档



## 前端项目初始化

Vue：https://cn.vuejs.org/

Vite：https://cn.vitejs.dev/

Vant：https://vant-contrib.gitee.io/vant/#/zh-CN/home

用脚手架初始项目

```bash
yarn create vite
```

整合组件库 Vant

```bash
yarn add vant
```

按需引入组件：
```bash
yarn add @vant/auto-import-resolver unplugin-vue-components -D
```

配置插件：

```bash
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';

export default {
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
};

```

注意！

有些样式样式还是需要自己引入

![image-20231020103149569](https://s2.loli.net/2023/10/20/uyEQcrC75J6o9Mt.webp)





### 前端主页+组件

导航条：展示当前页面名称：

主页搜索框=>搜索页=>搜索结果页（标签筛选页面）

内容

tab栏：

+ 主页（推荐页）
  + 搜索框
  + banner
  + 推荐信息流
+ 队伍页
+ 用户页（消息->考虑邮件发送方式）



### 添加navbar导航栏

```vue
    <van-nav-bar
        title="标题"
        left-text="返回"
        right-text="按钮"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
    >
        <template #right>
            <van-icon name="search" size="18" />
        </template>
    </van-nav-bar>


```

```ts
const onClickLeft = () => history.back();
const onClickRight = () => showToast('按钮');
```



![image-20231020102414409](https://s2.loli.net/2023/10/20/H6p7ogtbDJlAkm5.webp)



页面效果如下：

![image-20231020102432835](https://s2.loli.net/2023/10/20/TxIO3tUrvCP62i7.webp)

### 添加tabbar标签栏

vue页面

```vue
    <van-tabbar v-model="active" @change="onChange">
        <van-tabbar-item icon="home-o" name="index">主页</van-tabbar-item>
        <van-tabbar-item icon="search" name="team">队伍</van-tabbar-item>
        <van-tabbar-item icon="friends-o" name="user">个人</van-tabbar-item>
    </van-tabbar>
```

ts

```ts
const active = ref("index");
const onChange = (index) => showToast(`标签 ${index}`);
```

效果如下

![image-20231020103349095](https://s2.loli.net/2023/10/20/ClOFwN7EP6qx9Mh.webp)

页面的切换，组件化思想

```vue
    <div id="content">
        <template v-if="active==='index'">
            <Index/>
        </template>
        <template v-else-if="active==='team'">
            <Team/>
        </template>

    </div>
```



## 数据库设计

标签的分类（要有哪些标签，怎么把标签进行分类）

标签表（分类表）

建议用标签，不要用分类，更灵活

性别：男，女

方向：Java，c++，go，前端

目标：考研，春招，秋招，社招，考公，竞赛，转行，跳槽

段位：初级，中级，高级，王者

身份：大一，大二，大三，大四，学生，待业，以就业，研一，研二，研三

状态：乐观，消极，一般，单身，已婚，有对象



### 标签表

| 字段       | 类型     | 备注                    |
| ---------- | -------- | ----------------------- |
| id         | int      | 主键                    |
| tagName    | varchar  | 标签名，唯一，索引      |
| userId     | int      | 上传标签的用户,普通索引 |
| parentId   | int      | 父标签id                |
| isParent   | tinyint  | 是否为父标签            |
| createTime | datetime | 创建时间                |
| updateTime | datetime | 修改时间                |
| isDelete   | tinyint  | 是否删除                |



怎么查询所有标签，并且把标签分好组？ 根据父标签id查询

根据父标签查询子标签？根据id查询

```sql
create table tag
(
    id         bigint auto_increment comment 'id' primary key,
    tagName    varchar(256)                       null comment '标签名称',
    userId     bigint                             null comment '用户id',
    parentId   bigint                             null comment '父标签id',
    isParent   tinyint  default 0                 not null comment '0-否 1-是',
    createTime datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除'
)
    comment '标签';


```

### 修改用户表

用户有哪些标签？

1. 直接在用户表补充tags字段，['java','男'] 存json字符串

   优点：查询方便，不用新建关联表，标签是用户的固有属性（除了该系统，其他系统可能要用到，标签是用户的固有属性）

   查询用户列表，查关系表拿到这100个用户的所有标签id，再根据标签id去查标签表

   哪怕性能低，可以用缓存

   缺点：用户表多一列，会有点

2. 加一个关联表，记录用户和标签的关系

   关联表的应用场景：查询灵活，可以正查反查

   缺点：要多建一个表，多维护一个表

   重点：企业大项目开发中尽量减少关联查询，很影响扩展性，而且会影响查询性能



**选择第一种**

```sql
alter table user
    add tags varchar(1024) null comment '标签列表';
```



### 添加索引

```sql
create unique index tagName_idx
    on tag (tagName);

create index userId_idx
    on tag (userId);
```

![image-20231020111358100](https://s2.loli.net/2023/10/20/Q5MKR26VlHBrWxE.webp)

## 后端接口开发

搜索标签

1. 允许用户传入多个标签，多个标签都存在才搜索出来 and 
2. 允许用户传入多个标签，有任何一个标签存在就能搜索出来 or 

两种方式：

1. SQL查询 （实现简单）
2. 内存查询 （灵活 ,可以通过并发进一步优化）



如果参数可以分析，根据用户的参数去选择查询方式，比如标签数

如果不可以分析，并且数据库足够，内存足够，可以并发查询，谁先返回用谁



解析JSON字符串：

序列化：把Java对象转为json

反序列化：把json转为Java对象

json序列化库：

1. Fastjson alibaba （快，漏洞太多）
2. gson （google ）
3. jackson
4. kryo

```xml
<!-- https://mvnrepository.com/artifact/com.google.code.gson/gson -->
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.8.9</version>
</dependency>

```

代码：

```java
    /**
     * 根据标签搜索用户
     *
     * @param tagNameList 标签列表
     * @return 用户列表
     */
    @Override
    public List<User> searchUsersByTags(List<String> tagNameList) {
        if (CollectionUtils.isEmpty(tagNameList)) {
            throw new BussinessException(Code.PARAMS_ERROR);
        }
        //return searchUsersByTagsBySQL(tagNameList);
        return searchUsersByTagsByMemory(tagNameList);
    }

    private List<User> searchUsersByTagsByMemory(List<String> tagNameList) {
        //先查询所有用户
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        List<User> userList = userMapper.selectList(queryWrapper);
        //在内存中判断：
        Gson gson = new Gson();
        List<User> users = userList.stream().filter(user -> {
            String tagsStr = user.getTags();
            if (StringUtils.isBlank(tagsStr)) {
                return false;
            }
            Set<String> set = gson.fromJson(tagsStr, new TypeToken<Set<String>>() {
            }.getType());
            set = Optional.ofNullable(set).orElse(new HashSet<>());

            for (String tagName : tagNameList) {
                if (!set.contains(tagName)) {
                    return false;
                }
            }
            return true;
        }).map(this::getSafetyUser).collect(Collectors.toList());
        return users;
    }

    @Deprecated //废弃
    private List<User> searchUsersByTagsBySQL(List<String> tagNameList) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        for (String tagName : tagNameList) {
            queryWrapper = queryWrapper.like("tags", tagName);
        }
        List<User> userList = userMapper.selectList(queryWrapper);
        List<User> users = userList.stream().map(this::getSafetyUser).collect(Collectors.toList());
        return users;
    }
```



Java8

1. stream  /parallelStream 流失处理
2. Optional可选类

