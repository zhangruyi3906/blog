---
title: Codeforces Round 895 (Div. 3)
date: 2023-09-09 11:44:40
category: 
  - Algorithm
  - Codeforces
tag:
  - Algorithm
  - Codeforces
  - div3
---

# A. Two Vessels

## 题目翻译

你有两个装有水的容器。第一个容器含有$a$克水，第二个容器含有$b$克水。这两艘船都非常大，可以容纳任意数量的水。

您还有一个空杯子，最多可容纳$c$克水。

一次，您可以从任何容器中舀出**多**$c$克水，然后将其倒入**另一个**容器中。请注意，一次倒入的水的质量**不必是整数**。

使容器中水的质量相等所需的最少移动次数是多少？请注意，您无法执行除所描述的移动之外的任何操作。

## 思路

每次可以使得两个杯子的差距最多减少2*c,因此答案就是$\frac{abs(a-b)}{2c}$,向上取整

> 因为c++的/默认是下取整
>
> $\frac{a}{b}$向上取整可以写成：$\frac{a+b-1}{b}$
>
> 或者使用ceil取整
>
> 或者使用 a/b+a%b!=0

## 代码

```cpp
/**
 * PROBLEM_NAME:A. Two Vessels
 * ONLINE_JUDGE_NAME:Codeforces
 * Date:2023/9/7
 * Author:houyunfei
**/
#include <bits/stdc++.h>

#define int long long
#define yes cout << "YES" << endl;
#define no cout << "NO" << endl;
#define IOS cin.tie(0), cout.tie(0), ios::sync_with_stdio(false);
#define cxk 1
#define debug(s, x) if (cxk) cout << "#debug:(" << s << ")=" << x << endl;
using namespace std;

void solve() {
    int a, b, c;
    cin >> a >> b >> c;
    int res = (abs(a - b) + 2 * c - 1) / (2 * c);
    cout << res << endl;
}

signed main() {
    IOS
    int _ = 1;
    cin >> _;
    while (_--) solve();
    return 0;
}

```

# B. The Corridor or There and Back Again

## 题目翻译

你正处在一条向右无限延伸的走廊里，分成了几个方形的房间。您从房间$1$开始，前往房间$k$，然后返回房间$1$。您可以选择$k$的值。移动到相邻的房间需要$1$秒。

另外，走廊里还有$n$个陷阱：第$i$个陷阱位于$d_i$房间，将在你进入房间**$\boldsymbol{d_i}$后$s_i$秒被激活。一旦陷阱被激活，你就无法进入或离开有该陷阱的房间。

