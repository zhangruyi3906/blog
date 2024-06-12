---
title: ikun伙伴匹配系统5
date: 2023-10-23
category:
   - 项目实战
   - ikun伙伴匹配系统
tag:
   - 项目实战
   - ikun伙伴匹配系统
---

# ikun伙伴匹配系统

## 组队功能

### 需求分析

>  理想场景：
>
> 和别人一起参加竞赛，做项目，可以发起队伍或者加入别人的队伍

用户可以创建一个队伍，设置队伍的人数，队伍名称（标题），描述，超时时间

> 队长，剩余人数
>
> 聊天？
>
> 公开 or 加密
>
> 不展示过期的队伍

修改队伍信息

用户可以加入队伍（其他人，未满，未过期）

> 是否需要队长同意

用户可以退出队伍（如果是队长，权限转给第二个进入的用户）

队长可以解散队伍

邀请其他用户加入队伍，分享队伍



### 实现

数据库设计

队伍表team

| 字段        | 类型   | 说明                   |
| ----------- | ------ | ---------------------- |
| id          | bigint | 主键                   |
| name        |        | 队伍名称               |
| description |        | 描述                   |
| maxNum      |        | 最大人数               |
| expireTime  |        | 过期时间               |
| userId      |        | 用户id                 |
| status      |        | 0-公开，1-私有，2-加密 |
| password    |        | 密码                   |
| createTime  |        | 创建时间               |
| updateTime  |        | 更新时间               |
| isDelete    |        | 是否删除               |

```sql
-- 队伍表
create table team
(
    id          bigint auto_increment comment 'id' primary key,
    name        varchar(256)                       not null comment '队伍名称',
    description varchar(1024)                      null comment '队伍描述 ',
    maxNum      int      default 1                 not null comment '最大人数',
    expireTime  datetime                           not null comment '过期时间',
    userId      bigint comment '队长id',
    status      int      default 0                 not null comment '0-公开，1-私有，2-加密 ',
    password    varchar(256)                       null comment '密码',
    createTime  datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime  datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete    tinyint  default 0                 not null comment '是否删除'
)
    comment '队伍';
```

两个关系：

1. 用户加入了哪些队伍
2. 队伍有哪些用户？

建立 用户-队伍表 user_team

| 字段       | 类型 | 说明     |
| ---------- | ---- | -------- |
| id         |      | 主键     |
| userId     |      | 用户 id  |
| teamId     |      | 队伍Id   |
| joinTime   |      | 加入时间 |
| createTime |      | 创建时间 |
| updateTime |      | 更新时间 |
| isDelete   |      | 是否删除 |

```sql
-- 队伍表
create table user_team
(
    id         bigint auto_increment comment 'id' primary key,
    userId     bigint comment '用户id',
    teamId     bigint comment '队伍id',
    joinTime   datetime                           null comment '加入时间',

    createTime datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除'
)
    comment '用户-队伍表';
```

增删改查

#### 创建队伍：

1. 请求参数是否为空
2. 是否登录，未登录不允许创建
3. 校验信息
   1. 队伍>1 且<=20
   2. 队伍标题
   3. 描述<=512
   4. status是否公开
   5. 如果是加密，必须要有密码
   6. 超时时间>当前时间
   7. 校验用户最多创建五个队伍
4. 插入队伍信息到队伍表
5. 插入用户=>队伍关系到关系表

