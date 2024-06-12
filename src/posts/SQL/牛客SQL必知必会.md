---
title: 牛客SQL必知必会
date: 2024-03-18
category:
  - MySQL
tag:
  - MySQL
---
# 牛客SQL必知必会

## 去重

表OrderItems含有非空的列prod_id代表商品id，包含了所有已订购的商品（有些已被订购多次）。

|         |
| ------- |
| prod_id |
| a1      |
| a2      |
| a3      |
| a4      |
| a5      |
| a6      |
| a7      |

【问题】编写SQL 语句，检索并列出所有已订购商品（prod_id）的去重后的清单。
```sql
select distinct prod_id from OrderItems;
```

## 排序
有表Customers，cust_id代表客户id，cust_name代表客户姓名。

|   |   |
|---|---|
|cust_id|cust_name|
|a1|andy|
|a2|ben|
|a3|tony|
|a4|tom|
|a5|an|
|a6|lee|
|a7|hex|

【问题】从 Customers 中检索所有的顾客名称（cust_name），并按从 Z 到 A 的顺序显示结果。
```sql
select cust_name from Customers order by cust_name desc;
```

有Orders表

|   |   |   |
|---|---|---|
|cust_id|order_num|order_date|
|andy|aaaa|2021-01-01 00:00:00|
|andy|bbbb|2021-01-01 12:00:00|
|bob|cccc|2021-01-10 12:00:00|
|dick|dddd|2021-01-11 00:00:00|

【问题】编写 SQL 语句，从 Orders 表中检索顾客 ID（cust_id）和订单号（order_num），并先按顾客 ID 对结果进行排序，再按订单日期倒序排列。

```sql
select 
    cust_id,
    order_num
from
    Orders
order by
    cust_id asc,
    order_date desc;
```

假设有一个OrderItems表

|   |   |
|---|---|
|quantity|item_price|
|1|100|
|10|1003|
|2|500|

【问题】编写 SQL 语句，显示 OrderItems 表中的数量（quantity）和价格（item_price），并按数量由多到少、价格由高到低排序。
```sql
select
    quantity ,
    item_price
from
    OrderItems
order by
    quantity desc,
    item_price desc;
```

## 过滤
有Products 表

|   |   |   |
|---|---|---|
|prod_id|prod_name|prod_price|
|a0011|egg|3|
|a0019|sockets|4|
|b0019|coffee|15|

【问题】编写 SQL 语句，返回 Products 表中所有价格在 3 美元到 6 美元之间的产品的名称（prod_name）和价格（prod_price），然后按价格对结果进行排序
```sql
select prod_name,prod_price

from Products

where prod_price >=3 and prod_price<=6  #between 3 and 6

order by prod_price ;
```

OrderItems表含有：订单号order_num，quantity产品数量

|   |   |
|---|---|
|order_num|quantity|
|a1|105|
|a2|1100|
|a2|200|
|a4|1121|
|a5|10|
|a2|19|
|a7|5|

【问题】从 OrderItems 表中检索出所有不同且不重复的订单号（order_num），其中每个订单都要包含 100 个或更多的产品。
```sql
select distinct order_num

from OrderItems

where quantity>=100
```

```sql
select order_num

from OrderItems

group by order_num

having sum(quantity)>=100
```

## 高级数据过滤
OrderItems 表包含了所有已订购的产品（有些已被订购多次）。

|   |   |   |
|---|---|---|
|prod_id|order_num|quantity|
|BR01|a1|105|
|BR02|a2|1100|
|BR02|a2|200|
|BR03|a4|1121|
|BR017|a5|10|
|BR02|a2|19|
|BR017|a7|5|

【问题】编写SQL 语句，查找所有订购了数量至少100 个的 BR01、BR02 或BR03 的订单。你需要返回 OrderItems 表的订单号（order_num）、产品 ID（prod_id）和数量（quantity），并按产品 ID 和数量进行过滤。
```sql
select order_num,prod_id,quantity
from OrderItems
where 
    quantity>=100 and
    prod_id in ('BR01','BR02','BR03');
```

## 通配符过滤
Products表

