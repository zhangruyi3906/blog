---
title: Codeforces Round 644 (Div. 3) D. Buying Shovels
date: 2023-03-31 16:10:21
category: 
    - Algorithm
    - Codeforces
tag:
    - Algorithm
    - Codeforces
    - math
    - forces
    - 1300
---



# D. Buying Shovels

[点击这里去看原题](https://codeforces.com/contest/1360/problem/D)

Polycarp wants to buy **exactly** 𝑛nn shovels. The shop sells packages with shovels. The store has 𝑘kk types of packages: the package of the 𝑖ii\-th type consists of exactly 𝑖 shovels (1≤𝑖≤𝑘). The store has an infinite number of packages of each type.

Polycarp wants to choose one type of packages and then buy several (one or more) packages of this type. What is the smallest number of packages Polycarp will have to buy to get exactly 𝑛nn shovels?

For example, if 𝑛\=8n\=8n=8 and 𝑘\=7k\=7k=7, then Polycarp will buy 222 packages of 444 shovels.

Help Polycarp find the minimum number of packages that he needs to buy, given that he:

- will buy exactly 𝑛 shovels in total;
- the sizes of all packages he will buy are all the same and the number of shovels in each package is an integer from 1 to 𝑘, inclusive.

## Input

The first line contains an integer 𝑡 (1≤𝑡≤100) — the number of test cases in the input. Then, 𝑡tt test cases follow, one per line.

Each test case consists of two positive integers $𝑛 (1≤𝑛≤10^9)$ and $𝑘 (1≤𝑘≤10^9)$ — the number of shovels and the number of types of packages.

## Output

Print 𝑡 answers to the test cases. Each answer is a positive integer — the minimum number of packages.



## 题目大意

给你一个n和k，范围是$10^9$,每包的数量可以为1-k，现在要求最小几包，恰好可以得到n，即$n=a*b$, b为一包的数量，a为几包 其中b<=k。



## 思路

因为$n=a*b$,因此a，b都是n的因子，因此本题要求的是在另一个因子不超过k的情况下，这个因子的最小值，只需要枚举到$\sqrt{n}$ 就可以了



## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n, k;
    cin >> n >> k;
    int res = INT_MAX;
    for (int a = 1; a * a <= n; a++) {
        if (n % a == 0) {
            if (a <= k) {
                res = min(res, n / a);
            }
            if (n / a <= k) {
                res = min(res, a);
            }
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

