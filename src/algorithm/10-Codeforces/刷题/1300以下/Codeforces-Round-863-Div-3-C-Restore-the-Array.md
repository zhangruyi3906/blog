---
title: Codeforces Round 863 (Div. 3) C. Restore the Array
date: 2023-04-07 18:50:07
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 思维
- 构造
- 1100
---

# C. Restore the Array

Kristina had an array 𝑎 of length 𝑛 consisting of non-negative integers.

She built a new array 𝑏 of length 𝑛−1 , such that 𝑏𝑖=max(𝑎𝑖,𝑎𝑖+1) (1≤𝑖≤𝑛−1 ).

For example, suppose Kristina had an array 𝑎 = [3,0,4,0,5 ] of length 5 . Then she did the following:

Calculated 𝑏1=max(𝑎1,𝑎2)=max(3,0)=3 ; Calculated 𝑏2=max(𝑎2,𝑎3)=max(0,4)=4 ; Calculated 𝑏3=max(𝑎3,𝑎4)=max(4,0)=4 ; Calculated 𝑏4=max(𝑎4,𝑎5)=max(0,5)=5 . As a result, she got an array 𝑏 = [3,4,4,5 ] of length 4 . You only know the array 𝑏 . Find any matching array 𝑎 that Kristina may have originally had.

## Input 

The first line of input data contains a single integer 𝑡 (1≤𝑡≤104 ) — the number of test cases.

The description of the test cases follows.

The first line of each test case contains one integer 𝑛 (2≤𝑛≤2⋅105 ) — the number of elements in the array 𝑎 that Kristina originally had.

The second line of each test case contains exactly 𝑛−1 non-negative integer — elements of array 𝑏 (0≤𝑏𝑖≤109 ).

It is guaranteed that the sum of 𝑛 over all test cases does not exceed 2⋅105 , and that array 𝑏 was built correctly from some array 𝑎 .

## Output 

For each test case on a separate line, print exactly 𝑛 non-negative integers — the elements of the array 𝑎 that Kristina originally had.

If there are several possible answers — output any of them.



## 题目大意

给你一个长度为$n-1$的数组b，$b_i=max(a_i,a_{i+1})$,需要你构造出长度为n的a数组。



## 思路

因为$b_1=max(a_1,a_2)$,所以$b_1>=a_2$,

因为$b_2=max(a_2,a_3)$,所以$b_2>=a_2$

根据上面两个性质，我们可以发现对于$a_i$来说，满足$a_i<=b_i 并且 a_i<=b_{i-1}$,因此可以取$a_i=min(b_i,b_{i-1})$

边界为1和n,可以直接赋$b_1,b_{n-1}$

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<int> a(n + 1), b(n);
    for (int i = 1; i < n; i++) cin >> b[i];
    for (int i = 2; i <= n - 1; i++) {
        a[i] = min(b[i], b[i - 1]);
    }
    a[1] = b[1], a[n] = b[n - 1];
    for (int i = 1; i <= n; i++){
        cout<<a[i]<<" \n"[i==n];
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

