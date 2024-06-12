---
title: Codeforces Round 784 (Div. 4) E. 2-Letter Strings
date: 2023-04-13 21:32:00
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- string
- 1200
---

# E. 2-Letter Strings

![image-20230413213354949](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230413213354949.png)

![image-20230413213414281](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/image-20230413213414281.png)

## 题目大意

给你n个长度为2的字符串，如果对于两个字符串i<j 并且两个字符串只有一个相同的字母，那么他们构成一组，问一共有多少组。

## 思路

用数组`a`记录字符串的第一个字母出现了多少次，`b`记录第二个，`c`用来记录这个字符串在此之前一共出现了多少次。对于每个字符串，他对答案的贡献应该为它的第一个字母在`a`中出现的次数+第二个字母在`b`中出现的次数-2*整个字符串在之前出现的次数

> 为什么是两倍？
>
> 假设这个字符串在此之前出现了k次，那么当算第一个字母的时候，会加上k，算上第二个字母的时候会加上k，因此，我们需要减去2*k

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;
const int N = 30;

void solve() {
    int n;
    cin >> n;
    vector<int> a(N);
    vector<int> b(N);
    map<string, int> c;
    int res = 0;
    for (int i = 1; i <= n; i++) {
        string s;
        cin >> s;
        int x = s[0] - 'a';
        int y = s[1] - 'a';
        res += (a[x] + b[y] - c[s]*2);
        a[x]++,b[y]++,c[s]++;
    }
    cout<<res<<endl;
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

