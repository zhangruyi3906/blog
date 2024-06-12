---
title: maven
date: 2024-01-18
category:
  - 工具
  - Maven
tag:
  - 工具
  - Maven
---
# maven

Maven仓库：https://mvnrepository.com/

配置，在setting中修改，添加阿里云镜像：

```xml
        <mirror>
          <id>aliyunmaven</id>
          <mirrorOf>central</mirrorOf>
          <name>aliyun maven</name>
          <url>https://maven.aliyun.com/repository/public </url>
        </mirror>
```

## Maven构建

编译：`mvn compile`

清理：`mvn clean`

测试：`mvn test`

打包：`mvn package`

安装到本地仓库：`mvn install `

可以自己配置一个maven指令，这个可以方便调试，快捷的可以使用IDEA自带的指令

![image-20240118194736528](https://s2.loli.net/2024/01/18/ZoxycpfhRAPjMzi.webp)

插件：

添加tomcat7 插件，右键可以直接运行

![image-20240118195110323](https://s2.loli.net/2024/01/18/vgSrNLpZVPokMxJ.webp)

## 依赖管理

### 依赖传递

如果模块test1 使用到了test2,那么test1可以使用test2中的所有依赖，

同一个配置中，后面的配置前面的

不想让别人知道自己模块用的什么,加optional true 不让别人看到：

```xml
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
            <optional>true</optional>
        </dependency>
```



### 排除依赖 exclusions：

```xml
        <dependency>
            <groupId>com.cxk</groupId>
            <artifactId>test3</artifactId>
            <version>0.1</version>
            <exclusions>
                <exclusion>
                    <groupId>log4j</groupId>
                    <artifactId>log4j</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.12</version>
        </dependency>
```

### 依赖范围

![image-20240118202630047](https://s2.loli.net/2024/01/18/htLYpyJSdWUMXDG.webp)

![image-20240118203038990](https://s2.loli.net/2024/01/18/fOTBVL6hruU4sFt.webp)

## maven高级

### 分模块开发与设计

原始模块如下：

![image-20240118204629433](https://s2.loli.net/2024/01/18/f9odKrCIhgyNO41.webp)

将模块拆为`pojo `    ,`dao`,`service` ,`controller`

dao模块依赖`pojo`,如果直接编译dao模块，会报错找不到

+ pojo模块坐标：
  ```xml
      <groupId>com.itheima</groupId>
      <artifactId>ssm_pojo</artifactId>
      <version>1.0-SNAPSHOT</version>
  ```

+ dao模块导入：
  ```xml
          <!--导入资源文件pojo-->
          <dependency>
              <groupId>com.itheima</groupId>
              <artifactId>ssm_pojo</artifactId>
              <version>1.0-SNAPSHOT</version>
          </dependency>
  ```

+ service导入：
  ```xml
          <!--导入资源文件dao-->
          <dependency>
              <groupId>com.itheima</groupId>
              <artifactId>ssm_dao</artifactId>
              <version>1.0-SNAPSHOT</version>
          </dependency>
  ```

+ controller导入：
  ```xml
      <dependency>
        <groupId>com.itheima</groupId>
        <artifactId>ssm_service</artifactId>
        <version>1.0-SNAPSHOT</version>
      </dependency>
  ```

每次使用其他模块，都需要安装其他模块

### 聚合

为了解决上面的问题，需要安装其他模块，引入聚合：

![image-20240118211857372](https://s2.loli.net/2024/01/18/e3P9B1JAxCVsyKz.webp)

用一个模块来聚合其他所有模块：

![image-20240118212437786](https://s2.loli.net/2024/01/18/g6eyA7BnV8HjW1T.webp)

packaging 需要设置为pom

此时构建不需要再去分别安装每个模块

