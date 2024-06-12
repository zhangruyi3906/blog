---
title: Git的使用
date: 2023-11-09
category:
  - git
tag:
  - git
---
# Git的使用

配置账户：
```bash
git config --global user.name "xxx" # 这里是 github 注册的账号（用户名）
git config --global user.email "xxx" # github 注册的邮箱
# 查看 git 账号信息
git config user.name
git config user.email
# 或者直接使用以下命令就可以看到整个账户信息
git config --list

```

```bash
cd /www/wwwroot/yunfei.plus/ &&git pull origin main
```



Git切换分支：
先查看分支：
```sh
git branch -a
```

再切换分支：
```sh
git checkout branchName
```
