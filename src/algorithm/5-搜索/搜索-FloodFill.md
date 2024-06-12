---
title: 搜索-FloodFill
date: 2023-06-04 17:09:24
category: 
    - Algorithm
    - 搜索
    - DFS
tag:
  - Algorithm
  - 搜索
  - DFS
---

# 池塘计数

## 题目

链接：https://www.acwing.com/problem/content/1099/

农夫约翰有一片 $ N*M $ 的矩形土地。

最近，由于降雨的原因，部分土地被水淹没了。

现在用一个字符矩阵来表示他的土地。

每个单元格内，如果包含雨水，则用”W”表示，如果不含雨水，则用”.”表示。

现在，约翰想知道他的土地中形成了多少片池塘。

每组相连的积水单元格集合可以看作是一片池塘。

每个单元格视为与其上、下、左、右、左上、右上、左下、右下八个邻近单元格相连。

请你输出共有多少片池塘，即矩阵中共有多少片相连的”W”块。

#### 输入格式

第一行包含两个整数 $ N $ 和 $ M $。

接下来 $ N $ 行，每行包含 $ M $ 个字符，字符为”W”或”.”，用以表示矩形土地的积水状况，字符之间没有空格。

#### 输出格式

输出一个整数，表示池塘数目。

#### 数据范围

$ 1 \le N,M \le 1000 $

#### 输入样例：

```css
10 12
W........WW.
.WWW.....WWW
....WW...WW.
.........WW.
.........W..
..W......W..
.W.W.....WW.
W.W.W.....W.
.W.W......W.
..W.......W.
```

#### 输出样例：

```
3
```

## 思路-dfs

遍历每个点，如何这个点为'W'，那么就dfs进去将整个连通块的点都设置为'.'，答案+1，直到遍历完为止

### 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 1010;
char g[N][N];
bool st[N][N];
int n, m;


void dfs(int a, int b) {
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            int x = a + i, y = b + j;
            if (x < 1 || x > n || y < 1 || y > m) continue;
            if (g[x][y]=='W'){
                g[x][y]='.';
                dfs(x,y);
            }
        }
    }
}


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            cin >> g[i][j];
        }
    }
    int res = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (g[i][j] == 'W') {
                dfs(i, j);
                res++;
            }
        }
    }
    cout<<res<<endl;

    return 0;
}
```

## 思路-bfs

用队列存储点，每次访问过打上标记即可

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;
typedef pair<int, int> PII;
const int N = 1010;
char g[N][N];
bool st[N][N];
int n, m;

void bfs(int startx, int starty) {
    queue<PII> q;
    q.push({startx, starty});
    st[startx][starty] = true;
    while (q.size()) {
        auto t = q.front();
        q.pop();
        for (int i = -1; i <= 1; i++) {
            for (int j = -1; j <= 1; j++) {
                int x = t.first + i, y = t.second + j;
                if (x < 1 || x > n || y < 1 || y > m) continue;
                if (!st[x][y] && g[x][y] == 'W') {
                    q.push({x, y});
                    st[x][y] = true;
                }
            }
        }
    }
}

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            cin >> g[i][j];
        }
    }

    int res = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (g[i][j] == 'W' && !st[i][j]) {
                bfs(i, j);
                res++;
            }
        }
    }
    cout<<res<<endl;

    return 0;
}

```



