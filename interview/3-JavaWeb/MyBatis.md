---
title: MyBatis
date: 2023-05-16 10:06:51
category:
  - Java
  - MyBatis
tag:
  - Java
  - MyBatis
---

# Mybatis

官网：https://mybatis.org/mybatis-3/zh/getting-started.html

## 创建mybatis项目

1. 导入坐标：

```xml
<dependencies>
    <!--mybatis 依赖-->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.5</version>
    </dependency>

    <!--mysql 驱动-->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.46</version>
    </dependency>

    <!--junit 单元测试-->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

2. 编写mybatis核心配置文件，具体可以在官网找到：

![image-20230516152751804](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305161527868.png)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <typeAliases>
        <package name="com.itheima.pojo"/>
    </typeAliases>
    
    <!--
    environments：配置数据库连接环境信息。可以配置多个environment，通过default属性切换不同的environment
    -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <!--数据库连接信息-->
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql:///mybatis?useSSL=false"/>
                <property name="username" value="root"/>
                <property name="password" value="1234"/>
            </dataSource>
        </environment>

        <environment id="test">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <!--数据库连接信息-->
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql:///mybatis?useSSL=false"/>
                <property name="username" value="root"/>
                <property name="password" value="1234"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
       <!--加载sql映射文件-->
       <mapper resource="UserMapper.xml"/>
    </mappers>
</configuration>
```

3. 创建Mapper映射文件UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="test">
    <select id="selectAll" resultType="com.itheima.pojo.User">
        select * from tb_user;
    </select>
</mapper>
```

4. 创建实体类User

```java
public class User {
    private int id;
    private String username;
    private String password;
    private String gender;
    private String addr;
}
```

5. 测试：

```java
public class MyBatisDemo {

    public static void main(String[] args) throws IOException {
        //1. 加载mybatis的核心配置文件，获取 SqlSessionFactory
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2. 获取SqlSession对象，用它来执行sql
        SqlSession sqlSession = sqlSessionFactory.openSession();
        //3. 执行sql
        List<User> users = sqlSession.selectList("test.selectAll"); //参数是一个字符串，该字符串必须是映射配置文件的namespace.id
        System.out.println(users);
        //4. 释放资源
        sqlSession.close();
    }
}
```

## Mapper代理开发

下面这个`test.selectAll`存在硬编码问题，可以使用Mapper代理的方式修改

![image-20230516154359212](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305161543272.png)

Mapper代理开发步骤：

1. 创建UserMapper接口：

```java
public interface UserMapper {
    List<User> selectAll();
}
```

2. 修改命名空间，必须是接口对应的全限定名字：

![image-20230516154827347](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305161548375.png)

3. 修改测试类

```java
//3.1 获取UserMapper接口的代理对象
UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
List<User> users = userMapper.selectAll();
```

> 如果Mapper接口名称和SQL映射文件名称相同，并在同一目录下，则可以使用包扫描的方式简化SQL映射文件的加载。也就是将核心配置文件的加载映射配置文件的配置修改为
>
> ```xml
> <mappers>
>     <!--加载sql映射文件-->
>     <!-- <mapper resource="com/itheima/mapper/UserMapper.xml"/>-->
>     <!--Mapper代理方式-->
>     <package name="com.itheima.mapper"/>
> </mappers>
> ```

## MyBatis核心配置文件

### 多环境配置

在核心配置文件的 `environments` 标签中其实是可以配置多个 `environment` ，使用 `id` 给每段环境起名，在 `environments` 中使用 `default='环境id'` 来指定使用哪儿段配置。

```xml
<environments default="development">
    <environment id="development">
        <transactionManager type="JDBC"/>
        <dataSource type="POOLED">
            <!--数据库连接信息-->
            <property name="driver" value="com.mysql.jdbc.Driver"/>
            <property name="url" value="jdbc:mysql:///mybatis?useSSL=false"/>
            <property name="username" value="root"/>
            <property name="password" value="1234"/>
        </dataSource>
    </environment>

    <environment id="test">
        <transactionManager type="JDBC"/>
        <dataSource type="POOLED">
            <!--数据库连接信息-->
            <property name="driver" value="com.mysql.jdbc.Driver"/>
            <property name="url" value="jdbc:mysql:///mybatis?useSSL=false"/>
            <property name="username" value="root"/>
            <property name="password" value="1234"/>
        </dataSource>
    </environment>
</environments>=
```

### 类型别名

在映射配置文件中的 `resultType` 属性需要配置数据封装的类型（类的全限定名）。而每次这样写是特别麻烦的，Mybatis 提供了 `类型别名`(typeAliases) 可以简化这部分的书写。

```xml
<typeAliases>
    <!--name属性的值是实体类所在包-->
    <package name="com.itheima.pojo"/> 
