---
title: 线性DP-最长上升子序列
date: 2023-05-11 08:08:27
category: 
  - Algorithm
  - 动态规划
tag:
  - Algorithm
  - 动态规划
---

# 最长上升子序列

## 题目描述

这是一个简单的动规板子题。

给出一个由 $n(n\le 5000)$ 个不超过 $10^6$ 的正整数组成的序列。请输出这个序列的**最长上升子序列**的长度。

最长上升子序列是指，从原序列中**按顺序**取出一些数字排在一起，这些数字是**逐渐增大**的。

## 输入格式

第一行，一个整数 $n$，表示序列长度。

第二行有 $n$ 个整数，表示这个序列。

## 输出格式

一个整数表示答案。

## 样例 #1

### 样例输入 #1

```
6
1 2 4 1 3 4
```

### 样例输出 #1

```
4
```

## 思路

动态规划：

- 状态表示：`f[i]`表示从第一个数字开始算，以`w[i]`结尾的最大的上升序列
- 状态计算（集合的划分）：`j∈(0,1,2,...,i-1)`,在`w[i]>w[j]`时，`f[i]=max(f[i],f[j]+1)`;

- - 有一个边界，若前面没有比`i`小的，那么`f[i]=1`(以自己为结尾)

- 状态转移方程：`f[i]=max(f[i],f[j]+1)`

二分优化：

状态表示：`f[i]`表示长度为`i`的最长上升子序列末尾最小的数字

状态计算：对于每个`w[i]`，

- 如果`w[i]>f[cnt]`,那么就吧这个元素加入到`f[++cnt]=w[i]`
- 否则找到第一个大于等于`w[i]`的元素，更新它为`w[i]`

## 代码

二维$O(n^2)$

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    vector<int> f(n + 1, 1);
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j < i; j++) {
            if (a[j] < a[i]) f[i] = max(f[i], f[j] + 1);
        }
    }
    int t = -1;
    for (int i = 1; i <= n; i++) t = max(t, f[i]);
    cout << t << endl;
    return 0;
}
```

二分优化：$O(nlogn)$

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n;
    cin >> n;
    vector<int> a(n + 1);
    vector<int> f;
    for (int i = 1; i <= n; i++) cin >> a[i];
    f.push_back(a[1]);
    for (int i = 2; i <= n; i++) {
        if (a[i] >= f.back()) f.push_back(a[i]);
        else *std::lower_bound(f.begin(), f.end(), a[i]) = a[i];
    }
    cout<<f.size();
    return 0;
}
```

# 最长公共子序列

## 问题

https://www.acwing.com/problem/content/description/899/

给定两个长度分别为 N和 M 的字符串 A和 B，求既是 A的子序列又是 B的子序列的字符串长度最长是多少。

## 思路

- `dp[i][j]`表示所有由第一个序列的前`i`个字母和第二个序列的前`j`个字母构成的公共子序列的最大值
- 集合的划分

- - 00 `a[i],a[j]`都不选 :`dp[i-1][j-1]`
  - 01 选`a[j]`，不选`a[i]`:`dp[i-1][j]`
  - 10 选`a[i]`,不选`a[j]`:`dp[i][j-1]`
  - 11 选`a[i],a[j]`:`dp[i-1][j-1]+1`

