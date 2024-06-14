---
title: MacOS Java多版本切换
date: 2024-05-29
category:
  - Java
tag:
  - Java
---

# MacOS Java多版本切换

查看本机有多少Java

```sh
/usr/libexec/java_home -V
```

![image-20240529234139648](https://s2.loli.net/2024/05/29/1FayoU9Bzlfni82.webp)

修改配置文件`~/.bash_profile`

将Java版本都设置进去

![image-20240529235533828](https://s2.loli.net/2024/05/29/tWu3x9KQBVYXIAw.webp)

以后我们想要切换的时候，直接`jdk17`

这样就可以切换成功了

![image-20240529235621389](https://s2.loli.net/2024/05/29/WF7ZakpvCKRtnM3.webp)
