---
title: JUC并发编程
date: 2024-01-07
category:
  - Java
  - JUC并发编程
tag:
  - Java
  - JUC并发编程
---

# JUC并发编程

## JUC概述

JUC是java.util.concurrent包的简称，即Java并发编程工具包，目的是为了更好地支持高并发任务，让开发者进行多线程编程时有效减少竞争条件和死锁线程。

### 并发编程

一些基本概念：

进程与线程：

+ 进程：程序是静止的，进程实体的运行过程就是进程，是系统进行资源分配的基本单位
+ 线程：线程是属于进程的，是一个基本的 CPU 执行单元，是程序执行流的最小单元。线程是进程中的一个实体，是系统独立调度的基本单位，线程本身不拥有系统资源，只拥有一点在运行中必不可少的资源，与同属一个进程的其他线程共享进程所拥有的全部资源

并发与并行：

+ 并行：在同一时刻，有多个指令在多个 CPU 上同时执行
+ 并发：在同一时刻，有多个指令在单个 CPU 上交替执行

同步与异步：

+ 需要等待结果返回，才能继续运行就是同步
+ 不需要等待结果返回，就能继续运行就是异步

进程间通信：

+ 信号量
+ 共享存储
+ 管道通信
+ 消息队列

Java中的通信机制：volatile、等待/通知机制、join 方式、InheritableThreadLocal、MappedByteBuffer

线程状态：

```java
public enum State {
    /**
     * Thread state for a thread which has not yet started.
     */
    NEW, 新建

    /**
     * Thread state for a runnable thread.  A thread in the runnable
     * state is executing in the Java virtual machine but it may
     * be waiting for other resources from the operating system
     * such as processor.
     */
    RUNNABLE, 准备就绪

    /**
     * Thread state for a thread blocked waiting for a monitor lock.
     * A thread in the blocked state is waiting for a monitor lock
     * to enter a synchronized block/method or
     * reenter a synchronized block/method after calling
     * {@link Object#wait() Object.wait}.
     */
    BLOCKED,阻塞

    /**
     * Thread state for a waiting thread.
     * A thread is in the waiting state due to calling one of the
     * following methods:
     * <ul>
     *   <li>{@link Object#wait() Object.wait} with no timeout</li>
     *   <li>{@link #join() Thread.join} with no timeout</li>
     *   <li>{@link LockSupport#park() LockSupport.park}</li>
     * </ul>
     *
     * <p>A thread in the waiting state is waiting for another thread to
     * perform a particular action.
     *
     * For example, a thread that has called {@code Object.wait()}
     * on an object is waiting for another thread to call
     * {@code Object.notify()} or {@code Object.notifyAll()} on
     * that object. A thread that has called {@code Thread.join()}
     * is waiting for a specified thread to terminate.
     */
    WAITING,等待

    /**
     * Thread state for a waiting thread with a specified waiting time.
     * A thread is in the timed waiting state due to calling one of
     * the following methods with a specified positive waiting time:
     * <ul>
     *   <li>{@link #sleep Thread.sleep}</li>
     *   <li>{@link Object#wait(long) Object.wait} with timeout</li>
     *   <li>{@link #join(long) Thread.join} with timeout</li>
     *   <li>{@link LockSupport#parkNanos LockSupport.parkNanos}</li>
     *   <li>{@link LockSupport#parkUntil LockSupport.parkUntil}</li>
     * </ul>
     */
    TIMED_WAITING,有时限的等待

    /**
     * Thread state for a terminated thread.
     * The thread has completed execution.
     */
    TERMINATED;终止
}
```

### 线程

#### 线程创建的三种方式

第一种方式：

启动线程调用start方法，如果直接调用run，就变成普通的启动了

```java
public class ThreadDemo01 {
    public static void main(String[] args) {
        Thread myThread = new MyThread();
        myThread.start();
        for (int i = 0; i < 10; i++) {
            System.out.println(Thread.currentThread()+":"+i);
        }
    }
}

class MyThread extends Thread{
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(Thread.currentThread()+":"+i);
        }
    }
}
```

第二种方式：
```java
public class ThreadDemo02 {
    public static void main(String[] args) {
        Runnable target = new MyThread02();
        Thread thread = new Thread(target,"线程1");
        thread.start();
        thread.run();
    }
}

class MyThread02 implements Runnable{

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            //Thread.currentThread()获取当前线程
            System.out.println(Thread.currentThread().getName()+":"+i);
        }
    }
}
```

第三种方式：

```java
public class ThreadDemo03 {
    public static void main(String[] args) {
        Callable call = new MyCallable();
        FutureTask<String> task = new FutureTask<>(call);
        Thread t = new Thread(task);
        t.start();
        try {
            String s = task.get(); // 获取call方法返回的结果（正常/异常结果）
            System.out.println(s);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class MyCallable implements Callable<String> {
    @Override
    public String call() throws Exception {
        return Thread.currentThread().getName() + "->" + "Hello World";
    }
}
```

#### 线程状态的转换

+ 线程创建之后调用start()方法开始运行，当调用wait(),join(),LockSupport.lock()方法线程会进入到WAITING状态，

+ 而同样的wait(long timeout)，sleep(long),join(long),LockSupport.parkNanos(),LockSupport.parkUtil()增加了超时等待的功能，也就是调用这些方法后线程会进入TIMED_WAITING状态，

+ 当超时等待时间到达后，线程会切换到Runable的状态，

+ 另外当WAITING和TIMED _WAITING状态时可以通过Object.notify(),Object.notifyAll()方法使线程转换到Runable状态。

+ 当线程出现资源竞争时，即等待获取锁的时候，线程会进入到BLOCKED阻塞状态，当线程获取锁时，线程进入到Runable状态。

+ 线程运行结束后，线程进入到TERMINATED状态

#### 线程的基本操作

##### yield与sleep

yield作用：提出释放CPU时间片的请求。不会释放锁，线程依然处于RUNNABLE状态。

sleep作用：会让当前线程从 Running 进入 Timed Waiting 状态（阻塞），不会释放对象锁

> 所以`yield()`方法调用后线程只是暂时的将调度权让给别人，但立刻可以回到竞争线程锁的状态；而`sleep()`方法调用后线程处于阻塞状态。

##### join()函数：

等待这个进程结束

> 如果一个线程实例A执行了threadB.join(),其含义是：当前线程A会等待threadB线程终止后threadA才会继续执行。

```java
    public final synchronized void join(final long millis)
    throws InterruptedException {
        if (millis > 0) {
            if (isAlive()) {
                final long startTime = System.nanoTime();
                long delay = millis;
                do {
                    wait(delay);
                } while (isAlive() && (delay = millis -
                        TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime)) > 0);
            }
        } else if (millis == 0) {
            while (isAlive()) {
                wait(0);
            }
        } else {
            throw new IllegalArgumentException("timeout value is negative");
        }
    }
```

+ join 方法是被 synchronized 修饰的，本质上是一个对象锁，其内部的 wait 方法调用也是释放锁的，但是**释放的是当前的线程对象锁，而不是外面的锁**

```java
public class ThreadDemo04 {
    static int count = 0;

    public static void main(String[] args) throws InterruptedException {
        test1();

    }

    private static void test1() throws InterruptedException {
        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            count = 10;
        });
        thread.start();
        thread.join();
        System.out.println(count);

    }
}
```

##### interrupt打断线程

它表示了一个运行中的线程是否被其他线程进行了中断操作

```java
public class ThreadDemo05 {
    public static void main(String[] args) {
        final Thread sleepThread = new Thread() {
            @Override
            public void run() {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        };

        Thread busyThread = new Thread() {
            @Override
            public void run() {
                while (true) {

                }
            }
        };

        sleepThread.start();
        busyThread.start();
        sleepThread.interrupt();
        busyThread.interrupt();
        while (sleepThread.isInterrupted());
        System.out.println("sleepThread isInterrupted: " + sleepThread.isInterrupted());
        System.out.println("busyThread isInterrupted: " + busyThread.isInterrupted());
    }
}
```

##### 守护线程Daemon

守护线程是一种特殊的线程，它是系统的守护者，在后台默默地守护一些系统服务，比如垃圾回收线程，JIT线程就可以理解守护线程。

