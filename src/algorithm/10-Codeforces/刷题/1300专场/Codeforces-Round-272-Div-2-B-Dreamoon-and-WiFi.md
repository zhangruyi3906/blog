---
title: Codeforces Round 272 (Div. 2) B. Dreamoon and WiFi
date: 2023-04-01 09:20:04
category: 
    - Algorithm
    - Codeforces
tag:
    - Algorithm
    - Codeforces
    - dfs
    - 1300
---

# B. Dreamoon and WiFi

Dreamoon is standing at the position 0 on a number line. Drazil is sending a list of commands through Wi-Fi to Dreamoon's smartphone and Dreamoon follows them.

Each command is one of the following two types:

+ Go 1 unit towards the positive direction, denoted as '+' 

+ Go 1 unit towards the negative direction, denoted as '-' 

But the Wi-Fi condition is so poor that Dreamoon's smartphone reports some of the commands can't be recognized and Dreamoon knows that some of them might even be wrong though successfully recognized. Dreamoon decides to follow every recognized command and toss a fair coin to decide those unrecognized ones (that means, he moves to the 1 unit to the negative or positive direction with the same probability 0.5).

You are given an original list of commands sent by Drazil and list received by Dreamoon. What is the probability that Dreamoon ends in the position originally supposed to be final by Drazil's commands?

## Input

The first line contains a string s1 — the commands Drazil sends to Dreamoon, this string consists of only the characters in the set {'+', '-'}.

The second line contains a string s2 — the commands Dreamoon's smartphone recognizes, this string consists of only the characters in the set {'+', '-', '?'}. '?' denotes an unrecognized command.

Lengths of two strings are equal and do not exceed 10.

## Output

Output a single real number corresponding to the probability. The answer will be considered correct if its relative or absolute error doesn't exceed $10^{-9}$.



## 题目大意

给你两个字符串，s1,s2,第一个是正确的方向，第二个存在？不确定往正半轴走还是负半轴，两种概率都是0.5，要你求最终两个走到一起的概率是多少。

## 思路

因为字符串长度不会超过10，因此可以去暴力枚举所有方案，对于每一个？要么选+，要么选-，时间复杂度大概为$O(2^{10})$,搜索的时候记得要回溯，`s2[u]='?'`

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

int sum, cnt, cnt1;
int n;
string s1, s2;

void dfs(int u) {
    if (u == n) {
        int _ = 0;
        for (auto x: s2) {
            if (x == '+') _++;
            else _--;
        }
        if (_ == sum)cnt1++;
        cnt++;
        return;
    }
    if (s2[u] == '?') {
        s2[u]='+';
        dfs(u+1);
        s2[u]='-';
        dfs(u+1);
        s2[u]='?';
    }else{
        dfs(u+1);
    }
}

int main() {
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif
    cin >> s1 >> s2;
    n = s1.size();
    sum = 0;
    for (auto x: s1) {
        if (x == '+')sum++;
        else sum--;
    }
    dfs(0);
    printf("%.9f",1.0*cnt1/cnt);


    return 0;
}
```

