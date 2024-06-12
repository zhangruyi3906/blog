---
title: Codeforces Round 261 (Div. 2) B. Pashmak and Flowers
date: 2023-03-31 08:16:43
category:
   - Algorithm
   - Codeforces
tag:
   - Algorithm
   - Codeforces
   - sort
   - 1300
swiper_index: 1
---

# Codeforces Round 261 (Div. 2) B. Pashmak and Flowers

## 题目

1. Pashmak decided to give Parmida a pair of flowers from the garden. There are _n_ flowers in the garden and the _i_\-th of them has a beauty number _b_<sub class="lower-index"><i>i</i></sub>. Parmida is a very strange girl so she doesn't want to have the two most beautiful flowers necessarily. She wants to have those pairs of flowers that their beauty difference is maximal possible!

   Your task is to write a program which calculates two things:

   1. The maximum beauty difference of flowers that Pashmak can give to Parmida.
   2. The number of ways that Pashmak can pick the flowers. Two ways are considered different if and only if there is at least one flower that is chosen in the first way and not chosen in the second way.

## Input

   The first line of the input contains _n_ (2 ≤ _n_ ≤ 2·10<sup class="upper-index">5</sup>). In the next line there are _n_ space-separated integers _b_<sub class="lower-index">1</sub>, _b_<sub class="lower-index">2</sub>, ..., _b_<sub class="lower-index"><i>n</i></sub> (1 ≤ _b_<sub class="lower-index"><i>i</i></sub> ≤ 10<sup class="upper-index">9</sup>).

## Output

   The only line of output should contain two integers. The maximum beauty difference and the number of ways this may happen, respectively.

## 题目大意
给你一个序列，求最大值和最小值的差值，以及求出能够得到这个差值的方案数

## 思路
将原序列排序，最大值即为最后一个数减去第一个数  
因为这个最大值只可能是最大值-最小值组成的，所以我们需要去统计最大值的个数和最小值的个数，根据乘法原理，最后的答案就是最大值的个数乘以最小值的个数
同时需要注意元素全相同的情况，比如1 1 1，如果按照上面的计算会出现9，但是实际上只有3种情况，也就是答案不会超过n(n-1)/2

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
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    std::sort(a.begin(), a.end());
    int maxn = a.back() - a.front();
    int cnt1 = 0, cnt2 = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] == a.front()) cnt1++;
        else break;
    }
    for (int i = n - 1; i >= 0; i--) {
        if (a[i] == a.back()) cnt2++;
        else break;
    }
    int cnt = min(cnt1 * cnt2, n * (n - 1) / 2);
    cout << maxn << ' ' << cnt << endl;

    return 0;
}
```
