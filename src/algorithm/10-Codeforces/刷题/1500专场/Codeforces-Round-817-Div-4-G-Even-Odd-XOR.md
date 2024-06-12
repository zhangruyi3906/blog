---
title: Codeforces Round 817 (Div. 4) G. Even-Odd XOR
date: 2023-04-15 10:06:41
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 位运算
- 1500
---

![image-20230415100846496](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230415100846496.png)

## 题目大意

要你构造一个长度为n的数组，元素不能重复，使得奇数位置异或的结果等于偶数位置异或的结果

## 思路

> 想了很久

因为奇数位置异或的结果等于偶数位置异或的结果，即 `odd=even`,则`odd^even=0`,则整个数组进行异或后的结果应该为0。

题目就变为了要我们构造一个数组，所有元素不重复并且异或的结果为0	

> 一种可能的思路是：先将前n-1个元素随便放，然后最后一位放前n-1个元素的异或和，这样就可以保证整个数组的异或结果为0，但是这样操作存在一个问题，就是不确定前n-1个元素的异或结果是否已经在数组中出现过了。

为了解决上述构造过程中存在的问题,可以将前n-3位就设置为i,然后考虑最后三个数，对于倒数的三个数来说，可以设置

+ $2^{29}$
+ $2^{30}$
+ sum^$2^{29}$^$2^{30}$

这样就可以保证前n-1位异或的结果不会在前n-1位中出现

> 如果只设一个$2^{30}$,可能还是会有重复，比如n=5,为：
>
> ```
> 1 2 3 1073741824 1073741824
> ```
>
> 因为前3位异或为0，所以会导致最后两位相同。



## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n;
    cin >> n;
    int sum = 0;
    for (int i = 1; i <= n - 3; i++) {
        cout << i << " ";
        sum ^= i;
    }
    int x = 1 << 29;
    int y = 1 << 30;
    sum = sum ^ x ^ y;
    cout << x << " " << y << " " << sum << endl;
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