```java
package com.cxk.demo01;

public class ThreadDemo06 {
    public static void main(String[] args) {
        Thread daemonThread =new Thread(new Runnable() {
            @Override
            public void run() {
                while (true){
                    try {
                        System.out.println("I am alive");
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }finally {
                        System.out.println("finally block");
                    }
                }
            }
        });
        daemonThread.setDaemon(true);
        daemonThread.start();
        //确保main线程结束前能给daemonThread能够分到时间片
        try {
            Thread.sleep(800);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

    }
}
```

> 区别：
>
> 1. **户线程（User Threads）:**
>    - 用户线程是程序的主要执行线程，当主线程结束时，用户线程不会自动结束，它们会继续执行直到完成或手动中断。
>    - 如果还有任何用户线程在运行，Java虚拟机（JVM）会保持运行，不会退出。
>    - 使用`Thread`类或实现`Runnable`接口创建的线程默认是用户线程。
> 2. **守护线程（Daemon Threads）:**
>    - 守护线程是程序的辅助线程，它的存在不会阻止程序的终止。当所有用户线程执行完毕后，JVM 会自动终止守护线程并退出。
>    - 守护线程通常用于执行后台任务，例如垃圾回收、定期任务等。
>    - 使用`setDaemon(true)`方法将线程设置为守护线程，必须在启动线程之前调用此方法。

## Lock接口

### synchronized关键字

`synchronized` 是Java中用于实现同步的关键字，它可以被用于方法和代码块。主要用于解决多线程环境下的并发问题，确保共享资源的安全访问。`synchronized` 的工作原理是使用锁（monitor）。当一个线程进入 synchronized 方法或代码块时，它会尝试获取锁。如果锁已经被其他线程占用，线程就会被阻塞，直到锁被释放。一旦线程执行完 synchronized 区域的代码，它就会释放锁，其他线程可以竞争获取该锁。

卖票案例

```java
class Ticket {
    int count = 3000;

    public synchronized void sale() {
        if (count > 0) {
            System.out.println(Thread.currentThread().getName() + "卖出了第" + (count--) + "张票，还剩" + count + "张票");
        }
    }
}

public class SaleTicket {
    public static void main(String[] args) {
        Ticket ticket = new Ticket();
        new Thread(() -> {
            for (int i = 0; i < 4000; i++) {
                ticket.sale();
            }
        }, "A").start();
        new Thread(() -> {
            for (int i = 0; i < 4000; i++) {
                ticket.sale();
            }
        }, "B").start();
        new Thread(() -> {
            for (int i = 0; i < 4000; i++) {
                ticket.sale();
            }
        }, "C").start();

    }
}
```

ReentrantLock锁实现：

> `ReentrantLock` 是Java中`java.util.concurrent.locks`包下的一种可重入锁。它提供了比传统的`synchronized`关键字更灵活的锁定机制，允许对共享资源进行更细粒度的控制。以下是 `ReentrantLock` 的一些主要特点和使用方法：
>
> 1. **可重入性：** 类似于`synchronized`，`ReentrantLock` 具有可重入性，允许线程多次获取同一把锁。
>
> 2. **公平性：** 可以选择在构造 `ReentrantLock` 时指定是否使用公平锁。公平锁按照请求锁的顺序来获取锁，而非公平锁允许插队。在构造函数中，通过传入 `true` 或 `false` 来指定是否使用公平锁，默认是非公平锁。
>
>    ```java
>    ReentrantLock fairLock = new ReentrantLock(true); // 公平锁
>    ReentrantLock unfairLock = new ReentrantLock(); // 非公平锁
>    ```
>
> 3. **锁定和解锁：** 使用 `lock()` 方法获取锁，`unlock()` 方法释放锁。为了确保在使用 `lock` 后能够正确释放锁，通常会在 `finally` 块中调用 `unlock()`。
>
>    ```java
>    ReentrantLock lock = new ReentrantLock();
>    try {
>        lock.lock();
>        // 执行同步代码块
>    } finally {
>        lock.unlock();
>    }
>    ```
>
> 4. **Condition：** `ReentrantLock` 还提供了与锁关联的 `Condition` 对象，可以用于在不同线程之间进行等待和通知。
>
>    ```java
>    ReentrantLock lock = new ReentrantLock();
>    Condition condition = lock.newCondition();
>                   
>    // 在一个线程中等待
>    lock.lock();
>    try {
>        condition.await();
>    } finally {
>        lock.unlock();
>    }
>                   
>    // 在另一个线程中通知
>    lock.lock();
>    try {
>        condition.signal();
>    } finally {
>        lock.unlock();
>    }
>    ```
>
> `ReentrantLock` 的灵活性和功能强大，使得它成为处理复杂同步需求的一种有力工具。然而，需要谨慎使用，确保在锁定和解锁的过程中不会出现死锁等问题。

```java
import java.util.concurrent.locks.ReentrantLock;

class Ticket {
    int count = 3000;

    private final ReentrantLock lock = new ReentrantLock();

    public void sale() {
        lock.lock();
        try {
            if (count > 0) {
                System.out.println(Thread.currentThread().getName() + "卖出了第" + (count--) + "张票，还剩" + count + "张");
            }
        } finally {
            lock.unlock();
        }
    }
}

public class SaleTicket {
    public static void main(String[] args) {
        Ticket ticket = new Ticket();

        new Thread(() -> {
            for (int i = 0; i < 3000; i++) {
                ticket.sale();
            }
        }, "A").start();

        new Thread(() -> {
            for (int i = 0; i < 3000; i++) {
                ticket.sale();
            }
        }, "B").start();

        new Thread(() -> {
            for (int i = 0; i < 3000; i++) {
                ticket.sale();
            }
        }, "C").start();

    }
}
```

区别：

`Lock` 和 `synchronized` 都是Java中用于实现线程同步的机制，区别：

1. **可见性：**
   - `synchronized` 保证了线程的可见性。当一个线程获取到锁时，会使在该锁上进行的修改对其他线程可见。
   - `Lock` 不具备自动释放锁的特性，需要手动调用 `unlock()` 方法，因此在使用时需要更加小心，确保在合适的时机释放锁，以防止死锁等问题。
2. **可中断性：**
   - `synchronized` 不支持中断，即在获取锁的过程中，如果其他线程想要中断正在等待锁的线程，是无法直接实现的。
   - `Lock` 提供了对中断的支持，通过 `lockInterruptibly()` 方法可以响应中断。
3. **条件变量：**
   - `Lock` 提供了与锁关联的 `Condition` 对象，可以用于在不同线程之间进行等待和通知。这使得线程间的协作更加灵活。
   - `synchronized` 也可以使用 `Object` 的 `wait()`、`notify()`、`notifyAll()` 方法进行线程间的等待和通知，但这些方法必须在同步代码块或同步方法中调用。
4. **锁的公平性：**
   - `Lock` 可以选择使用公平锁或非公平锁，通过构造函数传入参数进行设置。公平锁按照请求锁的顺序获取锁，而非公平锁允许插队。
   - `synchronized` 使用的是非公平锁。
5. **灵活性：**
   - `Lock` 提供了更灵活的锁定和解锁机制，允许更细粒度的控制。
   - `synchronized` 的使用相对简单，但灵活性较差。

## 线程间通信

第一步创建资源类，在资源类创建属性和操作方法
第二步在资源类操作方法

1. 判断
2. 干活
3. 通知

第三步创建多个线程：调用资源类的操作方法

```java
class Share {
    private int number = 0;

    public synchronized void increment() throws InterruptedException {
        if (number != 0) {
            this.wait();
        }
        number++;
        System.out.println(Thread.currentThread().getName() + "=>" + number);
        this.notifyAll(); // 通知其他线程
    }

    public synchronized void decrement() throws InterruptedException {
        if (number != 1) {
            this.wait();
        }
        number--;
        System.out.println(Thread.currentThread().getName() + "=>" + number);
        this.notifyAll(); // 通知其他线程
    }
}

public class Test {
    public static void main(String[] args) {
        Share share = new Share();
        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                try {
                    share.increment();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "A").start();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                try {
                    share.decrement();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "B").start();
    }
}
```