|   |   |
|---|---|
|prod_name|prod_desc|
|a0011|usb|
|a0019|iphone13|
|b0019|gucci t-shirts|
|c0019|gucci toy|
|d0019|lego toy|

【问题】编写 SQL 语句，从 Products 表中检索产品名称（prod_name）和描述（prod_desc），仅返回描述中包含 toy 一词的产品名称
```sql
select prod_name,prod_desc 
from Products
where prod_desc like '%toy%'
```

Products表

|   |   |
|---|---|
|prod_name|prod_desc|
|a0011|usb|
|a0019|iphone13|
|b0019|gucci t-shirts|
|c0019|gucci toy|
|d0019|lego toy|

【问题】编写 SQL 语句，从 Products 表中检索产品名称（prod_name）和描述（prod_desc），仅返回描述中未出现 toy 一词的产品，最后按”产品名称“对结果进行排序。
```sql
select prod_name,prod_desc
from Products
where prod_desc not like '%toy%'
order by prod_name;
```

Products表

【问题】编写 SQL 语句，从 Products 表中检索产品名称（prod_name）和描述（prod_desc），仅返回描述中同时出现 toy 和 carrots 的产品。有好几种方法可以执行此操作，但对于这个挑战题，请使用 AND 和两个 LIKE 比较。

|           |                  |
| --------- | ---------------- |
| prod_name | prod_desc        |
| a0011     | usb              |
| a0019     | iphone13         |
| b0019     | gucci t-shirts   |
| c0019     | gucci toy        |
| d0019     | lego carrots toy |
```sql
select prod_name,prod_desc 
from Products
where prod_desc like '%toy%' and prod_desc like '%carrots%';
```

Products表

|   |   |
|---|---|
|prod_name|prod_desc|
|a0011|usb|
|a0019|iphone13|
|b0019|gucci t-shirts|
|c0019|gucci toy|
|d0019|lego toy carrots|

【问题】编写 SQL 语句，从 Products 表中检索产品名称（prod_name）和描述（prod_desc），仅返回在描述中以先后顺序同时出现 toy 和 carrots 的产品。提示：只需要用带有三个 % 符号的 LIKE 即可。
```sql
select
    prod_name,
    prod_desc
from
    Products
where
    prod_desc like '%toy%carrots%';
```

## 别名
别名的常见用法是在检索出的结果中重命名表的列字段（为了符合特定的报表要求或客户需求）。有表Vendors代表供应商信息，vend_id供应商id、vend_name供应商名称、vend_address供应商地址、vend_city供应商城市。

|   |   |   |   |
|---|---|---|---|
|vend_id|vend_name|vend_address|vend_city|
|a001|tencent cloud|address1|shenzhen|
|a002|huawei cloud|address2|dongguan|
|a003|aliyun cloud|address3|hangzhou|
|a003|netease cloud|address4|guangzhou|

【问题】编写 SQL 语句，从 Vendors 表中检索vend_id、vend_name、vend_address 和 vend_city，将 vend_name重命名为 vname，将 vend_city 重命名为 vcity，将 vend_address重命名为 vaddress，按供应商名称对结果进行升序排序。
```sql
select
    vend_id,
    vend_name as vname,
    vend_address as vaddress,
    vend_city as vcity
from Vendors
order by vname asc;
```

我们的示例商店正在进行打折促销，所有产品均降价 10%。Products表包含prod_id产品id、prod_price产品价格  

【问题】编写 SQL语句，从 Products 表中返回 prod_id、prod_price 和 sale_price。sale_price 是一个包含促销价格的计算字段。提示：可以乘以 0.9，得到原价的 90%（即 10%的折扣）

【示例结果】

返回产品id prod_id、产品价格prod_price、销售价格 sale_price

|   |   |   |
|---|---|---|
|prod_id|prod_price|sale_price|
|a0011|9.49|8.541|
|a0019|600|540|
|b0019|1000|900|

【示例解析】sale_price的价格是prod_price的90%
```sql
select prod_id,prod_price,prod_price * 0.9 as sale_price

from Products
```

