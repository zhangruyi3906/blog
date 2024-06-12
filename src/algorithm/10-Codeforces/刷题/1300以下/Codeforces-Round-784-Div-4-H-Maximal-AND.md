---
title: Codeforces Round 784 (Div. 4) H. Maximal AND
date: 2023-04-13 22:52:45
tag:
---

# H. Maximal AND

![image-20230413225322278](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230413225322278.png)

## 题目大意

给你一个长度为n的数组a，和一个整数k，你每次可以选择一个数和$2^j(0<=j<=30)$进行或操作，最多可以进行k次，问整个数组最终一起进行或操作的最大值是多少。

## 思路

贪心的思想，先开一个数组，统计所有数的二进制表示下的第i位一共出现了几次，每进行一次或操作，就相当于给第i位的次数加上了1，只有这个次数达到n的时候，在最终整个数组进行或运算的时候才有效，因此如果加上都不满n了，那么也没有必要加上了。我们可以从后往前加，如果后面加上一定的次数满n了，那我们一定要加上，否则就不加，因为加多少次都无效。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n + 1);
    vector<int> b(31);
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        for (int j = 0; j < 31; j++) {
            b[j] += (a[i] >> j & 1);
        }
    }

    for (int i = 30; i >= 0; i--) {
        if (b[i] + k >= n) {
            int t = n - b[i];
            b[i] = n;
            k -= t;
        }
    }

    int res = 0;
    for (int i = 0; i <= 30; i++) {
        if (b[i] == n) {
            res += pow(2, i);
        }
    }
    cout << res << endl;

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

