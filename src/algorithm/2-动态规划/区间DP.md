---
title: 区间DP
date: 2023-05-20 22:40:25
category: 
  - Algorithm
  - 动态规划
tag:
  - Algorithm
  - 动态规划
---

# 石子合并（弱化版）

## 题目描述

https://www.luogu.com.cn/problem/P1775

设有 $N(N \le 300)$ 堆石子排成一排，其编号为 $1,2,3,\cdots,N$。每堆石子有一定的质量 $m_i(m_i \le 1000)$。现在要将这 $N$ 堆石子合并成为一堆。每次只能合并相邻的两堆，合并的代价为这两堆石子的质量之和，合并后与这两堆石子相邻的石子将和新堆相邻。合并时由于选择的顺序不同，合并的总代价也不相同。试找出一种合理的方法，使总的代价最小，并输出最小代价。

## 输入格式

第一行，一个整数 $N$。

第二行，$N$ 个整数 $m_i$。

## 输出格式

输出文件仅一个整数，也就是最小代价。

## 样例 #1

### 样例输入 #1

```
4
2 5 3 1
```

### 样例输出 #1

```
22
```

## 思路($O(n^3)$)

状态表示：`f[i][j]`表示把从`L`到`R`合并成一堆的最小代价

状态转移方程：`f[L][R]=f[L][k]+f[k+1][R]+s[R]-s[L-1]`

状态计算：`f[L,R]=min(f[L,R],f[L,k]+f[k+1,R]+s[R]-s[L-1])`

初始化：`f[i,i]=0`其余为正无穷

目标:`f[1,n]`

注意：s为前缀和数组,k为分割点

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 310;
int f[N][N]; //合并i,j所需要的最小代价
int a[N];
int s[N];
int n;

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> a[i];
    memset(f, 0x3f, sizeof f);
    for (int i = 1; i <= n; i++) {
        f[i][i] = 0;
        s[i] = s[i - 1] + a[i];
    }
    for (int len = 2; len <= n; len++) {
        for (int l = 1; l + len - 1 <= n; l++) {
            int r = l + len - 1;
            for (int k = l; k < r; k++) {
                f[l][r] = min(f[l][r], f[l][k] + f[k + 1][r] + s[r] - s[l - 1]);
            }
        }
    }
    cout << f[1][n] << endl;
    return 0;
}
```

# [NOI1995] 石子合并-环形

## 题目描述

https://www.luogu.com.cn/problem/P1880

在一个圆形操场的四周摆放 $N$ 堆石子，现要将石子有次序地合并成一堆，规定每次只能选相邻的 $2$ 堆合并成新的一堆，并将新的一堆的石子数，记为该次合并的得分。

试设计出一个算法,计算出将 $N$ 堆石子合并成 $1$ 堆的最小得分和最大得分。

## 输入格式

数据的第 $1$ 行是正整数 $N$，表示有 $N$ 堆石子。

第 $2$ 行有 $N$ 个整数，第 $i$ 个整数 $a_i$ 表示第 $i$ 堆石子的个数。

## 输出格式

输出共 $2$ 行，第 $1$ 行为最小得分，第 $2$ 行为最大得分。

## 样例 #1

### 样例输入 #1

```
4
4 5 9 4
```

### 样例输出 #1

```
43
54
```

## 提示

$1\leq N\leq 100$，$0\leq a_i\leq 20$。

## 思路

动态规划：
状态表示：`f[l][r]`表示当前合并的石子堆的大小为`len`,且石子堆的左端点是`l`,右端点是`r`的方案 的`max/min`

遇到环形的题目：

可以把环拆开，把链延长两倍，变成2n堆，其中`i`和`i+n`是相同的两堆。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 410;
int a[N], s[N];
int f[N][N], g[N][N];
int n;

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    memset(f, 0x3f, sizeof f), memset(g, -0x3f, sizeof g);
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        a[i + n] = a[i];
    }
    for (int i = 1; i <= 2 * n; i++) {
        s[i] = s[i - 1] + a[i];
        g[i][i] = 0, f[i][i] = 0;
    }

    for (int len = 2; len <= n; len++) {
        for (int l = 1; l + len - 1 <= 2 * n; l++) {
            int r = l + len - 1;
            for (int k = l; k < r; k++) {
                f[l][r] = min(f[l][r], f[l][k] + f[k + 1][r] + s[r] - s[l - 1]);
                g[l][r] = max(g[l][r], g[l][k] + g[k + 1][r] + s[r] - s[l - 1]);
            }
        }
    }
    int mi = INT_MAX, mx = -INT_MAX;
    for (int i = 1; i <= n; i++) {
        mi = min(mi, f[i][i + n - 1]);
        mx = max(mx, g[i][i + n - 1]);
    }
    cout << mi << "\n" << mx << endl;

    return 0;
}
```

