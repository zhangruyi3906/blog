---
title: Docker
date: 2023-10-07
category: 
  - Docker
tag:
  - Docker
---
# Docker
仓库：[https://hub.docker.com/](https://hub.docker.com/)
## Centos安装Docker

1. 卸载旧版本的Docker
```bash
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine \
                  docker-ce
```

2. centos安装yum工具
```bash
yum install -y yum-utils \
           device-mapper-persistent-data \
           lvm2 --skip-broken
```

3. 设置docker镜像源
```bash
yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    
sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo

yum makecache fast
```

4. 安装docker
```bash
yum install -y docker-ce
```

5. 配置docker镜像加速：[https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)
```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://nmbvk9xi.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## Docker启动相关

1. 开关防火墙：
```bash
# 关闭
systemctl stop firewalld
# 禁止开机启动防火墙
systemctl disable firewalld
```

2. 启动docker
```bash
systemctl start docker  # 启动docker服务

systemctl stop docker  # 停止docker服务

systemctl restart docker  # 重启docker服务
```
## Docker基本操作
### 镜像相关
先去仓库搜索镜像：[https://hub.docker.com/](https://hub.docker.com/)

1. 拉取镜像
```bash
docker pull nginx
```

2. 查询目前拥有的镜像
```bash
docker images
```

3. 将镜像导出到磁盘
> docker save -o [保存的目标文件名称] [镜像名称]

```bash
docker save -o nginx.tar nginx:latest
```

4. 删除镜像
```bash
docker rmi nginx:latest
```

5. 加载本地镜像
```bash
docker load -i nginx.tar
```
### 容器相关

1. 创建运行容器
```bash
docker run --name cxk -p 80:80 -d nginx:latest
```
> - docker run ：创建并运行一个容器
> - --name : 给容器起一个名字，比如叫做mn
> - -p ：将宿主机端口与容器端口映射，冒号左侧是宿主机端口，右侧是容器端口
> - -d：后台运行容器
> - nginx：镜像名称，例如nginx

2. 进入容器
```bash
docker exec -it cxk bash
```
> - docker exec ：进入容器内部，执行一个命令
> - -it : 给当前进入的容器创建一个标准输入、输出终端，允许我们与容器交互
> - cxk ：要进入的容器的名称
> - bash：进入容器后执行的命令，bash是一个linux终端交互命令

3. 查看容器日志
```bash
docker logs
```

4. 查看容器状态
```bash
docker ps [-a]
```
### 挂载数据卷

1. 创建数据卷
```bash
# 创建数据卷html
docker volume create html 
```

2. 查看数据卷
```bash
docker volume ls
```

3. 查看数据卷详细信息
```bash
docker volume inspect html
```
> 可以通过这个命令看到挂载点为："Mountpoint": "/var/lib/docker/volumes/html/_data",

4. 删除数据卷
```bash
docker volume rm html
```

5. 删除所有未使用的数据卷
```bash
docker volume prune
```

6. 挂载数据卷
```bash
docker run \
	--name cxk \
  -v html:/root/html \
  -p 80:80
  nginx 
```
> - -v html:/root/htm ：把html数据卷挂载到容器内的/root/html这个目录中

nginx的html目录所在位置/usr/share/nginx/html
```bash
docker run --name cxk -v html:/usr/share/nginx/html -p 80:80 -d nginx
```
### 直接挂载
> 区别：
> - 带数据卷模式：宿主机目录 --> 数据卷 ---> 容器内目录
> - 直接挂载模式：宿主机目录 ---> 容器内目录

以Mysql为例
```bash
  docker run \
  	--name some-mysql \
    -e MYSQL_ROOT_PASSWORD=cxk123123 \
    -p 3306:3306 \
    -v /tmp/mysql/conf/hmy.cnf:/etc/mysql/conf.d/hmy.cnf \
    -v /tmp/mysql/data:/var/lib/mysql  \
    -d mysql:latest
```
> 左边挂载的/tmp/mysql/conf/hmy.cnf和/tmp/mysql/data:是自己的

## Dockerfile自定义镜像
官方文档：[https://docs.docker.com/engine/reference/builder](https://docs.docker.com/engine/reference/builder)<br />构建一个Java项目：

- docker-demo.jar
- jdk8.tar.gz
- Dockerfile

Dockerfile文件内容：
```dockerfile
# 指定基础镜像
FROM ubuntu:16.04
# 配置环境变量，JDK的安装目录
ENV JAVA_DIR=/usr/local

# 拷贝jdk和java项目的包
COPY ./jdk8.tar.gz $JAVA_DIR/
COPY ./docker-demo.jar /tmp/app.jar

# 安装JDK
RUN cd $JAVA_DIR \
 && tar -xf ./jdk8.tar.gz \
 && mv ./jdk1.8.0_144 ./java8

# 配置环境变量
ENV JAVA_HOME=$JAVA_DIR/java8
ENV PATH=$PATH:$JAVA_HOME/bin

# 暴露端口
EXPOSE 8090
# 入口，java项目的启动命令
ENTRYPOINT java -jar /tmp/app.jar
```
然后构建
```bash
 docker build -t javaweb:1.0 .
```
这种方式安装Java8复杂，可以使用基于java:8-alpine镜像<br />Dockerfile文件
```dockerfile
FROM java:8-alpine
COPY ./app.jar /tmp/app.jar
EXPOSE 8090
ENTRYPOINT java -jar /tmp/app.jar
```
## Docker-Compose
Docker Compose可以基于Compose文件帮我们快速的部署分布式应用，而无需手动一个个创建和运行容器！<br />DockerCompose文件可以看做是将多个docker run命令写到一个文件，只是语法稍有差异。<br />格式：
```json
version: "3.8"
 services:
  mysql:
    image: mysql:5.7.25
    environment:
     MYSQL_ROOT_PASSWORD: 123 
    volumes:
     - "/tmp/mysql/data:/var/lib/mysql"
     - "/tmp/mysql/conf/hmy.cnf:/etc/mysql/conf.d/hmy.cnf"
  web:
    build: .
    ports:
     - "8090:8090"

```
### DockerCompose安装

1. 下载docker-compose文件
```shell
# 安装
curl -L https://github.com/docker/compose/releases/download/1.23.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```

2. 修改文件权限：
```shell
# 修改权限
chmod +x /usr/local/bin/docker-compose
```

3. 命令不全
```bash
# 补全命令
curl -L https://raw.githubusercontent.com/docker/compose/1.29.1/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose
```
> 如果无法访问GitHub，可以修改host文件
> `echo "199.232.68.133 raw.githubusercontent.com" >> /etc/hosts`

### 部署微服务
```bash
version: "3.2"

services:
  nacos:
    image: nacos/nacos-server
    environment:
      MODE: standalone
    ports:
      - "8848:8848"
  mysql:
    image: mysql:5.7.25
    environment:
      MYSQL_ROOT_PASSWORD: 123
    volumes:
      - "$PWD/mysql/data:/var/lib/mysql"
      - "$PWD/mysql/conf:/etc/mysql/conf.d/"
  userservice:
    build: ./user-service
  orderservice:
    build: ./order-service
  gateway:
    build: ./gateway
    ports:
      - "10010:10010"
```
> 可以看到，其中包含5个service服务：
> - nacos：作为注册中心和配置中心
>    - image: nacos/nacos-server： 基于nacos/nacos-server镜像构建
>    - environment：环境变量
>       - MODE: standalone：单点模式启动
>    - ports：端口映射，这里暴露了8848端口
> - mysql：数据库
>    - image: mysql:5.7.25：镜像版本是mysql:5.7.25
>    - environment：环境变量
>       - MYSQL_ROOT_PASSWORD: 123：设置数据库root账户的密码为123
>    - volumes：数据卷挂载，这里挂载了mysql的data、conf目录，其中有我提前准备好的数据
> - userservice、orderservice、gateway：都是基于Dockerfile临时构建的

每个微服务中：
```bash
FROM java:8-alpine
COPY ./app.jar /tmp/app.jar
ENTRYPOINT java -jar /tmp/app.jar
```
同时，需要将将order-service、user-service、gateway服务的mysql、nacos地址都修改为基于容器名的访问。
```bash
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/cloud_order?useSSL=false
    username: root
    password: 123
    driver-class-name: com.mysql.jdbc.Driver
  application:
    name: orderservice
  cloud:
    nacos:
      server-addr: nacos:8848 # nacos服务地址
```
部署命令：
```bash
docker-compose up -d
```
