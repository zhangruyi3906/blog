---
title: ACM算法竞赛中在编辑器中使用输入输出样例(CPH)
date: 2023-08-10 12:19:34
category: 
  - Algorithm
  - 技巧
tag:
  - Algorithm
  - 技巧
---

# 通用方法

我们可以在编辑器中创建三个文件，一个是`main.cpp`,一个是`test.in`,一个是`test.out`分别用来写代码，输入输入数据，显示输出数据

这种方法的好处是不需要插件，在任何编辑器中都可以实现，例如Devc++,sublime,vscode,clion...

> 可以在比赛的时候使用，例如篮球杯，天梯赛。。。

以Clion为例：

![image-20230810122412590](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101224645.png)

文件结构长这样，然后使用freopen来读取文件和写入文件，加上ifndef

> ifndef 的好处就是，很多OJ有ONLINE_JUDGE ，因此你本地写了代码可以直接交，不会报错，也不用删除这一段代码
>
> ```cpp
> #ifndef ONLINE_JUDGE
>     freopen("../test.in", "r", stdin);
>     freopen("../test.out", "w", stdout);
> #endif
> ```

个人常用的模版文件如下(打codeforces比较快)：

```cpp
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

}

signed main() {
    IOS
#ifndef ONLINE_JUDGE
    freopen("../test.in", "r", stdin);
    freopen("../test.out", "w", stdout);
#endif
    int _ = 1;
    cin >> _;
    while (_--) solve();
    return 0;
}
```

> 在solve函数中写完代码可以直接交OJ，例如codeforces，Atcoder，落谷，acwing 这些都可以通过



# 编辑器插件

下面介绍的方法都和一个CPH的东西有关，可以现在浏览器中安装插件(可能需要代理)：

链接：https://chrome.google.com/webstore/detail/competitive-companion/cjnmckjndlpiamhfimnnjmnckgghkjbl

![image-20230810123235420](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101232448.png)

没代理的话就去GitHub碰运气进去吧https://github.com/jmerle/competitive-companion

![image-20230810123539787](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101235813.png)

安装完这里会显示一个加号，点击这个可以把本次比赛页面的所有题目弄到编辑器中，之后会遇到。

## Clion插件

在Clion中，推荐使用插件**AutoCp**,该插件需要保持Clion为最新版本

链接：https://pushpavel.github.io/AutoCp/guide/getting-started.html#prerequisites

![image-20230810122803895](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101228923.png)

安装完后，右侧会显示这个东西，找不到的话，可以在上面的View里面找一下：

![image-20230810124421972](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101244009.png)

然后随便找一个比赛，点CPH上面的**加号**:

![image-20230810124547364](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101245402.png)

然后回到编辑器中(由于这个比赛A题搞不下来，所以我换了一个Div2):

![image-20230810124812902](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101248951.png)

然后你就会得到这样的画面：

左边的几个题目全都帮你拉下来了，右边的样例输入输出也拉进来了，

![image-20230810124857874](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101248914.png)

写代码测试：

下面是通过的样子：

![image-20230810125431000](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101254039.png)

下面是不通过的样子,可以点进去看哪里不一样

![image-20230810125216982](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101252009.png)



如果你有自己的初始代码模版，也可以在这里添加：

![image-20230810125651374](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101256416.png)



## Vscode

搜索安装如下插件：

浏览器安装的插件在Clion里面讲过了，步骤也是一样的，

![image-20230810133823322](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101338370.png)

然后网页上面点那个加号，回到vscode就会显示让你创建文件，我把python，java之类的都删了，因为我只需要用 c++

![image-20230810134712153](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101347210.png)

然后界面就出来了，右边的submit是用来提交平台的，不过好像只有火狐浏览器有这个插件

![image-20230810134812771](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202308101348827.png)

## Sublime Text

参考https://juejin.cn/post/7177570367844646971吧

用法和上面一样
