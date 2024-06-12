---
title: Codeforces Round 258 (Div. 2) B Sort the Array
date: 2023-03-31 07:17:42
category: 
    - Algorithm
    - Codeforces
tag:
  - Algorithm
  - Codeforces
  - sort
  - 1300
swiper_index: 1
---


# Codeforces Round 258 (Div. 2) B Sort the Array

## 题目大意
给你一个数组，问你是否能够翻转区间`[l,r]`使得数组变成升序的。

### 输入格式
第一行一个整数`n`，表示数组长度。  
第二行`n`个整数，表示数组。

### 输出格式
如果可以，输出`YES`，然后输出`l`和`r`。  
如果不可以，输出`NO`。

### 思路
可以开一个数组b，然后将a数组复制到b数组中，然后对b数组进行排序，再将两个数组相减，
用两个指针`l`和`r` 分别记录从左开始的第一个不为0的位置和从右开始的第一个不为0的位置，
如果`l`大于`r`，则说明数组已经是升序的，输出`NO`，否则去判断原数组的`l`和`r`是否是降序的，
如果是，则输出`YES`，并且输出`l`和`r`，否则输出`NO`。

### 代码
```cpp
#include <bits/stdc++.h>

using namespace std;


int main() {
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];

    vector<int> b(n + 1);
    for (int i = 1; i <= n; i++)b[i] = a[i];
    std::sort(b.begin() + 1, b.end());
    for (int i = 1; i <= n; i++) b[i] -= a[i];
    int l = 1, r = n;
    while (b[l] == 0) l++;
    if (l > n) {
        cout << "yes" << endl;
        cout<<"1 1\n";
    } else {
        while (b[r] == 0) r--;
        bool flag = true;
        for (int i = l; i < r; i++) {
            if (a[i]<a[i+1]) flag=false;
        }
        if (flag) {
            cout<<"yes"<<endl;
            cout<<l<<" "<<r<<endl;
        }
        else cout<<"no"<<endl;
    }
    return 0;
}
```
