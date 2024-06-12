---
title: Codeforces Round 817 (Div. 4) E. Counting Rectangles
date: 2023-04-15 11:38:43
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 前缀和
- 二维前缀和
- 1500
---

# E. Counting Rectangles

![image-20230415113917339](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230415113917339.png)	![image-20230415113942127](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230415113942127.png)

## 题目大意

给你n个矩形和q组询问:$n<=10^5,q<=10^5$

+ 每个矩形的长度为$h_i,w_i$,其中$h_i,w_i<=1000$

+ 每组询问包含两个长宽，分别为$h_s,w_s,h_b,w_b$
+ 问你这个长度能包含的矩形的面积和为多少，即$h_s<h_i<h_b,w_s<w_i<w_b$

## 思路

因为长度和宽度的范围很小，因此我们可以使用二维前缀和算法，将长度和宽度的乘积存入对应的二维数组中去。然后对于每个询问，就相当于问在范围$[h_s+1,w_s+1]～[h_b-1,w_b-1]$之间的元素和为多少。

> 可参考二维前缀和模版，
>
> 注意这里对二维vector的使用：
>
> 如果是用`vector<int>` `a[N]`; 这种方式是不会对元素进行初始化的，因此在赋值的时候不可以使用+=
>
> 如果是使用 ` vector<vector<int>> a(N, vector<int>(N))`; ,那么二维数组的元素初始化都是0

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;
const int N = 1010;

void solve() {
    int n, q;
    cin >> n >> q;
    vector<vector<int>> a(N, vector<int>(N));
    vector<vector<int>> s(N, vector<int>(N));
    for (int i = 1; i <= n; i++) {
        int h, w;
        cin >> h >> w;
        a[h][w] += h * w;
    }
    for (int i = 1; i <= 1000; i++) {
        for (int j = 1; j <= 1000; j++) {
            s[i][j] = s[i - 1][j] + s[i][j - 1] + a[i][j] - s[i - 1][j - 1];
        }
    }
    while (q--) {
        int hs, ws, hb, wb;
        cin >> hs >> ws >> hb >> wb;
        int res = s[hb - 1][wb - 1] - s[hs][wb - 1] - s[hb - 1][ws] + s[hs][ws];
        cout << res << endl;
    }
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

