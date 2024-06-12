---
title:  服务器脚本检测Java程序状态
date: 2024-05-16
category:
  - 服务器
tag:
  - 服务器
---

# 服务器脚本检测Java程序状态

> 需求：测试服务器上面有些Java服务会由于某些经常挂掉，我们需要写一个脚本，来检测Java程序的运行状态，如果出现了挂掉的程序，那么肯定就要想办法让他重启。

ps （英文全拼：process status）命令用于显示当前进程的状态，类似于 windows 的任务管理器。

查找指定进程格式：

```sh
ps -ef | grep 进程关键字
```

举个例子`ps -ef |grep java`：

```sh
root      5479     1  0 3月27 ?       00:36:04 java -jar -Xms256M -Xmx256m jenkins.war --httpPort=8085
```

总共有八个列，解释如下：

1. **User (用户)**：进程的所有者，这里是"root"，意味着该Java进程是以root用户的身份运行的。
2. **PID (进程ID)**：进程的唯一标识符，这里是5479。
3. **PPID (父进程ID)**：创建该进程的父进程的ID，这里是1，通常1表示init进程，它是所有其他进程的祖先。
4. **C (CPU占用百分比)**：进程在CPU上的占用百分比。由于这一列是0，意味着该进程目前没有占用CPU。
5. **STIME (启动时间)**：进程启动的时间或者日期，这里是3月27日。
6. **TTY (终端设备)**：与进程关联的终端设备，这里是一个问号，表示该进程没有与之关联的终端。
7. **TIME (CPU时间)**：该进程已经在CPU上运行的累计时间。
8. **CMD (命令)**：启动进程的命令，这里是完整的Java命令，包括了运行Jenkins的相关参数。

所以，这一行的意思是：一个以root用户身份运行的Java进程，它的进程ID是5479，在3月27日启动，没有占用CPU，它是通过运行Jenkins的命令来启动的。

使用`pgrep -f 进程名`可以直接获取到进程的id，然后杀死重启。



## 简单的重启Java进程

```sh
#!/bin/bash

# 定义Java进程名称
JAVA_PROCESS_NAME="driver-admin-service"

# 查找包含指定关键词的Java进程，并获取其进程ID
PID=$(pgrep -f driver-admin-service)
echo $PID
if [ -z "$PID" ]; then
    echo "未找到匹配的Java进程。"
    exit 1
fi

echo "找到Java进程，$JAVA_PROCESS_NAME 进程ID为: $PID"

# 杀死Java进程
echo "正在停止Java进程..."
kill -9 "$PID"
echo "Java进程已停止."

# 启动新的Java进程
echo "正在启动新的Java进程..."
nohup java -jar -Xms128M -Xmx128m driver-admin-service-0.1.0.jar --spring.profiles.active=test &
echo "Java进程$JAVA_PROCESS_NAME 已启动."
```



## 检测Java，待完成

