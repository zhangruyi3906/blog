---
title: MySQL
date: 2023-10-30
category:
  - MySQL
  - 数据库
tag:
  - MySQL
  - 数据库
---
# MySQL

关系型数据库：建立在关系模型基础上，由多张相互连接的二维表组成的数据库。

## MYSQL基础

### DDL
Data Definition Language，数据定义语言，用来定义数据库对象(数据库，表，字段) 。
相关操作如下：
#### 数据库相关
```sql
# 查询所有数据库
show databases;

#选择数据库
use template;

#  查询当前数据库
select database();

# 创建数据库
create database if not exists cxk;
create database if not exists cxk2 default charset utf8mb4;


# 删除数据库
drop database if exists cxk2;
```

#### 表相关

```sql
# 查询当前数据库所有表
show tables;

# 查看表结构
desc user;

# 查看建表语句
show create table user;

# 创建表结构
create table tb_user
(
    id int comment '编号',
    name varchar(50) comment '姓名',
    age int comment '年龄',
    gender varchar(1) comment '性别'
) comment '用户表'

```

##### 数据类型
###### 数值类型

|类型|大小|范围（有符号）|范围（无符号）|用途|
|---|---|---|---|---|
|TINYINT|1 Bytes|(-128，127)|(0，255)|小整数值|
|SMALLINT|2 Bytes|(-32 768，32 767)|(0，65 535)|大整数值|
|MEDIUMINT|3 Bytes|(-8 388 608，8 388 607)|(0，16 777 215)|大整数值|
|INT或INTEGER|4 Bytes|(-2 147 483 648，2 147 483 647)|(0，4 294 967 295)|大整数值|
|BIGINT|8 Bytes|(-9,223,372,036,854,775,808，9 223 372 036 854 775 807)|(0，18 446 744 073 709 551 615)|极大整数值|
|FLOAT|4 Bytes|(-3.402 823 466 E+38，-1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38)|0，(1.175 494 351 E-38，3.402 823 466 E+38)|单精度  <br>浮点数值|
|DOUBLE|8 Bytes|(-1.797 693 134 862 315 7 E+308，-2.225 073 858 507 201 4 E-308)，0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308)|0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308)|双精度  <br>浮点数值|
|DECIMAL|对DECIMAL(M,D) ，如果M>D，为M+2否则为D+2|依赖于M和D的值|依赖于M和D的值|小数值|

###### 字符串类型
|类型|大小|用途|
|---|---|---|
|CHAR|0-255 bytes|定长字符串|
|VARCHAR|0-65535 bytes|变长字符串|
|TINYBLOB|0-255 bytes|不超过 255 个字符的二进制字符串|
|TINYTEXT|0-255 bytes|短文本字符串|
|BLOB|0-65 535 bytes|二进制形式的长文本数据|
|TEXT|0-65 535 bytes|长文本数据|
|MEDIUMBLOB|0-16 777 215 bytes|二进制形式的中等长度文本数据|
|MEDIUMTEXT|0-16 777 215 bytes|中等长度文本数据|
|LONGBLOB|0-4 294 967 295 bytes|二进制形式的极大文本数据|
|LONGTEXT|0-4 294 967 295 bytes|极大文本数据|

