---
title: 概率DP
date: 2023-05-29 22:42:53
category: 
  - Algorithm
  - 动态规划
tag:
  - Algorithm
  - 动态规划
---

# Bag of mice

## 题面翻译

https://www.luogu.com.cn/problem/CF148D

袋子里有$w$ 只白鼠和$b$ 只黑鼠 ，A和B轮流从袋子里抓，谁先抓到白色谁就赢。A每次随机抓一只，B每次随机抓完一只之后会有另一只随机老鼠跑出来。如果两个人都没有抓到白色则B赢。A先抓，问A赢的概率。

### 输入

一行两个数$w,b$ 。
### 输出

A赢的概率，误差$10^{-9}$ 以内。
### 数据范围
$0\le w,b\le 1000$ 。

## 题目描述

The dragon and the princess are arguing about what to do on the New Year's Eve. The dragon suggests flying to the mountains to watch fairies dancing in the moonlight, while the princess thinks they should just go to bed early. They are desperate to come to an amicable agreement, so they decide to leave this up to chance.

They take turns drawing a mouse from a bag which initially contains $ w $ white and $ b $ black mice. The person who is the first to draw a white mouse wins. After each mouse drawn by the dragon the rest of mice in the bag panic, and one of them jumps out of the bag itself (the princess draws her mice carefully and doesn't scare other mice). Princess draws first. What is the probability of the princess winning?

If there are no more mice in the bag and nobody has drawn a white mouse, the dragon wins. Mice which jump out of the bag themselves are not considered to be drawn (do not define the winner). Once a mouse has left the bag, it never returns to it. Every mouse is drawn from the bag with the same probability as every other one, and every mouse jumps out of the bag with the same probability as every other one.

## 输入格式

The only line of input data contains two integers $ w $ and $ b $ ( $ 0<=w,b<=1000 $ ).

## 输出格式

Output the probability of the princess winning. The answer is considered to be correct if its absolute or relative error does not exceed $ 10^{-9} $ .

## 样例 #1

### 样例输入 #1

```
1 3
```

### 样例输出 #1

```
0.500000000
```

## 样例 #2

### 样例输入 #2

```
5 5
```

### 样例输出 #2

```
0.658730159
```

## 提示

Let's go through the first sample. The probability of the princess drawing a white mouse on her first turn and winning right away is 1/4. The probability of the dragon drawing a black mouse and not winning on his first turn is 3/4 \* 2/3 = 1/2. After this there are two mice left in the bag — one black and one white; one of them jumps out, and the other is drawn by the princess on her second turn. If the princess' mouse is white, she wins (probability is 1/2 \* 1/2 = 1/4), otherwise nobody gets the white mouse, so according to the rule the dragon wins.

## 思路

本题是dp算概率：

状态表示：`f[i][j]`表示当前袋中有i只白鼠j只黑鼠时，A获胜的概率

起点：

+ `f[0][i]=0` 袋子中没有白鼠，A获胜的概率为0
+ `f[i][0]=1`袋子中全是白鼠，A获胜的概率为1

终点：`f[w][b]`

状态转移：

+ 先手拿到白鼠：$f[i][j]+=\frac{i}{i+j}$
+ 先手拿到黑鼠：
  + 后手拿到白鼠：先手获胜概率为0，即$f[i][j]+=0$
  + 后手拿到黑鼠：
    + 跑了白鼠：$f[i][j]+=\frac{j}{i+j}*\frac{j-1}{i+j-1}*\frac{i}{i+j-2}*f[i-1][j-2]$
    + 跑了黑鼠：$f[i][j]+=\frac{j}{i+j}*\frac{j1}{i+j-1}*\frac{j-2}{i+j-2}*f[i][j-3]$

## 代码

线性递推：

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int w, b;
    cin >> w >> b;
    vector<vector<double>> f(w + 1, vector<double>(b + 1));
    //fij表示袋子里有i只白鼠，j只黑鼠时A获胜的概率
    for (int i = 1; i <= b; i++) f[0][i] = 0;
    for (int i = 1; i <= w; i++) f[i][0] = 1;

    for (int i = 1; i <= w; i++) {
        for (int j = 1; j <= b; j++) {
            f[i][j] += 1.0 * i / (i + j);
            if (i >= 1 && j >= 2)
                f[i][j] += 1.0 * j / (i + j) * (j - 1) / (i + j - 1) * i / (i + j - 2) * f[i - 1][j - 2];
            if (j >= 3)
                f[i][j] += 1.0 * j / (i + j) * (j - 1) / (i + j - 1) * (j - 2) / (i + j - 2) * f[i][j - 3];
        }
    }
    printf("%.10f", f[w][b]);

    return 0;
}
```

记忆化搜索：

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 1010;
double f[N][N];

double dfs(int i, int j) {
    if (f[i][j]) return f[i][j];
    if (i == 0) return f[i][j] = 0;
    if (j == 0) return f[i][j] = 1.0;
    f[i][j] += 1.0 * i / (i + j);//先白
    if (i >= 1 && j >= 2)
        f[i][j] += 1.0 * j / (i + j) * (j - 1) / (i + j - 1) * i / (i + j - 2) * dfs(i - 1, j - 2);
    if (j >= 3)
        f[i][j] += 1.0 * j / (i + j) * (j - 1) / (i + j - 1) * (j - 2) / (i + j - 2) * dfs(i, j - 3);
    return f[i][j];
}

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int w, b;
    cin >> w >> b;
    double t = dfs(w, b);
    std::printf("%.10f", t);
    return 0;
}
```

