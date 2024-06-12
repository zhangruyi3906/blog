---
title: Codeforces Round 648 (Div. 2) B. Trouble Sort
date: 2023-04-01 11:53:01
category: 
    - Algorithm
    - Codeforces
tag:
    - Algorithm
    - Codeforces
    - 思维
    - 1300
---

# B. Trouble Sort

[题目链接在这里](https://codeforces.com/contest/1365/problem/B)

Ashish has 𝑛 elements arranged in a line.

These elements are represented by two integers 𝑎𝑖 — the value of the element and 𝑏𝑖 — the type of the element (there are only two possible types: 0 and 1 ). He wants to sort the elements in non-decreasing values of 𝑎𝑖 .

He can perform the following operation any number of times:

+ Select any two elements 𝑖 and 𝑗 such that 𝑏𝑖≠𝑏𝑗 and swap them. That is, he can only swap two elements of different types in one move. 

Tell him if he can sort the elements in non-decreasing values of 𝑎𝑖 after performing any number of operations.

## Input

The first line contains one integer 𝑡 (1≤𝑡≤100) — the number of test cases. The description of the test cases follows.

The first line of each test case contains one integer 𝑛 (1≤𝑛≤500) — the size of the arrays.

The second line contains 𝑛 integers 𝑎𝑖 ($1≤𝑎_𝑖≤10^5$)  — the value of the 𝑖 -th element.

The third line containts 𝑛 integers 𝑏𝑖 (𝑏𝑖∈{0,1})  — the type of the 𝑖 -th element.

## Output

For each test case, print "Yes" or "No" (without quotes) depending on whether it is possible to sort elements in non-decreasing order of their value.

You may print each letter in any case (upper or lower).



## 题目大意

给你二个长度为n的数组a，b，a是需要排序的数组，b里面只有1和0，只有数组b中的两个数不同的时候，数组a对应的位置元素才可以交换，问能不能变成升序。



## 思路

我们可以先考虑三个元素的情况，比如三个元素a,b,c,他们对应的0和1的情况为0 1 1,具体例子如下：

```
a b c  				b a c				b c a			a c b
					-> 					-> 				->
0 1 1					1 0 1				1 1 0			0 1 1
```

根据这个例子我们发现只要存在至少一个0和1，我们就可以任意的交换两个元素，因此只需要去统计0和1是否出现过一次就可以了。同时还需要注意即使没有出现过，数组本身就有序的情况。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<int> a(n), b(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 0; i < n; i++) cin >> b[i];
    int cnt0 = 0, cnt1 = 0;
    for (int i = 0; i < n; i++) {
        if (b[i] == 0) cnt0++;
        else cnt1++;
    }
    bool flag = false;
    for (int i = 0; i < n - 1; i++) {
        if (a[i] > a[i + 1]) {
            flag = true;
        }
    }
    if (flag) {
        if (cnt1==0||cnt0==0){
            cout<<"NO"<<endl;
            return;
        }
    }
    cout<<"YES"<<endl;

}

int main() {
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

