---
title: 最短路Johnson算法
date: 2023-07-08 21:47:24
category: 
    - Algorithm
    - 图论
tag:
    - Algorithm
    - 图论
    - Johnson算法
---

# 最短路Johnson算法($O(nmlogm)$)

> 可以求任意两点最短路，
>
> 新图的边权改造为：$w(x,y)+h(x)-h(y)$
>
> 构造的新图 $d1(x,y)=d(x,y)+h(x)-h(y)$,其中$h(x)$表示从虚拟原点到点x最短路
>
> 因此旧图 $d(x,y)=d1(x,y)+h(y)-h(x)$
>
> 

![image-20230708214732120](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202307082147256.png)

# 【模板】Johnson 全源最短路

## 题目描述

给定一个包含 $n$ 个结点和 $m$ 条带权边的有向图，求所有点对间的最短路径长度，一条路径的长度定义为这条路径上所有边的权值和。

注意：

1. 边权**可能**为负，且图中**可能**存在重边和自环；

2. 部分数据卡 $n$ 轮 SPFA 算法。

## 输入格式

第 $1$ 行：$2$ 个整数 $n,m$，表示给定有向图的结点数量和有向边数量。

接下来 $m$ 行：每行 $3$ 个整数 $u,v,w$，表示有一条权值为 $w$ 的有向边从编号为 $u$ 的结点连向编号为 $v$ 的结点。

## 输出格式

若图中存在负环，输出仅一行 $-1$。

若图中不存在负环：

输出 $n$ 行：令 $dis_{i,j}$ 为从 $i$ 到 $j$ 的最短路，在第 $i$ 行输出 $\sum\limits_{j=1}^n j\times dis_{i,j}$，注意这个结果可能超过 int 存储范围。

如果不存在从 $i$ 到 $j$ 的路径，则 $dis_{i,j}=10^9$；如果 $i=j$，则 $dis_{i,j}=0$。

## 样例 #1

### 样例输入 #1

```
5 7
1 2 4
1 4 10
2 3 7
4 5 3
4 2 -2
3 4 -3
5 3 4
```

### 样例输出 #1

```
128
1000000072
999999978
1000000026
1000000014
```

## 样例 #2

### 样例输入 #2

```
5 5
1 2 4
3 4 9
3 4 -3
4 5 3
5 3 -2
```

### 样例输出 #2

```
-1
```

## 提示

【样例解释】

左图为样例 $1$ 给出的有向图，最短路构成的答案矩阵为：

```
0 4 11 8 11 
1000000000 0 7 4 7 
1000000000 -5 0 -3 0 
1000000000 -2 5 0 3 
1000000000 -1 4 1 0 
```

右图为样例 $2$ 给出的有向图，红色标注的边构成了负环，注意给出的图不一定连通。

![](https://cdn.luogu.com.cn/upload/image_hosting/7lb35u4u.png)

【数据范围】

对于 $100\%$ 的数据，$1\leq n\leq 3\times 10^3,\ \ 1\leq m\leq 6\times 10^3,\ \ 1\leq u,v\leq n,\ \ -3\times 10^5\leq w\leq 3\times 10^5$。

对于 $20\%$ 的数据，$1\leq n\leq 100$，不存在负环（可用于验证 Floyd 正确性）

对于另外 $20\%$ 的数据，$w\ge 0$（可用于验证 Dijkstra 正确性）

upd. 添加一组 Hack 数据：针对 SPFA 的 SLF 优化



## 代码

> 被卡一组SPFA，暂时不会解决

```cpp
#include <bits/stdc++.h>

#define endl '\n'
using namespace std;

const int INF = 1e9;
const int N = 3e3 + 10;
typedef pair<int, int> PII;
typedef long long ll;
typedef struct node {
    int y, w;
} node;
vector<node> e[N];
int n, m;

bool cnt[N];
ll h[N], d[N];

void spfa() {
    for (int i = 1; i <= n; i++) h[i] = 1e18;
    queue<int> q;
    vector<bool> st(n + 1);
    q.push(0);
    h[0] = 0;
    st[0] = true;
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        st[x] = false;
        for (auto [y, w]: e[x]) {
            if (h[y] > h[x] + w) {
                h[y] = h[x] + w;
                cnt[y] = cnt[x] + 1;
                if (cnt[y] >= n) {
                    cout << -1;
                    exit(0);
                }
                if (!st[y]) {
                    q.push(y);
                    st[y] = true;
                }
            }
        }
    }
}

void dijkstra(int s) {
    priority_queue<pair<long long, int>> q;
    vector<bool> st(n + 1);
    for (int i = 1; i <= n; i++) d[i] = INF;
    for (int i = 1; i <= n; i++) st[i] = false;
    q.emplace(0, s);
    d[s] = 0;
    while (!q.empty()) {
        int u = q.top().second;
        q.pop();
        if (st[u]) continue;
        st[u] = true;
        for (auto [y, w]: e[u]) {
            if (d[y] > d[u] + w) {
                d[y] = d[u] + w;
                if (!st[y]) {
                    q.emplace(-d[y], y);
                }
            }
        }
    }
}

int main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    cin.tie(0), cout.tie(0);
    ios::sync_with_stdio(false);
    cin >> n >> m;
    for (int i = 1; i <= m; i++) {
        int a, b, c;
        cin >> a >> b >> c;
        e[a].push_back({b, c});
    }
    for (int i = 1; i <= n; i++) {
        e[0].push_back({i, 0});//加虚拟边
    }
    spfa();
    for (int x = 1; x <= n; x++) {
        for (auto &item: e[x]) {
            item.w += h[x] - h[item.y];//构造新的边权
        }
    }
    for (int i = 1; i <= n; i++) {
        dijkstra(i);

        ll res = 0;
        for (int j = 1; j <= n; j++) {
            if (d[j] == INF) res += (ll) j * INF;
            else res += (ll) j * (d[j] + h[j] - h[i]);
        }
        cout << res << endl;
    }
    return 0;
}
```
