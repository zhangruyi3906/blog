---
title: MySQL下
date: 2023-10-31
category:
  - mysql
tag:
  - mysql
---
# MySQL

## 约束
约束是作用于表中字段上的规则，用于限制存储在表中的数据。
目的：保证数据库中数据的正确、有效性和完整性。
| 约束     | 描述         | 关键字      |
| -------- | ------------ | ----------- |
| 非空     | 不能为null   | not null    |
| 唯一约束 | 唯一         | unique      |
| 主键     | 非空唯一     | primary key |
| 默认     | 默认值     | default     |
| 检查约束 | 满足一个条件 | check       |
| 外键     | 两张表的链接 | for            |

添加外键语法：
```sql
CREATE TABLE 表名(
字段名 数据类型,
...
[CONSTRAINT] [外键名称] FOREIGN KEY (外键字段名) REFERENCES 主表 (主表列名)
);
```

```sql
ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段名)
REFERENCES 主表 (主表列名) ;
```

删除外键语法：
ALTER TABLE 表名 DROP FOREIGN KEY 外键名称


删除/更新行为 ：
| 行为        | 说明                           |
| ----------- | ------------------------------ |
| no action   | 先检查是否有，有不允许删       |
| restrict    | 根 no action一样               |
| cascade     | 有也删                         |
| set null    | 删除时有，就把子表外键设为null |
| set default | 设置为一个默认值                               |

语法 ：
ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段) REFERENCES 主表名 (主表字段名) ON UPDATE CASCADE ON DELETE CASCADE;


```sql
drop table if exists tb_user;
CREATE TABLE tb_user
(
    id     int AUTO_INCREMENT PRIMARY KEY COMMENT 'ID唯一标识',
    name   varchar(10) NOT NULL UNIQUE COMMENT '姓名',
    age    int check (age > 0 && age <= 120) COMMENT '年龄',
    status char(1) default '1' COMMENT '状态',
    gender char(1) COMMENT '性别'
);

insert into tb_user(name, age, status, gender)
values ('Tom1', 19, '1', '男'),
       ('Tom2', 25, '0', '男');
insert into tb_user(name, age, status, gender)
values ('Tom3', 19, '1', '男');
insert into tb_user(name, age, status, gender)
values (null, 19, '1', '男');
insert into tb_user(name, age, status, gender)
values ('Tom3', 19, '1', '男');
insert into tb_user(name, age, status, gender)
values ('Tom4', 80, '1', '男');
insert into tb_user(name, age, status, gender)
values ('Tom5', -1, '1', '男');
insert into tb_user(name, age, status, gender)
values ('Tom5', 121, '1', '男');
insert into tb_user(name, age, gender)
values ('Tom5', 120, '男');

# 外键约束
drop table if exists dept;
create table dept
(
    id   int auto_increment comment 'ID' primary key,
    name varchar(50) not null comment '部门名称'
) comment '部门表';
INSERT INTO dept (id, name)
VALUES (1, '研发部'),
       (2, '市场部'),
       (3, '财务部'),
       (4, '销售部'),
       (5, '总经办');
drop table if exists emp;
create table emp
(
    id        int auto_increment comment 'ID' primary key,
    name      varchar(50) not null comment '姓名',
    age       int comment '年龄',
    job       varchar(20) comment '职位',
    salary    int comment '薪资',
    entrydate date comment '入职时间',
    managerid int comment '直属领导ID',
    dept_id   int comment '部门ID'
) comment '员工表';
INSERT INTO emp (id, name, age, job, salary, entrydate, managerid, dept_id)
VALUES (1, '金庸', 66, '总裁', 20000, '2000-01-01', null, 5),
       (2, '张无忌', 20, '项目经理', 12500, '2005-12-05', 1, 1),
       (3, '杨逍', 33, '开发', 8400, '2000-11-03', 2, 1),
       (4, '韦一笑', 48, '开发', 11000, '2002-02-05', 2, 1),
       (5, '常遇春', 43, '开发', 10500, '2004-09-07', 3, 1),
       (6, '小昭', 19, '程序员鼓励师', 6600, '2004-10-12', 2, 1);

# 添加外键 约束
alter table emp add  constraint  fk_emp_dept_id foreign key (dept_id) references dept(id);
# 此时删除报错
delete from dept where id=1;

# 删除外键
alter table emp drop foreign key fk_emp_dept_id;

# cascade 级联操作
alter table emp add constraint  fl_emp_dept_id foreign key
(dept_id) references dept(id) on update cascade on delete cascade;
# 修改父表id为1的记录，id改为6 此时会把emp表的dept_id为1的记录全部也改为6
update dept set id=6 where id=1;
#删除父表id为6的记录，此时会把emp表的dept_id为6的记录全部删除
delete from dept where id=6;
# set null 此时会把emp表的dept_id为6的记录全部改为null
alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references
    dept(id) on update set null on delete set null ;
delete from dept where id=1;

```

