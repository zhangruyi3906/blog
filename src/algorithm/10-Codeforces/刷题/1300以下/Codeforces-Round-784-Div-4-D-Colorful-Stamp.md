---
title: Codeforces Round 784 (Div. 4) D. Colorful Stamp
date: 2023-04-10 13:39:46
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- string
- 1100
---

# [D. Colorful Stamp](https://codeforces.com/contest/1669/problem/D)

A row of 𝑛 cells is given, all initially white. Using a stamp, you can stamp any two neighboring cells such that one becomes red and the other becomes blue. A stamp can be rotated, i.e. it can be used in both ways: as 𝙱𝚁 and as 𝚁𝙱 .

During use, the stamp must completely fit on the given 𝑛 cells (it cannot be partially outside the cells). The stamp can be applied multiple times to the same cell. Each usage of the stamp recolors both cells that are under the stamp.

For example, one possible sequence of stamps to make the picture 𝙱𝚁𝙱𝙱𝚆 could be 𝚆𝚆𝚆𝚆𝚆→𝚆𝚆𝚁𝙱⎯⎯⎯⎯𝚆→𝙱𝚁⎯⎯⎯⎯𝚁𝙱𝚆→𝙱𝚁𝙱⎯⎯⎯⎯𝙱𝚆 . Here 𝚆 , 𝚁 , and 𝙱 represent a white, red, or blue cell, respectively, and the cells that the stamp is used on are marked with an underline.

Given a final picture, is it possible to make it using the stamp zero or more times?

## Input

 The first line contains an integer 𝑡 (1≤𝑡≤104 ) — the number of test cases.

The first line of each test case contains an integer 𝑛 (1≤𝑛≤105 ) — the length of the picture.

The second line of each test case contains a string 𝑠 — the picture you need to make. It is guaranteed that the length of 𝑠 is 𝑛 and that 𝑠 only consists of the characters 𝚆 , 𝚁 , and 𝙱 , representing a white, red, or blue cell, respectively.

It is guaranteed that the sum of 𝑛 over all test cases does not exceed 105 .

## Output 

Output 𝑡 lines, each of which contains the answer to the corresponding test case. As an answer, output "YES" if it possible to make the picture using the stamp zero or more times, and "NO" otherwise.

You can output the answer in any case (for example, the strings "yEs", "yes", "Yes" and "YES" will be recognized as a positive answer).



## 题目大意

给你一个长度为n的字符串，初始全为"W"，每次可以将连续两个变为“RB”或者“BR”，可以重复涂，问你最后能不能得到这个字符串。

## 思路

我们可以将这个字符串按照“W”的出现位置进行分割，然后考虑分割后的每一块内容，每一块的内容必须同时包含B和R，因为最后一次涂一定会有这两个，出现的位置可以任意，只要包括了这两个，什么排列都可以涂出来。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n;
    cin >> n;
    string s;
    cin >> s;
    bool ok = true;

    int cntB = 0, cntR = 0;
    for (int i = 0; i < n; ++i) {
        if (s[i] == 'W') {
            if ((!cntB && cntR) || (!cntR && cntB)) {
                ok = false;
                break;
            }
            cntB = cntR = 0;
        }
        else if (s[i] == 'R') cntR++;
        else cntB++;
    }
    if ((!cntB && cntR) || (!cntR && cntB)) {
        ok = false;
    }
    cout << (ok ? "YES" : "NO") << endl;
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