## 函数处理
我们的商店已经上线了，正在创建顾客账户。所有用户都需要登录名，默认登录名是其名称和所在城市的组合。

给出 Customers表 如下：

|   |   |   |   |
|---|---|---|---|
|cust_id|cust_name|cust_contact|cust_city|
|a1|Andy Li|Andy Li|Oak Park|
|a2|Ben Liu|Ben Liu|Oak Park|
|a3|Tony Dai|Tony Dai|Oak Park|
|a4|Tom Chen|Tom Chen|Oak Park|
|a5|An Li|An Li|Oak Park|
|a6|Lee Chen|Lee Chen|Oak Park|
|a7|Hex Liu|Hex Liu|Oak Park|

【问题】编写 SQL 语句，返回顾客 ID（cust_id）、顾客名称（cust_name）和登录名（user_login），其中登录名全部为大写字母，并由顾客联系人的前两个字符（cust_contact）和其所在城市的前三个字符（cust_city）组成。提示：需要使用函数、拼接和别名。
```sql
select
    cust_id,cust_name,
    upper(concat(substring(cust_name,1,2),substring(cust_city,1,3))) as user_login
from Customers;
```

Orders订单表

|   |   |
|---|---|
|order_num|order_date|
|a0001|2020-01-01 00:00:00|
|a0002|2020-01-02 00:00:00|
|a0003|2020-01-01 12:00:00|
|a0004|2020-02-01 00:00:00|
|a0005|2020-03-01 00:00:00|

【问题】编写 SQL 语句，返回 2020 年 1 月的所有订单的订单号（order_num）和订单日期（order_date），并按订单日期升序排序

```sql
select order_num,order_date
from Orders
where order_date like '2020-01%'
order by order_date asc;

```
```sql
    left(order_date,7) ='2020-01'
    order_date >='2020-01-01 00:00:00' and order_date <='2020-01-31 23:59:59'
    order_date regexp '2020-01'
    year(order_date) ='2020' and month(order_date)='1'
    date_format(order_date,'%Y-%m')='2020-01'
```

## 汇总数据
Products 表

|   |
|---|
|prod_price|
|9.49|
|600|
|1000|

【问题】编写 SQL 语句，确定 Products 表中价格不超过 10 美元的最贵产品的价格（prod_price）。将计算所得的字段命名为 max_price。

【示例结果】返回max_price

|   |
|---|
|max_price|
|9.49|
```sql
select 
    prod_price as max_price
from 
    Products
where
    prod_price <=10
order by
    max_price desc
limit 1
```

```sql
select max(prod_price) as max_price
from Products
where prod_price<=10
```

## 分组数据

OrderItems 表包含每个订单的每个产品

|           |
| --------- |
| order_num |
| a002      |
| a002      |
| a002      |
| a004      |
| a007      |
|           |

【问题】编写 SQL 语句，返回每个订单号（order_num）各有多少行数（order_lines），并按 order_lines对结果进行升序排序。

【示例结果】返回订单号order_num和对应订单号的行数order_lines

|           |             |
| --------- | ----------- |
| order_num | order_lines |
| a004      | 1           |
| a007      | 1           |
| a002      | 3           |
```sql
select
    order_num,
    count(order_num) as order_lines
from OrderItems
group by order_num
order by order_lines

```

有Products表，含有字段prod_price代表产品价格，vend_id代表供应商id

|   |   |
|---|---|
|vend_id|prod_price|
|a0011|100|
|a0019|0.1|
|b0019|1000|
|b0019|6980|
|b0019|20|

【问题】编写 SQL 语句，返回名为 cheapest_item 的字段，该字段包含每个供应商成本最低的产品（使用 Products 表中的 prod_price），然后从最低成本到最高成本对结果进行升序排序。

【示例结果】返回供应商id vend_id和对应供应商成本最低的产品cheapest_item。

|         |               |
| ------- | ------------- |
| vend_id | cheapest_item |
| a0019   | 0.1           |
| b0019   | 20            |
| a0011   | 100           |
```sql
select 
    vend_id,
    min(prod_price) as cheapest_item
from    
    Products
group by 
    vend_id
order by 
    cheapest_item
```

