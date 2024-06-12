---
title: 状态压缩DP
date: 2023-05-20 10:07:05
category:
   - Algorithm
   - 动态规划
tag:
   - Algorithm
   - 动态规划
---

# [SCOI2005] 互不侵犯

## 题目描述

https://www.luogu.com.cn/problem/P1896

在N×N的棋盘里面放K个国王，使他们互不攻击，共有多少种摆放方案。国王能攻击到它上下左右，以及左上左下右上右下八个方向上附近的各一个格子，共8个格子。

注：数据有加强（2018/4/25）

## 输入格式

只有一行，包含两个数N，K （ 1 <=N <=9, 0 <= K <= N \* N）

## 输出格式

所得的方案数

## 样例 #1

### 样例输入 #1

```
3 2
```

### 样例输出 #1

```
16
```

## 思路

学习状态压缩DP，首先需要熟悉各种位运算：

+ &：两位都为1才得1
+ ｜：有1得1
+ ^：相同为0，不同为1
+ ~：0变1，1变0
+ <<：左移一次相当于✖️2，例如1<<n相当于$2^n$,  5<<3相当于$5*2^3$
+ \>\>：右移：相当于➗2

为了求解本题，我们使用二进制数记录每行都状态：例如101代表第一格和第三格放国王，接着我们先筛选出行内合法的方案：

1. 行内合法： 如果`!(i&i>>1)`为真，则`i`合法：

   > ```
   > i=5  1 0 1  i=6  1 1 0
   > 		 0 1 0  		 0 1 1
   > ```

2. 行间兼容：如果`!(a&b)&&!(a&b>>1) &&!(a&b<<1)`为真，则a，b兼容

   > `a&b`表示列方向上不可以同时为1
   >
   > `a&b>>1`表示左对角不可以放1
   >
   > `a&b<<1`表示右对角不可以放1

3. 状态表示：`f[i,j,a]`表示前i行已经放了j个国王，第i行的第a个状态的方案数

![image.png](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305201125661.png)

![img](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305201126692.png)