```java
    @Override
    @Transactional(rollbackFor = Exception.class)
    public long addTeam(Team team, User loginUser) {
        //1. 请求参数是否为空
        if (team == null) {
            throw new BussinessException(Code.PARAMS_ERROR);
        }
        //2. 是否登录，未登录不允许创建
        if (loginUser == null) {
            throw new BussinessException(Code.NOT_LOGIN);
        }
        //3. 校验信息
        //    1. 队伍>1 且<=20
        int maxNum = Optional.ofNullable(team.getMaxNum()).orElse(0);
        if (maxNum < 1 || maxNum > 20) {
            throw new BussinessException(Code.PARAMS_ERROR, "队伍人数不满足要求");
        }
        //    2. 队伍标题
        String name = team.getName();
        if (StringUtils.isBlank(name) || name.length() > 20) {
            throw new BussinessException(Code.PARAMS_ERROR, "队伍标题不满足要求");
        }
        //    3. 描述<=512
        String description = team.getDescription();
        if (StringUtils.isNotBlank(description) && description.length() > 512) {
            throw new BussinessException(Code.PARAMS_ERROR, "队伍描述过长");
        }
        //    4. status是否公开
        Integer status = Optional.ofNullable(team.getStatus()).orElse(0);
        if (status < 0 || status > 3) {
            throw new BussinessException(Code.PARAMS_ERROR, "队伍状态不满足要求");
        }
        //    5. 如果是加密，必须要有密码
        String password = team.getPassword();
        if (status.equals(TeamStatusEnum.PASSWORD)) {
            if (StringUtils.isBlank(password) || password.length() > 32) {
                throw new BussinessException(Code.PARAMS_ERROR, "密码设置不正确");
            }
        }
        //    6. 超时时间>当前时间
        Date expireTime = team.getExpireTime();
        if (new Date().after(expireTime)) {
            throw new BussinessException(Code.PARAMS_ERROR, "超时时间不正确");
        }
        //    7. 校验用户最多创建五个队伍
        QueryWrapper<Team> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userId", loginUser.getId());
        long hasTeamCount = this.count(queryWrapper);
        if (hasTeamCount >= 5) {
            throw new BussinessException(Code.PARAMS_ERROR, "最多创建五个队伍");
        }
        //4. 插入队伍信息到队伍表
        team.setId(null);
        team.setUserId(loginUser.getId());
        boolean save = this.save(team);
        if (!save) {
            throw new BussinessException(Code.PARAMS_ERROR, "创建队伍失败");
        }
        //5. 插入用户=>队伍关系到关系表
        Long teamId = team.getId();
        UserTeam userTeam = new UserTeam();
        userTeam.setUserId(loginUser.getId());
        userTeam.setTeamId(teamId);
        userTeam.setJoinTime(new Date());
        boolean save1 = userTeamService.save(userTeam);
        if (!save1) {
            throw new BussinessException(Code.PARAMS_ERROR, "创建队伍失败");
        }

        return teamId;
    }
```

#### 查询队伍列表

分页展示队伍列表，根据名称、最大人数等搜索队伍 P0，信息流中不展示已过期的队伍

1. 从请求参数中取出队伍名称等查询条件，如果存在则作为查询条件
2. 不展示已过期的队伍（根据过期时间筛选）
3. 可以通过某个**关键词**同时对名称和描述查询
4. **只有管理员才能查看加密还有非公开的房间**
5. 关联查询已加入队伍的用户信息
6. **关联查询已加入队伍的用户信息（可能会很耗费性能，建议大家用自己写 SQL 的方式实现）**

