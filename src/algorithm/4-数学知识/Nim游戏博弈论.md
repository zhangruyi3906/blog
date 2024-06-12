---
title: Nim游戏博弈论
date: 2023-07-19 10:11:04
category: 
    - Algorithm
    - 数学知识
tag:
  - Algorithm
  - 数学知识
  - 数论
  - 博弈论
---

# 【模板】nim 游戏

## 题目描述

https://www.luogu.com.cn/problem/P2197

甲，乙两个人玩 nim 取石子游戏。

nim 游戏的规则是这样的：地上有 $n$ 堆石子（每堆石子数量小于 $10^4$），每人每次可从任意一堆石子里取出任意多枚石子扔掉，可以取完，不能不取。每次只能从一堆里取。最后没石子可取的人就输了。假如甲是先手，且告诉你这 $n$ 堆石子的数量，他想知道是否存在先手必胜的策略。

## 输入格式

**本题有多组测试数据。**

第一行一个整数 $T$ （$T\le10$），表示有 $T$ 组数据

接下来每两行是一组数据，第一行一个整数 $n$，表示有 $n$ 堆石子，$n\le10^4$。

第二行有 $n$ 个数，表示每一堆石子的数量.

## 输出格式

共 $T$ 行，每行表示如果对于这组数据存在先手必胜策略则输出 `Yes`，否则输出 `No`。

## 样例 #1

### 样例输入 #1

```
2
2
1 1
2
1 0
```

### 样例输出 #1

```
No
Yes
```

## 思路

如果初态为必胜态$a_1 \land a_2 \land a_3 .. . \land a_n!=0$,则先手必胜。

如果初态为必败态，即上式结果为0，则先手必败

证明：

1. 必胜态一定可以给对手留下一个必败态

$s=a_1 \land  ... \land a_n!=0$,设s的二进制为1的最高位为k

那么一定有奇数个$a_i$的二进制位的第k位为1，我们使用$a_i\land s$替换$a_i$,那么

$a_1 \land ... \land a_i \land s... \land a_n=s \land s=0$

同时可以保证$a_i \land s<a_i$

2. 必败态一定给对手留下必胜态

因为必败态 $a_1 \land a_2 ... \land a_n=0$,看二进制位上面1的个数，相同位上面1的个数一定是偶数个，因此无论减少哪个数，异或和都不为0了，即给对手一个必胜态

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int t;
    cin >> t;
    while (t--) {
        int n, x;
        cin >> n;
        int res = 0;
        while (n--) {
            cin >> x;
            res ^= x;
        }
        cout << (res ? "Yes" : "No") << endl;
    }
    return 0;
}
```



# 取火柴游戏

## 题目描述

https://www.luogu.com.cn/problem/P1247

输入 $k$ 及 $k$ 个整数 $n_1,n_2,\cdots,n_k$，表示有 $k$ 堆火柴棒，第 $i$ 堆火柴棒的根数为 $n_i$；接着便是你和计算机取火柴棒的对弈游戏。取的规则如下：每次可以从一堆中取走若干根火柴，也可以一堆全部取走，但不允许跨堆取，也不允许不取。

谁取走最后一根火柴为胜利者。

例如：$k=2$，$n_1=n_2=2$，A 代表你，P 代表计算机，若决定 A 先取：

- A：$(2,2) \rightarrow (1,2)$，即从第一堆中取一根。
- P：$(1,2) \rightarrow (1,1)$，即从第二堆中取一根。
- A：$(1,1) \rightarrow (1,0)$。
- P：$(1,0) \rightarrow (0,0)$。P 胜利。

如果决定 $A$ 后取：

- P：$(2,2) \rightarrow (2,0)$。
- A：$(2,0) \rightarrow (0,0)$。A 胜利。

又如 $k=3$，$n_1=1$，$n_2=2$，$n_3=3$，$A$ 决定后取：

- P：$(1,2,3) \rightarrow (0,2,3)$。
- A：$(0,2,3) \rightarrow (0,2,2)$。
- A 已将游戏归结为 $(2,2)$ 的情况，不管 P 如何取 A 都必胜。

编一个程序，在给出初始状态之后，判断是先取必胜还是先取必败，如果是先取必胜，请输出第一次该如何取。如果是先取必败，则输出 `lose`。

## 输入格式

第一行，一个正整数 $k$。

第二行，$k$ 个整数 $n_1,n_2,\cdots,n_k$。

## 输出格式

如果是先取必胜，请在第一行输出两个整数 $a,b$，表示第一次从第 $b$ 堆取出 $a$ 个。第二行为第一次取火柴后的状态。如果有多种答案，则输出 $\lang b,a\rang$ 字典序最小的答案（ 即 $b$ 最小的前提下，使 $a$ 最小）。

如果是先取必败，则输出 `lose`。

## 样例 #1

### 样例输入 #1

```
3
3 6 9
```

### 样例输出 #1

```
4 3
3 6 5
```

## 样例 #2

### 样例输入 #2

```
4
15 22 19 10
```

### 样例输出 #2

```
lose
```

## 提示

### 数据范围及约定

对于全部数据，$k \le 500000$，$n_i \le 10^9$。

## 思路

与上一题的Nim游戏一样，这里需要特殊输出第一次拿走的数量

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n;
    cin >> n;
    vector<int> a(n + 1);
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
        res ^= a[i];
    }
    if (!res) {
        cout << "lose";
    } else {
        for (int i = 1; i <= n; i++) {
            if ((a[i] ^ res) < a[i]) {
                cout << (a[i] - (a[i] ^ res)) << " " << i << endl;
                a[i] = a[i] ^ res;
                break;
            }
        }
        for (int i = 1; i <= n; ++i) {
            cout << a[i] << " \n"[i == n];
        }
    }


    return 0;
}
```



