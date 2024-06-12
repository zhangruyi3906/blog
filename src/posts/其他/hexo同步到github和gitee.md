---
title: hexo同步到github和gitee
date: 2023-04-25 13:00:42
category:
  - GitHub
  - Gitee
  - hexo
tag: 
  - GitHub
  - Gitee
  - hexo
---

# hexo同步到GitHub和gitee

我们可以使用`hexo-deployer-git` 插件进行上传

```shell
npm install hexo-deployer-git --save
```

但是hexo官网说的配置如下：

```yml
deploy:
  type: git
  repo: <repository url> #https://bitbucket.org/JohnSmith/johnsmith.bitbucket.io
  branch: [branch]
  message: [message]
```

这里只能推送到一个，如果推送到GitHub，默认是在main分支。

```yml
  deploy:
  - type: git
    repository: git@github.com:yunfeidog/yunfeidog.github.io.git
    branch: main
```

> 问题出现：
>
> 我现在想同时推送到GitHub和Gitee，主要是因为GitHub有时候访问的速度太慢，对国内不太好，所以需要推送到gitee

于是我写了如下配置：

```yml
deploy:
- type: git
  repository:
    github: git@github.com:yunfeidog/yunfeidog.github.io.git
    gitee: git@gitee.com:dogyunfei/dogyunfei.git
  branch:
    github: main
    gitee: master
```

但是我发现这样推送的时候，gitee会推送到master分支，但是GitHub也会推送到master分支，我也不知道具体原因

![image-20230425130826533](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304251308598.png)

发现网上也没有相关文章，或者遇到这个问题，于是查阅`hexo-deployer-git`官方文档，发现是自己写错格式了：

[点我去看hexo-deployer-git的官网文档](https://github.com/hexojs/hexo-deployer-git)

![image-20230425131009879](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304251310901.png)



我们只需要按照这个格式写即可,例如我的代码如下：

```yml
deploy:
  - type: git
    repository: git@github.com:yunfeidog/yunfeidog.github.io.git
    branch: main
  - type: git
    repository: git@gitee.com:dogyunfei/dogyunfei.git
    branch: master
```