```java
    @Override
    public List<TeamUserVO> listTeams(TeamQueryDTO teamQueryDto, boolean isAdmin) {
        QueryWrapper<Team> queryWrapper = new QueryWrapper<>();
        if (teamQueryDto != null) {
            Long teamId = teamQueryDto.getId();
            if (teamId != null && teamId > 0) {
                queryWrapper.eq("id", teamId);
            }
            String name = teamQueryDto.getName();
            if (StringUtils.isNotBlank(name)) {
                queryWrapper.like("name", name);
            }

            String description = teamQueryDto.getDescription();
            if (StringUtils.isNotBlank(description)) {
                queryWrapper.like("description", description);
            }
            Integer maxNum = teamQueryDto.getMaxNum();
            if (maxNum != null && maxNum > 0) {
                queryWrapper.eq("maxNum", maxNum);
            }
            Long userId = teamQueryDto.getUserId();
            if (userId != null && userId > 0) {
                queryWrapper.eq("userId", userId);
            }
            Integer status = teamQueryDto.getStatus();
            if (status == null) {
                status = 0;
            }
            if (status > -1) {
                queryWrapper.eq("status", status);
            }
            if (!isAdmin && !status.equals(TeamStatusEnum.PUBLIC)) {
                throw new BussinessException(Code.PARAMS_ERROR, "只能查看公开的队伍");
            }
            String searchText = teamQueryDto.getSearchText();
            if (StringUtils.isNotBlank(searchText)) {
                queryWrapper.and(wrapper -> wrapper.like("name", searchText)
                        .or().like("description", searchText));
            }
        }
        //不展示已过期的队伍
        queryWrapper.and(wrapper -> wrapper.gt("expireTime", new Date())
                .or().isNull("expireTime"));


        List<Team> teamList = this.list(queryWrapper);
        if (CollectionUtils.isEmpty(teamList)) {
            return new ArrayList<>();
        }
        //关联查询用户信息
        //查询队伍和已加入队伍成员信息
        log.info("teamList size:{}", teamList.size());
        List<TeamUserVO> teamUserVOList = new ArrayList<>();
        for (Team team : teamList) {
            Long userId = team.getUserId();
            if (userId == null) {
                continue;
            }
            User user = userService.getById(userId);
            if (user == null) {
                continue;
            }
            TeamUserVO teamUserVO = new TeamUserVO();
            BeanUtils.copyProperties(team, teamUserVO);
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            teamUserVO.setCreateUser(userVO);
            teamUserVOList.add(teamUserVO);
        }
        return teamUserVOList;
    }
```



#### 修改队伍信息

1. 查询队伍是否存在
2. 只有管理员或者队伍的创建者可以修改
3. 如果用户传入的值和老的一致，就不用update

```java
    @Override
    public boolean updateTeam(TeamUpdateDTO teamUpdateDTO, User loginUser) {
        if (teamUpdateDTO == null) {
            throw new BussinessException(Code.PARAMS_ERROR);
        }
        Long id = teamUpdateDTO.getId();
        if (id == null || id <= 0) {
            throw new BussinessException(Code.PARAMS_ERROR);
        }
        Team oldTeam = this.getById(id);
        if (oldTeam == null) {
            throw new BussinessException(Code.PARAMS_ERROR);
        }
        if (oldTeam.getUserId() != loginUser.getId() && !userService.isAdmin(loginUser)) {
            throw new BussinessException(Code.NO_AUTH, "只能修改自己创建的队伍");
        }
        if (oldTeam.getStatus().equals(TeamStatusEnum.PASSWORD)) {
            if (StringUtils.isBlank(teamUpdateDTO.getPassword())) {
                throw new BussinessException(Code.PARAMS_ERROR, "加密房间必须要设置密码");
            }
        }

        Team team = new Team();
        BeanUtils.copyProperties(teamUpdateDTO, team);
        return this.updateById(team);

    }
```

#### 用户加入队伍

其他人、未满、未过期，允许加入多个队伍，但是要有个上限 P0

1. 用户最多加入 5 个队伍
2. 队伍必须存在，只能加入未满、未过期的队伍
3. 不能加入自己的队伍，不能重复加入已加入的队伍（幂等性）
4. 禁止加入私有的队伍
5. 如果加入的队伍是加密的，必须密码匹配才可以
6. 新增队伍 - 用户关联信息

加入队伍，如果一个用户疯狂点击，可能会出现错误，需要加一把分布式锁

