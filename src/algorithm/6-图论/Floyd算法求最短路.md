---
title: Floyd算法求最短路
date: 2023-04-11 22:43:55
category:
  - Algorithm
  - 图论
tag:
  - Algorithm
  - 图论
  - floyd
---

# Floyd算法

> 全源最短路算法，可以求任意两个点之间的最短路，是一种动态规划算法，也称为插点法

## 题目

https://www.acwing.com/problem/content/description/856/

给定一个 `n `个点` m` 条边的有向图，图中可能存在重边和自环，边权可能为负数。

再给定 `k` 个询问，每个询问包含两个整数 `x` 和 `y`，表示查询从点 `x` 到点 `y` 的最短距离，如果路径不存在，则输出 `impossible`。

数据保证图中不存在负权回路。

## 思路

Floyd算法：动态规划的思想

- 状态表示：`f[k][i][j]`表示考虑经过前`k`个点，从`i`到`j`的距离的最小值，注意：中间只经过节点编号1-k
- 状态计算：
  - 不经过k点，`f[k,i,j]=f[k-1,i,j]`
  - 经过k点，`f[k,i,j]=f[k-1,i,k]+f[k-1,k,j]`
- 状态转移方程：`f[k][i][j]=f[k-1][i][k]+f[k-1][k][j]`

空间可以优化掉一维：`f[i][j]=f[i][k]+f[k][j]`

>注意：，k必须要放在最外层，因为在计算第k层状态`f[i][j]`的时候，必须要先将k-1层的所有状态全部计算出来。

## 代码

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef long long LL;

const int N=210,INF=0x3f3f3f3f;
int d[N][N];
int n,m,t;

int main()
{
	cin>>n>>m>>t;
	memset(d,0x3f,sizeof d);
	for(int i=1;i<=n;i++) d[i][i]=0;

	while(m--)
	{
		int a,b,c;
		cin>>a>>b>>c;
		d[a][b]=min(d[a][b],c);
	}
    //floyd算法
	for(int k=1;k<=n;k++)
		for(int i=1;i<=n;i++)
			for(int j=1;j<=n;j++)
				d[i][j]=min(d[i][j],d[i][k]+d[k][j]);

	while(t--)
	{
		int x,y;
		cin>>x>>y;
		if(d[x][y]>INF/2) cout<<"impossible"<<endl;
		else cout<<d[x][y]<<endl;
	}
	return 0;

}
```
