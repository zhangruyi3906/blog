---
title: Codeforces Round 826 (Div. 3) E. Sending a Sequence Over the Network
date: 2023-04-18 20:04:57
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 动态规划
- 1600
---

# E. Sending a Sequence Over the Network

​	![image-20230418200908805](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230418200908805.png)

![image-20230418200924964](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230418200924964.png)

## 题目大意

给你一个长度为n的数组，问整个数组能不能满足如下条件：

+ 将数组a分成若干个序列（连续，完全覆盖，可以想象为切开）

+ 对于每个序列来说，它的长度被写在了左边或者右边，例如

  >  3 1 1 1 对于序列1 1 1来说，它的长度3写在了左边
  >
  > 1 1 1 3 对于序列 1 1 1来说，它的长度3 写在了右边
  >
  > 这两种都是符合题意的，可以写在左边也可以写在右边

+ 最后分成的序列能不能满足上面的条件

## 思路

动态规划：

状态表示：`f[i]`表示以第`i`个数结尾的前缀合法方案的集合

> 如果以第i个数结尾的集合是合法的记为1，不是记为0

状态计算：

+ 如果以第`i`个数结尾，这个数为a[i],先考虑它是左侧a[i]个数的长度，并且`f[i-a[i]-1]`即这`a[i]+1`个数之前的所有数必须要已经是合法方案了，那么以第`i`个数结尾的这个数才可以是一个合法方案。
+ 再考虑a[i]是右侧`a[i]`个数的长度，那么说明`f[i-1]`需要已经是一个合法方案了，这样右侧的`a[i]+1`个数才是合法的，即第`a[i]+1`个数之前都是合法的

状态转移方程：

+ 初始化`f[i]=0,f[1]=1`
+ `if (i - a[i] >= 1 && f[i - a[i] - 1]) f[i] = 1;`
+ `if (i + a[i] <= n && f[i - 1]) f[i+a[i]]=1;`

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    vector<int> f(n + 1);
    f[0] = 1;
    for (int i = 1; i <= n; i++) {
        if (i - a[i] >= 1 && f[i - a[i] - 1]) f[i] = 1;
        if (i + a[i] <= n && f[i - 1]) f[i+a[i]]=1;
    }
    cout << (f[n] ? "YES" : "NO") << endl;
}

signed main() {
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif
    int _;
    cin >> _;
    while (_--) solve();

    return 0;
}
```

