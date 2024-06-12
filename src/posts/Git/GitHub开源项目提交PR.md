---
title: GitHub开源项目提交PR
date: 2024-04-28
category:
  - GitHub
tag:
  - GitHub
---
# GitHub开源项目提交PR

### Fork代码

首先fork一份代码到自己的仓库
![image.png](https://s2.loli.net/2024/04/28/MXjRUmgDvHuKPc5.webp)

### 更新代码到最新

选择Sync fork下的update
![image.png](https://s2.loli.net/2024/04/28/c5sJljVNrtn4DuY.webp)

### 本地仓库更新

```
git pull
```

使得本地仓库可以拉取到最新的代码


### 添加自己的代码
https://programmercarl.com/0028.%E5%AE%9E%E7%8E%B0strStr.html#%E7%AE%97%E6%B3%95%E5%85%AC%E5%BC%80%E8%AF%BE

以代码随想录这道找字符串位置的题目为例：

他给出的是KMP算法，这种算法的时间复杂度为$O(n+m)$
我们给出字符串哈希的解法，时间复杂度为$O(n)$
![image.png](https://s2.loli.net/2024/04/28/mdP3uetUSVpb1Wl.webp)

写完了，然后提交GitHub,写好我们更新了那些东西
![image.png](https://s2.loli.net/2024/04/28/ZBjdNExWhvqQG5C.webp)

然后到GitHub中，我们向仓库提交PR申请：
![image.png](https://s2.loli.net/2024/04/28/TG7OzAxIpeFljmd.webp)

创建 Pull Request
![image.png](https://s2.loli.net/2024/04/28/6junkJAgVaQ2Eoy.webp)

只有一个commit，那么title和description一致即可。
![image.png](https://s2.loli.net/2024/04/28/bx6gRGTn3BIHQNF.webp)


此时我们已经提交成功了，等待合并即可
![image.png](https://s2.loli.net/2024/04/28/mO5NIWXZjTnU1bG.webp)


## 滑动窗口求最大值

这是我之前的提交，增加滑动窗口求最大值的单调队列解法
![image.png](https://s2.loli.net/2024/04/28/QF9U5CH2KrcztdL.webp)
![image.png](https://s2.loli.net/2024/04/28/BbJ9K583mYDwaeE.webp)
