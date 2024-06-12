---
title: Codeforces Round 273 (Div. 2) B. Random Teams
date: 2023-03-31 08:47:48
category: 
    - Algorithm
    - Codeforces
tag:
    - Algorithm
    - Codeforces
    - math
    - greedy
    - combinatorics
    - 1300
---

# B Random Teams

## problem

_n_ participants of the competition were split into _m_ teams in some manner so that each team has at least one participant. After the competition each pair of participants from the same team became friends.

Your task is to write a program that will find the minimum and the maximum number of pairs of friends that could have formed by the end of the competition.

## Input

The only line of input contains two integers _n_ and _m_, separated by a single space (1 ≤ _m_ ≤ _n_ ≤ 10<sup class="upper-index">9</sup>) — the number of participants and the number of teams respectively.

## Output

The only line of the output should contain two integers _k_<sub class="lower-index"><i>min</i></sub> and _k_<sub class="lower-index"><i>max</i></sub> — the minimum possible number of pairs of friends and the maximum possible number of pairs of friends respectively.



## 题目大意

给你一个n，m， 将n分成m组，组内的两个人会成为好朋友，求会得到的好朋友个数的最大值和最小值



## 思路

显然，将一个人放到人多的组里对答案的贡献会比将这个人放到人数少的里面要好，比如现在有两组，一组里面10个人，另一组一个人，显然放到10个人的这组里对答案的贡献会+10。因此:

+ 最优的答案是`m-1` 组里面只放一个人，1组里面放`n-m+1` 个人 ，此时的答案为：`(n - (m - 1)) * (n - (m - 1) - 1) / 2` 
+ 最差的答案为先将每组平均分配，多出来的人，再去平均分配到每组中去。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;


signed main() {
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif
    int n, m;
    cin >> n >> m;
    int maxn = (n - (m - 1)) * (n - (m - 1) - 1) / 2;
    int t = n / m;
    int yu = n % m;
    int minn = t * (t - 1) / 2 * (m - yu);
    minn += (t + 1) * t / 2 * yu;
    cout << minn << " " << maxn << endl;
    return 0;
}
```