###### 日期和时间类型
|类型|大小  <br>( bytes)|范围|格式|用途|
|---|---|---|---|---|
|DATE|3|1000-01-01/9999-12-31|YYYY-MM-DD|日期值|
|TIME|3|'-838:59:59'/'838:59:59'|HH:MM:SS|时间值或持续时间|
|YEAR|1|1901/2155|YYYY|年份值|
|DATETIME|8|'1000-01-01 00:00:00' 到 '9999-12-31 23:59:59'|YYYY-MM-DD hh:mm:ss|混合日期和时间值|
|TIMESTAMP|4|'1970-01-01 00:00:01' UTC 到 '2038-01-19 03:14:07' UTC<br><br>结束时间是第 **2147483647** 秒，北京时间 **2038-1-19 11:14:07**，格林尼治时间 2038年1月19日 凌晨 03:14:07|YYYY-MM-DD hh:mm:ss|混合日期和时间值，时间戳|
- `CHAR`（字符）：`CHAR` 类型用于存储定长字符串。这意味着无论实际字符串长度是多少，`CHAR` 列始终占据固定数量的字符位置。如果存储的字符串不足指定长度，MySQL 会使用空格进行填充。这会导致 `CHAR` 类型占用的存储空间通常较大，但检索数据速度较快。
- `VARCHAR`（可变字符）：`VARCHAR` 类型用于存储可变长度字符串。它只占据实际数据的存储空间，不会浪费额外的空间用于填充。因此，`VARCHAR` 类型在存储时通常更有效，但在检索数据时可能略慢一些。

##### 表操作案例
```sql
# 表操作案例
create table emp
(
    id int comment '编号',
    workno varchar(10) comment '员工编号',
    name varchar(10) comment '姓名',
    gender char(1) comment '性别',
    age tinyint comment '年龄',
    idcard char(18) comment '身份证',
    entrydate date comment '入职时间'
) comment '员工表'
```

##### 字段修改
```sql
# 添加字段
alter table emp
    add nickname varchar(20) comment '昵称';

# 修改数据类型
alter table emp
    modify nickname varchar(30);

# 修改字段和字段类型
alter table emp
    change nickname username varchar(30) comment '昵称';

# 删除字段
alter table emp
    drop username;

# 修改表名
 alter table emp rename to employee;

# 删除表
drop table if exists tb_user;
```



### DML
DML英文全称是Data Manipulation Language(数据操作语言)，用来对数据库中表的数据记录进
行增、删、改操作。

```sql
# 添加数据
insert into tb_user(id, name, age, gender)
values (1, '蔡徐坤', 18, '女');

# 给全部字段添加数据
insert into tb_user
values (2, '蔡徐坤', 18, '女');

# 批量添加数据
insert into tb_user (id, name, age, gender)
values (3, '蔡徐坤', 18, '女'),
       (4, '蔡徐坤', 18, '女');


# 查询数据

select * from tb_user;

# 修改数据
update tb_user set name='蔡徐坤爸爸' where id = 4;

update tb_user set name='蔡徐坤奶奶',   age=100 where id = 3;

update tb_user set gender='男';


# 删除数据
delete from tb_user where id = 2;

# 删除所有
delete from tb_user;
```

### DQL
DQL英文全称是Data Query Language(数据查询语言)，数据查询语言，用来查询数据库中表的记
录。

```sql
SELECT
	字段列表
FROM
	表名列表
WHERE
	条件列表
GROUP BY
	分组字段列表
HAVING
	分组后条件列表
ORDER BY
	排序字段列表
LIMIT
	分页参数
```


#### 基础查询
```sql
# 查询多个字段
select id,name from emp;
select * from emp;

# 字段设置别名
select id,name as 姓名 from emp;
select id as 序号,name as 姓名 from emp;

# 去重
select distinct workaddress as  '工作地址' from emp;
```

#### 条件查询

```sql

# 条件查询 =
select  * from  emp where age=18;
# 查询年龄<20
select  * from emp where age<20;
# 查询没有身份证的人
select * from emp where idcard is null  ;
# 查询有身份证的人
select  * from emp where idcard is not null;
# 查询年龄不等于88的人
select  * from emp where age!=88;
# 查询年龄在15到20的人
select  * from emp where age>=15 and age<=20;
select  * from emp where age>=15 && age<=20;
select  * from emp where age between 15 and 20;
# 查询性别为女，年龄<25的员工
select  * from emp where age<25 and gender='女';
# 查询年龄为18 ，20 ，40岁的人
select * from emp where age=18 or age=20 or age=40;
# 查询姓名为两个字的员工
select * from  emp where name like '__';
# 查询身份证最后一个是x的人
select * from  emp where idcard like '%X';
select * from  emp where idcard like '_________________X';

```

