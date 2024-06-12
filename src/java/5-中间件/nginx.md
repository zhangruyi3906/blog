---
title: nginx
date: 2024-01-28
category:
  - java
  - nginx
tag:
  - java
  - nginx
---

# nginx

拉取镜像：

```sh
docker pull nginx
```

先用docker启动一次nginx

```sh
docker run -p 80:80 --name nginx -d nginx:latest
```

将容器内的配置文件拷贝到当前目录

```sh
docker container cp nginx:/etc/nginx .
```

修改文件夹名字为conf

![image-20240128155142924](https://s2.loli.net/2024/01/28/tHbTojyaRBQ1cM5.webp)

启动nginx，前端页面可以放在html中

```sh
docker run -p 80:80 --name nginx \
-v ~/tools/docker-volumes/nginx/html:/usr/share/nginx/html \
-v ~/tools/docker-volumes/nginx/logs:/var/log/nginx \
-v ~/tools/docker-volumes/nginx/conf:/etc/nginx \
-d nginx:latest
```

