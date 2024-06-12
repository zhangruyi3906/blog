---
title: Codeforces Round 834 (Div. 3) E. The Humanoid
date: 2023-05-03 09:58:22
category:
- Algorithm
- Codeforces
tag: 
- codeforces
- 贪心
- 1500
---



# The Humanoid

## 题面翻译

## 题目描述
有 $n$ 名宇航员，他们每个人有大小为 $a_i$ 的能量。一个初始具有 $h$ 单位能量的邪恶的人形生物来这里吸收宇航员们的能量。  

人型生物可以做以下三个动作：  
- 吸收一个能量值严格低于当前人型生物的宇航员。
- 将自身的能量值翻倍 ($\times 2$), 这个操作最多能进行两次。
- 将自身的能量值翻三倍 ($\times 3$), 这个操作最多能进行一次。

其中，当一名具有 $a_i$ 能量的宇航员被吸收时，这名宇航员消失，人型生物的能量增加 $\lfloor {a_i\over 2} \rfloor$。

请你帮他算一算，如果他用最佳方案进行操作，他最多能吸收几名宇航员的能量？  

## 输入格式
第一行包含一个整数 $t\ (1\leq t \leq 10^4)$, 表示数据组数。  

对于每组数据，第一行包含两个整数 $n\ (1\leq n \leq 2\cdot 10^5),h\ (1\leq h \leq 10^6)$, 分别代表宇航员人数和人形生物的初始能量。第二行包含 $n$ 个整数 $a_i\ (1\leq a_i \leq 10^8)$, 表示每名宇航员的能量。

保证 $\sum n\leq 2\cdot 10^5$。  

## 输出格式
对于每组数据，在单独的一行里输出一个整数，表示人形生物可以吸收宇航员的最大数量。

## 题目描述

There are $ n $ astronauts working on some space station. An astronaut with the number $ i $ ( $ 1 \le i \le n $ ) has power $ a_i $ .

An evil humanoid has made his way to this space station. The power of this humanoid is equal to $ h $ . Also, the humanoid took with him two green serums and one blue serum.

In one second , a humanoid can do any of three actions:

1. to absorb an astronaut with power strictly less humanoid power;
2. to use green serum, if there is still one left;
3. to use blue serum, if there is still one left.

When an astronaut with power $ a_i $ is absorbed, this astronaut disappears, and power of the humanoid increases by $ \lfloor \frac{a_i}{2} \rfloor $ , that is, an integer part of $ \frac{a_i}{2} $ . For example, if a humanoid absorbs an astronaut with power $ 4 $ , its power increases by $ 2 $ , and if a humanoid absorbs an astronaut with power $ 7 $ , its power increases by $ 3 $ .

After using the green serum, this serum disappears, and the power of the humanoid doubles, so it increases by $ 2 $ times.

After using the blue serum, this serum disappears, and the power of the humanoid triples, so it increases by $ 3 $ times.

The humanoid is wondering what the maximum number of astronauts he will be able to absorb if he acts optimally.

## 输入格式

The first line of each test contains an integer $ t $ ( $ 1 \le t \le 10^4 $ ) — number of test cases.

The first line of each test case contains integers $ n $ ( $ 1 \le n \le 2 \cdot 10^5 $ ) — number of astronauts and $ h $ ( $ 1 \le h \le 10^6 $ ) — the initial power of the humanoid.

The second line of each test case contains $ n $ integers $ a_i $ ( $ 1 \le a_i \le 10^8 $ ) — powers of astronauts.

It is guaranteed that the sum of $ n $ for all test cases does not exceed $ 2 \cdot 10^5 $ .

## 输出格式

For each test case, in a separate line, print the maximum number of astronauts that a humanoid can absorb.

## 样例 #1

### 样例输入 #1

```
8
4 1
2 1 8 9
3 3
6 2 60
4 5
5 1 100 5
3 2
38 6 3
1 1
12
4 6
12 12 36 100
4 1
2 1 1 15
3 5
15 1 13
```

### 样例输出 #1

```
4
3
3
3
0
4
4
3
```

## 提示

In the first case, you can proceed as follows:

1. use green serum. $ h = 1 \cdot 2 = 2 $
2. absorb the cosmonaut $ 2 $ . $ h = 2 + \lfloor \frac{1}{2} \rfloor = 2 $
3. use green serum. $ h = 2 \cdot 2 = 4 $
4. absorb the spaceman $ 1 $ . $ h = 4 + \lfloor \frac{2}{2} \rfloor = 5 $
5. use blue serum. $ h = 5 \cdot 3 = 15 $
6. absorb the spaceman $ 3 $ . $ h = 15 + \lfloor \frac{8}{2} \rfloor = 19 $
7. absorb the cosmonaut $ 4 $ . $ h = 19 + \lfloor \frac{9}{2} \rfloor = 23 $



## 思路

显然需要贪心，从小到大进行排序，先吃小的，再吃大的，只有在我们当前的h比宇航员的a [i]小的时候，我们才会去使用药水，

否则在还可以进行吃宇航员的情况下使用药水显然h会比吃完再使用小。

问题就变成这三个药水的使用顺序

>  不一定先使用两个✖️2的,因为在2 1 1 15 这组中，就是先使用3比较好。

因为只有三瓶药水，我们可以去枚举✖️3的药水在什么时候喝，先喝，第二个喝，最后一个喝，即可。

## 代码

```cpp
#include <bits/stdc++.h>
#define int long long
using namespace std;

void solve(){
    int n,h;
    cin>>n>>h;
    std::vector<int> v(n+1);
    for(int i=1;i<=n;i++) cin>>v[i];
    sort(v.begin()+1, v.end());
    
    int res=0;
    for(int op=0;op<3;op++){ //控制什么时候喝✖️3的药水
        int tmp=h;
        int cnt=0;
        int ans=0;
        for(int i=1;i<=n;i++){
            while(tmp<=v[i]){
                if(cnt==op){
                    tmp*=3,cnt++;
                }else if(cnt<3){
                    tmp*=2,cnt++;
                }else{
                    break;
                }
            }
            if(tmp<=v[i]) break;
            else{
                tmp+=v[i]/2;
                ans++;
            }
        }
        res=max(res,ans);
    }
    cout<<res<<endl;
}

signed main() {
    int _;
    cin>>_;
    while(_--) solve();
    return 0;
}
```

