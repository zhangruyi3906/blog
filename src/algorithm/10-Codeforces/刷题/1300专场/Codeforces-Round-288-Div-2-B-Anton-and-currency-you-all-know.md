---
title: Codeforces Round 288 (Div. 2) B. Anton and currency you all know
date: 2023-04-02 13:04:25
category: 
    - Algorithm
    - Codeforces
tag:
    - Algorithm
    - Codeforces
    - greedy
    - 1300
---

# [B. Anton and currency you all know](https://codeforces.com/contest/508/problem/B)

Berland, 2016. The exchange rate of currency you all know against the burle has increased so much that to simplify the calculations, its fractional part was neglected and the exchange rate is now assumed to be an integer.

Reliable sources have informed the financier Anton of some information about the exchange rate of currency you all know against the burle for tomorrow. Now Anton knows that tomorrow the exchange rate will be an even number, which can be obtained from the present rate by swapping exactly two distinct digits in it. Of all the possible values that meet these conditions, the exchange rate for tomorrow will be the maximum possible. It is guaranteed that today the exchange rate is an odd positive integer n. Help Anton to determine the exchange rate of currency you all know for tomorrow!

## Input 

The first line contains an odd positive integer n — the exchange rate of currency you all know for today. The length of number n's representation is within range from 2 to 105, inclusive. The representation of n doesn't contain any leading zeroes.

## Output 

If the information about tomorrow's exchange rate is inconsistent, that is, there is no integer that meets the condition, print  - 1.

Otherwise, print the exchange rate of currency you all know against the burle for tomorrow. This should be the maximum possible number of those that are even and that are obtained from today's exchange rate by swapping exactly two digits. Exchange rate representation should not contain leading zeroes.

## 题目大意

给你一个奇数n，范围为$10^5$,要你找能不能交换两个数字，把这个数字变成可以交换得到的最大偶数是多少。

## 思路

显然，如果这个奇数里面没有偶数的话，那么是没有结果的，如果有偶数的话，我们可以利用贪心的思想，我们需要找到一个偶数和最后一个数字进行交换。

+ 如果我们能从前往后找到第一个比他小的偶数，那么显然交换这两个

+ 如果找不到，说明所有偶数都比它要大，那么此时交换从后往前找到的第一个偶数和它进行交换

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif
    string s;
    cin >> s;
    vector<int> a;
    bool flag = false;
    for (char i : s) {
        int x = i - '0';
        if (x % 2 == 0) flag = true;
        a.push_back(x);
    }
    if (!flag) {
        cout << -1 << endl;
    } else {
        int n = s.size();
        flag = false;
        for (int i = 0; i < n; i++) {
            if (a[i] % 2 == 0 && a[i] < a[n - 1]) {
                swap(a[i], a[n - 1]);
                flag = true;
                break;
            }
        }
        if (!flag) {
            for (int i = n - 2; i >= 0; i--) {
                if (a[i] % 2 == 0) {
                    swap(a[i], a[n - 1]);
                    break;
                }
            }
        }
        for (int i = 0; i < n; i++) {
            cout << a[i];
        }
    }

    return 0;
}
```