## 代码 

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n, m;
    cin >> n >> m;
    string a, b;
    cin >> a >> b;
    a = " " + a, b = " " + b;
    vector<vector<int> > f(n + 1, vector<int>(m + 1));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            f[i][j] = max(f[i - 1][j], f[i][j - 1]);
            if (a[i] == b[j]) f[i][j] = max(f[i][j], f[i - 1][j - 1] + 1);
        }
    }
    cout << f[n][m];
    return 0;
}
```

# 【模板】最长公共子序列-洛谷+排列

## 题目描述

给出 $1,2,\ldots,n$ 的两个排列 $P_1$ 和 $P_2$ ，求它们的最长公共子序列。

## 输入格式

第一行是一个数 $n$。

接下来两行，每行为 $n$ 个数，为自然数 $1,2,\ldots,n$ 的一个排列。

## 输出格式

一个数，即最长公共子序列的长度。

## 样例 #1

### 样例输入 #1

```
5 
3 2 1 4 5
1 2 3 4 5
```

### 样例输出 #1

```
3
```

## 提示

- 对于 $50\%$ 的数据， $n \le 10^3$；
- 对于 $100\%$ 的数据， $n \le 10^5$。

## 思路

将第一个序列看成是升序的，可以映射为1 2 3 4 5...，同时把第二个序列的数字做相应的更改

> 例如原本为3 2 1 4 5 可以改为 1 2 3 4 5 变成升序的
>
> 第二个序列1 2 3 4 5 就相应的变为 : 3 2 1 4 5

现在需要求最长公共子序列，显然如果一个序列在第二个序列中是升序的，那么它一定是第一个序列的子序列，

因此此时只要求第二个序列的最长上升子序列即可。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n;
    cin >> n;
    vector<int> a(n + 1), b(n + 1), f;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        a[x] = i;
    }
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        b[i] = a[x];
    }
    //求b的最长上升子序列
    f.push_back(b[1]);
    for (int i = 2; i <= n; i++) {
        if (b[i] > f.back()) f.push_back(b[i]);
        else *std::lower_bound(f.begin(), f.end(), b[i]) = b[i];

    }
    cout << f.size();
    return 0;
}
```

# AcWing 1017. 怪盗基德的滑翔翼

## 题目

题目链接：https://www.acwing.com/problem/content/1019/

怪盗基德是一个充满传奇色彩的怪盗，专门以珠宝为目标的超级盗窃犯。

而他最为突出的地方，就是他每次都能逃脱中村警部的重重围堵，而这也很大程度上是多亏了他随身携带的便于操作的滑翔翼。

有一天，怪盗基德像往常一样偷走了一颗珍贵的钻石，不料却被柯南小朋友识破了伪装，而他的滑翔翼的动力装置也被柯南踢出的足球破坏了。

不得已，怪盗基德只能操作受损的滑翔翼逃脱。

假设城市中一共有N幢建筑排成一条线，每幢建筑的高度各不相同。

初始时，怪盗基德可以在任何一幢建筑的顶端。

他可以选择一个方向逃跑，但是不能中途改变方向（因为中森警部会在后面追击）。

因为滑翔翼动力装置受损，他只能往下滑行（即：只能从较高的建筑滑翔到较低的建筑）。

他希望尽可能多地经过不同建筑的顶部，这样可以减缓下降时的冲击力，减少受伤的可能性。

请问，他最多可以经过多少幢不同建筑的顶部(包含初始时的建筑)？

## 输入格式

输入数据第一行是一个整数K，代表有K组测试数据。

每组测试数据包含两行：第一行是一个整数N，代表有N幢建筑。第二行包含N个不同的整数，每一个对应一幢建筑的高度h，按照建筑的排列顺序给出。

## 输出格式

对于每一组测试数据，输出一行，包含一个整数，代表怪盗基德最多可以经过的建筑数量。

## 思路

动态规划：

- 题目可以转化为最长上升子序列问题，即：正向求一遍最长上升子序列问题，反向求一遍最长上升子序列问题，他们的最大值即为结果

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;



