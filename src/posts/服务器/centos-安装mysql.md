---
title: centos 安装mysql
date: 2023-04-05 22:12:27
category: 
  - Linux
  - MySQL
tag:
  - Linux
  - MySQL
---

# Centos安装mysql（原生安装）

在 CentOS 上安装 MySQL 时，通常建议先删除 MariaDB，以避免潜在的冲突。因为默认情况下，CentOS 内部集成了 MariaDB，而安装 MySQL 的话会和 MariaDB 的文件冲突。

可以使用以下命令检查是否安装：

```shell
rpm -pa | grep mariadb
```

## 安装mysql

先到目录中进行下载软件包rpm文件

```shell
cd /usr/local
mkdir mysql
cd mysql
wget  https://repo.mysql.com//mysql80-community-release-el7-1.noarch.rpm
```

安装下载的 `mysql80-community-release-el7-1.noarch.rpm` 包

```shell
sudo rpm -ivh mysql80-community-release-el7-1.noarch.rpm
```

可以使用 yum 命令安装 MySQL 8 软件包。运行以下命令来安装：

```shell
sudo yum install mysql-community-server
```

安装完成后，启动 MySQL 服务并将其设置为自动启动：

```shell
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

然后，运行安全设置脚本以保护 MySQL 实例：

```shell
sudo mysql_secure_installation
```

## Docker安装mysql

国内 daocloud 一键安装命令

```shell
curl -sSL https://get.daocloud.io/docker | sh
```

​	启动docker

```shell
 sudo systemctl start docker
```

查看docker运行状态

```shell
systemctl status docker
```

### 安装mysql：

https://hub.docker.com/search?q=mysql&type=image	

拉取mysql镜像

```shell
docker pull mysql
```

创建mysql容器并运行，名字为mysql8

```shell
docker run -p 3306:3306 --name mysql8 -e MYSQL_ROOT_PASSWORD=cxk@12345 -d mysql:8
```

进入容器mysql8

```shell
docker exec -it mysql8 bash
```

进入mysql命令行

```shell
mysql -uroot -p
```

> 这时候需要密码，需要去设置，先关闭mysql
>
> ```shell
> docker stop mysql8
> ```
>
> 使用以下命令编辑 MySQL 配置文件：
>
> ```shell
> sudo vim /etc/my.cnf
> ```
>
> 在 `[mysqld]` 标志下添加一行 `skip-grant-tables`
>
> 重启mysql
>
> ```shell
> docker start mysql8
> ```
>
> 查看容器运行状态： -a可以省去，加上表示查看所有包括已经停止的
>
> ```shell
> docker ps -a
> ```
>
> 进入mysql容器：
>
> ```shell
> docker exec -it mysql8  /bin/bash
> ```
>
> 

```shell
docker run -d --name mysql8 --mount source=mysql-data,target=/var/lib/mysql mysql8 --skip-grant-tables

```

centos查看端口占用

```shell
netstat -tlnp | grep 3306
```

```shell
docker run -e MYSQL_ROOT_PASSWORD=123456 -d --name mysql8 mysql
```

