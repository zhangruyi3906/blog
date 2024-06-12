---
title: Mac使用ngrok进行内网穿透
date: 2024-04-25
category:
  - Mac
  - 内网穿透
tag:
  - Mac
  - 内网穿透
---
# Mac使用ngrok进行内网穿透
安装：https://dashboard.ngrok.com/get-started/setup/macos
```sh
brew install ngrok/ngrok/ngrok
```

登录网站的时候可能还需要下载Google的Authenticator用于验证。手机APP下载Google Play
获取你的authtoken
![image.png](https://s2.loli.net/2024/04/25/yRF2BAs1oE8aWQV.webp)


配置auth
```sh
ngrok config add-authtoken 你的authtoken
```

开启内网穿透：
```sh
ngrok http http://localhost:10000
```

我本地开了一个Java程序，端口10000:
![image.png](https://s2.loli.net/2024/04/25/jMAtXFS8JGZqpCO.webp)

开启内网穿透后：
![image.png](https://s2.loli.net/2024/04/25/4OhSZDlvAunIq5H.webp)

此时访问网址可以访问到：
![image.png](https://s2.loli.net/2024/04/25/e9271SlNAOc6fyK.webp)

可以申请一个域名：
![image.png](https://s2.loli.net/2024/04/25/heAwYtsG1NaOqdU.webp)
