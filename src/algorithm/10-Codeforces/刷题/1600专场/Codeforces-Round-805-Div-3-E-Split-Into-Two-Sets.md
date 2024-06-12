---
title: Codeforces Round 805 (Div. 3) E. Split Into Two Sets
date: 2023-04-25 18:14:41
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 并查集
- 1600
---

# E. Split Into Two Sets

![image-20230425181512182](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304251815245.png)

![image-20230425181530768](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304251815796.png)

## 题目大意

给你n组数，每组里面有两个数字，问你能不能把这n组数分为两组，使得两组里面没有重复的数字

## 思路

种类并查集：

普通的并查集维护一个关系，例如元素是否在同一个集合，这里需要用到种类并查集来维护多个关系。

> 举个例子：1和2是敌人，2和3是敌人，则1和3应该是朋友。

种类并查集需要扩展一倍数据规则，即把n变成2*n，

> 上面的例子就变成 1 2 3 4 5 6
>
> 1和2是敌人：连线1-5，2-4
>
> 2和3是敌人：连线2-6，3-5
>
> 1和3是朋友：连线1-3 4-6
>
> 进行判断1 和3 是否在同一集合，显然在同一集合，说明他们是朋友，而不在同一集合说明是敌人

在本题中，

+ 显然一个数字出现的次数不可以大于等于2次，因为这样必然会导致一个集合里面有两个一样的元素，
+ 同时，这两个元素还不可以相等，这是显然的。

所以还剩下一种情况就是每个数字出现的次数不超过两次，并且同一组里的数字不同，我们可以将同一组里的两个数字看成是敌人，

>例如1-2 ，2-1
>
>1和2是敌人，2和1 是敌人，显然没有冲突
>
>
>
>例如1-2，2-3，1-3
>
>1和2是敌人，2和3是敌人，1和3是敌人，显然冲突，出现错误。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 4e5 + 10;
int f[N];

int find(int x) {
    if (f[x] != x) f[x] = find(f[x]);
    return f[x];
}

void merge(int x, int y) {
    int xx = find(x);
    int yy = find(y);
    if (xx != yy) {
        f[xx] = yy;
    }
}

void solve() {
    int n;
    cin >> n;
    for(int i=1;i<=n*2;i++) f[i]=i;
    int t = n;
    bool flag = true;
    map<int, int> m;
    while (n--) {
        int a, b;
        cin >> a >> b;
        m[a]++, m[b]++;
        if (m[a] > 2 || m[b] > 2) flag = false;
        if (a == b) flag = false;
        int xx = t + a, yy = t + b;
        if (find(a) == find(b)) {
            flag = false;
        } else {
            merge(a,yy), merge(b,xx);
        }

    }
    cout<<(flag?"YES":"NO")<<endl;
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

