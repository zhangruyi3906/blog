---
title: Codeforces Round 863 (Div. 3) E. Living Sequence
date: 2023-04-24 18:41:35
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 进制转换
- 1500
---

# E. Living Sequence

![image-20230424184208240](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304241842357.png)

## 题目大意

所有的整数，去掉出现4的数，问你第k个数是多少？

## 思路

把所有有4出现的数字都去掉了，显然每一位上面只会有9个数字出现。

> 原来十进制每位上可以为：0 1 2 3 4 5 6 7 8 9,共10个，
>
> 现在去掉一个4，就相当于变成了9个，即9进制。

相当于做了如下映射：

```
0 1 2 3 4 5 6 7 8 9
0 1 2 4 5 6 7 8 9
```

我们可以先将原来要求的数变成一个9进制数，但是结果里不应该含有4，所以需要再将大于等于4的部分变成对应的映射，即加1。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n;
    cin >> n;
    string s;
    while (n) {
        int x = n % 9;
        s += '0' + x;
        n /= 9;
    }
    std::reverse(s.begin(), s.end());
    for (char &item: s) {
        if (item >= '4') item++;
    }
    cout << s << endl;
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