## 多表查询

多表关系 ：
+ 一对一
+ 一对多
+ 多对多

### 一对一

例如：用户 与 用户详情的关系 
关系: 一对一关系，多用于单表拆分，将一张表的基础字段放在一张表中，其他详情字段放在另 一张表中，以提升操作效率 
实现: 在任意一方加入外键，关联另外一方的主键，并且设置外键为唯一的(UNIQUE)

![image.png](https://s2.loli.net/2023/10/31/QIM8hwOqsFN4YLe.webp)

```sql
drop table if exists tb_user;
create table tb_user
(
    id     int auto_increment primary key comment '主键ID',
    name   varchar(10) comment '姓名',
    age    int comment '年龄',
    gender char(1) comment '1: 男 , 2: 女',
    phone  char(11) comment '手机号'
) comment '用户基本信息表';

drop table if exists tb_user_edu;
create table tb_user_edu
(
    id            int auto_increment primary key comment '主键ID',
    degree        varchar(20) comment '学历',
    major         varchar(50) comment '专业',
    primaryschool varchar(50) comment '小学',
    middleschool  varchar(50) comment '中学',
    university    varchar(50) comment '大学',
    userid        int unique comment '用户ID',
    constraint fk_userid foreign key (userid) references tb_user (id)
) comment '用户教育信息表';
insert into tb_user(id, name, age, gender, phone)
values (null, '黄渤', 45, '1', '18800001111'),
       (null, '冰冰', 35, '2', '18800002222'),
       (null, '码云', 55, '1', '18800008888'),
       (null, '李彦宏', 50, '1', '18800009999');
insert into tb_user_edu(id, degree, major, primaryschool, middleschool,
                        university, userid)
values (null, '本科', '舞蹈', '静安区第一小学', '静安区第一中学', '北京舞蹈学院', 1),
       (null, '硕士', '表演', '朝阳区第一小学', '朝阳区第一中学', '北京电影学院', 2),
       (null, '本科', '英语', '杭州市第一小学', '杭州市第一中学', '杭州师范大学', 3),
       (null, '本科', '应用数学', '阳泉第一小学', '阳泉区第一中学', '清华大学', 4);
```
### 一对多
例如：部门和员工的关系，一个部门对应多个员工，一个员工对应一个部门
实现：在多的一方添加外键，指向一的一方的主键
![image.png](https://s2.loli.net/2023/10/31/WOJSVRB4DEPZj9A.webp)

建表语句如下 ：
```sql
drop table if exists dept;
create table dept
(
    id   int auto_increment comment 'ID' primary key,
    name varchar(50) not null comment '部门名称'
) comment '部门表';
INSERT INTO dept (id, name)
VALUES (1, '研发部'),
       (2, '市场部'),
       (3, '财务部'),
       (4, '销售部'),
       (5, '总经办');
drop table if exists emp;
create table emp
(
    id        int auto_increment comment 'ID' primary key,
    name      varchar(50) not null comment '姓名',
    age       int comment '年龄',
    job       varchar(20) comment '职位',
    salary    int comment '薪资',
    entrydate date comment '入职时间',
    managerid int comment '直属领导ID',
    dept_id   int comment '部门ID'
) comment '员工表';
INSERT INTO emp (id, name, age, job, salary, entrydate, managerid, dept_id)
VALUES (1, '金庸', 66, '总裁', 20000, '2000-01-01', null, 5),
       (2, '张无忌', 20, '项目经理', 12500, '2005-12-05', 1, 1),
       (3, '杨逍', 33, '开发', 8400, '2000-11-03', 2, 1),
       (4, '韦一笑', 48, '开发', 11000, '2002-02-05', 2, 1),
       (5, '常遇春', 43, '开发', 10500, '2004-09-07', 3, 1),
       (6, '小昭', 19, '程序员鼓励师', 6600, '2004-10-12', 2, 1);

```

### 多对多
例如：学生 与 课程的关系 关系: 一个学生可以选修多门课程，一门课程也可以供多个学生选择 
实现: 建立第三张中间表，中间表至少包含两个外键，分别关联两方主键
![image.png](https://s2.loli.net/2023/10/31/HzgwcWVNSQqYtDr.webp)

建表语句如下：
```sql
# 多表查询
drop table if exists student;
create table student
(
    id   int auto_increment primary key comment '主键ID',
    name varchar(10) comment '姓名',
    no   varchar(10) comment '学号'
) comment '学生表';
insert into student
values (null, '黛绮丝', '2000100101'),
       (null, '谢逊', '2000100102'),
       (null, '殷天正', '2000100103'),
       (null, '韦一笑', '2000100104');


drop table if exists course;
create table course
(
    id   int auto_increment primary key comment '主键ID',
    name varchar(10) comment '课程名称'
) comment '课程表';
insert into course
values (null, 'Java'),
       (null, 'PHP'),
       (null, 'MySQL'),
       (null, 'Hadoop');

drop table if exists student_course;
create table student_course
(
    id        int auto_increment comment '主键' primary key,
    studentid int not null comment '学生ID',
    courseid  int not null comment '课程ID',
    constraint fk_courseid foreign key (courseid) references course (id),
    constraint fk_studentid foreign key (studentid) references student (id)
) comment '学生课程中间表';
insert into student_course
values (null, 1, 1),
       (null, 1, 2),
       (null, 1, 3),
       (null, 2, 2),
       (null, 2, 3),
       (null, 3, 4);
```

### 多表查询
```sql
-- 创建dept表，并插入数据
drop table if exists dept;
create table dept
(
    id   int auto_increment comment 'ID' primary key,
    name varchar(50) not null comment '部门名称'
) comment '部门表';
INSERT INTO dept (id, name)
VALUES (1, '研发部'),
       (2, '市场部'),
       (3, '财务部'),
       (4, '销售部'),
       (5, '总经办'),
       (6, '人事部');
-- 创建emp表，并插入数据
drop table if exists emp;
create table emp
(
    id        int auto_increment comment 'ID' primary key,
    name      varchar(50) not null comment '姓名',
    age       int comment '年龄',
    job       varchar(20) comment '职位',
    salary    int comment '薪资',
    entrydate date comment '入职时间',
    managerid int comment '直属领导ID',
    dept_id   int comment '部门ID'
) comment '员工表';
-- 添加外键
alter table emp
    add constraint fk_emp_dept_id foreign key (dept_id) references
        dept (id);
INSERT INTO emp (id, name, age, job, salary, entrydate, managerid, dept_id)
VALUES (1, '金庸', 66, '总裁', 20000, '2000-01-01', null, 5),
       (2, '张无忌', 20, '项目经理', 12500, '2005-12-05', 1, 1),
       (3, '杨逍', 33, '开发', 8400, '2000-11-03', 2, 1),
       (4, '韦一笑', 48, '开发', 11000, '2002-02-05', 2, 1),
       (5, '常遇春', 43, '开发', 10500, '2004-09-07', 3, 1),
       (6, '小昭', 19, '程序员鼓励师', 6600, '2004-10-12', 2, 1),
       (7, '灭绝', 60, '财务总监', 8500, '2002-09-12', 1, 3),
       (8, '周芷若', 19, '会计', 48000, '2006-06-02', 7, 3),
       (9, '丁敏君', 23, '出纳', 5250, '2009-05-13', 7, 3),
       (10, '赵敏', 20, '市场部总监', 12500, '2004-10-12', 1, 2),
       (11, '鹿杖客', 56, '职员', 3750, '2006-10-03', 10, 2),
       (12, '鹤笔翁', 19, '职员', 3750, '2007-05-09', 10, 2),
       (13, '方东白', 19, '职员', 5500, '2009-02-12', 10, 2),
       (14, '张三丰', 88, '销售总监', 14000, '2004-10-12', 1, 4),
       (15, '俞莲舟', 38, '销售', 4600, '2004-10-12', 14, 4),
       (16, '宋远桥', 40, '销售', 4600, '2004-10-12', 14, 4),
       (17, '陈友谅', 42, null, 2000, '2011-10-12', 1, null);


# 多表查询 ,这样会得到 17*6=102条数据
select * from emp,dept;
# 去除无效笛卡尔积 这样16条数据，因为id为17的员工没有 dept_id
select * from emp,dept   where emp.dept_id=dept.id;

```

分类：
连接查询
+ 内连接：相当于查询A、B交集部分数据
外连接：
+ 左外连接：查询左表所有数据，以及两张表交集部分数据
+ 右外连接：查询右表所有数据，以及两张表交集部分数据
自连接：当前表与自身的连接查询，自连接必须使用表别名

#### 内连接
隐式内连接:
```sql
SELECT 字段列表 FROM 表1 , 表2 WHERE 条件 ... ;
```
显式内连接:
```sql
SELECT 字段列表 FROM 表1 [ INNER ] JOIN 表2 ON 连接条件 ... ;
```

```sql
# 分类：
# 隐式内连接
select emp.name, dept.name
from emp,
     dept
where emp.dept_id = dept.id;
# 为每一张表起别名
select e.name, d.name
from emp e,
     dept d
where e.dept_id = d.id;
# 显式内连接
select e.name, d.name
from emp e
         inner join dept d on e.dept_id = d.id;
# 起别名
select e.name,d.name
from emp e  join dept d on e.dept_id = d.id;
```

#### 外连接
![image.png](https://s2.loli.net/2023/10/31/m1EWtnGeC2hK6dc.webp)
左外连接：
```sql
SELECT 字段列表 FROM 表1 LEFT [ OUTER ] JOIN 表2 ON 条件 ... ;
```
左外连接相当于查询表1(左表)的所有数据，当然也包含表1和表2交集部分的数据。

右外连接
```sql
SELECT 字段列表 FROM 表1 RIGHT [ OUTER ] JOIN 表2 ON 条件 ... ;
```
右外连接相当于查询表2(右表)的所有数据，当然也包含表1和表2交集部分的数据。

> 左右连接是可以交换的

```sql

# 外连接
# 查询emp表的所有数据, 和对应的部门信息
select e.*, d.name
from emp e
         left outer join
     dept d on e.dept_id = d.id;

# 查询dept表的所有数据, 和对应的员工信息(右外连接
select d.*, e.*
from emp e
         right outer join dept d on e.dept_id = d.id;
```

#### 自连接
自连接查询就是自己连接自己，也就是把一张表连接查询多次。
```sql
SELECT 字段列表 FROM 表A 别名A JOIN 表A 别名B ON 条件 ... ;
```

```sql
# 查询员工 及其 所属领导的名字
select a.name, b.name
from emp a,
     emp b
where a.managerid = b.id;

#查询所有员工 emp 及其领导的名字 emp , 如果员工没有领导, 也需要查询出来
select a.name '员工',b.name '领导'
from emp a left join  emp b on  a.managerid=b.id;

```

#### 联合查询

对于union查询，就是把多次查询的结果合并起来，形成一个新的查询结果集。
```sql
SELECT 字段列表 FROM 表A ...
UNION [ ALL ]
SELECT 字段列表 FROM 表B ....;
```
>对于联合查询的多张表的列数必须保持一致，字段类型也需要保持一致。
> union all 会将全部的数据直接合并在一起，union 会对合并之后的数据去重。

```sql
# 联合查询
#  将薪资低于 5000 的员工 , 和 年龄大于 50 岁的员工全部查询出来.
select * from emp where salary<5000
union all
select * from emp where age>50;
# union all查询出来的结果，仅仅进行简单的合并，并未去重。
# union查询出来的结果，进行了去重操作。
select * from emp where salary<5000
union
select * from emp where age>50;
```

#### 子查询
SQL语句中嵌套SELECT语句，称为嵌套查询，又称子查询。
```sql
SELECT * FROM t1 WHERE column1 = ( SELECT column1 FROM t2 );
```

```sql
# 子查询
# 查询 "销售部" 的所有员工信息
select id from dept where name='销售部';
select * from emp where dept_id=(select id from dept where name='销售部');

# 查询在 "方东白" 入职之后的员工信息
select * from emp where entrydate>(select entrydate from emp where name='方东白');
```

列子查询
子查询返回的结果是一列（可以是多行），这种子查询称为列子查询。

```sql
# 查询 "销售部" 和 "市场部" 的所有员工信息
select *
from emp
where dept_id in (select id from dept where name = '销售部' or name = '市场部');

# 查询比 财务部 所有人工资都高的员工信息
select *
from emp
where salary > all (select salary from emp where dept_id = (select id from dept where name = '财务部'));

#  查询比研发部其中任意一人工资高的员工信息
select *
from emp
where salary > any (select salary from emp where dept_id = (select id from dept where name = '研发部'))
```

行内子查询
子查询返回的结果是一行（可以是多列），这种子查询称为行子查询。

```sql
#  查询与 "张无忌" 的薪资及直属领导相同的员工信息 ;
select * from  emp where (salary,managerid)=(select  salary,managerid from emp where name='张无忌');

```

表子查询
子查询返回的结果是多行多列，这种子查询称为表子查询。


```sql
# 查询与 "鹿杖客" , "宋远桥" 的职位和薪资相同的员工信息
select job,salary from emp where name = '鹿杖客' or name = '宋远桥';
select  * from emp where (job,salary) in (select job,salary from emp where name = '鹿杖客' or name = '宋远桥');

# 查询入职日期是 "2006-01-01" 之后的员工信息 , 及其部门信息
select * from emp where entrydate > '2006-01-01';
select e.*,d.* from (select * from emp where entrydate>'2006-01-01') e left join dept d on e.dept_id=d.id;
```



## 事务 
事务 是一组操作的集合，它是一个不可分割的工作单位，事务会把所有的操作作为一个整体一起向系 统提交或撤销操作请求，即这些操作要么同时成功，要么同时失败。

> 默认MySQL的事务是自动提交的，也就是说，当执行完一条DML语句时，MySQL会立即隐 式的提交事务。

事务控制两种方式
```sql
# 控制事务一
# 查看/设置事务提交方式
select @@autocommit;
set autocommit = 0;
# 提交事务
commit;
# 回滚事务
rollback;

# 控制事务二
# 开启事务
start transaction ;
# 提交事务
commit;
# 回滚事务
rollback;
```

案例：
```sql
# 案例
-- 开启事务
start transaction;
-- 1. 查询张三余额
select * from account where name = '张三';
-- 2. 张三的余额减少1000
update account set money = money - 1000 where name = '张三';
-- 3. 李四的余额增加1000
update account set money = money + 1000 where name = '李四';
-- 如果正常执行完毕, 则提交事务
commit;
-- 如果执行过程中报错, 则回滚事务
-- rollback;
```

事务四大特性：
+ 原子性（Atomicity）：事务是不可分割的最小操作单元，要么全部成功，要么全部失败。 
+ 一致性（Consistency）：事务完成时，必须使所有的数据都保持一致状态。 
+ 隔离性（Isolation）：数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立 环境下运行。 
+ 持久性（Durability）：事务一旦提交或回滚，它对数据库中的数据的改变就是永久的。

事务隔离 级别：
为了解决并发事务所引发的问题，在数据库中引入了事务隔离级别。

```sql
# 查看 事务的隔离级别
select @@transaction_isolation;
```
