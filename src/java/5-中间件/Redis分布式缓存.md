---
title: 分布式缓存
date: 2023-11-10
category: 
    - 中间件
    - Redis
tag:
    - 中间件
    - Redis

---

# Redis分布式缓存

## Redis持久化

Redis持久化有两种方案：

- RDB持久化
- AOF持久化

### RDB持久化

RDB（Relational
Database）持久化是指将内存中的数据库状态保存到硬盘上的一种持久化存储方式，以便在服务器重新启动时恢复数据。当Redis实例故障重启后，从磁盘读取快照文件，恢复数据。快照文件称为RDB文件，默认是保存在当前运行目录。

#### 执行时机

1. **手动触发：** 可以使用命令 `SAVE` 或 `BGSAVE` 来手动触发RDB持久化。
    - `SAVE` 阻塞服务器进程，直到持久化过程完成，期间服务器不能处理其他请求。
    - `BGSAVE` 在后台进行持久化，不会阻塞服务器的正常操作。
2. **自动触发：**

+ 你可以通过配置文件中的 `save`
  指令设置自动触发RDB持久化的条件。默认配置中会有一条规则，表示当900秒（15分钟）内至少有1个键被修改，就执行 `BGSAVE` 操作。
+ Redis停机时

执行save命令

查看保存在哪里：`config get dir`,即redis的安装目录
![image.png](https://s2.loli.net/2023/11/10/aZDStMg5HluspE2.webp)

执行bgsave
![image.png](https://s2.loli.net/2023/11/10/uc8diKNf52IPVsR.webp)
这个命令执行后会开启独立进程完成RDB，主进程可以持续处理用户请求，不受影响。

修改redis.conf文件：
![image.png](https://s2.loli.net/2023/11/10/Tra9dOvcDlMnqLR.webp)

修改save之后的保存位置：
![image.png](https://s2.loli.net/2023/11/10/kXnWuKJriOtz3be.webp)

#### RDB原理

bgsave开始时会fork主进程得到子进程，子进程共享主进程的内存数据。完成fork后读取内存数据并写入 RDB 文件。
fork采用的是copy-on-write技术：

- 当主进程执行读操作时，访问共享内存；
- 当主进程执行写操作时，则会拷贝一份数据，执行写操作。

### AOF持久化

AOF（Append-only File）是Redis中另一种持久化机制，用于将写操作追加到一个文件中。相较于RDB持久化，AOF持久化提供了更细粒度的持久化，记录每个写命令的操作，而不是周期性地保存整个数据集的快照。
等 需要数据的时候，将这个文件 从头到尾执行一边，即可 得到准确的数据

修改conf文件 进行 配置：

```conf
# 是否开启AOF功能，默认是no
appendonly yes
# AOF文件的名称
appendfilename "appendonly.aof"
```

修改记录 频率：

```conf
# 表示每执行一次写命令，立即记录到AOF文件
appendfsync always 
# 写命令执行完先放入AOF缓冲区，然后表示每隔1秒将缓冲区数据写到AOF文件，是默认方案
appendfsync everysec 
# 写命令执行完先放入AOF缓冲区，由操作系统决定何时将缓冲区内容写回磁盘
appendfsync no
```

![image-20210725151654046.png](https://s2.loli.net/2023/11/10/Tyzh4xVulXjHrJm.webp)

#### AOF文件重写

因为是记录命令，AOF文件会比RDB文件大的多。而且AOF会记录对同一个key的多次写操作，但只有最后一次写操作才有意义。通过执行bgrewriteaof命令，可以让AOF文件执行重写功能，用最少的命令达到相同效果。

```bash
bgrewriteaof
```

也可以配置自动触发：

```conf
# AOF文件比上次文件 增长超过多少百分比则触发重写
auto-aof-rewrite-percentage 100
# AOF文件体积最小多大以上才触发重写 
auto-aof-rewrite-min-size 64mb 
```

两种方式对比：
![image-20210725151940515.png](https://s2.loli.net/2023/11/10/2DcJhLBUq7HlzSE.webp)

## Redis主从集群

单节点Redis的并发能力是有上限的，要进一步提高Redis的并发能力，就需要搭建主从集群，实现读写分离。
![image-20210725152037611.png](https://s2.loli.net/2023/11/10/MTGOrgI9ewxtKA3.webp)

搭建Redis集群
新建三个文件夹 7001 7002 7003
将配置文件拷贝到每一个文件夹下面
分别修改每个配置文件的端口为7001 ,7002,7003
修改rdb文件的保存目录：

```conf
dir /Users/houyunfei/tools/redis/7001
```

三个都需要修改

然后启动三个redis

```bash
redis-server 7001/redis.conf
```

![image.png](https://s2.loli.net/2023/11/10/yKohGxP4QReSBXr.webp)

让7002的主设置为7001，7003同理
![image.png](https://s2.loli.net/2023/11/10/mDjUNG4VBvPLHAe.webp)

可以看到此时7001成为了master
![image.png](https://s2.loli.net/2023/11/10/yw9ZWephJfF2Brn.webp)

当7001成为了主之后，他设置的值都可以被7002和7003读取到，但是7002和7003不可以写，只可以读
![image.png](https://s2.loli.net/2023/11/10/dRXnDLQ3eYUcOpb.webp)

主从分离：

+ 主节点做写
+ 从节点做读