</typeAliases>
```

如果写上面的了，那么resultType就可以简化了

```xml
<mapper namespace="com.itheima.mapper.UserMapper">
    <select id="selectAll" resultType="user">
        select * from tb_user;
    </select>
</mapper>
```

## 数据库映射问题

如果Java的实体类和数据库里的字段不一致，可以使用起别名的方式来解决这个问题

![image-20230516160626425](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305161606461.png)

```xml
<select id="selectAll" resultType="brand">
    select
    id, brand_name as brandName, company_name as companyName, ordered, description, status
    from tb_brand;
</select>
```

但是这种方式还是太麻烦，复用性不高，可以使用下面两种方式进行：

SQL片段引用：

```xml
<sql id="brand_column">
	id, brand_name as brandName, company_name as companyName, ordered, description, status
</sql>

<select id="selectAll" resultType="brand">
    select
    <include refid="brand_column" />
    from tb_brand;
</select>
```

### 使用resultMap

```xml
<resultMap id="brandResultMap" type="brand">
    <!--
            id：完成主键字段的映射
                column：表的列名
                property：实体类的属性名
            result：完成一般字段的映射
                column：表的列名
                property：实体类的属性名
        -->
    <result column="brand_name" property="brandName"/>
    <result column="company_name" property="companyName"/>
</resultMap>

<select id="selectAll" resultMap="brandResultMap">
    select *
    from tb_brand;
</select>
```

> 注意接口的返回结果变成了resultMap而不是resultType

## 参数占位符

例如selectById接口，需要传入一个id，可以使用#占位符

```xml
<select id="selectById"  resultMap="brandResultMap">
    select *
    from tb_brand where id = #{id};
</select>
```

调用：

```java
BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
Brand brand = brandMapper.selectById(id);
System.out.println(brand);
```

\#存在SQL注入问题，可以使用$替换

```xml
<select id="selectById"  resultMap="brandResultMap">
    select *
    from tb_brand where id = ${id};
</select>
```

使用ParameterType可以指定参数的类型：

```xml
<select id="selectById" parameterType="int" resultMap="brandResultMap">
    select *
    from tb_brand where id = ${id};
</select>
```

### 特殊符号

因为映射配置文件是xml类型的问题，而 > < 等这些字符在xml中有特殊含义，所以此时我们需要将这些符号进行转义，

例如:`<`可以使用`&lt`

## 多条件查询

编写接口：

+ 使用 `@Param("参数名称")` 标记每一个参数，在映射配置文件中就需要使用 `#{参数名称}` 进行占位

```java
List<Brand> selectByCondition(@Param("status") int status, @Param("companyName") String companyName,@Param("brandName") String brandName);
```

> 测试：
>
> ```java
> @Test
> public void testSelectByCondition() throws IOException {
>     //接收参数
>     int status = 1;
>     String companyName = "华为";
>     String brandName = "华为";
> 
>     // 处理参数
>     companyName = "%" + companyName + "%";
>     brandName = "%" + brandName + "%";
> 
>     //1. 获取SqlSessionFactory
>     String resource = "mybatis-config.xml";
>     InputStream inputStream = Resources.getResourceAsStream(resource);
>     SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
>     //2. 获取SqlSession对象
>     SqlSession sqlSession = sqlSessionFactory.openSession();
>     //3. 获取Mapper接口的代理对象
>     BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
> 
>     //4. 执行方法
> 	  //方式一 ：接口方法参数使用 @Param 方式调用的方法
>     List<Brand> brands = brandMapper.selectByCondition(status, companyName, brandName);
>     //5. 释放资源
>     sqlSession.close();
> }
> ```

+ 将多个参数封装成一个 实体对象 ，将该实体对象作为接口的方法参数。该方式要求在映射配置文件的SQL中使用 `#{内容}` 时，里面的内容必须和实体类属性名保持一致。

```java
List<Brand> selectByCondition(Brand brand);
```

> 测试：
>
> ```java
> //方式二 ：接口方法参数是 实体类对象 方式调用的方法
>  //封装对象
> Brand brand = new Brand();
> brand.setStatus(status);
> brand.setCompanyName(companyName);
> brand.setBrandName(brandName);
> List<Brand> brands = brandMapper.selectByCondition(brand);
> ```

+ 使用Map映射，将map集合作为接口的方法参数。该方式要求在映射配置文件的SQL中使用 `#{内容}` 时，里面的内容必须和map集合中键的名称一致。

```java
List<Brand> selectByCondition(Map map);
```

> 测试：
>
> ```java
> //方式三 ：接口方法参数是 map集合对象 方式调用的方法
> Map map = new HashMap();
> map.put("status" , status);
> map.put("companyName", companyName);
> map.put("brandName" , brandName);
> List<Brand> brands = brandMapper.selectByCondition(map);
> System.out.println(brands);
> ```
>
> 

SQL语句如下：

```xml
<select id="selectByCondition" resultMap="brandResultMap">
    select *
    from tb_brand
    where status = #{status}
    and company_name like #{companyName}
    and brand_name like #{brandName}
</select>
```



