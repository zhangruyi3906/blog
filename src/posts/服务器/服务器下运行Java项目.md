---
title: 服务器下运行Java项目
date: 2023-04-10 20:19:52
category: 
   - Linux
   - Java
tag:
   - Linux
   - Java
---



查看端口占用：

```shell
sudo netstat -tln
```

通过以下步骤将 Java Spring Boot 项目部署到 CentOS 服务器上：

1. 在 CentOS 服务器上安装 Docker。你可以使用如下命令安装 Docker：

   ```
   sudo yum install docker
   ```

2. 将应用打包成 Docker 镜像。在项目的根目录下，新建一个名为 `Dockerfile` 的文件，然后在该文件中编写 Docker 镜像的构建脚本。例如：

   ```
   FROM openjdk:8-jdk-alpine
   VOLUME /tmp
   COPY target/myapp.jar app.jar
   ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
   ```

   其中，`openjdk:8-jdk-alpine` 是 Docker 官方提供的基于 Alpine Linux 的 JDK 镜像，

   + `/tmp` 是 Docker 镜像中的挂载点，
   + `target/myapp.jar` 是指要拷贝到 Docker 镜像中的可运行 JAR 文件路径（请确定此处路径与实际情况一致），
   + `["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]` 是要运行的命令。

   然后在项目根目录下输入以下命令构建 Docker 镜像：

   ```
   sudo docker build -t app .
   ```

   其中，`myapp` 是你指定的 Docker 镜像名称，注意末尾有一个“.”表示当前目录下的 `Dockerfile` 文件。

3. 运行 Docker 镜像。使用如下命令运行 Docker 镜像：

   ```
   sudo docker run -d --name jizhang -p 80:80 app
   ```

   其中，`myapp` 是你指定的 Docker 镜像名称，`8080:8080` 表示将 Docker 容器的 8080 端口映射到 CentOS 服务器的 8080 端口（请根据实际情况调整端口号），`-d` 参数表示后台运行。

   + 前面的80是docker的，后面的是服务器的

4. 测试应用是否正常运行。可以在浏览器中输入以下地址来测试应用是否正常运行：

   ```
   http://<centos_server_ip>:8080/
   ```

   其中，`<centos_server_ip>` 是你 CentOS 服务器的 IP 地址。

这样就可以将 Java Spring Boot 应用部署到 CentOS 服务器上了。