```java
        public boolean joinTeam(TeamJoinDTO teamJoinDTO, User loginUser) {
        if (teamJoinDTO == null) {
            throw new BussinessException(Code.PARAMS_ERROR);
        }
        Long teamId = teamJoinDTO.getTeamId();
        Team team = getTeamById(teamId);
        if (team.getExpireTime() != null && team.getExpireTime().before(new Date())) {
            throw new BussinessException(Code.PARAMS_ERROR, "队伍已过期");
        }
        if (team.getStatus().equals(TeamStatusEnum.PRIVATE)) {
            throw new BussinessException(Code.NULL_ERROR, "禁止加入私有队伍");
        }
        String password = teamJoinDTO.getPassword();
        if (team.getStatus().equals(TeamStatusEnum.PASSWORD)) {
            if (StringUtils.isBlank(password) || !password.equals(team.getPassword())) {
                throw new BussinessException(Code.PARAMS_ERROR, "密码错误");
            }
        }

        Long userId = loginUser.getId();
        //分布式锁
        RLock lock = redissonClient.getLock("ikun:join_team");

        try {
            while (true) {
                if (lock.tryLock(0, 30000, TimeUnit.MICROSECONDS)) {
                    System.out.println("getLock" + Thread.currentThread().getId());
                    QueryWrapper<UserTeam> userTeamQueryWrapper = new QueryWrapper<>();
                    userTeamQueryWrapper.eq("userId", userId);
                    long count = userTeamService.count(userTeamQueryWrapper);
                    if (count > 5) {
                        throw new BussinessException(Code.PARAMS_ERROR, "最多创建和加入五个队伍");
                    }
                    //不能重复加入已加入的队伍
                    userTeamQueryWrapper = new QueryWrapper<>();
                    userTeamQueryWrapper.eq("userId", userId);
                    userTeamQueryWrapper.eq("teamId", teamId);
                    long count2 = userTeamService.count(userTeamQueryWrapper);
                    if (count2 > 0) {
                        throw new BussinessException(Code.PARAMS_ERROR, "不能重复加入已加入的队伍");
                    }

                    //已加入队伍的人数
                    long count1 = countTeamUserByTeamId(teamId);
                    if (count1 >= team.getMaxNum()) {
                        throw new BussinessException(Code.PARAMS_ERROR, "队伍已满");
                    }

                    //插入用户=>队伍关系到关系表
                    UserTeam userTeam = new UserTeam();
                    userTeam.setUserId(userId);
                    userTeam.setTeamId(teamId);
                    userTeam.setJoinTime(new Date());
                    return userTeamService.save(userTeam);
                }
            }
        } catch (Exception e) {
            throw new BussinessException(Code.SYSTEM_ERROR);
        } finally {
            //只能释放自己的锁
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

```

#### 用户可以退出队伍

请求参数：队伍 id

1. 校验请求参数

2. 校验队伍是否存在

3. 校验我是否已加入队伍

4. 如果队伍

   1. 只剩一人，队伍解散

   2. 还有其他人

      1. 如果是队长退出队伍，权限转移给第二早加入的用户 —— 先来后到

         \> 只用取 id 最小的 2 条数据

      2. 非队长，自己退出队伍

