---
title: MySQL语句
date: 2024-06-17
category:
  - MySQL
tag:
  - MySQL
---

# MySQL进阶篇 存储引擎



#### 查询建表语句 展示默认的存储引擎：InnoDB

show create table account;



#### 查询当前数据库支持的存储引擎

show engines;  

InnoDB（支持事务，外键和行级锁）



MyISAM -> 被MongoDB所替代

MEMORY -> 被Redis所替代