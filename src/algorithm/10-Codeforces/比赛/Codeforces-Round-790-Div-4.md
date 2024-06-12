---
title: Codeforces Round 790 (Div. 4)
date: 2023-04-03 21:43:49
category: 
    - Algorithm
    - Codeforces
tag:
  - Algorithm
  - Codeforces
---

## [H2. Maximum Crossings (Hard Version)](https://codeforces.com/contest/1676/problem/H2)

The only difference between the two versions is that in this version 𝑛≤2⋅105 and the sum of 𝑛 over all test cases does not exceed 2⋅105 .

A terminal is a row of 𝑛 equal segments numbered 1 to 𝑛 in order. There are two terminals, one above the other.

You are given an array 𝑎 of length 𝑛 . For all 𝑖=1,2,…,𝑛 , there should be a straight wire from some point on segment 𝑖 of the top terminal to some point on segment 𝑎𝑖 of the bottom terminal. You can't select the endpoints of a segment. For example, the following pictures show two possible wirings if 𝑛=7 and 𝑎=[4,1,4,6,7,7,5] .

![](https://espresso.codeforces.com/660719c81039b1ce9c48c6c80d2c922157422c16.png)

A crossing occurs when two wires share a point in common. In the picture above, crossings are circled in red.

What is the maximum number of crossings there can be if you place the wires optimally?

## Input 

The first line contains an integer 𝑡 (1≤𝑡≤1000 ) — the number of test cases.

The first line of each test case contains an integer 𝑛 ($1≤𝑛≤2⋅10^5$ ) — the length of the array.

The second line of each test case contains 𝑛 integers 𝑎1,𝑎2,…,𝑎𝑛 (1≤𝑎𝑖≤𝑛 ) — the elements of the array.

The sum of 𝑛 across all test cases does not exceed 2⋅105 .

## Output

For each test case, output a single integer — the maximum number of crossings there can be if you place the wires optimally.



## 思路

仔细研究发现其实就是求逆序对，只不过是求$a_i>=a_j(i<j)$，套逆序对的模版即可，求逆序对应该还可以用树状数组的。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;
typedef pair<int, int> PII;
const int INF = 0x3f3f3f3f;
const int N = 2e5 + 10;

int n;
int a[N], temp[N];

LL merge_sort(int a[], int l, int r) {
    if (l >= r) return 0;
    int mid = l + r >> 1;
    LL res = merge_sort(a, l, mid) +
             merge_sort(a, mid + 1, r);
    int k = 0, i = l, j = mid + 1;
    while (i <= mid && j <= r) {
        if (a[i] < a[j]) temp[k++] = a[i++];
        else {
            res += mid - i + 1;
            temp[k++] = a[j++];
        }
    }
    while (i <= mid) temp[k++] = a[i++];
    while (j <= r) temp[k++] = a[j++];
    for (int i = l, j = 0; i <= r; i++, j++) {
        a[i] = temp[j];
    }
    return res;

}


void solve() {
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> a[i];
    cout<<merge_sort(a,1,n)<<endl;
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

