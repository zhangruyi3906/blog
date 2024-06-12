---
title: Codeforces Round 827 (Div. 4) G. Orray
date: 2023-04-06 21:48:25
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 字典序
- 排序
- 贪心
- 位运算
- 1500
---

# G. Orray

You are given an array 𝑎 consisting of 𝑛 nonnegative integers.

Let's define the prefix OR array 𝑏 as the array 𝑏𝑖=𝑎1 𝖮𝖱 𝑎2 𝖮𝖱 … 𝖮𝖱 𝑎𝑖 , where 𝖮𝖱 represents the bitwise OR operation. In other words, the array 𝑏 is formed by computing the 𝖮𝖱 of every prefix of 𝑎 .

You are asked to rearrange the elements of the array 𝑎 in such a way that its prefix OR array is lexicographically maximum.

An array 𝑥 is lexicographically greater than an array 𝑦 if in the first position where 𝑥 and 𝑦 differ, 𝑥𝑖>𝑦𝑖 .

## Input 

The first line of the input contains a single integer 𝑡 (1≤𝑡≤100 ) — the number of test cases. The description of test cases follows.

The first line of each test case contains a single integer 𝑛 (1≤𝑛≤2⋅105 ) — the length of the array 𝑎 .

The second line of each test case contains 𝑛 nonnegative integers 𝑎1,…,𝑎𝑛 (0≤𝑎𝑖≤109 ).

It is guaranteed that the sum of 𝑛 over all test cases does not exceed 2⋅105 .

## Output

 For each test case print 𝑛 integers — any rearrangement of the array 𝑎 that obtains the lexicographically maximum prefix OR array.

## 题目大意

给你一个长度为n的非负整数数组，问你能不能重新排序，使得前缀异或数组是字典序最大的。

## 思路

> 这题我看错题目了，一开始以为是异或操作，所以就想的复杂了。

因为两个数会进行或操作，在或运算中，有1得1，全0为0，所以两个数进行或运算只会变大，而不会变小。

假设当前的前缀或为res,因为要想让数变大，所以我们肯定会尽可能多选能让res变大的数，这个过程最多只会进行30次，因为$a_i$最大为$10^9$,因此我们最多会进行$min(n,30)$次排序，选出我们想要的数，剩下的任意输出就可以了。

## 代码

```shell
#include <bits/stdc++.h>

#define int long long
using namespace std;
int res = 0;

bool cmp(int a, int b) {
    return (res | a) > (res | b);
}

void solve() {
    res = 0;
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];

    int cnt = min((long long) 30, n);
    for (int i = 1; i <= cnt; i++) {
        sort(a.begin() + i, a.end(), cmp);
        res |= a[i];
    }
    for (int i = 1; i <= n; i++) {
        cout << a[i] << " \n"[i == n];
    }
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