## 动态SQL

每个字段不一定全部都输入，需要判断是否存在,可以使用if条件判断

```xml
<select id="selectByCondition" resultMap="brandResultMap">
    select *
    from tb_brand
    where
        <if test="status != null">
            and status = #{status}
        </if>
        <if test="companyName != null and companyName != '' ">
            and company_name like #{companyName}
        </if>
        <if test="brandName != null and brandName != '' ">
            and brand_name like #{brandName}
        </if>
</select>
```

这样也存在问题，如果没有输入status，SQL会变成：

```sql
select * from tb_brand where and company_name like ? and brand_name like ?
```

可以使用where语句解决：会动态的去掉第一个条件前的 and 

```sql
<select id="selectByCondition" resultMap="brandResultMap">
    select *
    from tb_brand
    <where>
        <if test="status != null">
            and status = #{status}
        </if>
        <if test="companyName != null and companyName != '' ">
            and company_name like #{companyName}
        </if>
        <if test="brandName != null and brandName != '' ">
            and brand_name like #{brandName}
        </if>
    </where>
</select>
```

> 注意：需要给每个条件前都加上 and 关键字。

## 单条件查询

在查询时只能选择 `品牌名称`、`当前状态`、`企业名称` 这三个条件中的一个，可以使用choose标签

```sql
<select id="selectByConditionSingle" resultMap="brandResultMap">
    select *
    from tb_brand
    <where>
        <choose><!--相当于switch-->
            <when test="status != null"><!--相当于case-->
                status = #{status}
            </when>
            <when test="companyName != null and companyName != '' "><!--相当于case-->
                company_name like #{companyName}
            </when>
            <when test="brandName != null and brandName != ''"><!--相当于case-->
                brand_name like #{brandName}
            </when>
        </choose>
    </where>
</select>
```

## 增删改查

### 增加

```sql
<insert id="add">
    insert into tb_brand (brand_name, company_name, ordered, description, status)
    values (#{brandName}, #{companyName}, #{ordered}, #{description}, #{status});
</insert>
```

如何判断是否成功？可以添加主键返回,执行完之后可以打印id

```sql
<insert id="add" useGeneratedKeys="true" keyProperty="id">
    insert into tb_brand (brand_name, company_name, ordered, description, status)
    values (#{brandName}, #{companyName}, #{ordered}, #{description}, #{status});
</insert>
```

> * useGeneratedKeys：是够获取自动增长的主键值。true表示获取
> * keyProperty  ：指定将获取到的主键值封装到哪儿个属性里

### 删除

```sql
<delete id="deleteById">
    delete from tb_brand where id = #{id};
</delete>
```

#### 批量删除

接口传入的参数为数组

```java
/**
  * 批量删除
  */
void deleteByIds(int[] ids);
```

SQL 语句：

编写SQL时需要遍历数组来拼接SQL语句。Mybatis 提供了 `foreach` 标签用来迭代任何可迭代的对象（如数组，集合）。

* collection 属性：
  * mybatis会将数组参数，封装为一个Map集合。
    * 默认：array = 数组
    * 使用@Param注解改变map集合的默认key的名称
* item 属性：本次迭代获取到的元素。
* separator 属性：集合项迭代之间的分隔符。`foreach` 标签不会错误地添加多余的分隔符。也就是最后一次迭代不会加分隔符。
* open 属性：该属性值是在拼接SQL语句之前拼接的语句，只会拼接一次
* close 属性：该属性值是在拼接SQL语句拼接后拼接的语句，只会拼接一次

```sql
<delete id="deleteByIds">
    delete from tb_brand where id
    in
    <foreach collection="array" item="id" separator="," open="(" close=")">
        #{id}
    </foreach>
    ;
</delete>
```

> 假如数组中的id数据是{1,2,3}，那么拼接后的sql语句就是：
>
> ```sql
> delete from tb_brand where id in (1,2,3);
> ```

### 修改

```sql
<update id="update">
    update tb_brand
    <set>
        <if test="brandName != null and brandName != ''">
            brand_name = #{brandName},
        </if>
        <if test="companyName != null and companyName != ''">
            company_name = #{companyName},
        </if>
        <if test="ordered != null">
            ordered = #{ordered},
        </if>
        <if test="description != null and description != ''">
            description = #{description},
        </if>
        <if test="status != null">
            status = #{status}
        </if>
    </set>
    where id = #{id};
</update>
```

> *set* 标签可以用于动态包含需要更新的列，忽略其它不更新的列。



## 注解开发

直接在接口语句上面写SQL即可：

* 查询 ：@Select
* 添加 ：@Insert
* 修改 ：@Update
* 删除 ：@Delete

```java
@Select(value = "select * from tb_user where id = #{id}")
public User select(int id);
```

虽然简单，但是无法完成复杂的SQL语句。
