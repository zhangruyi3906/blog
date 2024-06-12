---
title: Codeforces Round 717 (Div. 2) B. AGAGA XOOORRR
date: 2023-04-04 21:17:17
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 位运算
- 贪心
- 1500
---

# B. AGAGA XOOORRR

Baby Ehab is known for his love for a certain operation. He has an array 𝑎 of length 𝑛 , and he decided to keep doing the following operation on it:

he picks 2 adjacent elements; he then removes them and places a single integer in their place: their bitwise XOR. Note that the length of the array decreases by one. Now he asks you if he can make all elements of the array equal. Since babies like to make your life harder, he requires that you leave at least 2 elements remaining.

## Input 

The first line contains an integer 𝑡 (1≤𝑡≤15 ) — the number of test cases you need to solve.

The first line of each test case contains an integers 𝑛 (2≤𝑛≤2000 ) — the number of elements in the array 𝑎 .

The second line contains 𝑛 space-separated integers 𝑎1 , 𝑎2 , … , 𝑎𝑛 ($0≤𝑎𝑖<2^{30}$ ) — the elements of the array 𝑎 .

## Output

If Baby Ehab can make all elements equal while leaving at least 2 elements standing, print "YES". Otherwise, print "NO".



## 题目大意

给你一个长度为n的数组，每次可以选择相邻的两个元素进行异或，并且把这两个元素替换为异或之后的结果，问最后能不能把这个数组变成元素都相同的数组。

## 思路

异或：对应二进制位，相同则为0，不同则为1

几个常用的性质：

+ 异或简单理解就是不进位加法：，例如1+1=0，0+0=1，1+0=1；
+ 自反性：a^a=0
+ 恒等式：0^a=0
+ 交换律：a^b=b^a
+ 结合律：(a^b)^c=a^(b^c)
+ 异或可逆性：a^b^b=a

在本题中，可以看出本题的一个性质是最后的数组大小不会超过三，因为如果超过三个相等的元素，那么他们之间一定可以通过运算减少元素的个数。本题暴力运算即可。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)cin >> a[i];

    int res=0;
    for(int i=1;i<=n;i++)res^=a[i];
    if (!res)cout<<"YES\n";
    else{
        int cur=0;
        int cnt=0;
        for(int i=1;i<=n;i++){
            cur^=a[i];
            if (cur==res){
                cnt++;
                cur=0;
            }
        }
        if (cnt>=2){
            cout<<"YES\n";
        }else cout<<"NO\n";
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

