---
title: 配置SSH Key
date: 2023-04-21 08:46:25
category:
  - Linux
  - SSH
tag: 
---

## 配置SSH KEY

如果存在 id_rsa 和 id_rsa.pub文件，说明已经有SSH Key

![image-20230421084848312](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304251311462.png)

查看id_rsa.pub中的内容

![image-20230421085118397](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304251312911.png)

> 如果不存在，可以先用 如下命令生成
>
> ```
> ssh-keygen -t rsa -C [youremail@example.com](mailto:youremail@example.com)
> ```

测试链接

![image-20230421090405793](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304251312950.png)


## 免密登录服务器

可以满足A机器免密登录到B机器：
1、登录A机器 
2、如果有就不要生成了，否则`ssh-keygen -t [rsa|dsa]`，(rsa和dsa选一种加密算法)，将会生成密钥文件和私钥文件 id_rsa,id_rsa.pub或id_dsa,id_dsa.pub
3、将 .pub 文件复制到B机器的 .ssh 目录， 并 `cat id_rsa.pub >> ~/.ssh/authorized_keys`
4、此时A登录B不需要密码`ssh root@ip -p 22`
