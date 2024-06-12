---
title: Educational Codeforces Round 147 (Rated for Div. 2)
date: 2023-04-21 15:47:29
category: 
    - Algorithm
    - Codeforces
tag:
  - Algorithm
  - Codeforces
  - div2
---

# Educational Codeforces Round 147 (Rated for Div. 2)

## A. Matching

![image-20230421154823928](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304251311264.png)

### 题目大意

给你一个字符串，里面包含数字和`?`,不可以有前导0，`?`可以替换任意数字，问你有多少种方式。

> 数字要严格大于0

### 思路

统计❓出现的次数，每出现一次就✖️10，如果是第一个字母为❓，那就✖️9。

### 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    string s;
    cin >> s;
    int cnt = 0;
    for (const auto &item: s) {
        if (item == '?') cnt++;
    }
    int res = 1;
    if (cnt == 0) res = 1;
    else if (s[0] == '?') {
        res *= 9;
        cnt--;
        for (int i = 0; i < cnt; i++) {
            res *= 10;
        }
    } else {
        for (int i = 0; i < cnt; i++) {
            res *= 10;
        }
    }
    if (s[0] == '0') res = 0;
    cout << res << endl;
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

## B. Sort the Subarray

![image-20230421155249785](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304251311288.png)

### 题目大意

给你两个数组，第一个是原数组,第二个是经过a数组排序后的数组，问你最长排序的区间是哪个。

### 思路

从左往右找到第一个两个数组中不同的元素位置，从右往左找到第一个两个数组中不同的元素位置，说明这一段之间一定是排序过的。

然后这个区间再分别向左和向右进行扩展，满足是升序的就加个加入到序列中。

### 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<int> a(n + 1), b(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) cin >> b[i];
    int l = 1, r = n;
    for (int i = 1; i <= n; i++) {
        if (a[i] != b[i]) {
            l = i;
            break;
        }
    }
    for (int i = n; i >= 1; i--) {
        if (a[i] != b[i]) {
            r = i;
            break;
        }
    }
    while (l > 1 && b[l] >= b[l - 1]) l--;
    while (r < n && b[r] <= b[r + 1]) r++;
    cout << l << " " << r << endl;
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



## C. Tear It Apart

![image-20230421162918880](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202304251311718.png)

### 题目大意

给你一个字符串，每次可以删除若干个字符，但是这些删除的字符不可以是连在一起的，至少要间隔一个，问你最少删除多少次，可以使得整个数组中的字符都是相同的

### 思路

将每个字符出现的左边记录在一个哈希表中，first为字母，second为一个vector，记录的是这个字母出现的坐标

然后去枚举每个出现的字母，我们去算假如数组最后只剩它的话，那么需要操作的次数。

很显然，如果数组只剩它，那么这种情况下需要操作的次数应该为两个这个字母中间夹着多少个其他字母，即这两个坐标之间的差值-1，设这个值为len。

我们找到最大的len，然后把最大的len都删除，那么其他长度小于len的也可以被删除了。

要把一个长度为len的字符串删除：

+ 如果len为偶数，那么最优的操作是删除1 3 5这样...显然每次可以删除len/2个，剩下len/2个
+ 如果len为奇数,那么最优的操作是删除1 3 5,显然可以删除len/2+1个，剩下le n/2个

所以每次删除剩下的元素个数为len/2，用一个while循环算要删多少次就可以了。

### 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

void solve() {
    string s;
    cin >> s;
    int n = s.size();
    s = " " + s;
    map<char, vector<int>> m;
    for (int i = 1; i <= n; i++) {
        m[s[i]].push_back(i);
    }
    int res = INT_MAX;
    for (const auto &item: m) {
        int pre = 0;
        int len = 0;
        auto [c, v] = item;
        v.push_back(n + 1);
        for (const auto &item1: v) {
            len = max(len, item1 - pre - 1);
            pre = item1;
        }
        int cnt = 0;
        while (len > 0) {
            len /= 2;
            cnt++;
        }
        res = min(res, cnt);
    }
    cout << res << endl;
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

