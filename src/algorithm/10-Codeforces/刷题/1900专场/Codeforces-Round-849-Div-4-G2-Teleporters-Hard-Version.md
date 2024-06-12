---
title: Codeforces Round 849 (Div. 4) G2. Teleporters (Hard Version)
date: 2023-04-05 15:32:55
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 前缀和
- 二分
- 贡献
- 贪心
- 1900
---

## G2. Teleporters (Hard Version)

Consider the points 0,1,…,𝑛+1 on the number line. There is a teleporter located on each of the points 1,2,…,𝑛 . At point 𝑖 , you can do the following:

Move left one unit: it costs 1 coin. Move right one unit: it costs 1 coin. Use a teleporter at point 𝑖 , if it exists: it costs 𝑎𝑖 coins. As a result, you can choose whether to teleport to point 0 or point 𝑛+1 . Once you use a teleporter, you can't use it again. You have 𝑐 coins, and you start at point 0 . What's the most number of teleporters you can use?

## Input 

The input consists of multiple test cases. The first line contains an integer 𝑡 (1≤𝑡≤1000 ) — the number of test cases. The descriptions of the test cases follow.

The first line of each test case contains two integers 𝑛 and 𝑐 ($1≤𝑛≤2⋅10^5 ; 1≤𝑐≤10^9$ )  — the length of the array and the number of coins you have respectively.

The following line contains 𝑛 space-separated positive integers 𝑎1,𝑎2,…,𝑎𝑛 ($1≤𝑎_𝑖≤10^9$ ) — the costs to use the teleporters.

It is guaranteed that the sum of 𝑛 over all test cases does not exceed $2⋅10^5$ .

## Output 

For each test case, output the maximum number of teleporters you can use.



## 题目大意

给你n个传送门，每个传送门的费用为$a_i$,在你使用过传送门之后，你可以传送到0或者$n+1$的位置，每次可以向左或者向右移动一格，这个操作的花费是1，现在给你c个花费，问最多可以使用几次传送门。

## 思路

先不考虑初始位置是0，假设我们现在就在0或者n+1的位置，那么对于第i个传送器，显然它的代价最小值为$min(i,n-i+1)+a[i]$,因此在选择传送器的时候，我们可以利用贪心的思想，优先去选择代价最小的，因此需要按照代价从小到大进行排序。我们要找总代价小于等于c的最大个数，因此还可以利用前缀和来优化代码，因为前缀和数组是单调递增的，所以可以去利用二分找到$<=c$的最大位置。

因为我们的代价数组里面有n-i+1,这种情况是需要先进行一次传送才可以有的，因此我们可以先去枚举第一次使用哪个传送器，然后看用完这个传送器剩下的价值里面还可以去使用多少个传送器。

时间复杂度为$O(nlogn)$

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;
typedef pair<int, int> PII;

void solve() {
    int n, c;
    cin >> n >> c;
    vector<PII> a(n + 1);
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        a[i].first = x + min(i, n  +1 - i);
        a[i].second = x + i;//作为起点的费用
    }
    std::sort(a.begin() + 1, a.end());
    vector<int> s(n + 1);
    for (int i = 1; i <= n; i++) {
        s[i] = s[i - 1] + a[i].first;
    }

    int res =0;
    for (int i = 1; i <= n; i++) {//将第i个传送门作为起点
        if (a[i].second > c) continue;
        int l = 0, r = n;
        while (l < r) {
            int mid = l + r + 1 >> 1;
            int cost = s[mid] + a[i].second;
            //看是否包含了i，如果包含了需要去掉
            if (i <= mid) cost -= a[i].first;
            if (cost<=c) l=mid;
            else r=mid-1;
        }
        if (i>l) l++;//加上起点选的
        res= max(res,l);
    }
    cout<<res<<endl;
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

