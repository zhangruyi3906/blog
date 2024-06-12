---

---

# Iterm2上传文件

mac安装：

```sh
brew install lrzsz
```

服务器安装：

```sh
yum -y install lrzsz
```

安装软件：

```sh
brew install trzsz
```

配置：

![image-20240524152446721](https://s2.loli.net/2024/05/24/PGRtFKUXsfeL8ua.webp)





Parameters可以查看`whereis trzsz-iterm2`

| Name               | Value                                      | Note       |
| :----------------- | :----------------------------------------- | :--------- |
| Regular Expression | :(:TRZSZ:TRANSFER:[SRD]:\d+\.\d+\.\d+:\d+) | 前后无空格 |
| Action             | Run Silent Coprocess...                    |            |
| Parameters         | /usr/local/bin/trzsz-iterm2 \1             | 前后无空格 |
| Enabled            | ✅                                          | 选中       |

![image-20240524152723611](https://s2.loli.net/2024/05/24/sQGe2YW8Fwb3JKO.webp)



![image-20240524152900369](https://s2.loli.net/2024/05/24/yGIA4LtBU9xschO.webp)



![image-20240524152928103](https://s2.loli.net/2024/05/24/JlGERQ3ncjK5Tt7.webp)