---
title: 字典树Trie
date: 2023-07-26 14:00:28
category:
  - Algorithm
  - 动态规划
tag:
  - Algorithm
  - 动态规划
---

> Trie树又称字典树，前缀树。是一种可以高效查询前缀字符串的树，典型应用是用于统计，排序和保存大量的字符串（但不仅限于字符串），所以经常被搜索引擎系统用于文本词频统计。
>
> 它的优点是：利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较，查询效率比哈希树高。`做题看到大量字符串或者大量字符就往Trie树或者哈希这边想，因为速度很快.
>
> ![image.png](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202307261420328.png)



# AcWing 835. Trie字符串统计

https://www.acwing.com/activity/content/problem/content/883/

维护一个字符串集合，支持两种操作：

1.  `I x` 向集合中插入一个字符串 $x$；
2.  `Q x` 询问一个字符串在集合中出现了多少次。

共有 $N$ 个操作，所有输入的字符串总长度不超过 $10^5$，字符串仅包含小写英文字母。

#### 输入格式

第一行包含整数 $N$，表示操作数。

接下来 $N$ 行，每行包含一个操作指令，指令为 `I x` 或 `Q x` 中的一种。

#### 输出格式

对于每个询问指令 `Q x`，都要输出一个整数作为结果，表示 $x$ 在集合中出现的次数。

每个结果占一行。

#### 数据范围

$1 \le N \le 2*10^4$

#### 输入样例：

```
5
I abc
Q abc
Q ab
I ab
Q ab
```

#### 输出样例：

```
1
0
1
```

## 思路

Trie树模版题

## 代码

```cpp
/**
 * https://www.acwing.com/problem/content/837/
 */
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 1e5 + 10;
int son[N][26], cnt[N], idx;
// 下标0代表根节点和空节点，cnt用于计数，idx代表结点的索引

void insert(string s) {
    int x = 0;
    for (auto c: s) {
        int y = c - 'a';
        if (!son[x][y]) son[x][y] = ++idx;// 没有该子结点就创建一个
        x = son[x][y]; // 走到该子节点
    }
    ++cnt[x];// 标记该子节点存在的单词个数
}

int query(string s) {
    int x = 0;
    for (auto c: s) {
        int y = c - 'a';
        if (!son[x][y]) return 0;// 没有该子结点就返回查询不到
        x = son[x][y];
    }
    return cnt[x];
}


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n;
    cin >> n;
    while (n--) {
        string op, s;
        cin >> op >> s;
        if (op == "I") insert(s);
        else cout << query(s) << endl;
    }


    return 0;
}
```



# 【模板】字典树

https://www.luogu.com.cn/problem/P8306

## 题目描述

给定 $n$ 个模式串 $s_1, s_2, \dots, s_n$ 和 $q$ 次询问，每次询问给定一个文本串 $t_i$，请回答 $s_1 \sim s_n$ 中有多少个字符串 $s_j$ 满足 $t_i$ 是 $s_j$ 的**前缀**。

一个字符串 $t$ 是 $s$ 的前缀当且仅当从 $s$ 的末尾删去若干个（可以为 0 个）连续的字符后与 $t$ 相同。

输入的字符串大小敏感。例如，字符串 `Fusu` 和字符串 `fusu` 不同。

## 输入格式

**本题单测试点内有多组测试数据**。  

输入的第一行是一个整数，表示数据组数 $T$。

对于每组数据，格式如下：  
第一行是两个整数，分别表示模式串的个数 $n$ 和询问的个数 $q$。  
接下来 $n$ 行，每行一个字符串，表示一个模式串。  
接下来 $q$ 行，每行一个字符串，表示一次询问。

## 输出格式

按照输入的顺序依次输出各测试数据的答案。  
对于每次询问，输出一行一个整数表示答案。

## 样例 #1

### 样例输入 #1

```
3
3 3
fusufusu
fusu
anguei
fusu
anguei
kkksc
5 2
fusu
Fusu
AFakeFusu
afakefusu
fusuisnotfake
Fusu
fusu
1 1
998244353
9
```

### 样例输出 #1

```
2
1
0
1
2
1
```

## 提示

### 数据规模与约定

对于全部的测试点，保证 $1 \leq T, n, q\leq 10^5$，且输入字符串的总长度不超过 $3 \times 10^6$。输入的字符串只含大小写字母和数字，且不含空串。

### 说明
std 的 IO 使用的是关闭同步后的 cin/cout，本题不卡常。

## 思路

因为这里需要统计的是前缀，因此每走一个点，都需要将cnt数组加1

这里不仅有小写，还有大写和数字，可以把小写映射为0-26,大写映射为26-52,数字映射为36-62 ,都是左闭右开区间。

有多组测试数据，需要初始化son为0，idx为0，cnt为0

数据比较大，需要开cin和cout优化

> Trie第一维开多大取决于字符串长度,与idx能增长到多少有关，尽可能开大一点5e6没问题，第二维取决于字符串里面字符的个数

## 代码

```cpp
/**
 * https://www.luogu.com.cn/problem/P8306
 */