OrderItems代表订单商品表，包括：订单号order_num和订单数量quantity。

|   |   |
|---|---|
|order_num|quantity|
|a1|105|
|a2|1100|
|a2|200|
|a4|1121|
|a5|10|
|a2|19|
|a7|5|

【问题】请编写 SQL 语句，返回订单数量总和不小于100的所有订单号，最后结果按照订单号升序排序。

【示例结果】返回order_num订单号。

|           |
| --------- |
| order_num |
| a1        |
| a2        |
| a4        |
```sql
select order_num
from OrderItems
group by order_num
having sum(quantity)>=100
order by order_num
```

> where和having的区别
> 1. **使用位置**：
    - `WHERE` 子句通常用于过滤行，它在执行 `SELECT` 语句时直接应用于源表，用于筛选符合条件的行。
    - `HAVING` 子句通常用于过滤分组，它在执行 `GROUP BY` 语句后应用于结果集，用于筛选分组后的结果。
>2. **作用对象**：
    - `WHERE` 子句作用于行级别，即它筛选的是从源表中检索到的记录。
    - `HAVING` 子句作用于组级别，即它筛选的是经过分组操作后的分组结果。
>3. **使用场景**：
    - `WHERE` 子句通常用于筛选数据行，例如根据条件过滤特定的记录。
    - `HAVING` 子句通常用于对分组后的结果进行过滤，例如对聚合函数计算的结果进行条件筛选。

`WHERE` 用于在对行进行筛选前进行条件过滤，而 `HAVING` 用于在对分组后的结果进行筛选。

OrderItems表代表订单信息，包括字段：订单号order_num和item_price商品售出价格、quantity商品数量。

|   |   |   |
|---|---|---|
|order_num|item_price|quantity|
|a1|10|105|
|a2|1|1100|
|a2|1|200|
|a4|2|1121|
|a5|5|10|
|a2|1|19|
|a7|7|5|

【问题】编写 SQL 语句，根据订单号聚合，返回订单总价不小于1000 的所有订单号，最后的结果按订单号进行升序排序。

提示：总价 = item_price 乘以 quantity

【示例结果】

|           |             |
| --------- | ----------- |
| order_num | total_price |
| a1        | 1050        |
| a2        | 1319        |
| a4        | 2242        |
```sql
select 
    order_num,
    sum(quantity*item_price) as total_price
from  
    OrderItems
group by 
    order_num
having 
    total_price >=1000
order by 
    order_num
```

## 子查询
OrderItems表示订单商品表，含有字段订单号：order_num、订单价格：item_price；Orders表代表订单信息表，含有顾客id：cust_id和订单号：order_num

OrderItems表

|           |            |
| --------- | ---------- |
| order_num | item_price |
| a1        | 10         |
| a2        | 1          |
| a2        | 1          |
| a4        | 2          |
| a5        | 5          |
| a2        | 1          |
| a7        | 7          |

Orders表

|   |   |
|---|---|
|order_num|cust_id|
|a1|cust10|
|a2|cust1|
|a2|cust1|
|a4|cust2|
|a5|cust5|
|a2|cust1|
|a7|cust7|

【问题】使用子查询，返回购买价格为 10 美元或以上产品的顾客列表，结果无需排序。  
注意：你需要使用 OrderItems 表查找匹配的订单号（order_num），然后使用Order 表检索这些匹配订单的顾客 ID（cust_id）。

【示例结果】返回顾客id cust_id

|         |
| ------- |
| cust_id |
| cust10  |


使用子查询
```sql
select cust_id from Orders 
where order_num in
(select order_num from OrderItems where item_price>=10)
```

使用连接查询
> **内连接（INNER JOIN）**：
>- 内连接根据两个表之间的匹配条件检索匹配的行。
>- 语法：`SELECT * FROM table1 INNER JOIN table2 ON table1.column = table2.column;`
>- 只返回两个表中在连接条件下匹配的行。
```sql
select t1.cust_id 
from OrderItems t inner join Orders t1 on t.order_num=t1.order_num
where t.item_price>=10
```