# FootBall

## 题意

https://vjudge.csgrandeur.cn/problem/POJ-3071

有2^n支球队比赛，每次和相邻的球队踢，两两淘汰，给定任意两支球队相互踢赢的概率，求最后哪只球队最可能夺冠

### 输入

```
2
0.0 0.1 0.2 0.3
0.9 0.0 0.4 0.5
0.8 0.6 0.0 0.6
0.7 0.5 0.4 0.0
-1
```

### 输出

```
2
```

## 思路

计算每个球队的获胜概率，取概率得到max的队伍即为答案

状态表示：`f[i][j]`表示在第i轮中，第j队获胜的概率

起点：`f[0][i]=1`表示第0轮全部都获胜

状态转移：$f[i][j]+=f[i-1][j]*f[i-1][k]*p[j][k]$

> 解释：
>
> 如果在第i轮中，j队与k队比赛，说明在i-1轮中，两队都获胜了， 计算$f[i][j]$还需要乘上j赢k的概率

我们在枚举第i轮，j队可以和哪些队伍相遇的时候，也就是找出第i-1轮获胜的邻近球队，可以使用如下技巧：

![image-20230530133521948](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305301335021.png)

> 注意，POJ使用cin会超时，使用scanf需要加上cstdio

## 代码

```cpp
#include <iostream>
#include <cstdio>

#define int long long
using namespace std;

const int N = 130;
double p[N][N];
double f[N][N];
int n, m;

void solve() {
    m = 1 << n;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < m; j++) {
            scanf("%lf", &p[i][j]);
        }
    }
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j < m; j++) {
            f[i][j] = 0;
        }
    }
    for (int i = 0; i < m; i++) f[0][i] = 1;

    for (int i = 1; i <= n; i++) { //多少场
        for (int j = 0; j < m; j++) {//第j个队伍
            for (int k = 0; k < m; k++) {//对手队伍
                int x = (j >> (i - 1)) ^ 1;
                int y = (k >> (i - 1));
                if (x == y) {
                    f[i][j] += f[i - 1][j] * f[i - 1][k] * p[j][k];
                }
            }
        }
    }
    int idx = 0;
    double max = -1;
    for (int i = 0; i < m; i++) {
        if (f[n][i] > max) {
            idx = i + 1;
            max = f[n][i];
        }
    }
    cout << idx << endl;
}

signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    while (scanf("%lld", &n), n != -1) solve();
    return 0;
}
```

# Jon and Orbs

## 题面翻译

https://www.luogu.com.cn/problem/CF768D

一个人要取$\,N\,$件物品，一天只能取一件物品，但不能确定取到的是什么物品，求最少需要在第几天，取完这$\,N\,$件物品的概率不小于$\,\dfrac{p}{2000}\,$，有$\,q\,$组询问，每组询问给定这个$\,p\,$。

## 题目描述

