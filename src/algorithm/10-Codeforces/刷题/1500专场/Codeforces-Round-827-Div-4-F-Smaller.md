---
title: Codeforces Round 827 (Div. 4) F. Smaller
date: 2023-04-06 20:39:36
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 字典序
- 字符串
- 贪心
- 1500
---

# F. Smaller

Alperen has two strings, 𝑠 and 𝑡 which are both initially equal to "a".

He will perform 𝑞 operations of two types on the given strings:

1𝑘𝑥 — Append the string 𝑥 exactly 𝑘 times at the end of string 𝑠 . In other words, 𝑠:=𝑠+𝑥+⋯+𝑥𝑘 times . 2𝑘𝑥 — Append the string 𝑥 exactly 𝑘 times at the end of string 𝑡 . In other words, 𝑡:=𝑡+𝑥+⋯+𝑥𝑘 times . After each operation, determine if it is possible to rearrange the characters of 𝑠 and 𝑡 such that 𝑠 is lexicographically smaller† than 𝑡 .

Note that the strings change after performing each operation and don't go back to their initial states.

† Simply speaking, the lexicographical order is the order in which words are listed in a dictionary. 

A formal definition is as follows: string 𝑝 is lexicographically smaller than string 𝑞 if there exists a position 𝑖 such that 𝑝𝑖<𝑞𝑖 , and for all 𝑗<𝑖 , 𝑝𝑗=𝑞𝑗 . If no such 𝑖 exists, then 𝑝 is lexicographically smaller than 𝑞 if the length of 𝑝 is less than the length of 𝑞 . For example, 𝚊𝚋𝚍𝚌<𝚊𝚋𝚎 and 𝚊𝚋𝚌<𝚊𝚋𝚌𝚍 , where we write 𝑝<𝑞 if 𝑝 is lexicographically smaller than 𝑞 .

## Input

The first line of the input contains an integer 𝑡 (1≤𝑡≤104 ) — the number of test cases.

The first line of each test case contains an integer 𝑞 (1≤𝑞≤105) — the number of operations Alperen will perform.

Then 𝑞 lines follow, each containing two positive integers 𝑑 and 𝑘 (1≤𝑑≤2 ; 1≤𝑘≤105 ) and a non-empty string 𝑥 consisting of lowercase English letters — the type of the operation, the number of times we will append string 𝑥 and the string we need to append respectively.

It is guaranteed that the sum of 𝑞 over all test cases doesn't exceed 105 and that the sum of lengths of all strings 𝑥 in the input doesn't exceed 5⋅105 .

## Output 

For each operation, output "YES", if it is possible to arrange the elements in both strings in such a way that 𝑠 is lexicographically smaller than 𝑡 and "NO" otherwise.



## 题目大意

现在有两个字符串s和t，初始的时候他们都是a,即s="a",t="a"

每组测试有q个操作，对于每个操作，收入d,k,x;

+ d=1,s加上k个x
+ d=2,t加上k个x

问能否重新排列s和t，使得s的字典序小于t。



## 思路

因为一开始都是a，所以一旦b中出现了一个大于a，那么肯定可以把这个大于a的放在第一位，此时t的字典序一定会小于s。如果b中没有出现过一个大于a的字符，那么说明b一定全是"a",此时如果s的长度>=t的长度,那么 s的字典序一定会大于t，因为b全是“a”,一定已经是最小的了，如果s的长度<t的长度，那么就去看s中有没有出现过大于"a"的字符，如果有的话，那么s的字典序也一定是大于b的，否则s的字典序就小于t

## 代码

```cpp
#include <bits/stdc++.h>
#define int long long
using namespace std;

void solve() {
    int q;
    cin >> q;
    bool flag1 = false, flag2 = false;
    int len1 = 1, len2 = 1;
    while (q--) {
        int d, k;
        string x;
        cin >> d >> k >> x;
        if (d == 1) {
            len1 += k * x.size();
            if (!flag1) {
                for (auto item: x) {
                    if (item > 'a')flag1 = true;
                }
            }
        } else {
            len2 += k * x.size();
            if (!flag2) {
                for (auto item: x) {
                    if (item > 'a') flag2 = true;
                }
            }
        }
        if (flag2) {
            cout << "YES" << endl;
        } else {
            if (len1>=len2){
                cout<<"NO"<<endl;
            }else{
                if (flag1){
                    cout<<"NO"<<endl;
                }else{
                    cout<<"YES"<<endl;
                }
            }
        }
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