```java
    @Transactional(rollbackFor = Exception.class)
    public boolean quitTeam(TeamQuitDTO teamQuitDTO, User loginUser) {
        if (teamQuitDTO == null) {
            throw new BussinessException(Code.PARAMS_ERROR);
        }
        long teamId = teamQuitDTO.getTeamId();
        Team team = getTeamById(teamId);
        long userId = loginUser.getId();
        UserTeam queryUserTeam = new UserTeam();
        queryUserTeam.setTeamId(teamId);
        queryUserTeam.setUserId(userId);
        QueryWrapper<UserTeam> userTeamQueryWrapper = new QueryWrapper<>(queryUserTeam);
        long count = userTeamService.count(userTeamQueryWrapper);
        if (count == 0) {
            throw new BussinessException(Code.PARAMS_ERROR, "未加入队伍");
        }
        long teamHasJoinNum = countTeamUserByTeamId(teamId);
        if (teamHasJoinNum == 1) {
            //如果队伍只有一个人，直接删除队伍
            return this.removeById(teamId);
        } else {
            //如果队伍有多个人
            if (team.getUserId() == userId) {
                //如果是队长，把队伍给最早加入的用户
                QueryWrapper<UserTeam> userTeamQueryWrapper1 = new QueryWrapper<>();
                userTeamQueryWrapper1.eq("teamId", teamId);
                userTeamQueryWrapper1.last("order by id asc limit 2");
                List<UserTeam> userTeamList = userTeamService.list(userTeamQueryWrapper1);
                if (CollectionUtils.isEmpty(userTeamList) || userTeamList.size() < 2) {
                    throw new BussinessException(Code.SYSTEM_ERROR, "队伍异常");
                }
                UserTeam nextUserTeam = userTeamList.get(1);
                Long nextUserTeamUserId = nextUserTeam.getUserId();
                //更新队伍的队长
                Team updateTeam = new Team();
                updateTeam.setId(teamId);
                updateTeam.setUserId(nextUserTeamUserId);
                boolean result = this.updateById(updateTeam);
                if (!result) {
                    throw new BussinessException(Code.SYSTEM_ERROR, "更新队伍队长失败");
                }
            }
        }
        //删除用户=>队伍关系到关系表
        return userTeamService.remove(userTeamQueryWrapper);
    }
```

#### 队长可以解散队伍

请求参数：队伍 id

业务流程：

1. 校验请求参数
2. 校验队伍是否存在
3. 校验你是不是队伍的队长
4. 移除所有加入队伍的关联信息
5. 删除队伍

####  获取当前用户已加入的队伍

```java
    public Result<List<TeamUserVO>> listMyJoinTeams(TeamQueryDTO teamQueryDto, HttpServletRequest request) {
        if (teamQueryDto == null) {
            throw new BussinessException(Code.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);

        QueryWrapper<UserTeam> userTeamQueryWrapper = new QueryWrapper<>();
        userTeamQueryWrapper.eq("userId", loginUser.getId());
        List<UserTeam> userTeamList = userTeamService.list(userTeamQueryWrapper);
        //取出不重复的队伍id teamId(单)=>userId(多)
        Map<Long, List<UserTeam>> listMap = userTeamList.stream().collect(Collectors.groupingBy(UserTeam::getTeamId));
        List<Long> idList = new ArrayList<>(listMap.keySet());
        teamQueryDto.setIdList(idList);
        List<TeamUserVO> teamList = teamService.listTeams(teamQueryDto, true);
        return ResultUtils.success(teamList);
    }

```


####  获取当前用户创建的队伍

复用 listTeam 方法，只新增查询条件，不做修改（开闭原则）

```java
    public Result<List<TeamUserVO>> listMyCreateTeams(TeamQueryDTO teamQueryDto, HttpServletRequest request) {
        if (teamQueryDto == null) {
            throw new BussinessException(Code.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        teamQueryDto.setUserId(loginUser.getId());
        List<TeamUserVO> teamList = teamService.listTeams(teamQueryDto, true);
        return ResultUtils.success(teamList);
    }

```

## 随机匹配

根据标签tag匹配

找到有相似标签的用户

1. 找到有共同标签最多的用户
2. 共同标签越多，分数越高，越排在前面
3. 如果没有匹配的用户，随机推荐几个

```java
    public static int minDistance(List<String> tagList1, List<String> tagList2) {
        int n = tagList1.size();
        int m = tagList2.size();

        if (n * m == 0)
            return n + m;

        int[][] d = new int[n + 1][m + 1];
        for (int i = 0; i < n + 1; i++) {
            d[i][0] = i;
        }

        for (int j = 0; j < m + 1; j++) {
            d[0][j] = j;
        }

        for (int i = 1; i < n + 1; i++) {
            for (int j = 1; j < m + 1; j++) {
                int left = d[i - 1][j] + 1;
                int down = d[i][j - 1] + 1;
                int left_down = d[i - 1][j - 1];
                if (!tagList1.get(i - 1).equals(tagList2.get(j - 1)))
                    left_down += 1;
                d[i][j] = Math.min(left, Math.min(down, left_down));
            }
        }
        return d[n][m];
    }
```


