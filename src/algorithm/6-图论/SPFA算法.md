---
title: SPFA算法
date: 2023-07-08 19:50:14
category: 
    - Algorithm
    - 图论
tag:
  - Algorithm
  - 图论
  - SPFA
---

# SPFA算法($O(km)-O(nm)$)

> SPFA算法是对Bellman-ford算法的优化

只有本轮被更新的点，其出边才有可能引起下一轮的松弛操作因此用队列来维护被更新的点的集合。vis[u]标记u点是否在队内，cntv记录边数，判负环。

1. 初始化，s入队，标记s在队内，d[s]=0,d[其它点]=+o
2. 从队头弹出u点，标记u不在队内：
3. 枚举u的所有出边，执行松弛操作。记录从s走到V的边数并判负环。如果V不在队内则把V压入队尾，并打上标记；
4. 重复2,3步操作，直到队列为空。

# 【模板】负环

## 题目描述

给定一个 $n$ 个点的有向图，请求出图中是否存在**从顶点 $1$ 出发能到达**的负环。

负环的定义是：一条边权之和为负数的回路。

## 输入格式

**本题单测试点有多组测试数据**。

输入的第一行是一个整数 $T$，表示测试数据的组数。对于每组数据的格式如下：

第一行有两个整数，分别表示图的点数 $n$ 和接下来给出边信息的条数 $m$。

接下来 $m$ 行，每行三个整数 $u, v, w$。

- 若 $w \geq 0$，则表示存在一条从 $u$ 至 $v$ 边权为 $w$ 的边，还存在一条从 $v$ 至 $u$ 边权为 $w$ 的边。
- 若 $w < 0$，则只表示存在一条从 $u$ 至 $v$ 边权为 $w$ 的边。

## 输出格式

对于每组数据，输出一行一个字符串，若所求负环存在，则输出 `YES`，否则输出 `NO`。

## 样例 #1

### 样例输入 #1

```
2
3 4
1 2 2
1 3 4
2 3 1
3 1 -3
3 3
1 2 3
2 3 4
3 1 -8
```

### 样例输出 #1

```
NO
YES
```

## 提示

#### 数据规模与约定

对于全部的测试点，保证：

- $1 \leq n \leq 2 \times 10^3$，$1 \leq m \leq 3 \times 10^3$。
- $1 \leq u, v \leq n$，$-10^4 \leq w \leq 10^4$。
- $1 \leq T \leq 10$。

#### 提示

请注意，$m$ **不是**图的边数。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;
const int N = 2010;
typedef struct node {
    int y, w;
} node;

vector<node> e[N];
int n, m;

bool spfa() {
    vector<int> dist(n + 1), cnt(n + 1, 0);
    for (int i = 1; i <= n; i++) dist[i] = 1e18;
    vector<bool> st(n + 1);
    queue<int> q;
    q.push(1);
    st[1] = 1;
    dist[1] = 0;
    while (q.size()) {
        int x = q.front();
        q.pop();
        st[x] = 0;
        for (auto [y, w]: e[x]) {
            if (dist[y] > dist[x] + w) {
                dist[y] = dist[x] + w;
                cnt[y] = cnt[x] + 1;
                if (cnt[y] >= n) return true; //存在负环
                if (!st[y]) {
                    q.push(y);
                    st[y] = 1;
                }
            }
        }
    }
    return false;
}

void solve() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++) e[i].clear();
    for (int i = 1; i <= m; i++) {
        int a, b, c;
        cin >> a >> b >> c;
        e[a].push_back({b, c});
        if (c >= 0)e[b].push_back({a, c});
    }
    if (spfa()) {
        cout << "YES" << endl;
    } else {
        cout << "NO" << endl;
    }
}

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int t;
    cin >> t;
    while (t--) solve();
    return 0;
}
```