表OrderItems代表订单商品信息表，prod_id为产品id；Orders表代表订单表有cust_id代表顾客id和订单日期order_date

OrderItems表

|   |   |
|---|---|
|prod_id|order_num|
|BR01|a0001|
|BR01|a0002|
|BR02|a0003|
|BR02|a0013|

Orders表

|   |   |   |
|---|---|---|
|order_num|cust_id|order_date|
|a0001|cust10|2022-01-01 00:00:00|
|a0002|cust1|2022-01-01 00:01:00|
|a0003|cust1|2022-01-02 00:00:00|
|a0013|cust2|2022-01-01 00:20:00|

【问题】

编写 SQL 语句，使用子查询来确定哪些订单（在 OrderItems 中）购买了 prod_id 为 "BR01" 的产品，然后从 Orders 表中返回每个产品对应的顾客 ID（cust_id）和订单日期（order_date），按订购日期对结果进行升序排序。

  

【示例结果】返回顾客id cust_id和定单日期order_date。

|   |   |
|---|---|
|cust_id|order_date|
|cust10|2022-01-01 00:00:00|
|cust1|2022-01-01 00:01:00|

【示例解析】 

产品id为"BR01"的订单a0001和a002的下单顾客cust10和cust1的下单时间分别为2022-01-01 00:00:00和2022-01-01 00:01:00
```sql
select
    cust_id,order_date
from
    Orders
where 
    order_num in (

select order_num from OrderItems where prod_id='BR01'

)
order by order_date
```

我们需要一个顾客 ID 列表，其中包含他们已订购的总金额。

OrderItems表代表订单信息，OrderItems表有订单号：order_num和商品售出价格：item_price、商品数量：quantity。

|   |   |   |
|---|---|---|
|order_num|item_price|quantity|
|a0001|10|105|
|a0002|1|1100|
|a0002|1|200|
|a0013|2|1121|
|a0003|5|10|
|a0003|1|19|
|a0003|7|5|

Orders表订单号：order_num、顾客id：cust_id

|   |   |
|---|---|
|order_num|cust_id|
|a0001|cust10|
|a0002|cust1|
|a0003|cust1|
|a0013|cust2|

【问题】

编写 SQL语句，返回顾客 ID（Orders 表中的 cust_id），并使用子查询返回total_ordered 以便返回每个顾客的订单总数，将结果按金额从大到小排序。

提示：你之前已经使用 SUM()计算订单总数。

  

【示例结果】返回顾客id cust_id和total_order下单总额

|         |               |
| ------- | ------------- |
| cust_id | total_ordered |
| cust2   | 2242          |
| cust1   | 1300          |
| cust10  | 1050          |
| cust2   | 104           |
```sql
select cust_id , (select sum(item_price*quantity) from OrderItems a 
                    where a.order_num=b.order_num) as total_ordered
from Orders b
order by total_ordered desc;

```

 Products 表中检索所有的产品名称：prod_name、产品id：prod_id

|   |   |
|---|---|
|prod_id|prod_name|
|a0001|egg|
|a0002|sockets|
|a0013|coffee|
|a0003|cola|

OrderItems代表订单商品表，订单产品：prod_id、售出数量：quantity

|   |   |
|---|---|
|prod_id|quantity|
|a0001|105|
|a0002|1100|
|a0002|200|
|a0013|1121|
|a0003|10|
|a0003|19|
|a0003|5|

【问题】

编写 SQL 语句，从 Products 表中检索所有的产品名称（prod_name），以及名为 quant_sold 的计算列，其中包含所售产品的总数（在 OrderItems 表上使用子查询和 SUM(quantity)检索）。

  

【示例结果】返回产品名称prod_name和产品售出数量总和

|           |            |
| --------- | ---------- |
| prod_name | quant_sold |
| egg       | 105        |
| sockets   | 1300       |
| coffee    | 1121       |
| cola      | 34         |
```sql
select a.prod_name,b.quantity
from (
    select prod_id,sum(quantity) quantity
    from OrderItems
    group by prod_id
)b,Products a
where a.prod_id=b.prod_id;
```
