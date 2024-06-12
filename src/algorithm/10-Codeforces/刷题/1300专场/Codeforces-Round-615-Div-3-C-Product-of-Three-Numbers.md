---
title: Codeforces Round 615 (Div. 3) C. Product of Three Numbers
date: 2023-03-31 12:49:53
category: 
    - Algorithm
    - Codeforces
tag:
    - Algorithm
    - Codeforces
    - math
    - greedy
    - forces
    - 1300
---

# C. Product of Three Numbers

You are given one integer number n.Find three **distinct integers** a,b,c such that 2 <=a,b,c and a b.c=n or say that it is impossible to do it.
If there are several answers,you can print any.You have to answer **t** independent test cases.

## Input

The first line of the input contains one integer t(1 <=t <= 100)-the number of test cases.
The next n lines describe test cases.The i-th test case is given on a new line as one integer $n(2<=n<=10^9)$ .

## Output

For each test case,print the answer on it.Print "NO"if it is impossible to represent n as a'b'c for some distinct integers a,b,c suchthat2≤a,b,c.
Otherwise,print "YES"and any possible such representation.



## 题目大意

求任意三个数a,b,c满足2<=a<b<c。



## 思路

因为a<b<c，数据范围最大为$10^9$ ,因此a不会超过$10^3$ ,所以我们可以去枚举a的范围，此时$bc=\frac{n}{a}$ ，那么$c=\frac{n}{ab}>b$ ,因此$b*b<\frac{n}{a}$ ,所以b只需要枚举到$\sqrt{\frac{n}{a}}$ 就行了，时间复杂度大概为$10^2*10^3*10^3$ 或者$10^2*4*10^4$ 



## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n;
    cin >> n;
    for (int a = 2; a <= 1000; a++) {
        for (int b = a + 1; b*b <n/a; b++) {
            if (a*b>n) break;
            int c = n / a / b;
            if (n%(a*b)==0&&c>b){
                cout<<"YES"<<endl;
                cout<<a<<" "<<b<<' '<<c<<endl;
                return;
            }
        }
    }
    cout<<"NO"<<endl;
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

