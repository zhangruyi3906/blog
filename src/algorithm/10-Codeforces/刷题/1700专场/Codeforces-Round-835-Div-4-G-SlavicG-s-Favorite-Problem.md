---
title: Codeforces Round 835 (Div. 4) G. SlavicG's Favorite Problem
date: 2023-04-05 12:02:17
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- bfs
- dfs
- tree
- 异或
- 位运算
- 1700
---

## G. SlavicG's Favorite Problem

You are given a weighted tree with 𝑛 vertices. Recall that a tree is a connected graph without any cycles. A weighted tree is a tree in which each edge has a certain weight. The tree is undirected, it doesn't have a root.

Since trees bore you, you decided to challenge yourself and play a game on the given tree.

In a move, you can travel from a node to one of its neighbors (another node it has a direct edge with).

You start with a variable 𝑥 which is initially equal to 0 . When you pass through edge 𝑖 , 𝑥 changes its value to 𝑥 𝖷𝖮𝖱 𝑤𝑖 (where 𝑤𝑖 is the weight of the 𝑖 -th edge).

Your task is to go from vertex 𝑎 to vertex 𝑏 , but you are allowed to enter node 𝑏 if and only if after traveling to it, the value of 𝑥 will become 0 . In other words, you can travel to node 𝑏 only by using an edge 𝑖 such that 𝑥 𝖷𝖮𝖱 𝑤𝑖=0 . Once you enter node 𝑏 the game ends and you win.

Additionally, you can teleport at most once at any point in time to any vertex except vertex 𝑏 . You can teleport from any vertex, even from 𝑎 .

Answer with "YES" if you can reach vertex 𝑏 from 𝑎 , and "NO" otherwise.

Note that 𝖷𝖮𝖱 represents the bitwise XOR operation.

## Input 

The first line contains a single integer 𝑡 (1≤𝑡≤1000 ) — the number of test cases.

The first line of each test case contains three integers 𝑛 , 𝑎 , and 𝑏 (2≤𝑛≤105 ), (1≤𝑎,𝑏≤𝑛;𝑎≠𝑏 ) — the number of vertices, and the starting and desired ending node respectively.

Each of the next 𝑛−1 lines denotes an edge of the tree. Edge 𝑖 is denoted by three integers 𝑢𝑖 , 𝑣𝑖 and 𝑤𝑖  — the labels of vertices it connects (1≤𝑢𝑖,𝑣𝑖≤𝑛;𝑢𝑖≠𝑣𝑖;1≤𝑤𝑖≤109 ) and the weight of the respective edge.

It is guaranteed that the sum of 𝑛 over all test cases does not exceed 105 .

## Output 

For each test case output "YES" if you can reach vertex 𝑏 , and "NO" otherwise.

## 题目大意

给你一棵树，边与边之间有权值，从a出发，每次经过一条边，就对边的权值进行一次异或操作，问最后到达b的时候，这条路异或的结果能否是0。

在走的过程中，可以进行一次传送，可以到达任意一点，但不可以是b点。

## 思路

可以从a点开始，对走过的路径进行异或操作，开一个数组w1，存从a异或到这个点的值，

第二次从b点开始，进行异或操作，也存下来，可以存在哈希表中。

然后可以去判断b走过的值能不能和a相等，如果相等，说明肯定可以找到一条合法路径，a->i,i->j,j->b

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;
typedef pair<int, int> PII;
const int N = 1e5 + 10;
vector<PII> v[N];
int n, a, b;
bool st[N];
set<int> s;
int w1[N];
int w2[N];

//从a开始遍历
void bfs() {
    memset(w1, 0, sizeof w1);
    memset(st, 0, sizeof st);
    queue<int> q;
    q.push(a);
    w1[a] = 0;
    while (q.size()) {
        auto t = q.front();
        q.pop();
        if (st[t])continue;
        st[t] = true;
        for (auto x: v[t]) {
            int j = x.first;
            int w = x.second;
            if (!st[j]) {
                if (j != b) {
                    w1[j] = w1[t] ^ w;
                    q.push(j);
                }
            }
        }
    }
}

void bfs2() {
    queue<int> q;
    q.push(b);
    memset(st, 0, sizeof st);
    memset(w2, 0, sizeof w2);
    w2[b] = 0;
    while (q.size()) {
        auto t = q.front();
        q.pop();
        if (st[t]) continue;
        st[t] = true;
        for (auto x: v[t]) {
            int j = x.first;
            int w = x.second;
            if (!st[j]) {
                w2[j] = w ^ w2[t];
                s.insert(w2[j]);
                q.push(j);
            }
        }
    }
}

void solve() {
    s.clear();
    cin >> n >> a >> b;
    for (int i = 1; i <= n; i++) {
        v[i].clear();
    }
    for (int i = 1; i <= n - 1; i++) {
        int x, y, w;
        cin >> x >> y >> w;
        v[x].push_back({y, w});
        v[y].push_back({x, w});
    }
    bfs();
    bfs2();
    for (int i = 1; i <= n; i++) {
        if (s.count(w1[i])) {
            cout<<"YES"<<endl;
            return;
        }
    }
    cout<<"NO"<<endl;
}

int main() {
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

