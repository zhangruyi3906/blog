---
title: Codeforces Round 665 (Div. 2) C. Mere Array
date: 2023-03-31 20:40:21
category:
    - Algorithm
    - Codeforces 
tag:
  - - Algorithm
    - Codeforces
    - codeforces
    - math
    - forces
    - 1300
---

# C. Mere Array

You are given an array 𝑎1,𝑎2,…,𝑎𝑛 where all 𝑎𝑖 are integers and greater than 0 .

In one operation, you can choose two different indices 𝑖 and 𝑗 (1≤𝑖,𝑗≤𝑛 ). If 𝑔𝑐𝑑(𝑎𝑖,𝑎𝑗) is equal to the minimum element of the whole array 𝑎 , you can swap 𝑎𝑖 and 𝑎𝑗 . 𝑔𝑐𝑑(𝑥,𝑦) denotes the greatest common divisor (GCD) of integers 𝑥 and 𝑦 .

Now you'd like to make 𝑎 non-decreasing using the operation any number of times (possibly zero). Determine if you can do this.

An array 𝑎 is non-decreasing if and only if 𝑎1≤𝑎2≤…≤𝑎𝑛 .

## Input

The first line contains one integer $𝑡 (1≤𝑡≤10^4 )$ — the number of test cases.

The first line of each test case contains one integer $𝑛 (1≤𝑛≤10^5 )$ — the length of array 𝑎 .

The second line of each test case contains 𝑛 positive integers 𝑎1,𝑎2,…𝑎𝑛 $(1≤𝑎𝑖≤10^9)$ — the array itself.

It is guaranteed that the sum of 𝑛 over all test cases doesn't exceed $10^5$ .

## Output 

For each test case, output "YES" if it is possible to make the array 𝑎 non-decreasing using the described operation, or "NO" if it is impossible to do so.



## 题目大意

给你一个长度为n的数组，只有两个数的最小公倍数是这个数组的最小值时，这两个数的位置可以互换，问能不能将数组变成不下降的数组。

## 思路

因为两个数的最小公倍数时这个数组的最小值，因此这两个数必然都是这个最小值的倍数，所以我们只需要去找到数组中是这个最小值的倍数的数即可，这些数字的顺序可以随便交换，我们可以将原数组先拷贝一份，然后对任意一份进行排序，再比较两个数组中的元素，如果出现不是这个数的倍数并且两个数组中这个位置的数不相同时，说明因子不是最小值的那个数发生了交换，此时输出NO，全部遍历完没有找到这样的数说明全部符合题目，此时输出YES。



### 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

#define endl '\n'
#define debug(x) cout<<"a["<<x<<"]="<<a[x]<<endl;
#define pr(x) cout<<x<<endl;
#define ct(x) cout<<x<<" ";
#define IOS ios::sync_with_stdio(false), cin.tie(0), cout.tie(0)
typedef long long ll;
typedef pair<int, int> PII;
const int INF = 0x3f3f3f3f;
const int N = 1e5 + 10;


void solve() {
    int n;
    cin >> n;
    vector<int> a(n + 1);
    int minn = INT_MAX;
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        minn = min(minn, a[i]);
    }
    vector<bool> st(n + 1);
    for (int i = 1; i <= n; i++) {
        if (a[i] % minn == 0) {
            st[i] = true;
        }
    }
    vector<int> b(n + 1);
    for (int i = 1; i <= n; i++)b[i] = a[i];
    std::sort(a.begin() + 1, a.end());
    for (int i = 1; i <= n; i++) {
        if (!st[i]&&a[i]!=b[i]){
            cout<<"NO"<<endl;
            return;
        }
    }
    cout << "YES" << endl;

}


int main() {
//IOS;
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif

    int t;
    cin >> t;
    while (t--) solve();

    return 0;
}

```

