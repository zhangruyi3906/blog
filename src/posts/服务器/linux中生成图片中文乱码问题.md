---
title: linux中生成图片中文乱码问题
date: 2024-03-14
category:
  - Linux
tag:
  - Linux
---
# linux中生成图片中文乱码问题

查看linux是否有中文字体

```java
fc-list // 查看所有字体

fc-list :lang=zh // 查看中文字体
```

因为没有字体
Springboot项目中生成图片存在乱码
![image.png](https://s2.loli.net/2024/03/14/zuPRj9NT2DXcUfV.webp)

解决办法：

安装字体库：
```sh
yum -y install fontconfig
```

查看安装：
![image.png](https://s2.loli.net/2024/03/14/IyHfxWl7DtXYBpz.webp)

将字体下载到目录下面`/usr/share/fonts`：
![image.png](https://s2.loli.net/2024/03/14/mAPdXqWZHBO9toT.webp)


查看是否安装成功：
![image.png](https://s2.loli.net/2024/03/14/b9PohXisIH8OYAx.webp)


此时乱码问题解决