> 状态表示：`f[i,j,a]`表示前`i`行已经放了`j`个国王，第`i`行的第`a`个状态的方案数
>
> - 统计每个合法状态包含的国王数：看有几个1
> - ![img](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305201127022.png)
> - [优先级](https://so.csdn.net/so/search?q=优先级&spm=1001.2101.3001.7020)：<<优先级高于&

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

int n, k;//棋盘行数，国王总数
int cnt = 0;//同一行的合法状态个数
int s[1 << 12];//同一行的合法状态集
int num[1 << 12];//每个合法状态包含的国王数
int f[12][144][1 << 12];//f[i,j,a]表示前i行放了j个国王，第i行第a个状态时的方案数

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    cin >> n >> k;

    //预处理
    for (int i = 0; i < (1 << n); i++)//枚举一行的所有状态
        if (!(i & i >> 1))//如果不存在相邻的1
        {
            s[cnt++] = i;//保存一行的合法状态
            for (int j = 0; j < n; j++)
                num[i] += (i >> j & 1);//统计每个合法状态包含的国王数(看里面有几个1)
        }

    f[0][0][0] = 1;//不放国王也是一种方案

    for (int i = 1; i <= n + 1; i++)//枚举行
        for (int j = 0; j <= k; j++)//枚举国王数
            for (int a = 0; a < cnt; a++)//枚举第i行的合法状态
                for (int b = 0; b < cnt; b++)//枚举第i-1行的合法状态
                {
                    int c = num[s[a]];//第i行第a个状态的国王数
                    //可以继续放国王，不存在同列的1，不存在斜对角的1
                    if ((j >= c) && !(s[b] & s[a]) && !(s[b] & s[a] << 1) && !(s[b] & (s[a] >> 1)))
                        f[i][j][a] += f[i - 1][j - c][b];//从第i-1行向第i行转移
                }
    cout << f[n + 1][k][0];
    return 0;
}
```

# [USACO06NOV]Corn Fields G 玉米田

## 题目描述

https://www.luogu.com.cn/problem/P1879

Farmer John has purchased a lush new rectangular pasture composed of M by N (1 ≤ M ≤ 12; 1 ≤ N ≤ 12) square parcels. He wants to grow some yummy corn for the cows on a number of squares. Regrettably, some of the squares are infertile and can't be planted. Canny FJ knows that the cows dislike eating close to each other, so when choosing which squares to plant, he avoids choosing squares that are adjacent; no two chosen squares share an edge. He has not yet made the final choice as to which squares to plant.

Being a very open-minded man, Farmer John wants to consider all possible options for how to choose the squares for planting. He is so open-minded that he considers choosing no squares as a valid option! Please help Farmer John determine the number of ways he can choose the squares to plant.

农场主 $\rm John$ 新买了一块长方形的新牧场，这块牧场被划分成 $M$ 行 $N$ 列 $(1 \le M \le 12; 1 \le  N \le 12)$，每一格都是一块正方形的土地。 $\rm John$ 打算在牧场上的某几格里种上美味的草，供他的奶牛们享用。

遗憾的是，有些土地相当贫瘠，不能用来种草。并且，奶牛们喜欢独占一块草地的感觉，于是 $\rm John$ 不会选择两块相邻的土地，也就是说，没有哪两块草地有公共边。

$\rm John$ 想知道，如果不考虑草地的总块数，那么，一共有多少种种植方案可供他选择？（当然，把新牧场完全荒废也是一种方案）

## 输入格式

第一行：两个整数 $M$ 和 $N$，用空格隔开。

第 $2$ 到第 $M+1$ 行：每行包含 $N$ 个用空格隔开的整数，描述了每块土地的状态。第 $i+1$ 行描述了第 $i$ 行的土地，所有整数均为 $0$ 或 $1$ ，是 $1$ 的话，表示这块土地足够肥沃，$0$ 则表示这块土地不适合种草。

## 输出格式

一个整数，即牧场分配总方案数除以 $100,000,000$ 的余数。

## 样例 #1

### 样例输入 #1

```
2 3
1 1 1
0 1 0
```

### 样例输出 #1

```
9
```

## 思路

1. 行内合法： 如果`!(i&i>>1)`为真，则`i`合法：

   > ```
   > i=5  1 0 1  i=6  1 1 0
   > 		 0 1 0  		 0 1 1
   > ```

2. 行间兼容：如果`!(a&b)&&(a&g[i]==a)`为真，则a，b兼容

   > 如果g[i]的某一位为0的话，a的那一位只可以为0，
   >
   > 如果g[i]的某一位为1的化，a的那一位可以为1或0
   >
   > 即 a&g[i]==a


状态表示：`f[i,a]`表示所有已经摆完前`i`行，并且第`i`行的状态是`a`的所有摆放方案的集合的数量

状态计算：$f[i,a]=\sum f[i-1,b]$

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int mod = 1e9;
int n, m;//玉米田的行数、列数
int g[14];//各行的状态值
int cnt;//同一行的合法状态个数
int s[1 << 14];//一行的合法状态集
int f[14][1 << 14];//f[i,a]表示已经种植前i行，第i行第a各状态时的方案数

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    cin >> n >> m;
    //预处理
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            int x;
            cin >> x;
            g[i] = (g[i] << 1) + x;//保存各行的状态值
        }
    }

    for (int i = 0; i < 1 << m; i++)//枚举一行所有状态
        if (!(i & i >> 1))//如果不存在相邻的1
            s[cnt++] = i;

    f[0][0] = 1;//什么都不种植也是一种方案；
    for (int i = 1; i <= n + 1; i++)//枚举行
        for (int a = 0; a < cnt; a++)//枚举第i行的合法状态
            for (int b = 0; b < cnt; b++) //枚举第i-1行合法状态
            {
                //a种植在肥沃的土地上；a,b同列不同时为1
                if ((s[a] & g[i]) == s[a] && !(s[a] & s[b]))
                    f[i][a] = (f[i][a] + f[i - 1][b]) % mod;
            }
    cout << f[n + 1][0];

    return 0;
}
```

# [NOI2001] 炮兵阵地

## 题目描述

https://www.luogu.com.cn/problem/P2704

司令部的将军们打算在 $N\times M$ 的网格地图上部署他们的炮兵部队。

一个 $N\times M$ 的地图由 $N$ 行 $M$ 列组成，地图的每一格可能是山地（用 $\texttt{H}$ 表示），也可能是平原（用 $\texttt{P}$ 表示），如下图。