#### 聚合函数

```sql
# 统计总的记录数
select count(*)  from emp;
# 统计的是idcard字段不为null的记录数
select  count(idcard) from emp;
select  count(1) from emp;
# 统计平均年龄
select avg(age) from emp;
# 统计最大年龄
select max(age) from emp;
# 统计最小年龄
select  min(age) from  emp;
# 统计西安地区员工的年龄之和
select sum(age) from emp where workaddress='西安';
```

#### 分组查询

格式：
```sql
SELECT 字段列表 FROM 表名 [ WHERE 条件 ] GROUP BY 分组字段名 [ HAVING 分组
后过滤条件 ];
```

where 和 having的区别：
+ where 是在分组之前进行过滤，不能进行聚合函数判断
+ having是在分组之后进行过滤，可以进行聚合函数判断
执行顺序：where > 聚合函数 > having 。

```sql
# 分组查询男女数量
select gender,count(*) from emp group by  gender;
# 分组统计男女平均年龄
select  gender,avg(age) from emp group by gender;
# 查询年龄小于45的员工 , 并根据工作地址分组 , 获取员工数量大于等于3的工作地址
select workaddress,count(*) cnt from emp
where age<45 group by workaddress having  cnt>=3;

# 统计各个工作地址上班的男性及女性员工的数量
select  workaddress,gender,count(*)  '数量' from emp
group by gender, workaddress;
```

#### 排序查询

格式：
```sql
SELECT 字段列表 FROM 表名 ORDER BY 字段1 排序方式1 , 字段2 排序方式2 ;
```

ASC：升序
DESC：降序
> 如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序

```sql
# 根据年龄升序排序
select * from  emp order by  age asc ;
# 根据入职时间，降序排序
select  * from  emp order by entrydate desc ;
# 根据年龄升序，入职时间降序排序
select * from  emp order by age asc,entrydate desc;
```


#### 分页查询
格式：
```sql
SELECT 字段列表 FROM 表名 LIMIT 起始索引, 查询记录数 
```

起始索引从0开始，起始索引 = （查询页码 - 1）* 每页显示记录数。
> 如果查询的是第一页数据，起始索引可以省略，直接简写为 limit 10。

```sql
# 查询第一页，每页10条
select * from  emp limit 0,10;
select * from  emp limit 10;
#查询第二页，每页10条 公式：(页码-1)*每页条数
select * from emp limit 10,10;
```

#### 练习

```sql
# 查询年龄为20,21,22,23岁的女员工信息。
select * from  emp where gender='女' and age in (20,21,22,23);
# 查询性别为 男 ，并且年龄在 20-40 岁(含)以内的姓名为三个字的员工。
select  * from emp where gender='男' and (age between 20 and 40) and name like '___';
# 统计员工表中, 年龄小于60岁的 , 男性员工和女性员工的人数。
select  gender,count(*) from emp where age<60 group by gender;
# 查询所有年龄小于等于35岁员工的姓名和年龄，并对查询结果按年龄升序排序，如果年龄相同按入职时间降序排序。
select name,age from emp where age<=35 order by age asc,entrydate desc;
# 查询性别为男，且年龄在20-40 岁(含)以内的前5个员工信息，对查询的结果按年龄升序排序，年龄相同按入职时间升序排序
select * from emp where gender='男' and age between 20 and 40 order by age asc,entrydate asc limit 5;
```