void solve() {
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    vector<int> f, g;
    f.push_back(a[1]);
    for(int i=2;i<=n;i++){
        if (a[i]>f.back()) f.push_back(a[i]);
        else *std::lower_bound(f.begin(), f.end(),a[i])=a[i];
    }
    std::reverse(a.begin()+1, a.end());
    g.push_back(a[1]);
    for(int i=2;i<=n;i++){
        if (a[i]>g.back()) g.push_back(a[i]);
        else *std::lower_bound(g.begin(), g.end(),a[i])=a[i];
    }
    cout<<max(f.size(),g.size())<<endl;
}
signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int t;
    cin >> t;
    while (t--) solve();


    return 0;
}
```

# AcWing 1014. 登山

## 题目

题目链接：https://www.acwing.com/problem/content/1016/

五一到了，ACM队组织大家去登山观光，队员们发现山上一共有N个景点，并且决定按照顺序来浏览这些景点，即每次所浏览景点的编号都要大于前一个浏览景点的编号。

同时队员们还有另一个登山习惯，就是不连续浏览海拔相同的两个景点，并且一旦开始下山，就不再向上走了。

队员们希望在满足上面条件的同时，尽可能多的浏览景点，你能帮他们找出最多可能浏览的景点数么？

## 思路

题目大概意思：

- 按照编号递增来浏览=>必须是子序列
- 相邻两个景点不能相同
- 一旦开始下降，不能上升=>先上升，再下降
- 目标：求最多能浏览多少个景点

AcWing怪盗基德的题目是求最长上升子序列和倒叙的最长上升子序列的最大值

本题类似，实际上是求上升子序列和下降子序列之和的最大值，可以先将最长上升子序列和最长下降子序列预处理出来，然后遍历一遍就可以求出答案

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    vector<int> f(n + 1), g(n + 1);
    for (int i = 1; i <= n; i++) {
        f[i] = 1;
        for (int j = 1; j < i; j++) {
            if (a[j] < a[i]) f[i] = max(f[i], f[j] + 1);
        }
    }
    for (int i = n; i >= 1; i--) {
        g[i] = 1;
        for (int j = n; j > i; j--) {
            if (a[j] < a[i]) g[i] = max(g[i], g[j] + 1);
        }
    }
    int t = 0;
    for (int i = 1; i <= n; i++) {
        t = max(t, f[i] + g[i] - 1);
    }
    cout << n-t << endl;
    return 0;
}
```

- 

# [NOIP2004 提高组 合唱队形](https://www.luogu.com.cn/problem/P1091)

## 题目描述

$n$ 位同学站成一排，音乐老师要请其中的 $n-k$ 位同学出列，使得剩下的 $k$ 位同学排成合唱队形。

合唱队形是指这样的一种队形：设 $k$ 位同学从左到右依次编号为 $1,2,$ … $,k$，他们的身高分别为 $t_1,t_2,$ … $,t_k$，则他们的身高满足 $t_1< \cdots <t_i>t_{i+1}>$ … $>t_k(1\le i\le k)$。

你的任务是，已知所有 $n$ 位同学的身高，计算最少需要几位同学出列，可以使得剩下的同学排成合唱队形。

## 输入格式

共二行。

第一行是一个整数 $n$（$2\le n\le100$），表示同学的总数。

第二行有 $n$ 个整数，用空格分隔，第 $i$ 个整数 $t_i$（$130\le t_i\le230$）是第 $i$ 位同学的身高（厘米）。

## 输出格式

一个整数，最少需要几位同学出列。

## 样例 #1

### 样例输入 #1

```
8
186 186 150 200 160 130 197 220
```

### 样例输出 #1

```
4
```

## 提示

对于 $50\%$ 的数据，保证有 $n \le 20$。

对于全部的数据，保证有 $n \le 100$。

## 思路

身高必须是先增加然后降低，可以 先求出上升子序列的长度再倒着求一遍上升子序列的长度，两者加在一起再减1，就是这个点先增加再下降的最大长度，因为要求的是出列的人，只需要用总人数减去这个最大的长度，就可以求出出列的人数的最小值。

