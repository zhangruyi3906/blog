---
title: Codeforces Round 799 (Div. 4)
date: 2023-04-07 19:43:45
category: 
  - Algorithm
  - Codeforces
tag:
  - Algorithm
  - Codeforces
  - 1700
  - 动态规划
  - 贪心
  - 排序
---

# G. 2^Sort

Given an array 𝑎 of length 𝑛 and an integer 𝑘 , find the number of indices 1≤𝑖≤𝑛−𝑘 such that the subarray [𝑎𝑖,…,𝑎𝑖+𝑘] with length 𝑘+1 (not with length 𝑘 ) has the following property:

If you multiply the first element by 20 , the second element by 21 , ..., and the (𝑘+1 )-st element by 2𝑘 , then this subarray is sorted in strictly increasing order. More formally, count the number of indices 1≤𝑖≤𝑛−𝑘 such that 20⋅𝑎𝑖<21⋅𝑎𝑖+1<22⋅𝑎𝑖+2<⋯<2𝑘⋅𝑎𝑖+𝑘.

##  Input

 The first line contains an integer 𝑡 (1≤𝑡≤1000 ) — the number of test cases.

The first line of each test case contains two integers 𝑛 , 𝑘 (3≤𝑛≤2⋅105 , 1≤𝑘<𝑛 ) — the length of the array and the number of inequalities.

The second line of each test case contains 𝑛 integers 𝑎1,𝑎2,…,𝑎𝑛 (1≤𝑎𝑖≤109 ) — the elements of the array.

The sum of 𝑛 across all test cases does not exceed 2⋅105 .

## Output

 For each test case, output a single integer — the number of indices satisfying the condition in the statement.



## 题目大意

给你一个长度为n的数组和一个整数k,如果满足连续的k个数：$2^0*a_i<2^1*a_{i+1}...<a^k*a_{i+k}$,问这些的连续序列有多少个。

## 思路

动态规划：

+ 状态表示：`f[i]`表示以`a[i]`结尾的连续两倍上升序列的最大长度。
+ 状态计算：
  + 初始`f[i]=1`
  + 如果`f[i]*2>f[i-1]` 则`f[i]=f[i-1]+1`

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
    }
    vector<int> f(n + 1, 1);
    for (int i = 2; i <= n; i++) {
        if (2 * a[i] > a[i - 1]) {
            f[i] = f[i - 1] + 1;
        }
    }

    int res = 0;
    for (int i = k + 1; i <= n; i++) {
        if (f[i] >= (k + 1)) {
            res++;
        }
    }
    cout << res << endl;
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

# [H. Gambling](https://codeforces.com/contest/1692/problem/H)

![image-20230410192059433](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230410192059433.png)

## 题目大意

给你一个长度为n的数组，需要你找一个连续的子序列，这个子序列中比如4 3 4,要求这段里面出现次数最多的数字减去其他数字的个数，这个值最大是多少，区间的左右断点是多少。

## 思路

把当前数字对答案的权重看成1，其他数字看成0，就是求子序列和的最大值。

可以参考[最大连续子序列](https://www.acwing.com/problem/content/description/3655/)



## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n;
    cin >> n;
    map<int, vector<int>> m;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        m[a[i]].push_back(i);
    }
    int val = a[1], L = 1, R = 1;
    int res = 1;
    for (const auto &[value, v]: m) {
        int cnt = 1;//当前这个数字value有多少个
        int l = v[0];
        for (int i = 1; i < v.size(); i++) {
            int num = v[i] - v[i - 1] - 1;//除了当前数其他的数有多少个
            cnt = cnt - num + 1; //+1是加的当前第i个
            if (cnt < 1) {
                cnt = 1;
                l = v[i];
            }
            if (cnt > res) {
                res = cnt;
                L = l, R = v[i];
                val = value;
            }
        }
    }
    cout << val << " " << L  << " " << R  << endl;
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