```java
    public List<User> matchUsers(long num, User loginUser) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("id", "tags");
        queryWrapper.isNotNull("tags");
        List<User> userList = this.list(queryWrapper);
        String tags = loginUser.getTags();
        Gson gson = new Gson();
        List<String> tagList = gson.fromJson(tags, new TypeToken<List<String>>() {
        }.getType());
        List<Pair<User, Long>> list = new ArrayList<>();
        for (int i = 0; i < userList.size(); i++) {
            User user = userList.get(i);
            String userTags = user.getTags();
            //无标签或者是自己，跳过
            if (StringUtils.isBlank(userTags) || user.getId().equals(loginUser.getId())) {
                continue;
            }
            List<String> userTagList = gson.fromJson(userTags, new TypeToken<List<String>>() {
            }.getType());
            int distance = AlgorithmUtils.minDistance(tagList, userTagList);
            list.add(new Pair<>(user, (long) distance));
        }
        //按照编辑距离从小到达排序
        List<Pair<User, Long>> topUserPairList = list.stream()
                .sorted((a, b) -> (int) (a.getValue() - b.getValue()))
                .limit(num)
                .collect(Collectors.toList());
        List<Long> userIdList = topUserPairList.stream().map(userLongPair -> userLongPair.getKey().getId()).collect(Collectors.toList());
        QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
        userQueryWrapper.in("id", userIdList);
        Map<Long, List<User>> userIdUserListMap = this.list(userQueryWrapper)
                .stream()
                .map(user -> getSafetyUser(user))
                .collect(Collectors.groupingBy(User::getId));
        List<User> finalUserList = new ArrayList<>();
        for (Long userId : userIdList) {
            finalUserList.add(userIdUserListMap.get(userId).get(0));
        }
        return finalUserList;
    }

```

编辑距离算法：[https://blog.csdn.net/DBC_121/article/details/104198838](https://blog.csdn.net/DBC_121/article/details/104198838)

> 最小编辑距离：字符串 1 通过最少多少次增删改字符的操作可以变成字符串 2



#### 2. 怎么对所有用户匹配，取 TOP

直接取出所有用户，依次和当前用户计算分数，取 TOP N（54 秒）

优化方法：

1. 切忌不要在数据量大的时候循环输出日志（取消掉日志后 20 秒）
    
2. Map 存了所有的分数信息，占用内存
    
    解决：维护一个固定长度的有序集合（sortedSet），只保留分数最高的几个用户（时间换空间）
    
    e.g.【3, 4, 5, 6, 7】取 TOP 5，id 为 1 的用户就不用放进去了
    
3. 细节：剔除自己 √
    
4. 尽量只查需要的数据：
    
    1. 过滤掉标签为空的用户 √
        
    2. 根据部分标签取用户（前提是能区分出来哪个标签比较重要）
        
    3. 只查需要的数据（比如 id 和 tags） √（7.0s）
        
5. 提前查？（定时任务）
    
    1. 提前把所有用户给缓存（不适用于经常更新的数据）
        
    2. 提前运算出来结果，缓存（针对一些重点用户，提前缓存）
        

大数据推荐，比如说有几亿个商品，难道要查出来所有的商品？

难道要对所有的数据计算一遍相似度？

检索 => 召回 => 粗排 => 精排 => 重排序等等

检索：尽可能多地查符合要求的数据（比如按记录查）

召回：查询可能要用到的数据（不做运算）

粗排：粗略排序，简单地运算（运算相对轻量）

精排：精细排序，确定固定排位



优化、上线

重复加入队伍的问题（加锁、分布式锁）并发请求时可能出现问题

**分布式锁**
