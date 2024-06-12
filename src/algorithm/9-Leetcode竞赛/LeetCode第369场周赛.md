---
title: LeetCode第369场周赛
date: 2023-10-29
category:
  - Algorithm
  - Leetcode
tag:
  - Algorithm
  - Leetcode
---
# LeetCode第369场周赛
## [2917. 找出数组中的 K-or 值](https://leetcode.cn/problems/find-the-k-or-of-an-array/)
给你一个下标从 **0** 开始的整数数组 `nums` 和一个整数 `k` 。
`nums` 中的 **K-or** 是一个满足以下条件的非负整数：
- 只有在 `nums` 中，至少存在 `k` 个元素的第 `i` 位值为 1 ，那么 K-or 中的第 `i` 位的值才是 1 。
返回 `nums` 的 **K-or** 值。
**注意** ：对于整数 `x` ，如果 `(2i AND x) == 2i` ，则 `x` 中的第 `i` 位值为 1 ，其中 `AND` 为按位与运算符。
### 思路

开一个数组将`nums`数组中的每个数字拆成二进制，cnt数组记录这一位上面1的个数
快速判断`x`的第`i`位是不是1:`x>>i&1`
然后再扫描一次数组，如果第i位的个数超过了k，那么结果的这一位就位1，也就是加上$2^i$,或者`|1<<i`
### 代码
```cpp
class Solution {
public:
    int findKOr(vector<int> &nums, int k) {
        vector<int> cnt(32);
        for (int x: nums) {
            for (int i = 0; i < 32; i++) {
                if (x >> i & 1) {
                    cnt[i]++;
                }
            }
        }
        int ans = 0;
        for (int i = 0; i < 32; i++) {
            if (cnt[i] >= k) {
                ans |= 1 << i;
            }
        }
        return ans;
    }
};
```


## [2918. 数组的最小相等和](https://leetcode.cn/problems/minimum-equal-sum-of-two-arrays-after-replacing-zeros/)
给你两个由正整数和 `0` 组成的数组 `nums1` 和 `nums2` 。
你必须将两个数组中的 **所有** `0` 替换为 **严格** 正整数，并且满足两个数组中所有元素的和 **相等** 。
返回 **最小** 相等和 ，如果无法使两数组相等，则返回 `-1` 。
### 思路

记录数组`nums1`的和为`s1`,0的个数为`cnt1`
数组`nums2`的和为`s2`,0的个数为`cnt2`
在最优的情况下，每个0都替换为1，即第一个数组的和为`nums1+s1`,第二个为`nums2+cnt2`
如果第一个数组的和大于第二个，并且第二个数组没出现过0，那么无解
如果第二个数组的和大于第一个，并且第一个数组没出现过0，那么无解
否则就返回他们两个的最大值，因为最后需要相等，只能是小的那个再变大。

### 代码
```cpp
class Solution {
public:
    long long minSum(vector<int> &nums1, vector<int> &nums2) {
        long long s1 = 0, s2 = 0, cnt1 = 0, cnt2 = 0;
        int n = nums1.size(), m = nums2.size();
        for (int i = 0; i < n; ++i) {
            s1 += nums1[i];
            if (nums1[i] == 0) cnt1++;
        }
        for (int i = 0; i < m; ++i) {
            s2 += nums2[i];
            if (nums2[i] == 0) cnt2++;
        }
        s1 += cnt1;
        s2 += cnt2;
        if (s1 == s2) return s1;
        if (s1 > s2) {
            if (cnt2 == 0) return -1;
            return s1;
        } else {
            if (cnt1 == 0) return -1;
            return s2;
        }
    }
};
```


## [2919. 使数组变美的最小增量运算数](https://leetcode.cn/problems/minimum-increment-operations-to-make-array-beautiful/)

给你一个下标从 **0** 开始、长度为 `n` 的整数数组 `nums` ，和一个整数 `k` 。

你可以执行下述 **递增** 运算 **任意** 次（可以是 **0** 次）：

