---
title: CF刷题遇到的一些数学题
date: 2023-07-11 13:41:00
category:
- Algorithm
- Codeforces
tag: 
- codeforces
---

# Many Perfect Squares

## 题面翻译

有 $n$ 个数  $(1 \le n \le 50)$ 。   它们分别是 $a_1,a_2,...,a_n$ 。你需要选择一个数 $x$ ，使得 $x$ 在 $0$ 至 $10^{18}$ 之内，并且  $a_1 + x,a_2 + x,a_3 + x ... a_n +x$ 中有尽可能多的完全平方数。询问当 $x$ 最优时,有多少个数是完全平方数。

## 题目描述

You are given a set $ a_1, a_2, \ldots, a_n $ of distinct positive integers.

We define the squareness of an integer $ x $ as the number of perfect squares among the numbers $ a_1 + x, a_2 + x, \ldots, a_n + x $ .

Find the maximum squareness among all integers $ x $ between $ 0 $ and $ 10^{18} $ , inclusive.

Perfect squares are integers of the form $ t^2 $ , where $ t $ is a non-negative integer. The smallest perfect squares are $ 0, 1, 4, 9, 16, \ldots $ .

## 输入格式

Each test contains multiple test cases. The first line contains the number of test cases $ t $ ( $ 1 \le t \le 50 $ ). The description of the test cases follows.

The first line of each test case contains a single integer $ n $ ( $ 1 \le n \le 50 $ ) — the size of the set.

The second line contains $ n $ distinct integers $ a_1, a_2, \ldots, a_n $ in increasing order ( $ 1 \le a_1 < a_2 < \ldots < a_n \le 10^9 $ ) — the set itself.

It is guaranteed that the sum of $ n $ over all test cases does not exceed $ 50 $ .

## 输出格式

For each test case, print a single integer — the largest possible number of perfect squares among $ a_1 + x, a_2 + x, \ldots, a_n + x $ , for some $ 0 \le x \le 10^{18} $ .

## 样例 #1

### 样例输入 #1

```
4
5
1 2 3 4 5
5
1 6 13 22 97
1
100
5
2 5 10 17 26
```

### 样例输出 #1

```
2
5
1
2
```

## 提示

In the first test case, for $ x = 0 $ the set contains two perfect squares: $ 1 $ and $ 4 $ . It is impossible to obtain more than two perfect squares.

In the second test case, for $ x = 3 $ the set looks like $ 4, 9, 16, 25, 100 $ , that is, all its elements are perfect squares.

## 思路

注意到n其实很小，答案至少为1，因为可以使得任意一个数变成平方数

现在我们考虑加一个$x$，可以使得至少两个数变为平方数到情况:

$a[i]+x=p^2$

$a[j]+x=q^2$

两式相减得到：$a[i]-a[j]=p^2-q^2$

于是：$a[i]-a[j]=(p+q)(p-q)$,这里$(p+q)和(p-q)$显然是具有相同奇偶性的

因为$n$很小，所以我们可以考虑枚举$a[i]-a[j]$,即$n^2$,设$diff=a[i]-a[j]$,可以先对$a$数组进行排序，降序排列

然后去枚举$diff$的因子$t=(p-q)$，得到如下结果：

$p-q=t$

$p+q=\frac{diff}{t}$

解方程得到$p=\frac{(t+\frac{diff}{t})}{2}$，因此$x=p^2-a[i]$

得到$x$后，再去判断数组$a$中的每个数是否都为平方数。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
#define yes cout << "YES" << endl;
#define no cout << "NO" << endl;
#define IOS cin.tie(0), cout.tie(0), ios::sync_with_stdio(false);
#define cxk 0
#define debug(s, x) if (cxk) cout << "#debug:(" << s << ")=" << x << endl;
using namespace std;

bool check(int x) {
    int t = sqrt(x);
    return t * t == x;
}

void solve() {
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    sort(a.begin() + 1, a.end());
    reverse(a.begin() + 1, a.end());
    int res = 1;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            int diff = a[i] - a[j];
            for (int t = 1; t * t <= diff; t++) {
                if (diff % t != 0) continue;
                if (t % 2 != (diff / t) % 2) continue; //两个因子奇偶性不同
                int p = (diff / t + t) / 2;
                int x = p * p - a[i];
                if (x < 0) continue;
                int cnt = 0;
                for (int k = 1; k <= n; k++) {
                    debug("a[k]+x", a[k] + x);
                    if (check(a[k] + x)) cnt++;
                }
                res = max(res, cnt);
            }
        }
    }
    cout << res << endl;
}

signed main() {
    IOS
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif
    int _ = 1;
    cin >> _;
    while (_--) solve();
    return 0;
}
```