#include <bits/stdc++.h>

#define int long long
using namespace std;

//空间怎么看开多大？看数据范围 输入总字符串总长度不超过3e6
const int N = 3e6 + 10;
int son[N][65], cnt[N], idx;

int get(char c) {
    if (c >= 'a' && c <= 'z') return c - 'a';
    if (c >= 'A' && c <= 'Z') return c - 'A' + 26;
    if (c >= '0' && c <= '9') return c - '0' + 26 + 26;

}

void insert(string s) {
    int x = 0;
    for (char c: s) {
        int y = get(c);
        if (!son[x][y]) son[x][y] = ++idx;
        x = son[x][y];
        cnt[x]++;
    }
}

int query(string s) {
    int x = 0;
    for (auto c: s) {
        int y = get(c);
        if (!son[x][y]) return 0;
        x = son[x][y];
    }
    return cnt[x];
}


void solve() {
    int n, q;
    cin >> n >> q;
    string s;
    while (n--) { cin >> s, insert(s); }
    while (q--) { cin >> s, cout << query(s) << '\n'; }

    //清空字典树,不使用memset,使用for
    for (int i = 0; i <= idx; i++) {
        for (int j = 0; j < 63; j++) {
            son[i][j] = 0;
        }
    }
    for (int i = 0; i <= idx; i++) cnt[i] = 0;
    idx = 0;
}

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    cin.tie(0), cout.tie(0), ios::sync_with_stdio(false);
    int t;
    cin >> t;
    while (t--) solve();
    return 0;
}
```

# AcWing 143. 最大异或对

在给定的 $N$ 个整数 $A_1，A_2……A_N$ 中选出两个进行 $xor$（异或）运算，得到的结果最大是多少？

#### 输入格式

第一行输入一个整数 $N$。

第二行输入 $N$ 个整数 $A_1$～$A_N$。

#### 输出格式

输出一个整数表示答案。

#### 数据范围

$1 \le N \le 10^5$,  
$0 \le A_i < 2^{31}$

#### 输入样例：

```
3
1 2 3
```

#### 输出样例：

```
3
```

## 思路

先将所有数插入到01Trie树中，然后遍历一遍数组，去找可以使得和他异或起来最大的数，时间复杂度是$nlogn$的，因为树每层最多30个.

如何找异或起来最大：

比如当前节点为0，那就看!0的节点是否存在，如果存在，走过去一定是最优的，因为在这一位异或起来的结果就可以变成1了，否则只能往0走。

## 代码

```cpp
/**
 * https://www.acwing.com/problem/content/145/
 */
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 1e5 + 10;
int son[N * 32][2], idx;

void insert(int t) {
    int x = 0;
    for (int i = 30; i >= 0; i--) {
        int y = t >> i & 1;
        if (!son[x][y]) son[x][y] = ++idx;
        x = son[x][y];
    }
}