# [NOIP2006 提高组] 能量项链

## 题目描述

https://www.luogu.com.cn/problem/P1063

在 Mars 星球上，每个 Mars 人都随身佩带着一串能量项链。在项链上有 $N$ 颗能量珠。能量珠是一颗有头标记与尾标记的珠子，这些标记对应着某个正整数。并且，对于相邻的两颗珠子，前一颗珠子的尾标记一定等于后一颗珠子的头标记。因为只有这样，通过吸盘（吸盘是 Mars 人吸收能量的一种器官）的作用，这两颗珠子才能聚合成一颗珠子，同时释放出可以被吸盘吸收的能量。如果前一颗能量珠的头标记为 $m$，尾标记为 $r$，后一颗能量珠的头标记为 $r$，尾标记为 $n$，则聚合后释放的能量为 $m \times r \times n$（Mars 单位），新产生的珠子的头标记为 $m$，尾标记为 $n$。

需要时，Mars 人就用吸盘夹住相邻的两颗珠子，通过聚合得到能量，直到项链上只剩下一颗珠子为止。显然，不同的聚合顺序得到的总能量是不同的，请你设计一个聚合顺序，使一串项链释放出的总能量最大。

例如：设 $N=4$，$4$ 颗珠子的头标记与尾标记依次为 $(2,3)(3,5)(5,10)(10,2)$。我们用记号 $\oplus$ 表示两颗珠子的聚合操作，$(j \oplus k)$ 表示第 $j,k$ 两颗珠子聚合后所释放的能量。则第 $4$，$1$ 两颗珠子聚合后释放的能量为：

$(4 \oplus 1)=10 \times 2 \times 3=60$。

这一串项链可以得到最优值的一个聚合顺序所释放的总能量为：

$(((4 \oplus 1) \oplus 2) \oplus 3)=10 \times 2 \times 3+10 \times 3 \times 5+10 \times 5 \times 10=710$。

## 输入格式

第一行是一个正整数 $N$（$4 \le N \le 100$），表示项链上珠子的个数。第二行是 $N$ 个用空格隔开的正整数，所有的数均不超过 $1000$。第 $i$ 个数为第 $i$ 颗珠子的头标记（$1 \le i \le N$），当 $i<N$ 时，第 $i$ 颗珠子的尾标记应该等于第 $i+1$ 颗珠子的头标记。第 $N$ 颗珠子的尾标记应该等于第 $1$ 颗珠子的头标记。

至于珠子的顺序，你可以这样确定：将项链放到桌面上，不要出现交叉，随意指定第一颗珠子，然后按顺时针方向确定其他珠子的顺序。

## 输出格式

一个正整数 $E$（$E\le 2.1 \times 10^9$），为一个最优聚合顺序所释放的总能量。

## 样例 #1

### 样例输入 #1

```
4
2 3 5 10
```

### 样例输出 #1

```
710
```



## 思路

环形转换为链型：复制一遍数组，转化为长度为2n的数组。

思路与上面一样，这里长度需要从3开始枚举，最大到n+1，因为可以把首位也合并

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 210;
int n;
int a[N];
int f[N][N];

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        a[i + n] = a[i];
    }

    for (int len = 3; len <= n + 1; len++) {
        for (int l = 1; l + len - 1 <= 2 * n; l++) {
            int r = l + len - 1;
            for (int k = l + 1; k < r; k++) {
                f[l][r] = max(f[l][r], f[l][k] + f[k][r] + a[l] * a[k] * a[r]);
            }
        }
    }
    int res = 0;
    for (int i = 0; i <= n; i++) res = max(res, f[i][i + n]);
    cout << res << endl;

    return 0;
}
```

