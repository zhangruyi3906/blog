---
title: Codeforces Round 655 (Div. 2) B. Omkar and Last Class of Math
date: 2023-04-01 12:47:07
category: 
    - Algorithm
    - Codeforces
tag:
    - Algorithm
    - Codeforces
    - 打表
    - 质数
    - math
    - 1300
---

# B. Omkar and Last Class of Math

In Omkar's last class of math, he learned about the least common multiple, or 𝐿𝐶𝑀 . 𝐿𝐶𝑀(𝑎,𝑏) is the smallest positive integer 𝑥 which is divisible by both 𝑎 and 𝑏 .

Omkar, having a laudably curious mind, immediately thought of a problem involving the 𝐿𝐶𝑀 operation: given an integer 𝑛 , find positive integers 𝑎 and 𝑏 such that 𝑎+𝑏=𝑛 and 𝐿𝐶𝑀(𝑎,𝑏) is the minimum value possible.

Can you help Omkar solve his ludicrously challenging math problem?

## Input 

Each test contains multiple test cases. The first line contains the number of test cases 𝑡 (1≤𝑡≤10 ). Description of the test cases follows.

Each test case consists of a single integer 𝑛 ($2≤𝑛≤10^9$ ).

## Output

For each test case, output two positive integers 𝑎 and 𝑏 , such that 𝑎+𝑏=𝑛 and 𝐿𝐶𝑀(𝑎,𝑏) is the minimum possible.



## 题目大意

给你一个n，范围为$10^9$,要你去找两个数a,b满足a+b=n,并且a和b的最大公倍数最小。



## 思路

显然当n为偶数的时候，两个数的最大公倍数的最小值一定是n/2,因为当一个数小于n/2，另一个数大于n-2的时候，最大公倍数是一定会大于n/2的。

当n为奇数的时候，看不出啥规律，只能打表，打表函数为代码中的f函数，我们发现：

+ n为质数的时候，a,b一定为1,n-1。

+ 当n不是质数的时候，b一定是a的倍数，此时可以假设b>a,并且b=ka(k>=2,因为等于1说明n是偶数),则n=a+b=a+ka=(k+1)a,所以$a=\frac{n}{k+1}$,当k增加的时候，a会减小，因为在这种情况下的$lcm(a,b)=b,b=n-a$,所以我们要保证a尽可能大，b才会变小，所以只需要找到第一个能被n整除的数就是答案了

总体的时间复杂度为$O(10*\sqrt{10^9})=3*10^5$



## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

bool is_prime(int x) {
    for (int i = 2; i * i <= x; i++) {
        if (x % i == 0) return false;
    }
    return true;
}

//这个是打表函数
void f() {
    for (int i = 3; i <= 10000; i += 2) {
        if (is_prime(i))continue;
        int res = INT_MAX;
        int x, y;
        for (int j = 1; j < i; j++) {
            int t = lcm(j, i - j);
            if (t < res) {
                res = t;
                x = j, y = i - j;
            }
        }
        cout << i << " " << x << " " << y << endl;
    }
}

void solve() {
    int n;
    cin >> n;
    if (n % 2 == 0) {
        cout << n / 2 << ' ' << n / 2 << endl;
    } else {
        if (is_prime(n)) {
            cout << 1 << " " << n - 1 << endl;
        } else {
            for (int k = 2;; k++) {
                if (n % (k + 1) == 0) {
                    int x=n/(k+1);
                    int y=x*k;
                    cout<<x<<' '<<y<<endl;
                    return;
                }
            }
        }
    }
}

int main() {
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif
//    f();
    int _;
    cin >> _;
    while (_--) solve();

    return 0;
}
```