> 虚假唤醒是指在没有调用 `notify()` 或 `notifyAll()` 的情况下，线程被唤醒。虽然在等待的过程中条件可能已经满足了，但是线程却被唤醒了，这种情况被称为虚假唤醒。
>
> 为了防止虚假唤醒，你可以将 `wait()` 方法调用放在一个循环中，并且检查等待条件是否满足。这样即使线程在没有被通知的情况下被唤醒，它也会重新检查条件并决定是否继续等待。
>
> 通过使用 `while` 循环来替换 `if` 语句，可以确保即使发生虚假唤醒，线程也会重新检查条件并决定是否继续等待。

## 线程间定制化通信

问题: A 线程打印 5 次 A，B 线程打印 10 次 B，C 线程打印 15 次 C,按照 此顺序循环 10 轮

> 1. **`await()` 方法：**
>    - `conditionA.await()`, `conditionB.await()`, 和 `conditionC.await()` 都是用来让当前线程进入等待状态，等待其他线程通过 `signal()` 或 `signalAll()` 方法来唤醒它。
>    - 在调用 `await()` 方法时，当前线程会释放锁，允许其他线程进入临界区执行。
> 2. **`signal()` 方法：**
>    - `conditionA.signal()`, `conditionB.signal()`, 和 `conditionC.signal()` 用于唤醒在对应 `Condition` 上等待的一个线程。
>    - 唤醒的线程会尝试重新获取锁，然后继续执行。

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class ShareResource {
    // 0:A 1:B 2:C
    private int flag = 0;

    private final Lock lock = new ReentrantLock();
    private Condition conditionA = lock.newCondition();
    private Condition conditionB = lock.newCondition();
    private Condition conditionC = lock.newCondition();

    public void print5(int loop) {
        lock.lock();
        try {
            // 1. 判断
            while (flag != 0) {
                conditionA.await();
            }
            // 2. 干活
            for (int i = 0; i < 5; i++) {
                System.out.println(Thread.currentThread().getName() + "\t" + i + "\t" + loop);
            }
            // 3. 通知
            flag = 1;
            conditionB.signal();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public void print10(int loop) {
        lock.lock();
        try {
            // 1. 判断
            while (flag != 1) {
                conditionB.await();
            }
            // 2. 干活
            for (int i = 0; i < 10; i++) {
                System.out.println(Thread.currentThread().getName() + "\t" + i + "\t" + loop);
            }
            // 3. 通知
            flag = 2;
            conditionC.signal();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public void print15(int loop) {
        lock.lock();
        try {
            // 1. 判断
            while (flag != 2) {
                conditionC.await();
            }
            // 2. 干活
            for (int i = 0; i < 15; i++) {
                System.out.println(Thread.currentThread().getName() + "\t" + i + "\t" + loop);
            }
            // 3. 通知
            flag = 0;
            conditionA.signal();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

}

public class Test {
    public static void main(String[] args) {
        ShareResource shareResource = new ShareResource();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                shareResource.print5(i);
            }
        }, "A").start();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                shareResource.print10(i);
            }
        }, "B").start();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                shareResource.print15(i);
            }
        }, "C").start();

    }
}
```

## 集合的线程安全

#### ArrayList线程不安全演示

```java
public class Test {
    public static void main(String[] args) {
        //List集合线程不安全
        List<String> list = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            new Thread(() -> {
                list.add(Thread.currentThread().getName());
                System.out.println(list);
            }, String.valueOf(i)).start();
        }
    }
}
```

运行结果：

![image-20240217161832061](https://s2.loli.net/2024/02/17/6rGhvnx4QpSNYwf.webp)

原因：源码里面没有加锁

##### 解决方案Vector

```java
public synchronized boolean add(E e) {
    modCount++;
    add(e, elementData, elementCount);
    return true;
}
```

只需要把上面的ArrayList换成Vector即可，因为Vector的源码里面加了synchronized关键字

##### 解决方案Collections

```java
List<String> list = Collections.synchronizedList(new ArrayList<>());
```

##### 解决方案CopyOnWriteArrayList

```java
List<String> list = new CopyOnWriteArrayList<>();
```

`CopyOnWriteArrayList` 是 Java 中并发编程中的一种线程安全的容器，它是 `ArrayList` 的一个线程安全的变体。与 `ArrayList` 不同的是，`CopyOnWriteArrayList` 的读操作是非常高效的，因为它不需要加锁，而写操作是通过复制底层数组来实现的，因此写操作的性能会比较低。

特点：

1. **线程安全：** `CopyOnWriteArrayList` 是线程安全的，多个线程可以同时读取其中的元素而不会发生并发修改异常（`ConcurrentModificationException`）。
2. **写操作的复制机制：** 当执行写操作（如添加、修改、删除元素）时，`CopyOnWriteArrayList` 会先复制一份原数组，然后在副本上执行写操作，最后将副本替换原数组。这样可以确保写操作不会影响到正在进行的读操作，从而保证线程安全。
3. **适用于读操作频繁、写操作相对较少的场景：** 由于写操作需要复制整个数组，因此写操作的性能相对较低。但是在读操作频繁、写操作较少的场景下，`CopyOnWriteArrayList` 的性能优势会体现出来。
4. **迭代器弱一致性：** `CopyOnWriteArrayList` 的迭代器是弱一致性的，即迭代器遍历的是创建迭代器时的快照。这意味着在迭代期间对集合的修改不会被迭代器所感知，但是在迭代器创建之后的修改会被迭代器感知。
5. **内存占用较高：** 由于写操作会复制整个数组，因此 `CopyOnWriteArrayList` 的内存占用会比较高。

源码如下：

```java
public boolean add(E e) {
    synchronized (lock) {
        Object[] es = getArray();
        int len = es.length;
        es = Arrays.copyOf(es, len + 1);
        es[len] = e;
        setArray(es);
        return true;
    }
}
```

#### HashSet线程不安全

```java
//HashSet 线程不安全
Set<Integer> set = new HashSet<>();
for (int i = 0; i < 30; i++) {
    new Thread(() -> {
        set.add(new Random().nextInt(100));
        System.out.println(set);
    }, String.valueOf(i)).start();
}
```

解决办法：CopyOnWriteArraySet

#### HashMap线程不安全

```java
public static void main(String[] args) {
    //HashMap 线程不安全
    Map<String, String> map = new HashMap<>();
    for (int i = 0; i < 30; i++) {
        new Thread(() -> {
            map.put(UUID.randomUUID().toString().substring(0, 5), "value");
            System.out.println(map);
        }, String.valueOf(i)).start();
    }
}
```

解决办法：ConcurrentHashMap

## 多线程锁

具体表现为以下 3 种形式。

+ 对于普通同步方法，锁是当前实例对象。
+ 对于静态同步方法，锁是当前类的 Class 对象。
+ 对于同步方法块，锁是 Synchonized 括号里配置的对象

### 公平锁和非公平锁

1. **公平锁（Fair Lock）：**

   - 公平锁是一种保证线程获取锁的顺序按照线程请求的顺序来的锁。即，先来先得的原则。
   - 在公平锁中，当有多个线程等待一个锁时，锁将按照请求的顺序分配给这些线程。这种方式可以防止某些线程长时间等待而不被公平地获得锁，避免饥饿问题。
   - Java中的 `ReentrantLock` 可以通过构造函数的参数来指定是公平锁还是非公平锁，默认是非公平锁。

   ```java
   ReentrantLock fairLock = new ReentrantLock(true); // 公平锁
   ```

2. **非公平锁（Non-Fair Lock）：**

   - 非公平锁是一种不保证线程获取锁的顺序的锁。线程获取锁是基于竞争的，谁先抢到锁就由谁获得。
   - 在非公平锁中，新来的线程有可能在等待队列中插队，直接获取锁，而不考虑之前等待的线程。
   - 非公平锁的优点是相对于公平锁，它的吞吐量更高，性能更好，因为不会导致线程频繁地切换和竞争。
   - Java中的 `ReentrantLock` 默认就是非公平锁。

   ```java
   ReentrantLock nonFairLock = new ReentrantLock(); // 非公平锁
   ```

如果对线程获取锁的顺序有特定的要求，且希望避免饥饿问题，可以使用公平锁。

如果追求更好的性能，允许新来的线程插队，可以使用非公平锁。

### 可重入锁

可重入锁是指同一个线程在持有锁的情况下，能够多次获取同一个锁，而不会被阻塞。在Java中，`ReentrantLock` 和 `synchronized` 关键字都是可重入锁的实现。

synchronized隐式实现

```java
public static void main(String[] args) {
    Object object = new Object();
    new Thread(() -> {
        synchronized (object) {
            System.out.println(Thread.currentThread().getName()+"外层");
            synchronized (object) {
                System.out.println(Thread.currentThread().getName()+"中层");
                synchronized (object) {
                    System.out.println(Thread.currentThread().getName()+"内层");
                }
            }
        }
    }).start();
}
```

可以多次进入

Lock显示实现

```java
Lock lock =new ReentrantLock();
new Thread(() -> {
    try {
        lock.lock();
        System.out.println("外层");
        try {
            lock.lock();
            System.out.println("内层");
        } finally {
            lock.unlock();
        }
    } finally {
        lock.unlock();
    }
}).start();
```

注意上锁之后必须要解锁

### 死锁

死锁是多线程编程中常见的问题，它发生在两个或多个线程互相等待对方释放资源而无法继续执行的情况。简而言之，死锁是一种状态，其中每个线程都在等待其他线程释放锁。

死锁场景包括以下四个必要条件：

1. **互斥条件（Mutual Exclusion）：** 至少有一个资源必须处于非共享模式，即一次只能由一个线程使用。如果另一个线程请求该资源，它必须等待，直到占有资源的线程释放它。
2. **占有并等待条件（Hold and Wait）：** 一个线程持有至少一个资源，并且正在等待获取其他线程持有的资源。
3. **非抢占条件（No Preemption）：** 线程不能强制占有其他线程已经持有的资源，只能等待，直到资源被释放。
4. **循环等待条件（Circular Wait）：** 一组线程互相等待彼此持有的资源，形成一个循环。

```java
import java.util.concurrent.TimeUnit;