可以参考上一题的登山。

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    vector<int> f(n + 1), g(n + 1);
    for (int i = 1; i <= n; i++) {
        f[i] = 1;
        for (int j = 1; j < i; j++) {
            if (a[j] < a[i]) f[i] = max(f[i], f[j] + 1);
        }
    }
    for (int i = n; i >= 1; i--) {
        g[i] = 1;
        for (int j = n; j > i; j--) {
            if (a[j] < a[i]) g[i] = max(g[i], g[j] + 1);
        }
    }
    int t = 0;
    for (int i = 1; i <= n; i++) {
        t = max(t, f[i] + g[i] - 1);
    }
    cout << n-t << endl;
    return 0;
}
```



# 友好城市

## 题目描述

有一条横贯东西的大河，河有笔直的南北两岸，岸上各有位置各不相同的N个城市。北岸的每个城市有且仅有一个友好城市在南岸，而且不同城市的友好城市不相同。每对友好城市都向政府申请在河上开辟一条直线航道连接两个城市，但是由于河上雾太大，政府决定避免任意两条航道交叉，以避免事故。编程帮助政府做出一些批准和拒绝申请的决定，使得在保证任意两条航道不相交的情况下，被批准的申请尽量多。

## 输入格式

第1行，一个整数N，表示城市数。

第2行到第n+1行，每行两个整数，中间用一个空格隔开，分别表示南岸和北岸的一对友好城市的坐标。

## 输出格式

仅一行，输出一个整数，表示政府所能批准的最多申请数。

## 样例 #1

### 样例输入 #1

```
7
22 4
2 6
10 3
15 12
9 8
17 17
4 2
```

### 样例输出 #1

```
4
```

## 提示

50% 1<=N<=5000,0<=xi<=10000

100% 1<=N<=2e5,0<=xi<=1e6

## 思路

将北面的城市按照坐标从小到大进行排序，然后找出下坐标的最长上升子序列即可，

最长上升子序列问题的思路与前几道题一致

注意这里数据比较大，必须要使用二分进行优化

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;
typedef pair<int, int> PII;


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n;
    cin >> n;
    vector<PII> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i].first >> a[i].second;
    std::sort(a.begin() + 1, a.end());
    vector<int> b(n + 1);
    for (int i = 1; i <= n; i++) b[i] = a[i].second;
    vector<int> f;
    f.push_back(b[1]);
    for (int i = 2; i <= n; i++) {
        if (b[i] > f.back()) f.push_back(b[i]);
        else *std::lower_bound(f.begin(), f.end(), b[i]) = b[i];
    }
    cout<<f.size();
    return 0;
}
```

# AcWing 1016. 最大上升子序列和

## 题目

题目链接：https://www.acwing.com/problem/content/1018/

一个数的序列 bi ，当 b1<b2<…<bS 的时候，我们称这个序列是上升的。

对于给定的一个序列(a1,a2,…,aN )，我们可以得到一些上升的子序列(ai1,ai2,…,aiK )，这里1≤i1<i2<…<iK≤N 。

比如，对于序列(1,7,3,5,9,4,8)，有它的一些上升子序列，如(1,7),(3,4,8)等等。

这些子序列中和最大为18，为子序列(1,3,5,9)的和。

你的任务，就是对于给定的序列，求出最大上升子序列和。

注意，最长的上升子序列的和不一定是最大的，比如序列(100,1,2,3)的最大上升子序列和为100，而最长上升子序列为(1,2,3)。

## 思路

动态规划：

- 状态表示：`f[i]`表示所有第一个数开始，以`f[i]`结尾的上升子序列的和的最大值
- 状态计算（集合的划分）：`j∈(0,1,2,...,i-1)`,在`a[i]>a[j]`时，`f[i]=max(f[i],f[j]+a[i])`;

- - 有一个边界，若前面没有比`i`小的，那么`f[i]=a[i]`(以自己为结尾)

- 状态转移方程：`f[i]=max(f[i],f[j]+a[i])`

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n;
    cin >> n;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    vector<int> f(n+1);
    for(int i=1;i<=n;i++){
        f[i]=a[i];
        for(int j=1;j<i;j++){
            if (a[i]>a[j]) f[i]= max(f[i],f[j]+a[i]);
        }
    }
    auto t=*std::max_element(f.begin(), f.end());
    cout<<t<<endl;

    return 0;
}
```

