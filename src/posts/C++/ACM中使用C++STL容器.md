---
title: C++的STL在ACM算法竞赛中的应用
date: 2023-05-11 08:14:46
category:
  - C++
  - ACM
tag:
  - C++
  - ACM
---

# C++的STL容器在ACM算法竞赛中的应用

## 一些有用的函数

### is_sorted(a.begin(),a.end(),cmp); 

> 判断是否按照cmp中的规则排序，默认升序

用法：

```cpp
vector<int> a(10);
bool ok = is_sorted(a.begin() + 1, a.end());
cout << ok << endl;
```

### stoi 将字符串转为整数

用法：

```cpp
string s = "123";
int x = stoi(s);
cout << x << endl;
```

### to_string 将整数转为字符串

用法：

```cpp
string s = to_string(231);
cout << s << endl;	
```

### max_element 获取数组中最大的元素

用法

```cpp
int mx = *max_element(a.begin() + 1, a.end())
```

min_element同理

### accumulate 数组求和

用法,第三个参数是累加的初值

```cpp
int sum = std::accumulate(a.begin(), a.end(), 0);
```

## lower_bound 和upper_bound 函数：

1. lower_bound返回数组中第一个大于等于x的数的位置,
2. upper_bound返回数组中第一个大于x的数的位置，

用法：

```cpp
#include <bits/stdc++.h>

using namespace std;


int main() {
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif
    int n;
    cin >> n;

    //数组用法
    int a[100];
    for (int i = 0; i < n; i++) cin >> a[i];
    int t = lower_bound(a, a + n, 3) - a; //大于等于3的最小位置，从0开始
    cout << t << endl;

    int tt = upper_bound(a, a + n, 3) - a;//大于3的最小位置，从0 开始
    cout << tt << endl;


    //vector用法：
    vector<int> b(n);
    for (int i = 0; i < n; i++) b[i] = a[i];

    int x = lower_bound(b.begin(), b.end(), 3) - b.begin();//大于等于3的最小位置，从0开始
    cout << x << endl;

    int xx = std::upper_bound(b.begin(), b.end(), 3) - b.begin();//大于3的最小位置，从0 开始
    cout << xx << endl;

    reverse(a,a+n-1);
    //greater用法 必须从大到小排序
    int q= lower_bound(a,a+n,3,greater<>())-a;//小于等于3的最小位置
    cout<<q<<endl;
    int qq= upper_bound(a,a+n,3,greater<>())-a;//小于3的最大位置
    cout<<qq<<endl;
    return 0;
}
```

## vector容器













## bitest容器

用来存储$0/1$的大小不可变的容器。在头文件`<bitset>`里面

1. 创建bitset：里面全是0

```cpp
bitset<64> bs;
```

2. 运算：

```cpp
    //运算
    bitset<64> bs1, bs2;
    bs = bs1 & bs2;//1.与
    bs = bs1 | bs2;//2.或
    bs = bs1 ^ bs2;//3.异或
    bs = ~bs1;//4.取反
    bs = bs1 << 1;//5.左移
    bs = bs1 >> 1;//6.右移
```

3. 函数：

```cpp
    bitset<64> bs;
    int cnt1 = bs.count();//1.返回1的数量
    int size = bs.size();//2.返回bitset的大小
    bool ok1 = bs.any();//3.判断是否存在1
    bool ok2 = bs.none();//4.判断是否全为0
    bool ok3 = bs.all();//5.判断是否全为1
    bs.set();//6.全部置为1
    bs.reset();//7.全部置为0
    bs.flip();//8.全部取反
    bs.flip(1);//9.将第1位取反
    string res = bs.to_string();//10.转为string
    unsigned long long res1 = bs.to_ullong();//11.变为unsigned long long
    unsigned long res2 = bs.to_ulong();//12.变为unsigned long
    int pos1 = bs._Find_first();//13.返回第一个1的位置
    int pos2 = bs._Find_next(10);//14.返回10后面的第一个1的位置
```

## multiset容器

`std::multiset`是一个基于红黑树实现的容器，元素可以重复，而set不可以重复

```cpp
    multiset<int> s;
    //1.增加操作，insert返回插入的位置
    for (int i = 10; i >= 1; i--) s.insert(i);
    int pos = *s.insert(3);
    cout << "插入的位置为：" << pos << endl;

    //2.删除操作 erase返回删除的个数
    int cnt = s.erase(1); //删除所有的1
    s.erase(s.begin()); //删除第一个元素
    //    multiset<int>::iterator it = s.end(); 也可以使用auto
    auto it = s.end();
    it--;
    s.erase(it); //删除最后一个元素
    s.erase(s.begin(), s.end()); //删除区间


    //3.查找操作,找不到返回end()
    auto it1 = s.find(4); //返回第一个3的位置
    auto it2 = s.lower_bound(3); //返回第一个大于等于3的位置
    auto it3 = s.upper_bound(3); //返回第一个大于3的位置
    int pos1 = distance(s.begin(), it1);//返回迭代器的位置0开始

    //区间equal_range,返回一个pair<iterator,iterator> pair的first指向第一个3的位置，second指向第一个大于3的位置
    auto it4 = s.equal_range(3);
    auto it5 = it4.first;
    auto it6 = it4.second;
    int pos2 = distance(s.begin(), it5);
    int pos3 = distance(s.begin(), it6);
    //4.统计操作
    int cnt1 = s.count(3); //返回3的个数
```



