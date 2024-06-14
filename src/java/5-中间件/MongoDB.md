---
title: MongoDB
date: 2023-12-02
category:
  - 中间件
  - MongoDB
tag:
  - 中间件
  - MongoDB
---

# MongoDB

## 快速入门

mac使用docker安装：

```shell
docker pull mongo
```

在本地创建一个挂载目录，用于存放数据,我的在以下文件夹：

```
~/tools/docker-volumes/mongodb/data
```

运行容器：

```
docker run -itd --name mongo \
-v ~/tools/docker-volumes/mongodb/data:/data/db \
-p 27017:27017 mongo --auth
```

进入容器 ：

```shell
docker exec -it mongo mongosh admin
```

创建角色：

```shell
db.createUser({ user:'root',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'},'readWriteAnyDatabase']});
```

