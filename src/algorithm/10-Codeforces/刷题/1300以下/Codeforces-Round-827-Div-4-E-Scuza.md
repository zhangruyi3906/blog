---
title: Codeforces Round 827 (Div. 4) E. Scuza
date: 2023-04-05 16:35:32
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 前缀和
- 二分
- 1200
---

# [E. Scuza](https://codeforces.com/contest/1742/problem/E)

Timur has a stairway with 𝑛 steps. The 𝑖 -th step is 𝑎𝑖 meters higher than its predecessor. The first step is 𝑎1 meters higher than the ground, and the ground starts at 0 meters.

![](https://espresso.codeforces.com/94f41815770eb18ce02522a8057553508b54069f.png)

The stairs for the first test case. Timur has 𝑞 questions, each denoted by an integer 𝑘1,…,𝑘𝑞 . For each question 𝑘𝑖 , you have to print the maximum possible height Timur can achieve by climbing the steps if his legs are of length 𝑘𝑖 . Timur can only climb the 𝑗 -th step if his legs are of length at least 𝑎𝑗 . In other words, 𝑘𝑖≥𝑎𝑗 for each step 𝑗 climbed.

Note that you should answer each question independently.

## Input

The first line contains a single integer 𝑡 (1≤𝑡≤100 ) — the number of test cases.

The first line of each test case contains two integers 𝑛,𝑞 (1≤𝑛,𝑞≤2⋅105 ) — the number of steps and the number of questions, respectively.

The second line of each test case contains 𝑛 integers (1≤𝑎𝑖≤109 ) — the height of the steps.

The third line of each test case contains 𝑞 integers (0≤𝑘𝑖≤109 ) — the numbers for each question.

It is guaranteed that the sum of 𝑛 does not exceed 2⋅105 , and the sum of 𝑞 does not exceed 2⋅105 .

## Output

 For each test case, output a single line containing 𝑞 integers, the answer for each question.

Please note, that the answer for some questions won't fit into 32-bit integer type, so you should use at least 64-bit integer type in your programming language (like long long for C++).



## 题目大意

现在给你n个楼梯，每个楼梯比前一个高$a_i$,现在有$q$个询问，每个询问给你一个腿长$k_i$,问在这种情况下，你最多可以跨几个台阶。

## 思路

很显然题目就是要去找小于等于$k_i$的最大位置，当然这个位置之前的所有数都满足小于等于$k_i$,找到之后对这些数字进行求和。

因此我们可以先开一个数组b,$b_i$表示前i个数的最大值，显然b数组是单调递增的，因此我们就可以用到二分去找满足小于等于$k_i$的最大位置。然后再对这个位置之前的数字进行求和，因此可以用到前缀和。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n, q;
    cin >> n >> q;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    vector<int> s(n + 1);
    for (int i = 1; i <= n; i++) s[i] = s[i - 1] + a[i];
    vector<int> b(n + 1);
    for (int i = 1; i <= n; i++) {
        b[i] = max(a[i], b[i - 1]);
    }

    while (q--){
        int x;
        cin>>x;
        //找到b中小于等于x的最大数
        int l=0,r=n;
        while (l<r){
            int mid=l+r+1>>1;
            if (b[mid]<=x) l=mid;
            else r=mid-1;
        }
        cout<<s[l]<<" ";
    }
    cout<<endl;

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

