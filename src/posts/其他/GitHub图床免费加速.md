---
title: GitHub图床免费加速
date: 2023-04-22 19:34:30
category:
  - GitHub
  - 图床
tag: 
  - GitHub
  - 图床
---

# GitHub图床免费加速

## Staticaly CDN加速GitHub图床

加速规则如下：

```
# 格式 其中 user是用户名  repo是仓库名  version代表版本(tag或者分支 默认为main)  flie是文件路径 
https://cdn.jsdelivr.net/gh/user/repo@version/file

以其中一张图片为例：下面是原本GitHub的图片链接：
https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230419230228217.png

可以改为如下加速方式：
# 比如我的示例仓库就是加速地址就是这个大家可以参考参考
https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230419230228217.png

```

因为我之前已经有很多图片了，所以现在需要进行全局替换

很显然是将前面的：

```
https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main
```

替换为：

```
https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main
```



同时可以在Picgo里面更改对应的域名：加上上面替换后的那个即可。

![image-20230422200207425](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304222002502.png)
