---
title: Codeforces Round 797 (Div. 3) D. Black and White Stripe
date: 2023-04-19 23:02:11
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 前缀和
- 1000
---

# D. Black and White Stripe



![image-20230419230228217](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230419230228217.png)

## 题目大意

给你一个长度为n的字符串，只包含B和W，每次操作可以将一个W变成B，问最少进行多少次操作可以得到连续的k个B。

## 思路

> 脑子抽了，想半天没想出来这么简单的问题

利用前缀和数组，如果是W，值就是1，然后从前往后求一遍前缀和

再去从头到尾扫一遍，以第i个数结尾的连续k个B，所需要的最小代价应该为`sum[i]-sum[i-k]`

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 2e5 + 10;
char s[N];

void solve() {
    int n, k;
    cin >> n >> k;
    cin >> s + 1;
    vector<int> sum(n + 1);
    for (int i = 1; i <= n; i++) {
        sum[i] += sum[i - 1];
        if (s[i] == 'W') sum[i]++;
    }
    int res = INT_MAX;
    for (int i = k; i <= n; i++) {
        res = min(res, sum[i] - sum[i - k]);
    }
    cout<<res<<endl;
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