public class Test {
    static Object a = new Object();
    static Object b = new Object();

    public static void main(String[] args) {
        //死锁
        new Thread(() -> {
            synchronized (a) {
                System.out.println(Thread.currentThread().getName() + " 获取b锁");
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                synchronized (b) {
                    System.out.println(Thread.currentThread().getName() + " 持有锁b，想要获取锁a");
                }
            }
        }, "A").start();

        new Thread(() -> {
            synchronized (b) {
                System.out.println(Thread.currentThread().getName() + " 获取a锁");
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                synchronized (a) {
                    System.out.println(Thread.currentThread().getName() + " 持有锁a，想要获取锁b");
                }
            }
        }, "B").start();
    }
}
```

验证是否死锁：

使用`jps -l`命令

![image-20240217172137429](https://s2.loli.net/2024/02/17/GOzqPvnr572fHgD.webp)

接着使用命令`jstack 84118` 84118是Test程序

![image-20240217172232383](https://s2.loli.net/2024/02/17/1qzLZhogfGN2BTS.webp)

可以发现死锁





## Callable接口

使用FutureTask

> 主要作用：
>
> 1. **异步计算：** `FutureTask` 可以接受一个 `Callable` 对象作为参数，在构造时传入，也可以接受一个 `Runnable` 对象。
> 2. **获取计算结果：** 可以通过 `get()` 方法来获取计算的结果。如果计算尚未完成，`get()` 方法会阻塞当前线程，直到计算完成并返回结果。
> 3. **取消任务：** 可以调用 `cancel()` 方法来取消任务的执行。任务只有在尚未开始执行时才能被取消，或者在某些情况下可以被中断。
> 4. **判断任务状态：** 可以通过 `isDone()`、`isCancelled()` 方法来判断任务的执行状态。

 ```java
 public static void main(String[] args) throws ExecutionException, InterruptedException {
     System.out.println("main .... start ....");
     FutureTask<Integer> task = new FutureTask<>(new Callable01());
     new Thread(task, "A").start();
     Integer i = task.get();
     //get会阻塞，直到线程执行完毕
     System.out.println("i = " + i);
     System.out.println("main .... end ....");
 }
 
 public static class Callable01 implements Callable<Integer> {
 
     @Override
     public Integer call() throws Exception {
         System.out.println("当前线程:" + Thread.currentThread().getId());
         int i = 10 / 2;
         System.out.println("i = " + i);
         return i;
     }
 }
 ```

## JUC强大的辅助类

### 减少计数CountDownLatch

```java
public class Test {
    public static void main(String[] args) {
        //6个同学离开教室后，班长才可以离开教室
        for (int i = 0; i < 6; i++) {
            new Thread(()->{
                System.out.println(Thread.currentThread().getName() + "离开了教室");
            },String.valueOf(i)).start();
        }
        System.out.println(Thread.currentThread().getName() + "班长离开了教室");
    }
}
```

这样会存在问题：

![image-20240218091818229](https://s2.loli.net/2024/02/18/NW8DZTpMcg4lzx7.webp)

使用CountDownLatch

```java
public static void main(String[] args) throws InterruptedException {
    //6个同学离开教室后，班长才可以离开教室
    CountDownLatch countDownLatch = new CountDownLatch(6);
    for (int i = 0; i < 6; i++) {
        new Thread(()->{
            System.out.println(Thread.currentThread().getName() + "离开了教室");
            countDownLatch.countDown();
        },String.valueOf(i)).start();
    }
    //等待
    countDownLatch.await();
    System.out.println(Thread.currentThread().getName() + "班长离开了教室");
}
```



#### 循环栅栏CyclicBarrier

> CyclicBarrier` 是 Java 中用于同步线程的工具类之一，它可以让一组线程达到一个同步点，然后再同时开始执行。`CyclicBarrier` 的特点是可以循环使用，即当所有线程都到达同步点后，可以重新开始新一轮的同步。
>
> 1. **同步点：** `CyclicBarrier` 设定一个同步点，所有参与的线程必须到达这个点才能继续执行。
> 2. **循环使用：** 与 `CountDownLatch` 不同，`CyclicBarrier` 可以重用。一旦所有线程到达同步点，它会自动重置，可以用于下一轮同步。
> 3. **构造方法：**
>    - `CyclicBarrier(int parties)`：构造一个 `CyclicBarrier`，指定参与同步的线程数量。
>    - `CyclicBarrier(int parties, Runnable barrierAction)`：构造一个 `CyclicBarrier`，除了指定参与同步的线程数量外，还可以在所有线程到达同步点时执行一个指定的`Runnable`。
> 4. **等待线程到达同步点：** `await()` 方法用于让线程等待其他线程到达同步点。
>    - 当线程调用 `await()` 方法时，它就会被阻塞，等待其他线程到达同步点。
>    - 当所有参与的线程都调用了 `await()` 方法后，它们就会被释放，继续执行。

模拟等7个人召唤神龙

```java
public class Test {
    static final int COUNT = 7;

    public static void main(String[] args) throws InterruptedException {
        CyclicBarrier barrier = new CyclicBarrier(COUNT, () -> {
            System.out.println("召唤神龙");
        });

        // 7个线程，每个线程代表一个球员
        for (int i = 0; i < 7; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "号球员已经就位");
                try {
                    barrier.await();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }, String.valueOf(i)).start();
        }
    }
}
```

### 信号灯Semaphore

> `Semaphore` 是 Java 中用于控制并发线程数量的工具类，它可以控制同时访问某个特定资源的线程数量。`Semaphore` 维护了一定数量的许可证（permits），线程在访问资源前必须先获得许可证，每个 `acquire()` 操作会消耗一个许可证，而每个 `release()` 操作会释放一个许可证。
>
> 1. **许可证数量：** `Semaphore` 维护了一定数量的许可证，可以通过构造函数来指定初始的许可证数量。
> 2. **获取许可证：** `acquire()` 方法用于获取许可证，如果有可用的许可证则立即返回，否则阻塞线程等待，直到有许可证可用。
> 3. **释放许可证：** `release()` 方法用于释放许可证，增加许可证的数量。释放后，如果有等待的线程，它们中的一个将会获得许可证。

