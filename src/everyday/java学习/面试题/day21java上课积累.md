---
title: 面试积累
date: 2024-06-17
category: 
  - 面试题
tag: 
  - 面试题
---



![image-20240617092744058](https://s2.loli.net/2024/06/17/iY7pfDdBXHewoJx.png)

第4题：

两种解法：

     1. select  a.mc,a.count-b.count from (select AAA.mc,AAA.sum(sl) count from AAA) a,(select BBB.mc,BBB.sum(sl) count from BBB)b where a.mc=b.mc;
     1. select a.mc,(a.sl-sum(b.sl)) from AAA a,BBB b where a.mc=b.mc group by b.mc;



![img](https://s2.loli.net/2024/06/17/Gpfa9tAcOoix6n3.jpg)![img](https://s2.loli.net/2024/06/17/VxuYQRab379UOGI.jpg)



安卓方面涉及到的技术有：

1. java语言开发

2. 安卓软件开发包（android SDK）

3. 安卓应用程序架构

   安卓应用程序采用MVC（Model-View-Controller）、MVVM（Model=View-ViewModel）等架构模式。

4. 数据存储（SQLite数据库）

5. 网络通信

   安卓应用需要与网络进行交互，使用内置的HttpURLConnection等库进行网络请求和数据传输。

6. 多媒体支持

   安卓支持图像、视频、音频等多媒体格式

7. 后台任务和多线程处理

   支持各种后台任务

8. 