int query(int t) {
    int x = 0, res = 0;
    for (int i = 30; i >= 0; i--) {
        int y = t >> i & 1;
        if (son[x][!y]) {//另一个存在
            res = res * 2 + !y;
            x = son[x][!y];
        } else {
            res = res * 2 + y;
            x = son[x][y];
        }
    }
    return res;
}


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; ++i)cin >> a[i];
    for (int i = 0; i < n; ++i) insert(a[i]);
    int mx = 0;
    for (int i = 0; i < n; ++i) mx = max(mx, a[i] ^ query(a[i]));
    cout << mx << endl;


    return 0;
}
```



# 最长异或路径

## 题目描述

给定一棵 $n$ 个点的带权树，结点下标从 $1$ 开始到 $n$。寻找树中找两个结点，求最长的异或路径。

异或路径指的是指两个结点之间唯一路径上的所有边权的异或。

## 输入格式

第一行一个整数 $n$，表示点数。

接下来 $n-1$ 行，给出 $u,v,w$ ，分别表示树上的 $u$ 点和 $v$ 点有连边，边的权值是 $w$。

## 输出格式

一行，一个整数表示答案。

## 样例 #1

### 样例输入 #1

```
4
1 2 3
2 3 4
2 4 6
```

### 样例输出 #1

```
7
```

## 提示

最长异或序列是 $1,2,3$，答案是 $7=3\oplus 4$。   

### 数据范围

$1\le n \le 100000;0 < u,v \le n;0 \le w < 2^{31}$。

## 思路

要求两个点之间的所有元素的异或值，设为$i,j$两点， 可以变成 $i$到根节点异或$j$到根节点的异或值。

![image-20230726161558142](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202307261615212.png)

因此我们可以去求每个点到根节点1的异或值，使用dfs即可，记录在sum中

然后遍历每个点，求当前点到根节点亦或值sum[i]可以异或得到的最大值。

之后就和上面一题一样了

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef struct edge {
    int to, w;
} edge;

const int N = 1e5 + 10;
int son[N * 31][2], cnt[N], idx;
int sum[N];// 存到根节点到异或值
vector<edge> e[N];
int n;

void dfs(int x, int fa) {
    for (auto [y, w]: e[x]) {
        if (y == fa) continue;
        sum[y] = sum[x] ^ w;
        dfs(y, x);
    }
}

void insert(int t) {
    int x = 0;
    for (int i = 30; i >= 0; i--) {
        int y = t >> i & 1;
        if (!son[x][y]) son[x][y] = ++idx;
        x = son[x][y];
    }
}

int query(int t) {
    int x = 0, res = 0;
    for (int i = 30; i >= 0; i--) {
        int y = t >> i & 1;
        if (son[x][!y]) {
            res += 1 << i;
            x = son[x][!y];
        } else {
            x = son[x][y];
        }
    }
    return res;
}

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    cin >> n;
    for (int i = 1; i <= n - 1; i++) {
        int x, y, w;
        cin >> x >> y >> w;
        e[x].push_back({y, w});
        e[y].push_back({x, w});
    }
    dfs(1, 0);
    for (int i = 1; i <= n; i++) insert(sum[i]);
    int res = 0;
    for (int i = 1; i <= n; i++) res = max(res, query(sum[i]));
    cout << res << endl;

    return 0;
}
```

# 最小异或对

## 题目描述

https://ac.nowcoder.com/acm/contest/53485/F

给出一个多重集合(元素可以重复的集合),你需要提供以下操作:  

1.  **ADD x**,向多重集合里添加一个元素x,多重集合内元素可以重复
2.  **DEL x,**从多重集合中删除一个元素x,保证要删除的元素一定存在,如果存在多个x则仅删除其中任意1个
3.  **QUE**,查询集合中的最小异或对的值,即找到集合中任何**两个元素(可以相等)**异或能得到的最小值,保证询问时集合包含的元素数量不少于2个

对于每个**QUE**操作,你需要输出查询的结果.  

以上操作中涉及的操作数x均为非负整数.

$1<=n<=2*10^5 ,0<=x<2^{30}$

## 思路-01Trie

与最大异或对类似

## 思路-结论

最小异或对的结论：最小异或对一定为数组排序后相邻两个数的异或值

> 证明：
>
> 设$a<b<c$,我们现在需要证明最小异或对只可能是a^b或者b^c
>
> 设c与a的第一个不同的位为第x位(从高向低看),则x位上面c一定为1，a一定为0 ,b可以为0或者1
>
> a,b,c在x位置之前的数字都是相同的。
>
> 因此在x位上面，a^c的这一位一定为1，a^b和b^c一定会有一个异或起来在这一位为0，
>
> 因此a^c不可能是最小的，也就是一定是相邻两个数异或起来才是最小。

可以使用平衡树进行增删改查操作.

### 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

multiset<int> s, res;
int n, x;
string op;

void add() {
    auto it = s.lower_bound(x);
    if (it != s.end()) res.insert(x ^ *it);
    if (it != s.begin()) res.insert(x ^ *prev(it));
    if (it != s.end() && it != s.begin()) res.erase(res.lower_bound(*it ^ *prev(it)));
    s.insert(x);
}

void del() {
    s.erase(s.find(x));
    auto it = s.lower_bound(x);
    if (it != s.end()) res.erase(res.find(x ^ *it));
    if (it != s.begin()) res.erase(res.find(x ^ *prev(it)));
    if (it != s.end() && it != s.begin()) res.insert(*it ^ *prev(it));
}

int que() {
    return *res.begin();
}

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    cin >> n;
    while (n--) {
        cin >> op;
        if (op == "ADD") {
            cin >> x;
            add();
        } else if (op == "DEL") {
            cin >> x;
            del();
        } else cout << que() << endl;
    }

    return 0;
}
```



