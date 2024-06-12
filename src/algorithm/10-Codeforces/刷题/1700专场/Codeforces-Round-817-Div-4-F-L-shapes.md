---
title: Codeforces Round 817 (Div. 4) F. L-shapes
date: 2023-04-15 14:37:32
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 暴力
- 1700
---



![image-20230415143801598](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230415143801598.png)

![image-20230415143843892](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230415143843892.png)

## 题目大意

在一个n*m的网格里面放L形，可以旋转，但是L之间不可以相连，点也不可以相交，问给定的图形是否合法。

## 思路

暴力：依次去遍历每个*，看这个 *所在的区域是否合法，如果不合法直接输出NO，否则就把这个区域的三个 *打上标记，防止重复访问。

> 我们只会访问到每种L形第一次出现的*,一共有下面四种情况
>
> ```cpp
> *   * ** **
> ** ** *   *
> ```

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;
const int N = 100;
char g[N][N];
bool st[N][N];
int n, m;


bool check(int x, int y) {
    if (x + 1 <= n && y + 1 <= m && g[x + 1][y + 1] == '*' && g[x + 1][y] == '*') {
        st[x][y] = st[x + 1][y + 1] = st[x + 1][y] = true;
        for (int i = x - 1; i <= x + 2; i++) {
            for (int j = y - 1; j <= y + 2; j++) {
                if (i < 1 || i > n || j < 1 || j > m) continue;
                if (i == x - 1 && j == y + 2) continue;
                if ((i == x && j == y) || (i == x + 1 && j == y) || (i == x + 1 && j == y + 1)) continue;
                if (g[i][j] != '.') return false;
            }
        }
    } else if (x + 1 <= n && y - 1 >= 1 && g[x + 1][y] == '*' && g[x + 1][y - 1] == '*') {
        st[x][y] = st[x + 1][y] = st[x + 1][y - 1] = true;
        for (int i = x - 1; i <= x + 2; i++) {
            for (int j = y - 2; j <= y + 1; j++) {
                if (i < 1 || i > n || j < 1 || j > m) continue;
                if (i == x - 1 && j == y - 2) continue;
                if ((i == x && j == y) || (i == x + 1 && j == y) || (i == x + 1 && j == y - 1)) continue;
                if (g[i][j] != '.') return false;
            }
        }
    } else if (x + 1 <= n && y + 1 <= m && g[x][y + 1] == '*' && g[x + 1][y] == '*') {
        st[x][y] = st[x][y + 1] = st[x + 1][y] = true;
        for (int i = x - 1; i <= x + 2; i++) {
            for (int j = y - 1; j <= y + 2; j++) {
                if (i < 1 || i > n || j < 1 || j > m) continue;
                if (i == x + 2 && j == y + 2) continue;
                if ((i == x && j == y) || (i == x && j == y + 1) || (i == x + 1 && j == y)) continue;
                if (g[i][j] != '.') return false;
            }
        }
    } else if (y + 1 <= m && x + 1 <= n && g[x][y + 1] == '*' && g[x + 1][y + 1] == '*') {
        st[x][y] = st[x][y + 1] = st[x + 1][y + 1] = true;
        for (int i = x - 1; i <= x + 2; i++) {
            for (int j = y - 1; j <= y + 2; j++) {
                if (i < 1 || i > n || j < 1 || j > m) continue;
                if (i == x + 2 && j == y - 1) continue;
                if ((i == x && j == y) || (i == x + 1 && j == y + 1) || (i == x && j == y + 1)) continue;
                if (g[i][j] != '.') return false;
            }
        }
    } else {
        return false;
    }
    return true;
}

void solve() {
    memset(st, 0, sizeof st);
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            cin >> g[i][j];
        }
    }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (g[i][j] == '*' && !st[i][j]) {
                if (!check(i, j)) {
//                    cout << i << " " << j << endl;
                    cout << "NO" << endl;
                    return;
                }
            }
        }
    }

    cout << "YES" << endl;


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