6辆汽车，3个停车位

```java
public static void main(String[] args) {
    Semaphore semaphore = new Semaphore(3);
    for (int i = 0; i < 6; i++) {
        new Thread(() -> {
            try {
                semaphore.acquire(); // 抢占
                System.out.println(Thread.currentThread().getName() + "--->抢到了车位");
                Thread.sleep(1000);
                System.out.println(Thread.currentThread().getName() + "<---离开了车位");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                semaphore.release(); // 释放
            }
        }, String.valueOf(i)).start();
    }
}
```

## ReentrantReadWriteLock读写锁

几种常见的锁：

1. **乐观锁（Optimistic Locking）：**
   - 乐观锁是一种基于数据版本控制的锁机制。在乐观锁的思想中，假设并发访问的情况是比较少见的，因此在读取数据时不加锁，而是在更新数据时检查数据的版本号或其他标识，确保在更新时数据没有被其他线程修改。如果数据被修改，更新操作将失败，需要重新尝试。
2. **悲观锁（Pessimistic Locking）：**
   - 悲观锁是一种悲观地认为并发访问是普遍存在的，因此在读取数据时就会加锁，防止其他线程同时访问相同的数据。悲观锁常常使用数据库的行锁来实现，以确保在事务中对数据的读写操作是串行的。
3. **表锁（Table Lock）：**
   - 表锁是在数据库表级别上加锁，即当一个事务对表进行操作时，其他事务不能同时对该表进行操作。表锁的粒度较大，可能会导致并发性能下降，因为多个事务可能需要等待同一表的锁。
4. **行锁（Row Lock）：**
   - 行锁是在数据库表的行级别上加锁，即锁定表中的某一行数据。行锁的粒度较小，允许多个事务同时操作同一表的不同行，提高了并发性。但是，行锁也可能导致死锁等问题，需要谨慎使用。

测试，不加锁

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

class MyCache {
    private volatile Map<String, Object> map = new HashMap<>();

    public void put(String key, Object value) throws InterruptedException {
        System.out.println(Thread.currentThread().getName() + "写入" + key);
        TimeUnit.MICROSECONDS.sleep(300);
        map.put(key, value);
        System.out.println(Thread.currentThread().getName() + "写入完成");
    }

    public void get(String key) throws InterruptedException {
        System.out.println(Thread.currentThread().getName() + "读取" + key);
        TimeUnit.MICROSECONDS.sleep(300);
        Object result = map.get(key);
        System.out.println(Thread.currentThread().getName() + "读取完成" + result);
    }
}