![](https://espresso.codeforces.com/b5c043dc906fc8419a9336f15dbb9f7f1f1b611f.png) 







可能的走廊以及通往房间$k$和返回的路径的示意图。

确定$k$的最大值，允许您从$1$房间移动到$k$房间，然后安全返回$1$房间。

例如，如果$n=1$和$d_1=2, s_1=2$，你可以前往$k=2$房间并安全返回（陷阱在$1+s_1=1+2=3$时刻激活，不能阻止你返回）。但如果你试图到达房间$k=3$，陷阱就会在$1+s_1=1+2=3$时刻激活，阻止你返回（你会在第二个$3$返回的路上尝试进入$2$房间，但激活的陷阱会阻止你）。 $k$任何更大的值也是不可行的。故答案为$k=2$。

## 思路

因为数据范围比较小，可以直接暴力枚举时间1-300,看是否合法，取合法的最大时间

## 代码

```cpp
/**
 * PROBLEM_NAME:B. The Corridor or There and Back Again
 * ONLINE_JUDGE_NAME:Codeforces
 * Date:2023/9/7
 * Author:houyunfei
**/
#include <bits/stdc++.h>

#define int long long
#define yes cout << "YES" << endl;
#define no cout << "NO" << endl;
#define IOS cin.tie(0), cout.tie(0), ios::sync_with_stdio(false);
#define cxk 1
#define debug(s, x) if (cxk) cout << "#debug:(" << s << ")=" << x << endl;
using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<pair<int, int>> a(n + 1);
    for (int i = 1, x, y; i <= n; i++) {
        cin >> x >> y;
        a[i] = {x, y};
    }
    int mx = 0;
    for (int i = 1; i <= 300; i++) {
        bool ok = 1;
        for (int j = 1; j <= n; j++) {
            if ((i - a[j].first) * 2 >= a[j].second) {
                ok = 0;
                break;
            }
        }
        if (ok) {
            mx = max(mx, i);
        }
    }
    cout << mx << endl;
}

signed main() {
    IOS
    int _ = 1;
    cin >> _;
    while (_--) solve();
    return 0;
}

```

# C. Non-coprime Split

## 题目翻译

给你两个整数$l \le r$。你需要找到**正**整数$a$和$b$，使得同时满足以下条件：

- $l \le a + b \le r$
- $\gcd(a, b) \neq 1$

或报告它们不存在。

$\gcd(a, b)$表示数字$a$和$b$的【最大公约数】(https://en.wikipedia.org/wiki/Greatest_common_divisor)。例如$\gcd(6, 9) = 3$、$\gcd(8, 9) = 1$、$\gcd(4, 2) = 2$。 

## 思路

如果l=r,那么就看l是不是素数，如果是素数就无解，否则可以找到一个因子x,另一个数为l-x,而$\frac{l-x}{x}=\frac{l}{x}-1$,因此$gcd(x,l-x)!=1$

如果l!=r：

+ r为奇数，此时r-1>=l ,并且r-1一定为偶数，因此可以构造 (2,r-1-2), 他们的gcd=2;
+ r为偶数，可以直接构造(2,r-2),gcd=2;

此外，还需要特判一些误解的情况。

## 代码

```cpp
/**
 * PROBLEM_NAME:C. Non-coprime Split
 * ONLINE_JUDGE_NAME:Codeforces
 * Date:2023/9/7
 * Author:houyunfei
**/
#include <bits/stdc++.h>

#define int long long
#define yes cout << "YES" << endl;
#define no cout << "NO" << endl;
#define IOS cin.tie(0), cout.tie(0), ios::sync_with_stdio(false);
#define cxk 1
#define debug(s, x) if (cxk) cout << "#debug:(" << s << ")=" << x << endl;
using namespace std;
//13 14 15 16 17
int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}

void solve() {
    int l, r;
    cin >> l >> r;
    if (l == 1 && r <= 3) {
        cout << -1 << endl;
        return;
    }
    if (l == 2 && r <= 3) {
        cout << -1 << endl;
        return;
    }
    if (l != r) {
        if (r & 1) {
            cout << 2 << " " << r - 1 - 2 << endl;
        } else {
            cout << 2 << " " << r - 2 << endl;
        }
    } else {
        for (int i = 2; i * i <= l; i++) {
            if (l % i == 0) {
                cout << i << " " << l - i << endl;
                return;
            }
        }
        cout << -1 << endl;
    }
}

signed main() {
    IOS
    int _ = 1;
    cin >> _;
    while (_--) solve();
    return 0;
}

```

# D. Plus Minus Permutation

## 题目翻译

给你$3$个整数——$n$、$x$、$y$。我们将排列的分数$^\dagger$ $p_1, \ldots, p_n$称为以下值：

$
(p_{1 \cdot x} + p_{2 \cdot x} + \ldots + p_{\lfloor \frac{n}{x} \rfloor \cdot x}) - (p_{1 \cdot y} + p_{2 \cdot y} + \ldots + p_{\lfloor \frac{n}{y} \rfloor \cdot y})
$

换句话说，排列的得分是所有指数$i$能被$x$整除的$p_i$之和，减去所有指数$i$能被$y$整除的$p_i$之和。

你需要在长度$n$的所有排列中找到最大可能的分数。

例如，如果$n = 7$、$x = 2$、$y = 3$，则通过排列$[2,\color{red}{\underline{\color{black}{6}}},\color{blue}{\underline{\color{black}{1}}},\color{red}{\underline{\color{black}{7}}},5,\color{blue}{\underline{\color{red}{\underline{\color{black}{4}}}}},3]$获得最高分数，并且等于$(6 + 7 + 4) - (1 + 4) = 17 - 5 = 12$。

$^\dagger$长度$n$的排列是由$n$个从$1$到$n$的不同整数以任意顺序组成的数组。例如，$[2,3,1,5,4]$是排列，但$[1,2,2]$不是排列（数字$2$在数组中出现两次），$[1,3,4]$也不是排列（$n=3$，但数组包含$4$） 】）。

## 思路

看n里面有几个x的倍数，有几个y的倍数，有几个lcm(x,y)的倍数，

答案应该是x倍数上面的数-y倍数上面的数，lcm(x,y)上面的数不记录答案，因为是一个减去一个加回来

设$x1=n/x,y1=n/y,t=n/(lcm(x,y))$

我们应该贪心的把x倍数上面的数从大到小放，把y倍数上面的数从小到大放。

n范围比较大，可以使用等差数列求和公式计算。

$S_n=\frac{n*(a_1+a_n)}{2}$

## 代码

```cpp
/**
 * PROBLEM_NAME:D. Plus Minus Permutation
 * ONLINE_JUDGE_NAME:Codeforces
 * Date:2023/9/7
 * Author:houyunfei
**/
#include <bits/stdc++.h>

#define int long long
#define yes cout << "YES" << endl;
#define no cout << "NO" << endl;
#define IOS cin.tie(0), cout.tie(0), ios::sync_with_stdio(false);
#define cxk 1
#define debug(s, x) if (cxk) cout << "#debug:(" << s << ")=" << x << endl;
using namespace std;

int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}

int lcm(int a, int b) {
    return a * b / gcd(a, b);
}

void solve() {
    int n, x, y;
    cin >> n >> x >> y;
    int t = lcm(x, y);
    int x1 = n / x - n / t;
    int y1 = n / y - n / t;
    int res = 0;
    res += x1 * (n + n - x1 + 1) / 2;
    res -= y1 * (1 + y1) / 2;
    cout << res << endl;
}

signed main() {
    IOS
    int _ = 1;
    cin >> _;
    while (_--) solve();
    return 0;
}
```

# E. Data Structures Fan

## 题目翻译

给你一个整数数组$a_1, a_2, \ldots, a_n$，以及一个由$n$个字符组成的二进制字符串$^{\dagger}$ $s$。

Augustin 是数据结构的忠实粉丝。因此，他要求你实现一个可以回答$q$查询的数据结构。有两种类型的查询：

- “1$l$ $r$”（$1\le l \le r \le n$）— 将$l \le i \le r$中的每个字符$s_i$替换为其相反字符。即，将$\texttt{0}$全部替换为$\texttt{1}$，将$\texttt{1}$全部替换为$\texttt{0}$。
- "2 $g$" ($g \in \{0, 1\}$) — 计算所有索引$i$的数字$a_i$的[按位异或](https://en.wikipedia.org/wiki/Bitwise_operation#XOR) 的值】 这样$s_i = g$。请注意，空数集的$\operatorname{XOR}$被认为等于$0$。

请帮助奥古斯丁回答所有问题！

例如，如果$n = 4$、$a = [1, 2, 3, 6]$、$s = \texttt{1001}$，请考虑以下一系列查询：

1.“2$0$”——我们对索引$i$感兴趣，其中$s_i = \tt{0}$，从$s = \tt{1001}$开始，这些是索引$2$和$3$，所以查询的答案将是$a_2 \oplus a_3 = 2 \oplus 3 = 1$。
2.“1$1$ $3$”——我们需要将字符$s_1, s_2, s_3$替换为其反义词，因此在查询$s = \tt{1001}$之前，在查询之后：$s = \tt{0111}$。
3.“2$1$”——我们对索引$i$感兴趣，其中$s_i = \tt{1}$，从$s = \tt{0111}$开始，这些是索引$2$，$3$和$4$，所以答案为查询结果为$a_2 \oplus a_3 \oplus a_4 = 2 \oplus 3 \oplus 6 = 7$。
4.“1$2$ $4$”—$s = \tt{0111}$ $\to$ $s = \tt{0000}$。
5. “2$1$”—$s = \tt{0000}$，没有带有$s_i = \tt{1}$的索引，因此由于空数集的$\operatorname{XOR}$被认为等于$0$，所以该查询的答案是$0$。

$^{\dagger}$二进制字符串是只包含字符$\texttt{0}$或$\texttt{1}$的字符串。

## 思路

异或的性质:

+ x^x=0

可以使用两个变量zero,one 来记录整个字符串中1上面权值异或的答案，0上面权值异或的答案。

+ 对于1操作：
  + 将整个字符串翻转，那么对于zero来说，他应该先去掉这个区间中0上权值的异或和(设为`x`)，再异或上这个区间中1上权值的异或和(设为`y`), 去掉x可以使用`zero^x`,因为`zero=x^t`(其中t为除去这个区间的其他0上权值异或和),这样`zero^x=t^x^x=t`,再异或上y可以使用`zero^y`,因此总的操作其实就是`zero^x^y=zero^sum`,其中`sum`为这个区间所有权值的异或和
+ 对于2操作，直接输出对应的1和0即可。

快速求区间的异或可以使用类似于前缀和思想。

## 代码

```cpp
/**
 * PROBLEM_NAME:E. Data Structures Fan
 * ONLINE_JUDGE_NAME:Codeforces
 * Date:2023/9/7
 * Author:houyunfei
**/
#include <bits/stdc++.h>

#define int long long
#define yes cout << "YES" << endl;
#define no cout << "NO" << endl;
#define IOS cin.tie(0), cout.tie(0), ios::sync_with_stdio(false);
#define cxk 1
#define debug(s, x) if (cxk) cout << "#debug:(" << s << ")=" << x << endl;
using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    string s;
    cin >> s;
    s = " " + s;
    cin >> q;
    vector<int> s1(n + 1);
    int x = 0, y = 0; //x-0 y-1
    for (int i = 1; i <= n; i++) {
        s1[i] = s1[i - 1] ^ a[i];
        if (s[i] == '1') {
            y ^= a[i];
        } else {
            x ^= a[i];
        }
    }
    while (q--) {
        int op, l, r;
        cin >> op;
        if (op == 2) {
            cin >> l;
            if (l == 0) {
                cout << x << " ";
            } else {
                cout << y << " ";
            }
        } else {
            cin >> l >> r;
            x ^= s1[r] ^ s1[l - 1];
            y ^= s1[r] ^ s1[l - 1];
        }
    }
    cout << endl;
}
    int q;

signed main() {
    IOS
    int _ = 1;
    cin >> _;
    while (_--) solve();
    return 0;
}

```

# F. Selling a Menagerie

## 题目翻译

您是一个动物园的主人，该动物园由$n$只动物组成，编号从$1$到$n$。然而，维护动物园的费用相当昂贵，所以你决定卖掉它！

众所周知，每种动物都害怕另一种动物。更准确地说，动物$i$害怕动物$a_i$（$a_i \neq i$）。另外，每只动物的成本是已知的，对于动物$i$来说，它等于$c_i$。

您将按固定顺序出售所有动物。正式来说，你需要选择一些排列$^\dagger$ $p_1, p_2, \ldots, p_n$，先卖动物$p_1$，然后卖动物$p_2$，依此类推，最后卖动物$p_n$。

当你出售动物$i$时，有两种可能的结果：

- 如果动物$a_i$在动物$i$之前**被出售，您将因出售动物$i$而收到$c_i$钱。
- 如果动物$a_i$在动物$i$之前**未**出售，您将因出售动物$i$而收到$2 \cdot c_i$钱。 （令人惊讶的是，目前害怕的动物更有价值）。

您的任务是选择出售动物的顺序，以使总利润最大化。

例如，如果$a = [3, 4, 4, 1, 3]$、$c = [3, 4, 5, 6, 7]$，并且您选择的排列是$[4, 2, 5, 1, 3]$，则：

- 第一个被出售的动物是动物$4$。动物$a_4 = 1$之前没有被出售过，所以你会因为出售它而收到$2 \cdot c_4 = 12$钱。
- 第二个出售的动物是动物$2$。动物$a_2 = 4$之前已被出售，因此您可以通过出售它获得$c_2 = 4$的钱。
- 第三个出售的动物是动物$5$。动物$a_5 = 3$之前没有出售过，所以出售它你会收到$2 \cdot c_5 = 14$钱。
- 第四个出售的动物是动物$1$。动物$a_1 = 3$之前没有出售过，所以出售它你会收到$2 \cdot c_1 = 6$钱。
- 第五个出售的动物是动物$3$。动物$a_3 = 4$之前已被出售，因此您可以通过出售它获得$c_3 = 5$的钱。

通过这种排列选择，您的总利润是$12 + 4 + 14 + 6 + 5 = 41$。请注意，在本例中，$41$**不是**最大可能利润。

$^\dagger$长度$n$的排列是由$n$个从$1$到$n$的不同整数以任意顺序组成的数组。例如，$[2,3,1,5,4]$是一个排列，但$[1,2,2]$不是一个排列（$2$在数组中出现了两次），$[1,3,4]$也不是一个排列（$n=3$，但$4$出现在数组中）大批）。

## 思路

根据输入数据，可以从`i`向`a[i]`连一条单向边，`w[i]`为点权，此时可以发现先拿i就可以获得两倍的贡献。因此可以记录每个点的入度，然后按照拓扑排序的方式，先拿入度为0的点，这些点拿了贡献就是两倍，

拿完之后剩下的就是一些环了，环与环之间不会相连，因为一个点最多有一个出边。

对于一个环，显然需要拿出一个点，这个点的代价为1倍，这样其他点点代价可以做到两倍，因此只需要找到这个环里面权值最低点哪个点，最后拿这个点，就可以做到贡献最大化。

## 代码

```cpp
/**
 * PROBLEM_NAME:F. Selling a Menagerie
 * ONLINE_JUDGE_NAME:Codeforces
 * Date:2023/9/7
 * Author:houyunfei
**/
#include <bits/stdc++.h>

#define int long long
#define yes cout << "YES" << endl;
#define no cout << "NO" << endl;
#define IOS cin.tie(0), cout.tie(0), ios::sync_with_stdio(false);
#define cxk 1
#define debug(s, x) if (cxk) cout << "#debug:(" << s << ")=" << x << endl;
using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<int> w(n + 1), a(n + 1), d(n + 1);
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        d[a[i]]++;
    }
    for (int i = 1; i <= n; i++) cin >> w[i];
    queue<int> q;
    vector<bool> st(n + 1);
    for (int i = 1; i <= n; i++) {
        if (d[i] == 0) q.push(i);
    }
    vector<int> res;
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        st[x] = true;
        res.push_back(x);
        if (--d[a[x]] == 0) q.push(a[x]);
    }
    //剩下的都是环了
    for (int i = 1; i <= n; i++) {
        if (st[i])continue;
        int x = i;
        vector<int> t;
        while (!st[x]) {
            st[x] = true;
            t.push_back(x);
            x = a[x];
        }
        int pos = 0; //权值最小的点的位置
        for (int j = 0; j < t.size(); j++) {
            if (w[t[j]] < w[t[pos]]) pos = j;
        }
        for (int j = 0; j < t.size(); j++) {
            pos++;
            if (pos == t.size())pos = 0;
            res.push_back(t[pos]);
        }
    }
    for (const auto &item: res) {
        cout << item << " ";
    }
    cout << endl;

}

signed main() {
    IOS
    int _ = 1;
    cin >> _;
    while (_--) solve();
    return 0;
}
```

# G. Replace With Product

## 题目翻译

给定一个数组$a$，其中$n$个正整数。您需要**恰好**执行一次以下操作：

- 选择$2$个整数$l$和$r$（$1 \le l \le r \le n$），并将子数组$a[l \ldots r]$替换为单个元素：子数组$(a_l \cdot \ldots \cdot a_r)$中所有元素的乘积。

例如，如果对数组$[5, 4, 3, 2, 1]$进行参数$l = 2, r = 4$的运算，则数组将变为$[5, 24, 1]$。

您的任务是在应用此操作后最大化数组的总和。找到应用此操作的最佳子数组。

## 思路

显然，如果区间的两边都是1，这些1一定不会选。

可以先找到区间[l,r],区间l的左边都是1，区间r的右边都是1，l和r都不等于1

对于一个区间来说，如果这个区间中元素的乘积大于1e9了，那么我们就会选择将整个区间进行合并，因为对于端点都是>=2的数，显然乘上这些数获得的贡献远比加上这些数获得的贡献大。

如果区间的乘积<1e9,那么说明不会有超过30个数大于1，因此可以记录这些>1的数的位置，然后暴力枚举两个数进行合并，看哪种方案获得的贡献最大，此时不会爆int。

## 代码

```cpp
/**
 * PROBLEM_NAME:G. Replace With Product
 * ONLINE_JUDGE_NAME:Codeforces
 * Date:2023/9/7
 * Author:houyunfei
**/
#include <bits/stdc++.h>

#define int long long
#define yes cout << "YES" << endl;
#define no cout << "NO" << endl;
#define IOS cin.tie(0), cout.tie(0), ios::sync_with_stdio(false);
#define cxk 1
#define debug(s, x) if (cxk) cout << "#debug:(" << s << ")=" << x << endl;
using namespace std;

void solve() {
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    int l = 1, r = n;
    while (l <= n && a[l] == 1) l++;
    while (r >= 1 && a[r] == 1) r--;
    if (l >= r) {
        cout << "1 1\n";
        return;
    }

    int mul = 1;
    for (int i = l; i <= r; i++) {
        mul *= a[i];
        if (mul > 1e9) {
            cout << l << " " << r << endl;
            return;
        }
    }

    int t = 0;
    vector<int> pos;
    for (int i = l; i <= r; i++) {
        if (a[i] > 1) {
            t++;
            pos.push_back(i);
        }
    }
    if (t >= 30) {
        cout << l << " " << r << endl;
        return;
    }
    vector<int> s(n + 1), sum(n + 1);
    s[0] = 1;
    for (int i = 1; i <= n; i++) {
        s[i] = s[i - 1] * a[i];
        sum[i] = sum[i - 1] + a[i];
    }
    int x = l, y = l;
    int mx = sum[n];
    for (int i = 0; i < pos.size(); i++) {
        for (int j = i + 1; j < pos.size(); j++) {
            t = s[pos[j]] / s[pos[i] - 1] + sum[n] - (sum[pos[j]] - sum[pos[i] - 1]);
            if (t > mx) mx = t, x = pos[i], y = pos[j];
        }
    }
    cout << x << " " << y << endl;
}

signed main() {
    IOS
    int _ = 1;
    cin >> _;
    while (_--) solve();
    return 0;
}
```

