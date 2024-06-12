---
title: Codeforces Round 169 (Div. 2) B. Little Girl and Game
date: 2023-04-01 15:01:11
category: 
    - Algorithm
    - Codeforces
tag:
    - Algorithm
    - Codeforces
    - 博弈论
    - 1300
---

## B. Little Girl and Game

The Little Girl loves problems on games very much. Here's one of them.

Two players have got a string s, consisting of lowercase English letters. They play a game that is described by the following rules:

The players move in turns; In one move the player can remove an arbitrary letter from string s. If the player before his turn can reorder the letters in string s so as to get a palindrome, this player wins. A palindrome is a string that reads the same both ways (from left to right, and vice versa). For example, string "abba" is a palindrome and string "abc" isn't. Determine which player will win, provided that both sides play optimally well — the one who moves first or the one who moves second.

## Input 

The input contains a single line, containing string $s (1 ≤ |s|  ≤  10^3)$ . String s consists of lowercase English letters.

## Output 

In a single line print word "First" if the first player wins (provided that both players play optimally well). Otherwise, print word "Second". Print the words without the quotes.



## 题目大意

给你一个字符串，每回合可以进行一次操作：

+ 删掉任意一个字符
+ 如果可以重组变成回文串，那么就赢了

问第一个人赢还是第二个人

## 思路

很显然，答案和奇数字符出现的次数和偶数出现的次数有关，对于初始状态来说，偶数字符出现的次数不会影响到最后的答案，如果字符次数为奇数的个数大于1：

+ 字符次数为奇数的个数为奇数时，那么是必胜的，因为可以先把字符出现次数为偶数的都去掉，也可以把字符次数为奇数的个数的字符都去掉到只剩下一个，这样整个字符串变成了全是不同字符的字符串，同时字符串长度为奇数，那么每次没人拿一个，最后肯定只剩下一个给第一个人，此时这个为回文串，同时还需要注意一开始字符次数全为偶数的情况，也是第一个人获胜

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;


int main() {
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif
    string s;
    cin >> s;
    map<char, int> m;
    for (auto x: s) {
        m[x]++;
    }
    int cnt = 0;
    for (auto x: m) {
        if (x.second & 1)cnt++;
    }
    if (cnt==0 || cnt&1){
        cout<<"First"<<endl;
    }else{
        cout<<"Second"<<endl;
    }
    return 0;
}
```

