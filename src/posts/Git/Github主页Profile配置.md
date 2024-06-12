---
title: Github主页Profile配置
date: 2024-04-28
category:
  - GitHub
tag:
  - GitHub
---
# Github主页Profile配置

## 配置WakaTIme

官网：[https://wakatime.com/settings/account](https://wakatime.com/settings/account)
### 1.获取密钥

![image.png](https://s2.loli.net/2024/04/28/pN5UWBPejKfVtol.webp)

### 2.在编辑器里面配置插件

同时需要输入密钥

![image.png](https://s2.loli.net/2024/04/28/ePbBZXJfAvr3di6.webp)

### 3.添加到仓库的Actions里面

+ key为WAKATIME_API_KEY
+ value为获取到的wakatime的值

![image.png](https://s2.loli.net/2024/04/28/DLbG194gyralIC6.webp)


### 4.获取GitHub令牌

![image.png](https://s2.loli.net/2024/04/28/NvCrBYcWOqQSUt2.webp)

选择workflow

再去GitHub仓库新建一个变量
+ key为GH_TOKEN
+ value为获取到的GitHub令牌

### 5.配置GitHub Action工作流

参考：

[https://zhsher.cn/posts/7339/index.html#%E5%9B%9B%E3%80%81%E8%87%AA%E7%94%A8%E6%95%B4%E7%90%86%E5%B8%B8%E7%94%A8Actions](https://zhsher.cn/posts/7339/index.html#%E5%9B%9B%E3%80%81%E8%87%AA%E7%94%A8%E6%95%B4%E7%90%86%E5%B8%B8%E7%94%A8Actions)



![image.png](https://s2.loli.net/2024/04/28/Fpbe4KOHRZ2kyCT.webp)

配置教程：[https://github.com/anmol098/waka-readme-stats](https://github.com/anmol098/waka-readme-stats)
```yml
name: Waka Readme

on:
  schedule:
    # Runs at 12am IST
    - cron: '30 18 * * *'
  workflow_dispatch:
jobs:
  update-readme:
    name: Update Readme with Metrics
    runs-on: ubuntu-latest
    steps:
      - uses: anmol098/waka-readme-stats@master
        with:
          WAKATIME_API_KEY: ${{ secrets.WAKATIME_API_KEY }}
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
```


在README中插入
```
<!--START_SECTION:waka-->
<!--END_SECTION:waka-->
```
