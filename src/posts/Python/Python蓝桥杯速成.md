---
title: Python蓝桥杯速成
date: 2024-02-26
category:
  - Python
  - 蓝桥杯
tag:
  - Python
  - 蓝桥杯
---
# Python蓝桥杯速成

## 基本语法
运算符：
`/`返回的是小数
`%`返回余数
`**`计算幂,如$2^3=2**3$
`//`整除 ，例如`9//2=4`



全排列：
```python
import itertools
ls=[1,2,3]
for i in itertools.permutations(ls):
    print(i)
```
结果：
(1, 2, 3)
(1, 3, 2)
(2, 1, 3)
(2, 3, 1)
(3, 1, 2)
(3, 2, 1)


## 优先队列 

有两种方式:
1. `from queue import PriorityQueue`
2. `import heapq`
区别：
1. **实现方式**:
    - `queue.PriorityQueue` 是基于堆（heap）实现的，具体来说是二叉最小堆。这意味着它使用堆数据结构来维护元素的顺序，使得最小的元素总是在队列的前面。
    - `heapq` 是一个模块，提供了对堆的基本操作，但它并不是一个完整的队列类。你可以使用 `heapq` 中的函数来操作普通的列表，将其当作优先队列来使用。
2. **接口差异**:
    - `queue.PriorityQueue` 提供了一个更高层次的接口，使用起来更加简单。它是一个类，具有队列类的一般方法，如 `put()` 和 `get()`，而这些方法会自动处理优先级。
    - `heapq` 提供的是一组函数，你需要显式地使用它们来维护堆。你可以使用 `heapq.heappush()` 将元素推入堆，使用 `heapq.heappop()` 弹出堆的最小元素，等等。
3. **线程安全性**:
    - `queue.PriorityQueue` 是线程安全的，适用于多线程环境。
    - `heapq` 不提供线程安全性，因此在多线程环境中需要额外的同步措施。
> 在一般情况下，`heapq` 模块的实现速度可能会略微快于 `queue.PriorityQueue`。这是因为 `heapq` 是基于原生的列表数据结构实现的，而 `queue.PriorityQueue` 是在 `heapq` 的基础上添加了线程安全的包装。

使用queue，对元组进行优先队列排序，默认是按第一个值进行比较，如果第一个一样，比较第二个，以此类推
```python
from queue import PriorityQueue
pq =PriorityQueue()
pq.put((1,'cxk','baba'))
pq.put((3,'cxk3','baba3'))
pq.put((2,'cxk2','baba2'))
while not pq.empty():
    a=pq.get()
    print(a)

# (1, 'cxk', 'baba')
# (2, 'cxk2', 'baba2')
# (3, 'cxk3', 'baba3')
```