在每一格平原地形上最多可以布置一支炮兵部队（山地上不能够部署炮兵部队）；一支炮兵部队在地图上的攻击范围如图中黑色区域所示：

 ![](https://cdn.luogu.com.cn/upload/pic/1881.png) 

如果在地图中的灰色所标识的平原上部署一支炮兵部队，则图中的黑色的网格表示它能够攻击到的区域：沿横向左右各两格，沿纵向上下各两格。

图上其它白色网格均攻击不到。从图上可见炮兵的攻击范围不受地形的影响。

现在，将军们规划如何部署炮兵部队，在防止误伤的前提下（保证任何两支炮兵部队之间不能互相攻击，即任何一支炮兵部队都不在其他支炮兵部队的攻击范围内），在整个地图区域内最多能够摆放多少我军的炮兵部队。

## 输入格式

第一行包含两个由空格分割开的正整数，分别表示 $N$ 和 $M$。

接下来的 $N$ 行，每一行含有连续的 $M$ 个字符，按顺序表示地图中每一行的数据。

## 输出格式

一行一个整数，表示最多能摆放的炮兵部队的数量。

## 样例 #1

### 样例输入 #1

```
5 4
PHPP
PPHH
PPPP
PHPP
PHHP
```

### 样例输出 #1

```
6
```

## 提示

对于 $100\%$ 的数据，$N\le 100$，$M\le 10$，保证字符仅包含 `P` 与 `H`。

## 思路

1. 行内合法：`!(i&i>>1) && !(i&i>>2)`为真，则i合法
2. 行间合法：`!(a&b) &&!(a&c) &&!(b&c) &&(a&g[i]==a)`为真，则a,b,c合法

状态表示：`f[i,a,b]`表示已经摆放了前i行，当前行是第i行的第a个状态，第i-1行的第b个状态能拜访的最大数量

状态计算：`f[i,a,b]=max(f[i,a,b],f[i-1,b,c]+num[a])`

空间压缩优化：只需要把`i`改为`i&1`

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 110, M = 1 << 10;
int n, m;//行数，列数
int g[N];//保存地图各行数值
int cnt;//同一行的合法状态个数
int s[M];//同一行的合法状态集
int num[M];//每个合法状态包含1的个数
int f[N][M][M];//f[i,a,b]表示已经放好前i行，第i行第a各状态，第i-1行第b各状态时，能放置的最大数量



signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < m; j++) {
            char c;
            cin >> c;
            if (c == 'P') g[i] = (g[i] << 1) + 1;
            else g[i] = g[i] << 1;
        }
    }
    for (int i = 0; i < 1 << m; i++) {
        if (!(i & i >> 1) && !(i & i >> 2)) {
            s[cnt++] = i;
            for (int j = 0; j < m; j++) num[i] += (i >> j & 1);
        }
    }
    for (int i = 1; i <= n + 2; i++) {
        for (int a = 0; a < cnt; a++) {
            for (int b = 0; b < cnt; b++) {
                for (int c = 0; c < cnt; c++) {
                    if (!(s[a] & s[b]) && !(s[a] & s[c]) && !(s[b] & s[c]) &&
                        (g[i] & s[a]) == s[a] && (g[i - 1] & s[b]) == s[b])
                        f[i][a][b] = max(f[i][a][b], f[i - 1][b][c] + num[s[a]]);
                }
            }
        }
    }
    cout << f[n + 2][0][0];


    return 0;
}
```

# 蒙德里安的梦想

## 题目

链接：https://www.acwing.com/problem/content/293/

求把 N×M 的棋盘分割成若干个 1×2的长方形，有多少种方案。

例如当 N=2，M=4 时，共有 5 种方案。当 N=2，M=3 时，共有 3种方案。

如下图所示：

![2411_1.jpg](https://www.acwing.com/media/article/image/2019/01/26/19_4dd1644c20-2411_1.jpg)

#### 输入格式

输入包含多组测试用例。

每组测试用例占一行，包含两个整数 N和 M。

当输入用例 N=0，M=0时，表示输入终止，且该用例无需处理。

#### 输出格式

每个测试用例输出一个结果，每个结果占一行。

#### 数据范围

1≤N,M≤11

#### 输入样例：

```
1 2
1 3
1 4
2 2
2 3
2 4
2 11
4 11
0 0
```

#### 输出样例：

```
1
0
1
2
3
5
144
51205
```

## 思路

![image.png](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305210855557.png)



## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 12, M = 1 << 12;
int st[M];
int f[N][M];


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n, m;
    while (cin >> n >> m && (n || m)) {

        for (int i = 0; i < 1 << n; i++) {
            int cnt = 0;
            st[i] = true;
            for (int j = 0; j < n; j++)
                if (i >> j & 1) {
                    if (cnt & 1) {
                        st[i] = false; // cnt 为当前已经存在多少个连续的0
                        break;
                    }
                } else cnt++;
            if (cnt & 1) st[i] = false; // 扫完后要判断一下最后一段有多少个连续的0
        }

        memset(f, 0, sizeof f);
        f[0][0] = 1;
        for (int i = 1; i <= m; i++)//枚举列
            for (int j = 0; j < 1 << n; j++)//枚举第i列第状态
                for (int k = 0; k < 1 << n; k++)//枚举第i-1列的状态
                    //两列状态兼容：	不出现重叠1，不出现
                    if ((j & k) == 0 && (st[j | k]))
                        // j & k == 0 表示 i 列和 i - 1列同一行不同时捅出来
                        // st[j | k] == 1 表示 在 i 列状态 j， i - 1 列状态 k 的情况下是合法的.
                        f[i][j] += f[i - 1][k];
        cout << f[m][0] << endl;
    }


    return 0;
}
```