public class Test {
    public static void main(String[] args) {
        MyCache myCache = new MyCache();

        for (int i = 0; i < 5; i++) {
            final int tempInt = i;
            new Thread(() -> {
                try {
                    myCache.put(tempInt + "", tempInt + "");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }, "Thread" + i).start();
        }

        for (int i = 0; i < 5; i++) {
            final int tempInt = i;
            new Thread(() -> {
                try {
                    myCache.get(tempInt + "");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }, "Thread" + i).start();
        }
    }
}
```

此时读写会有问题：

![image-20240218101729220](https://s2.loli.net/2024/02/18/bUCOAwhcJkXT74K.webp)

修改后代码：

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

class MyCache {
    private volatile Map<String, Object> map = new HashMap<>();
    private ReadWriteLock rwLock = new ReentrantReadWriteLock();

    public void put(String key, Object value) {
        rwLock.writeLock().lock(); // 加锁
        System.out.println(Thread.currentThread().getName() + "写入" + key);
        try {
            TimeUnit.MICROSECONDS.sleep(300);
            map.put(key, value);
            System.out.println(Thread.currentThread().getName() + "写入完成");
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            rwLock.writeLock().unlock(); // 释放锁
        }
    }

    public void get(String key) {
        rwLock.writeLock().lock(); // 加锁
        System.out.println(Thread.currentThread().getName() + "读取" + key);
        try {
            TimeUnit.MICROSECONDS.sleep(300);
            Object result = map.get(key);
            System.out.println(Thread.currentThread().getName() + "读取完成" + result);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            rwLock.writeLock().unlock(); // 释放锁
        }

    }
}

public class Test {
    public static void main(String[] args) {
        MyCache myCache = new MyCache();

        for (int i = 0; i < 5; i++) {
            final int tempInt = i;
            new Thread(() -> {
                myCache.put(tempInt + "", tempInt + "");
            }, "Thread" + i).start();
        }

        for (int i = 0; i < 5; i++) {
            final int tempInt = i;
            new Thread(() -> {
                myCache.get(tempInt + "");
            }, "Thread" + i).start();
        }
    }
}
```

### 锁降级

写锁可以降级为读锁，反之不行

```java
public static void main(String[] args) {
    ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    ReentrantReadWriteLock.ReadLock readLock = lock.readLock();
    ReentrantReadWriteLock.WriteLock writeLock = lock.writeLock();

    //锁降级
    writeLock.lock();
    System.out.println("writeLock");
    //降级为读锁
    readLock.lock();
    System.out.println("readLock");
    writeLock.unlock();
    System.out.println("writeLock unlock");
    readLock.unlock();
    System.out.println("readLock unlock");
}
```

## BlockingQueue阻塞队列

阻塞队列：

1. **阻塞操作：** `BlockingQueue` 支持阻塞操作，即当队列为空时，消费者线程试图从队列中获取元素时会被阻塞，直到有元素可用；当队列已满时，生产者线程试图往队列中添加元素时会被阻塞，直到队列有空间。
2. **线程安全：** `BlockingQueue` 的实现是线程安全的，可以在多线程环境下安全地进行数据传递。
3. **常见实现：**
   - `LinkedBlockingQueue`：基于链表的阻塞队列，可以设置容量，当达到容量限制时，会阻塞等待。
   - `ArrayBlockingQueue`：基于数组的阻塞队列，需要指定容量，当达到容量限制时，会阻塞等待。
   - `PriorityBlockingQueue`：无界阻塞队列，元素按照优先级顺序出队，实现了 `Comparable` 接口或使用构造函数指定的 `Comparator`。
   - `DelayQueue`：延迟阻塞队列，元素只有在其指定的延迟时间过后才能出队。
   - 等等。
4. **阻塞方法：**
   - `put(E e)`：将元素添加到队列，如果队列已满，则阻塞等待空间。
   - `take()`：从队列中取出元素，如果队列为空，则阻塞等待元素可用。
5. **超时操作：** 除了阻塞方法外，`BlockingQueue` 还提供了带有超时参数的方法，例如 `offer(E e, long timeout, TimeUnit unit)` 和 `poll(long timeout, TimeUnit unit)`，允许在一定的时间内阻塞等待或者返回特定值。

阻塞队列演示

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

public class Test {
    public static void main(String[] args) {
        BlockingQueue<String> blockingQueue = new ArrayBlockingQueue<>(2);

        //第一组 add remove element 会抛出异常
        System.out.println(blockingQueue.add("a"));
        System.out.println(blockingQueue.add("b"));
        //System.out.println(blockingQueue.add("c")); //java.lang.IllegalStateException: Queue full

        System.out.println(blockingQueue.element()); //a
        System.out.println(blockingQueue.remove()); //a
        System.out.println(blockingQueue.remove()); //b
        //System.out.println(blockingQueue.remove()); //java.util.NoSuchElementException

        //第二组 offer poll peek 不会抛出异常
        System.out.println(blockingQueue.offer("a")); //true
        System.out.println(blockingQueue.offer("b")); //true
        System.out.println(blockingQueue.offer("c")); //false

        System.out.println(blockingQueue.peek()); //a
        System.out.println(blockingQueue.poll()); //a
        System.out.println(blockingQueue.poll()); //b
        System.out.println(blockingQueue.poll()); //null

        //第三组 put take 不会抛出异常
        try {
            blockingQueue.put("a");
            blockingQueue.put("b");
            //blockingQueue.put("c"); //阻塞
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        try {
            System.out.println(blockingQueue.take()); //a
            System.out.println(blockingQueue.take()); //b
            //System.out.println(blockingQueue.take()); //阻塞
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //第四组 offer poll peek 可以设置超时时间
        try {
            blockingQueue.offer("a", 2, TimeUnit.SECONDS);
            blockingQueue.offer("b", 2, TimeUnit.SECONDS);
            //blockingQueue.offer("c", 2, TimeUnit.SECONDS); //超时
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        try {
            System.out.println(blockingQueue.poll(2, TimeUnit.SECONDS)); //a
            System.out.println(blockingQueue.poll(2, TimeUnit.SECONDS)); //b
            //System.out.println(blockingQueue.poll(2, TimeUnit.SECONDS)); //超时
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

## ThreadPool线程池

### 线程池概述

线程池是一种管理和复用线程的机制，它可以在应用程序中创建和维护线程，以便更有效地处理并发任务。线程池的主要目标是降低线程创建和销毁的开销，并提高系统的性能、稳定性以及资源的利用率。

1. **程池组成：**
   - **工作队列（Work Queue）：** 存储等待执行的任务。
   - **线程池管理器（Thread Pool Manager）：** 负责创建、管理和销毁线程。
2. **优势：**
   - **降低线程创建销毁的开销：** 线程的创建和销毁是相对昂贵的操作。通过线程池，可以事先创建一定数量的线程，并在任务到达时重复使用这些线程，减少创建和销毁线程的开销。
   - **提高系统性能：** 线程池可以根据系统的负载情况动态地调整线程数量，使得系统更好地适应工作负载，提高整体性能。
   - **提高稳定性：** 由于线程池对线程的创建和销毁进行了管理，可以防止因为大量的线程创建导致系统资源不足而崩溃。
   - **更好地控制资源：** 可以限制线程的数量，避免系统因为过多线程而耗尽资源，如内存。
3. **Java 中的线程池：**
   - Java 提供了 `Executor` 框架和 `ExecutorService` 接口，以及其实现类 `ThreadPoolExecutor` 和 `ScheduledThreadPoolExecutor`，用于方便地创建和管理线程池。
4. **线程池的创建：**
   - 可以使用 `Executors` 工厂类的静态方法创建不同类型的线程池，如 `newFixedThreadPool`、`newCachedThreadPool`、`newSingleThreadExecutor` 等。
5. **线程池的生命周期：**
   - 线程池的生命周期包括：创建、运行、关闭。在创建线程池后，它会一直运行，处理任务，直到显式调用关闭方法为止。

### 线程池创建

线程池构造器：

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler)
```

> 1. `corePoolSize`（核心线程数）:
>    - 描述：线程池中始终保持存活的线程数，即使它们处于空闲状态。
> 2. `maximumPoolSize`（最大线程数）:
>    - 描述：线程池中允许存在的最大线程数。
> 3. `keepAliveTime`（线程空闲时间）:
>    - 描述：当线程池中的线程数超过核心线程数时，多余的空闲线程在被终止之前等待新任务的最长时间。
> 4. `unit`（时间单位）:
>    - 描述：用于指定 keepAliveTime 的时间单位，可以是秒、毫秒等。
> 5. `workQueue`（工作队列）:
>    - 描述：用于保存等待执行的任务的阻塞队列。类型：BlockingQueue`<Runnable>`。
> 6. `threadFactory`（线程工厂）:
>    - 描述：用于创建新线程的工厂。类型：ThreadFactory 接口的实现。
> 7. `handler`（拒绝策略）:
>    - 描述：当工作队列已满，并且无法再接受新任务时，用于处理新任务的策略。类型：RejectedExecutionHandler 接口的实现。

面试题：一个线程池 core 7； max 20 ，queue：50，100 并发进来怎么分配的；

答案：先有 7 个能直接得到执行，接下来 50 个进入队列排队，在多开 13 个继续执行。现在70 个被安排上了。剩下 30 个默认拒绝策略。

常见线程池：

1. **FixedThreadPool (固定大小线程池):**
   - `FixedThreadPool` 是一个具有固定线程数量的线程池。
   - 在执行任务时，如果线程池中的线程都在执行任务，新任务会被放入队列中等待。
   - 适用于并发任务数量可控的场景。
2. **CachedThreadPool (缓存线程池):**
   - `CachedThreadPool` 是一个可根据需要创建新线程的线程池，线程池的大小可动态调整。
   - 在执行任务时，如果线程池中的线程都在执行任务，会创建新的线程来处理新任务。
   - 适用于短生命周期的异步任务。
3. **SingleThreadExecutor (单线程线程池):**
   - `SingleThreadExecutor` 是一个仅包含一个线程的线程池。
   - 所有提交的任务都按顺序执行，保证不会有并发执行的情况。
   - 适用于需要保证任务按照顺序执行的场景。
4. **ScheduledThreadPool (定时任务线程池):**
   - `ScheduledThreadPool` 是一个支持定时以及周期性执行任务的线程池。
   - 可以用于执行定时任务，例如定时执行任务、周期性执行任务等。
   - 适用于需要按照一定规律执行任务的场景。

这些线程池实现都是通过 `Executors` 工厂类创建的，提供了方便的线程池创建和管理方式。

实际使用中：

> 【强制】线程池不允许使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式，这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险。
> 说明： Executors 返回的线程池对象的弊端如下：
> 1） FixedThreadPool 和 SingleThreadPool ：
> 允许的请求队列的长度可能会堆积大量的请求，从而导致 OOM。
> 2） CachedThreadPool ：
> 允许的创建线程数量为 Integer.MAX_VALUE，可能会创建大量的线程，从而导致 OOM。

### 自定义线程池

```java
ExecutorService executor = new ThreadPoolExecutor(
        2,
        5,
        1L,
        TimeUnit.SECONDS,
        new ArrayBlockingQueue<>(3),
        Executors.defaultThreadFactory(),
        new ThreadPoolExecutor.AbortPolicy()
);
```

## Fork/Join分支合并框架

Fork/Join（分支合并）框架是 Java 并发包中用于并行计算的框架。它通过递归地将任务拆分成更小的子任务，并在最后将子任务的结果进行合并，从而实现任务的并行执行。Fork/Join 框架最适用于可以被递归地拆分成独立子任务的问题。

主要包括以下几个核心组件：

1. **ForkJoinPool（分支合并池）：** 是 Fork/Join 框架的核心，负责管理工作线程的执行和任务的提交。它是一个特殊类型的 ExecutorService。
2. **ForkJoinTask（分支合并任务）：** 用于表示可以由 Fork/Join 池执行的任务。`RecursiveTask` 和 `RecursiveAction` 是 ForkJoinTask 的两个子类。
   - `RecursiveTask<V>`：表示一个有返回值的任务，执行结果的类型是 `V`。
   - `RecursiveAction`：表示没有返回值的任务。
3. **RecursiveTask：** 递归任务，用于有返回值的任务。继承 `RecursiveTask` 需要实现 `compute` 方法。
4. **RecursiveAction：** 递归操作，用于没有返回值的任务。同样，继承 `RecursiveAction` 需要实现 `compute` 方法。

Fork/Join 框架的基本流程如下：

1. **任务拆分：** 将一个大任务拆分成多个小任务，如果任务足够小，则直接执行，否则继续拆分。
2. **任务执行：** 将小任务提交给 Fork/Join 池执行，池中的线程会并行地执行这些任务。
3. **结果合并：** 将小任务的执行结果合并成大任务的结果。

```java
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;
import java.util.concurrent.RecursiveTask;

class MyTask extends RecursiveTask<Integer> {

    //拆分差值不能超过10
    private static final Integer VALUE = 10;
    private int begin;
    private int end;
    private int result;

    public MyTask(int begin, int end) {
        this.begin = begin;
        this.end = end;
    }

    @Override
    protected Integer compute() {
        if ((end - begin) <= VALUE) {
            for (int i = begin; i <= end; i++) {
                result = result + i;
            }
        } else {
            int middle = (begin + end) / 2;
            MyTask task1 = new MyTask(begin, middle);
            MyTask task2 = new MyTask(middle + 1, end);
            task1.fork();
            task2.fork();
            result = task1.join() + task2.join();
        }
        return result;
    }
}

public class Test {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        MyTask myTask = new MyTask(0, 100);
        ForkJoinPool forkJoinPool = new ForkJoinPool();
        ForkJoinTask<Integer> forkJoinTask = forkJoinPool.submit(myTask);
        Integer result = forkJoinTask.get();
        System.out.println(result);
        forkJoinPool.shutdown();
    }
}
```

## CompletableFuture异步回调

#### 创建异步对象

```java
public static CompletableFuture<Void> runAsync(Runnable runnable) 
public static CompletableFuture<Void> runAsync(Runnable runnable,Executor executor)
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier,Executor executor)
```

runAsync没有返回值，supply有返回值

runAsync

```java
public static ExecutorService service = Executors.newFixedThreadPool(10);

public static void main(String[] args) throws ExecutionException, InterruptedException {
    System.out.println("start ...");
    CompletableFuture<Void> future =CompletableFuture.runAsync(()->{
        System.out.println("当前线程:" + Thread.currentThread().getId());
        int i = 10 / 2;
        System.out.println("i = " + i);
    },service);
    System.out.println("end ...");
}
```

supplyAsync

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
    System.out.println("start ...");
    CompletableFuture<Integer> integerCompletableFuture = CompletableFuture.supplyAsync(() -> {
        System.out.println("当前线程:" + Thread.currentThread().getId());
        int i = 10 / 2;
        System.out.println("i = " + i);
        return i;
    }, service);
    Integer i = integerCompletableFuture.get();
    System.out.println("i = " + i);
    System.out.println("end2 ...");
}
```

#### 完成时回调

whenComplete回调

```java
public static ExecutorService service = Executors.newFixedThreadPool(10);

public static void main(String[] args) throws ExecutionException, InterruptedException {
    System.out.println("start ...");
    CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
        System.out.println("current thread: " + Thread.currentThread().getName());
        return 10 / 2;
    }, service).whenComplete((result, e) -> {
        System.out.println("current thread: " + Thread.currentThread().getName());
        if (e == null) {
            System.out.println("result: " + result);
        } else {
            System.out.println("exception: " + e);
        }
    }).exceptionally(e -> {
        System.out.println("exception: " + e);
        return 0;
    });
    Integer i = future.get();
    System.out.println("result2: " + i);
    System.out.println("end ...");
}
```

后续处理handle：

```java
public static ExecutorService service = Executors.newFixedThreadPool(10);

public static void main(String[] args) throws ExecutionException, InterruptedException {
    System.out.println("start ...");
    CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {
        System.out.println("current thread: " + Thread.currentThread().getName());
        return 10 / 2;
    }, service).handle((res, thr) -> {
        System.out.println("current thread: " + Thread.currentThread().getName());
        return res * 2;
    });
    Integer i = future.get();
    System.out.println("result2: " + i);
    System.out.println("end ...");
}
```

总结：

```java
public CompletableFuture<T> whenComplete(
    BiConsumer<? super T, ? super Throwable> action) {
    return uniWhenCompleteStage(null, action);
}

public CompletableFuture<T> whenCompleteAsync(
    BiConsumer<? super T, ? super Throwable> action) {
    return uniWhenCompleteStage(defaultExecutor(), action);
}

public CompletableFuture<T> whenCompleteAsync(
    BiConsumer<? super T, ? super Throwable> action, Executor executor) {
    return uniWhenCompleteStage(screenExecutor(executor), action);
}

public CompletableFuture<T> exceptionally(
    Function<Throwable, ? extends T> fn) {
    return uniExceptionallyStage(null, fn);
}
```

whenComplete 处理正常和异常的结果，exceptionally 处理异常情况。

whenComplete：是执行当前任务的线程执行继续执行 whenComplete 的任务。

whenCompleteAsync：是执行把 whenCompleteAsync 这个任务继续提交给线程池来进行执行

handle:和 complete 一样，可对结果做最后的处理（可处理异常），可改变返回值。

#### 线程串行化方法

```java
    public <U> CompletableFuture<U> thenApply(
        Function<? super T,? extends U> fn) {
        return uniApplyStage(null, fn);
    }

    public <U> CompletableFuture<U> thenApplyAsync(
        Function<? super T,? extends U> fn) {
        return uniApplyStage(defaultExecutor(), fn);
    }

    public <U> CompletableFuture<U> thenApplyAsync(
        Function<? super T,? extends U> fn, Executor executor) {
        return uniApplyStage(screenExecutor(executor), fn);
    }

```

> - `thenApply`: 这个方法表示当当前的CompletableFuture完成时，将执行提供的函数，并返回一个新的CompletableFuture，其结果是应用该函数的结果。
> - `thenApplyAsync`: 这是异步版本的`thenApply`，它使用默认的Executor执行器执行提供的函数。
> - `thenApplyAsync`（带有Executor参数）: 这是具有自定义Executor执行器的异步版本，允许你指定一个特定的执行器来执行提供的函数。

```java
public CompletableFuture<Void> thenAccept(Consumer<? super T> action) {
    return uniAcceptStage(null, action);
}

public CompletableFuture<Void> thenAcceptAsync(Consumer<? super T> action) {
    return uniAcceptStage(defaultExecutor(), action);
}

public CompletableFuture<Void> thenAcceptAsync(Consumer<? super T> action,
                                               Executor executor) {
    return uniAcceptStage(screenExecutor(executor), action);
}
```

> - `thenAccept`: 当当前的CompletableFuture完成时，将执行提供的Consumer函数，但不返回新的结果。相反，返回一个`CompletableFuture<Void>`，表示这个阶段的操作不产生结果。
> - `thenAcceptAsync`: 这是异步版本的`thenAccept`，使用默认的Executor执行器执行提供的Consumer函数。
> - `thenAcceptAsync`（带有Executor参数）: 这是具有自定义Executor执行器的异步版本，允许你指定一个特定的执行器来执行提供的Consumer函数。

```java
public CompletableFuture<Void> thenRun(Runnable action) {
    return uniRunStage(null, action);
}

public CompletableFuture<Void> thenRunAsync(Runnable action) {
    return uniRunStage(defaultExecutor(), action);
}

public CompletableFuture<Void> thenRunAsync(Runnable action,
                                            Executor executor) {
    return uniRunStage(screenExecutor(executor), action);
}
```

> - `thenRun`: 当前`CompletableFuture`完成后，将执行提供的`Runnable`操作，但不返回新的结果。相反，返回一个`CompletableFuture<Void>`，表示这个阶段的操作不产生结果。
> - `thenRunAsync`: 这是`thenRun`的异步版本，使用默认的`Executor`执行器执行提供的`Runnable`操作。
> - `thenRunAsync`（带有`Executor`参数）: 这是具有自定义`Executor`执行器的异步版本，允许你指定一个特定的执行器来执行提供的`Runnable`操作。

#### 两任务组合

```java
public <U,V> CompletableFuture<V> thenCombine(
    CompletionStage<? extends U> other,
    BiFunction<? super T,? super U,? extends V> fn) {
    return biApplyStage(null, other, fn);
}

public <U,V> CompletableFuture<V> thenCombineAsync(
    CompletionStage<? extends U> other,
    BiFunction<? super T,? super U,? extends V> fn) {
    return biApplyStage(defaultExecutor(), other, fn);
}

public <U,V> CompletableFuture<V> thenCombineAsync(
    CompletionStage<? extends U> other,
    BiFunction<? super T,? super U,? extends V> fn, Executor executor) {
    return biApplyStage(screenExecutor(executor), other, fn);
}

public <U> CompletableFuture<Void> thenAcceptBoth(
    CompletionStage<? extends U> other,
    BiConsumer<? super T, ? super U> action) {
    return biAcceptStage(null, other, action);
}

public <U> CompletableFuture<Void> thenAcceptBothAsync(
    CompletionStage<? extends U> other,
    BiConsumer<? super T, ? super U> action) {
    return biAcceptStage(defaultExecutor(), other, action);
}

public <U> CompletableFuture<Void> thenAcceptBothAsync(
    CompletionStage<? extends U> other,
    BiConsumer<? super T, ? super U> action, Executor executor) {
    return biAcceptStage(screenExecutor(executor), other, action);
}

public CompletableFuture<Void> runAfterBoth(CompletionStage<?> other,
                                            Runnable action) {
    return biRunStage(null, other, action);
}

public CompletableFuture<Void> runAfterBothAsync(CompletionStage<?> other,
                                                 Runnable action) {
    return biRunStage(defaultExecutor(), other, action);
}

public CompletableFuture<Void> runAfterBothAsync(CompletionStage<?> other,
                                                 Runnable action,
                                                 Executor executor) {
    return biRunStage(screenExecutor(executor), other, action);
}
```

> 1. thenCombine：组合两个 future，获取两个 future 的返回结果，并返回当前任务的返回值
> 2. thenAcceptBoth：组合两个 future，获取两个 future 任务的返回结果，然后处理任务，没有返回值。 
> 3. runAfterBoth：组合两个 future，不需要获取 future 的结果，只需两个future 处理完任务后，处理该任务。

#### 两任务组合完成一个

把上面的both换成either，当两个任务中，任意一个 future 任务完成的时候，执行任务。

#### 多任务组合

```java
public static CompletableFuture<Void> allOf(CompletableFuture<?>... cfs)
public static CompletableFuture<Object> anyOf(CompletableFuture<?>... cfs) 
```

> allOf：等待所有任务完成 
>
> anyOf：只要有一个任务完成







## 并发理论JMM

### JMM内存模型

java内存模型（JMM）：出现线程安全的问题一般是因为**主内存和工作内存数据不一致性**和**重排序**导致的，理解它们的核心在于理解java内存模型（JMM）

在并发编程中主要需要解决两个问题：1. 线程之间如何通信；2.线程之间如何完成同步





### 重排序

在执行程序时，为了提高性能，编译器和处理器常常会对指令进行重排序

### happens-before规则

JMM可以通过happens-before关系向程序员提供跨线程的内存可见性保证（如果A线程的写操作a与B线程的读操作b之间存在happens-before关系，尽管a操作和b操作在不同的线程中执行，但JMM向程序员保证a操作将对b操作可见）



## 并发关键字

### synchronized

`Synchronized`是Java中的关键字，用于实现线程同步，确保多个线程之间正确地共享资源。在Java中，当多个线程访问共享资源时，如果没有适当的同步机制，可能会导致数据不一致或其他问题。`synchronized`关键字提供了一种简单而有效的方法来控制对共享资源的访问。

1. 同步方法：
   ```java
   public synchronized void synchronizedMethod() {
       // 同步的方法体
   }
   ```

   

2. 同步代码块：
   ```java
   public void someMethod() {
       // 非同步的代码块
   
       synchronized (lockObject) {
           // 同步的代码块
       }
   
       // 非同步的代码块
   }
   ```



#### CAS操作

CAS，即比较并交换（Compare and Swap），是一种并发编程中常见的原子操作。它是一种多线程同步的手段，用于在多线程环境下实现对共享数据的安全操作。CAS 操作主要包含三个步骤：

1. **比较（Compare）：** 读取当前内存中的值与期望值进行比较。
2. **交换（And Swap）：** 如果当前内存中的值与期望值相等，则使用新值来更新内存中的值。
3. **返回新值：** 返回操作是否成功，通常用于判断操作是否在竞争条件下成功执行。

使用锁时，线程获取锁是一种**悲观锁策略**，即假设每一次执行临界区代码都会产生冲突，所以当前线程获取到锁的时候同时也会阻塞其他线程获取该锁。而CAS操作（又称为无锁操作）是一种**乐观锁策略**，它假设所有线程访问共享资源的时候不会出现冲突，既然不会出现冲突自然而然就不会阻塞其他线程的操作。因此，线程就不会出现阻塞停顿的状态。那么，如果出现冲突了怎么办？无锁操作是使用**CAS(compare and swap)**又叫做比较交换来鉴别线程是否出现冲突，出现冲突就重试当前操作直到没有冲突为止。

### volatile

`volatile`是Java中的关键字，用于修饰变量，主要用于多线程编程。`volatile`关键字的主要作用是确保变量的可见性和禁止指令重排序。

```java
public class VolatileExample {
    private volatile boolean flag = false;

    public void setFlag() {
        flag = true;
    }

    public void printFlag() {
        System.out.println("Flag: " + flag);
    }

    public static void main(String[] args) {
        VolatileExample example = new VolatileExample();

        // Thread 1: set flag to true
        new Thread(() -> {
            example.setFlag();
        }).start();

        // Thread 2: print flag
        new Thread(() -> {
            while (!example.flag) {
                // Thread 2 keeps checking flag until it becomes true
            }
            example.printFlag();
        }).start();
    }
}

```

> 在上述例子中，如果`flag`没有被声明为`volatile`，则Thread 2 可能会一直在循环中等待，因为它无法感知到Thread 1 对`flag`的修改。通过使用`volatile`关键字，确保了对`flag`的修改对所有线程可见，从而避免了潜在的问题

### final

**当final修饰基本数据类型变量时，不能对基本数据类型变量重新赋值，因此基本数据类型变量不能被改变。而对于引用类型变量而言，它仅仅保存的是一个引用，final只保证这个引用类型变量所引用的地址不会发生改变，即一直引用这个对象，但这个对象属性是可以改变的**。

**被final修饰的方法不能够被子类所重写**。

被final修饰的方法是可以重载的

### 三大特性

（1）原子性：synchronized；（2）可见性：synchronized，volatile；（3）有序性：synchronized，volatile



## Lock体系



使用Lock的一般形式：

```java
Lock lock = new ReentrantLock();
lock.lock();
try{
	.......
}finally{
	lock.unlock();
}
```

Lock锁的API如下：

![image-20240109161247254](https://s2.loli.net/2024/02/18/ifyUWh4jXtM8Fpc.webp)

Lock锁接口的实现类：

ReentrantLock实现了lock接口，基本上所有的方法的实现实际上都是调用了其静态内存类`Sync`中的方法，而Sync类继承了`AbstractQueuedSynchronizer（AQS）`。可以看出要想理解ReentrantLock关键核心在于对队列同步器AbstractQueuedSynchronizer（简称同步器）的理解。

### AQS（AbstractQueuedSynchronizer）

AQS（AbstractQueuedSynchronizer）是Java中用于实现同步器的抽象基类。它为构建各种同步工具提供了一个框架，最典型的例子就是ReentrantLock和ReentrantReadWriteLock都是基于AQS实现的。AQS提供了一种灵活的机制，允许开发人员实现自定义的同步器，以满足各种并发场景的需求。

以下是AQS的主要特征和组成部分：

1. **同步状态（Sync State）：** AQS维护了一个同步状态的抽象概念，表示资源的数量或可用性。同步状态是AQS实现同步的核心。
2. **等待队列（Wait Queue）：** AQS使用一个等待队列来管理那些因为获取锁而被阻塞的线程。这个队列通常是一个双向链表，每个节点代表一个等待线程。
3. **获取与释放（Acquire and Release）：** AQS定义了两个主要的操作，即`acquire`（获取）和`release`（释放），用于管理同步状态。具体的同步器（如ReentrantLock）会实现这两个操作，根据自身的逻辑来获取和释放同步状态。

AQS的实现方式基于模板方法设计模式，子类需要实现AQS提供的几个核心方法来定义自己的同步逻辑。以下是一些关键的方法：

- **`tryAcquire`：** 尝试获取同步状态，如果成功则返回true，否则返回false。子类需要根据实际需求实现这个方法，通常用于独占式同步器（如ReentrantLock）。
- **`tryRelease`：** 尝试释放同步状态，如果成功则返回true，否则返回false。同样，子类需要根据实际需求实现这个方法。
- **`tryAcquireShared`：** 尝试获取共享同步状态，用于支持共享式同步器（如ReentrantReadWriteLock）。
- **`tryReleaseShared`：** 尝试释放共享同步状态。
- **`isHeldExclusively`：** 查询同步状态是否被当前线程独占。

AQS使用了一种称为"CLH队列"（Craig, Landin, and Hagersten）的等待队列算法，这是一种基于链表的队列，它在性能和可伸缩性方面有一些优势。