# 取数游戏 II

## 题目描述

有一个取数的游戏。初始时，给出一个环，环上的每条边上都有一个非负整数。这些整数中至少有一个 $0$。然后，将一枚硬币放在环上的一个节点上。两个玩家就是以这个放硬币的节点为起点开始这个游戏，两人轮流取数，取数的规则如下：

1.  选择硬币左边或者右边的一条边，并且边上的数非 $0$；

1.  将这条边上的数减至任意一个非负整数（至少要有所减小）；

1.  将硬币移至边的另一端。

如果轮到一个玩家走，这时硬币左右两边的边上的数值都是 $0$，那么这个玩家就输了。

如下图，描述的是 Alice 和 Bob 两人的对弈过程（其中黑色节点表示硬币所在节点）。

 ![](https://cdn.luogu.com.cn/upload/pic/93.png) 

各图的结果为：

$\text{A}$：Alice 胜；$\text{B}$：Bob 胜；$\text{C}$：Alice 胜；$\text{D}$：Bob 胜。

$\text{D}$ 中，轮到 Bob 走时，硬币两边的边上都是 $0$，所以 Alice 获胜。

现在，你的任务就是根据给出的环、边上的数值以及起点（硬币所在位置），判断先走方是否有必胜的策略。

## 输入格式

第一行一个整数 $N$ $(N \leq 20)$，表示环上的节点数。

第二行 $N$ 个数，数值不超过 $30$，依次表示 $N$ 条边上的数值。硬币的起始位置在第一条边与最后一条边之间的节点上。

## 输出格式

仅一行。若存在必胜策略，则输出 ```YES```，否则输出 ```NO```。

## 样例 #1

### 样例输入 #1

```
4
2 5 3 0
```

### 样例输出 #1

```
YES
```

## 样例 #2

### 样例输入 #2

```
3
0 0 0
```

### 样例输出 #2

```
NO
```

## 思路

要么一直顺时针走，要么一直逆时针走，每次走的时候一定是把这条边减小为0，否则对手可以反过来走，让你变成失败。

找第一个为0的位置，看初始点到这个点要走多少次，奇数次则先手获胜。



## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
#define yes cout << "YES" << endl;
#define no cout << "NO" << endl;
#define IOS cin.tie(0), cout.tie(0), ios::sync_with_stdio(false);
#define cxk 1
#define debug(s, x) if (cxk) cout << "#debug:(" << s << ")=" << x << endl;
using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; ++i) {
        cin >> a[i];
    }
    int cnt1 = 0, cnt2 = 0;
    for (int i = 1; i <= n && a[i]; i++, cnt1++);
    for (int i = n; i >= 1 && a[i]; i--, cnt2++);
    if (cnt1 & 1 || cnt2 & 1) {
        yes
    } else {
        no
    }
}

signed main() {
    IOS
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif
    int _ = 1;
    while (_--) solve();
    return 0;
}
```