执行顺序
![image.png](https://s2.loli.net/2023/10/30/HfmqpzD6WkcsRBi.webp)

### DCL
DCL英文全称是Data Control Language(数据控制语言)，用来管理数据库用户、控制数据库的访 问权限。
#### 用户管理
```sql
# 查询用户
select * from  mysql.user;
# 创建用户
create user 'test'@'localhost' identified by '12345678';
# 修改用户密码
alter user 'test'@'localhost'  identified with  mysql_native_password by '123456789';
# 删除用户
drop user 'test'@'localhost';

```

#### 权限控制
| 权限               | 说明     |
| ------------------ | -------- |
| all,all privileges | 所有权限 |
| select             | 查询     |
| insert             | 插入     |
| update             | 修改     |
| delete             | 删除     |
| alter              | 修改表   |
| drop               | 删除数据库/表          |
| create             | 创建数据库 /表         |

查询权限 
+ SHOW GRANTS FOR '用户名'@'主机名' ;  
授权 
+ GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';  
撤销权限 
+ REVOKE 权限列表 ON 数据库名.表名 FROM '用户名'@'主机名';

```sql
# 查询test用户的权限
show grants  for 'test'@'localhost';
# 授权
grant all on template.* to 'test'@'localhost';
# 撤销权限
revoke all on template.* from 'test'@'localhost';
```

### 函数

#### 常用函数
+ concat(s1,s2) ,字符串拼接 
+ lower(str),全部转为小写
+ upper(str),转为大写
+ lpad(str,n,pad) ,用字符串pad对str进行作填充，直到长度为n
+ rpad(str,n,pad)
+ trim(str) ,去掉首尾空格
+ substring(str,start,len),返回 str从start开始对len个长度的字符串

```sql
# 字符串拼接
select  concat('hello','world');
# 转小写
select lower('HELLO');
# 转大写
select upper('hello');
# 左填充
select lpad('hello',10,'*');
# 右填充
select rpad('hello',10,'*');
# 去空格
select trim(' hello ');
# 截取
select substr('hello',1,2);

# 将emp的所有id变为6为 ，不满的前面补0
update emp set workno = lpad(workno,6,'0');
```

#### 数值函数
+ ceil 上取整
+ floor 下取整
+ mod(x,y) 返回x/y的模
+ rand(),返回0-1度随机数
+ round(x,y) 求x四舍五入结果

```sql
# ceil 上取整
select ceil(1.1);
# floor 下取整
select floor(1.1);
# mod(x,y) 返回x/y的模
select mod(5,2);
# rand(),返回0-1度随机数
select rand();
# round(x,y) 求x四舍五入结果
select round(1.5);
# 生成6为随机验证码
select lpad(round(rand()*1000000),6,'0')
```

#### 日期函数
+ curdate 当前日期
+ curtime 当前时间
+ now 当前日期和时间
+ year(date) 指定的年份
+ month(date) 月份
+ day(date) 日期
+ date_add(date,interval,exprtype) 返回一个日期间隔 expr后的时间
+ datediff(date1,date2) 间隔天数

```sql
# curdate 当前日期
select curdate();
#  curtime 当前时间
select curtime();
#  now 当前日期和时间
select now();
#  year(date) 指定的年份
select year(now());
#  month(date) 月份
select month(now());
#  day(date) 日期
select day(now());
#  date_add(date,interval,exprtype) 返回一个日期间隔 expr后的时间
select date_add(now(), interval 1 day);
#  datediff(date1,date2) 间隔天数
select datediff('2019-01-01', '2019-03-02');

# 查询所有员工的入职天数，并根据入职天数倒序排序。
select name, datediff(curdate(), entrydate) as '入职天数'
from emp
order by entrydate desc
```

#### 流程函数
+ if(value,t,f) 如果value为true，返回t，否则f
+ ifnull(value1,value2) 如果value1不为空，则返回value1，否则value2
+ `case when [val1] then [res1] ... else [default] end`如果val1位true，返回res1，否则返回默认
+ `case [expr] when [val1] then [res1] ... else [default] end`如果expr为val1，返回res1，否则返回默认

```sql
# if
select if(false, 'ok', 'true');
# ifnull
select ifnull('ok', 'default');
select ifnull('', 'default');
select ifnull(null, 'default');
# case when then else and
# 查询emp表的员工姓名和工作地址 (北京/上海 ----> 一线城市 , 其他 ----> 二线城市)
select name,
       (case workaddress
            when '北京' then '一线城市'
            when '上海' then '一线城市'
            else
                '二线城市 ' end) as '工作城市'
from emp;

```