Jon Snow is on the lookout for some orbs required to defeat the white walkers. There are $ k $ different types of orbs and he needs at least one of each. One orb spawns daily at the base of a Weirwood tree north of the wall. The probability of this orb being of any kind is equal. As the north of wall is full of dangers, he wants to know the minimum number of days he should wait before sending a ranger to collect the orbs such that the probability of him getting at least one of each kind of orb is at least ![](https://cdn.luogu.com.cn/upload/vjudge_pic/CF768D/084e5b8c9ee986cd51e443adb59a2f8594ceba38.png), where $ ε<10^{-7} $ .

To better prepare himself, he wants to know the answer for $ q $ different values of $ p_{i} $ . Since he is busy designing the battle strategy with Sam, he asks you for your help.

## 输入格式

First line consists of two space separated integers $ k $ , $ q $ ( $ 1<=k,q<=1000 $ ) — number of different kinds of orbs and number of queries respectively.

Each of the next $ q $ lines contain a single integer $ p_{i} $ ( $ 1<=p_{i}<=1000 $ ) — $ i $ -th query.

## 输出格式

Output $ q $ lines. On $ i $ -th of them output single integer — answer for $ i $ -th query.

## 样例 #1

### 样例输入 #1

```
1 1
1
```

### 样例输出 #1

```
1
```

## 样例 #2

### 样例输入 #2

```
2 2
1
2
```

### 样例输出 #2

```
2
2
```

## 思路

概率dp

状态表示：`f[i][j]`表示前i天，取到了j个不同的物品的概率

状态转移：

+ 第i-1天已经取到了j个物品，则第i天应该取这j个物品中任意一个：$f[i][j]+=f[i-1][j]*\frac{j}{k}$
+ 第i-1天取到了j-1个物品，第i天从剩下的$n-(j-1)$里面取一个：$f[i][j]+=f[i-1][j-1]*\frac{n-j+1}{k}$

一开始可以先把数组开很大，例如10000，然后试试极限数据也就是取1000个物品需要多少天，跑完之后发现只需要7274天，因此数组开到7500就可以了。

> 极限数据
>
> ```
> 1000 1
> 1000
> ```

## 代码

```cpp
#include <bits/stdc++.h>

#define int long long
using namespace std;

const int N = 7500, M = 1010;
double f[N][M];


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int k, q;
    cin >> k >> q;
    f[0][0] = 1.0;
    for (int i = 1; i < N; i++) {
        for (int j = 1; j <= k; j++) {
            f[i][j] += 1.0 * f[i - 1][j - 1]  * (k - j + 1) / k;
            f[i][j] += 1.0 * f[i - 1][j]  * j / k;
        }
    }
    while (q--) {
        double p;
        cin >> p;
        double t = 1.0 * p / 2000;
        for (int i = 1; i < N; i++) {
            if (f[i][k] > t) {
                cout << i << endl;
                break;
            }
        }
    }
    return 0;
}
```

# Collecting Bugs

## 题目

一个软件有s个子系统，会产生n种bug，某人一天发现一个bug，这个bug属于一个子系统，属于一个分类
每个bug属于某个子系统的概率是1/s，属于某种分类的概率是1/n
问：发现n种bug，s个子系统都发现bug的期望天数

## 思路

状态表示：`f[i][j]`表示已经找了i种bug，j个子系统的bug，达到目标状态的期望天数

起始状态：`f[n][s]=0`,答案`f[0][0]`

状态转移：

+ `f[i][j]`:发现一个bug属于已经有的i个分类，j个系统，概率为$p_1=(i/n)*(j/s)$
+ `f[i][j+1]`:发现一个bug属于已有的分类，不属于已有的系统，概率为：$p_2=(i/n)*(1-\frac{j}{s})$
+ `f[i+1][j]`:发现一个bug不属于已有分类，属于已有的系统，概率为：$p_3=(1-\frac{i}{n})*(j/s)$
+ `f[i+1][j+1]`:发现一个bug不属于已有分类，不属于已有系统，概率为：$p_4=(1-\frac{i}{n})*(1-\frac{j}{s})$

因此：$f[i][j]=f[i][j]*p_1+f[i][j+1]*p_2+f[i+1][j]*p_3+f[i+1][j+1]*p_4+1$

移项，将$f[i][j]$放到同一侧，除去$1-p_1$得：

$f[i][j]=(f[i][j+1]*p_2+f[i+1][j]*p_3+f[i+1][j+1]*p_4+1)/(1-p_1)$

## 代码

```cpp
#include <iostream>
#include <vector>
#include <cstdio>
#define int long long
using namespace std;


signed main() {
#ifndef ONLINE_JUDGE
    freopen("test.in", "r", stdin);
    freopen("test.out", "w", stdout);
#endif
    int n, s;
    cin >> n >> s;
    vector<vector<double> > f(n + 2, vector<double>(s + 2));
    f[n][s] = 0;
    for (int i = n; i >= 0; i--) {
        for (int j = s; j >= 0; j--) {
            if (i == n && j == s) continue;
            double p1 = 1.0 * i / n * j / s;
            double p2 = 1.0 * i / n * (s - j) / s;
            double p3 = 1.0 * (n - i) / n * j / s;
            double p4 = 1.0 * (n - i) / n * (s - j) / s;
            f[i][j] = (f[i][j + 1] * p2 + f[i + 1][j] * p3 + f[i + 1][j + 1] * p4 + 1) / (1 - p1);
        }
    }
    printf("%10f",f[0][0]);
    return 0;
}
```