- 从范围 `[0, n - 1]` 中选择一个下标 `i` ，并将 `nums[i]` 的值加 `1` 。

如果数组中任何长度 **大于或等于 3** 的子数组，其 **最大** 元素都大于或等于 `k` ，则认为数组是一个 **美丽数组** 。

以整数形式返回使数组变为 **美丽数组** 需要执行的 **最小** 递增运算数。

子数组是数组中的一个连续 **非空** 元素序列。

### 思路

动态规划：
状态表示：`dp[i]`表示修改第i项，使得前i项变美丽的最小次数
状态转移：`dp[i]=max(0,k-nums[i])+min(dp[i-1],dp[i-2],dp[i-3])`

### 代码

```cpp
class Solution {
public:
    long long minIncrementOperations(vector<int>& nums, int k) {
        //dp[i]表示修改第i项，使得前i项变美丽的最小次数
        int n=nums.size();
        vector<long long > dp(n);
        for(int i=0;i<n;i++){
            dp[i]=max(0,k-nums[i]); //根据定义，第i项 一定要修改
            if(i>=3) dp[i]+=min({dp[i-1],dp[i-2],dp[i-3]});
        }
        return min({dp[n-1],dp[n-2],dp[n-3]});
    }
};
```


## [2920. 收集所有金币可获得的最大积分](https://leetcode.cn/problems/maximum-points-after-collecting-coins-from-all-nodes/)

节点 `0` 处现有一棵由 `n` 个节点组成的无向树，节点编号从 `0` 到 `n - 1` 。给你一个长度为 `n - 1` 的二维 **整数** 数组 `edges` ，其中 `edges[i] = [ai, bi]` 表示在树上的节点 `ai` 和 `bi` 之间存在一条边。另给你一个下标从 **0** 开始、长度为 `n` 的数组 `coins` 和一个整数 `k` ，其中 `coins[i]` 表示节点 `i` 处的金币数量。

从根节点开始，你必须收集所有金币。要想收集节点上的金币，必须先收集该节点的祖先节点上的金币。

节点 `i` 上的金币可以用下述方法之一进行收集：

- 收集所有金币，得到共计 `coins[i] - k` 点积分。如果 `coins[i] - k` 是负数，你将会失去 `abs(coins[i] - k)` 点积分。
- 收集所有金币，得到共计 `floor(coins[i] / 2)` 点积分。如果采用这种方法，节点 `i` 子树中所有节点 `j` 的金币数 `coins[j]` 将会减少至 `floor(coins[j] / 2)` 。

返回收集 **所有** 树节点的金币之后可以获得的最大积分。

### 思路

记忆化搜索：
`dfs(u,j,fa)`
+ 表示当前节点
+ j表示用了几次第二种操作
当第二种操作次数超过14次时，贡献为0，此时没有必要再做第二种操作
选第一种贡献为：`(coins[u]>>j) -k`
第二种：`coin[u]>>(j+1)`
`>>i`表示除以$2^i$
### 代码

```cpp
class Solution {
public:
    int maximumPoints(vector<vector<int>>& edges, vector<int>& coins, int k) {
        int n=edges.size()+1;
        vector<int> e[n];
        for(auto v:edges){
            int x=v[0],y=v[1];
            e[x].push_back(y);
            e[y].push_back(x);
        }
        vector<vector<int>> dp(n,vector<int>(14,-1));
        function<int (int, int,int )> dfs = [&](int u,int j, int fa)->int {
            if(dp[u][j]!=-1) return dp[u][j]; 
            int sum1=(coins[u]>>j)-k;
            int sum2=coins[u]>>(j+1);
            for(auto v:e[u]){
                if(v==fa) continue;
                sum1+=dfs(v,j,u);
                if(j<13) sum2+=dfs(v,j+1,u);
            }
            return dp[u][j]= max(sum1,sum2);
        };
        return dfs(0,0,-1);
    }
};
```
