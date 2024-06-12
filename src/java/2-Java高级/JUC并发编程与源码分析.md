---
title: JUC并发编程与源码分析
date: 2024-02-19
category:
  - Java
  - JUC
tag:
  - Java
  - JUC
---
# JUC并发编程与源码分析
## 线程基础知识复习
Java开启一个线程的源码：
```java
public synchronized void start() {  
    /**  
     * This method is not invoked for the main method thread or "system"     * group threads created/set up by the VM. Any new functionality added     * to this method in the future may have to also be added to the VM.     *     * A zero status value corresponds to state "NEW".     */    if (threadStatus != 0)  
        throw new IllegalThreadStateException();  
  
    /* Notify the group that this thread is about to be started  
     * so that it can be added to the group's list of threads     * and the group's unstarted count can be decremented. */    group.add(this);  
  
    boolean started = false;  
    try {  
        start0();  
        started = true;  
    } finally {  
        try {  
            if (!started) {  
                group.threadStartFailed(this);  
            }  
        } catch (Throwable ignore) {  
            /* do nothing. If start0 threw a Throwable then  
              it will be passed up the call stack */        }  
    }  
}  
  
private native void start0();
```
可以发现调用的start0是native，底层是c++实现的，此时需要去下载Java底层源码
链接：https://github.com/openjdk/jdk8
Thread.java对应的源码就是Thread.c,start0就是JVM_StartThread,可以在jvm.h中找到声明，jvm.cpp中实现
位置：`jdk/src/share/native/java/lang/Thread.c` 
`jdk/src/share/javavm/export/jvm.h`
`hotspot/src/share/vm/prims/jvm.cpp`
`hotspot/src/share/vm/runtime/thread.cpp`
![image.png](https://s2.loli.net/2024/02/19/P5XmGZqDsRSzF47.webp)
jvm.cpp中
![image.png](https://s2.loli.net/2024/02/19/6k8T4cldzUmH9sK.webp)
在thread.cpp中：
![image.png](https://s2.loli.net/2024/02/19/HzURkpIPYCTc3n1.webp)


## CompletableFuture
`Future` 接口是 Java 并发编程中用于表示异步计算结果的接口。它允许你提交一个任务并在将来某个时候获取任务的执行结果。`Future` 接口提供了一种异步获取计算结果的机制，可以在任务执行完成之前进行其他操作，避免了阻塞等待计算结果的情况。
比如主线程让一个子线程去执行任务，子线程可能比较耗时，启动子线程开始执行任务后，主线程就去做其他事情了，忙其它事情或者先执行完，过了一会才去获取子任务的执行结果或变更的任务状态。
### FutureTask
`FutureTask` 是 Java 并发包中的一个类，实现了 `RunnableFuture` 接口，而 `RunnableFuture` 接口又扩展自 `Runnable` 和 `Future` 接口。它是一个可取消的异步计算任务，允许在计算完成之前进行取消操作，同时也可以通过实现 `Callable` 接口来支持有返回值的任务。主要有两个构造函数，分别是可以传入Callable和Runnable接口。
```java
/**  
 * Creates a {@code FutureTask} that will, upon running, execute the  
 * given {@code Callable}.  
 * * @param  callable the callable task  
 * @throws NullPointerException if the callable is null  
 */public FutureTask(Callable<V> callable) {  
    if (callable == null)  
        throw new NullPointerException();  
    this.callable = callable;  
    this.state = NEW;       // ensure visibility of callable  
}  
  
/**  
 * Creates a {@code FutureTask} that will, upon running, execute the  
 * given {@code Runnable}, and arrange that {@code get} will return the  
 * given result on successful completion. * * @param runnable the runnable task  
 * @param result the result to return on successful completion. If  
 * you don't need a particular result, consider using * constructions of the form: * {@code Future<?> f = new FutureTask<Void>(runnable, null)}  
 * @throws NullPointerException if the runnable is null  
 */public FutureTask(Runnable runnable, V result) {  
    this.callable = Executors.callable(runnable, result);  
    this.state = NEW;       // ensure visibility of callable  
}
```

api调用：
```java
public class Test {  
    public static void main(String[] args) {  
        FutureTask<String> futureTask = new FutureTask<>(new MyThread());  
        Thread a = new Thread(futureTask, "A");  
        a.start();  
        try {  
            System.out.println(futureTask.get());  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }  
}  
  
class MyThread implements Callable<String> {  
  
    @Override  
    public String call() throws Exception {  
        System.out.println("---come in call()");  
        return "Hello";  
    }  
}
```
使用多线程和单个线程的区别：
```java
import java.util.concurrent.*;  
  
public class Test {  
    public static void main(String[] args) throws ExecutionException, InterruptedException {  
        m1();  
        m2();  
    }  
  
    private static void m2() throws InterruptedException, ExecutionException {  
        long startTime=System.currentTimeMillis();  
        ExecutorService executorService = Executors.newFixedThreadPool(3);  
  
        FutureTask<String> futureTask = new FutureTask<>(()->{  
            try{TimeUnit.MILLISECONDS.sleep(500);}catch (InterruptedException e){e.printStackTrace();}  
            return "task1 end";  
        });  
        executorService.submit(futureTask);  
  
        FutureTask<String> futureTask2 = new FutureTask<>(()->{  
            try{TimeUnit.MILLISECONDS.sleep(300);}catch (InterruptedException e){e.printStackTrace();}  
            return "task2 end";  
        });  
        executorService.submit(futureTask2);  
  
        FutureTask<String> futureTask3 = new FutureTask<>(()->{  
            try{TimeUnit.MILLISECONDS.sleep(200);}catch (InterruptedException e){e.printStackTrace();}  
            return "task3 end";  
        });  
        executorService.submit(futureTask3);  
  
        System.out.println("futureTask.get() = " + futureTask.get());  
        System.out.println("futureTask2.get() = " + futureTask2.get());  
        System.out.println("futureTask3.get() = " + futureTask3.get());  
  
  
        executorService.shutdown();  
        long endTime=System.currentTimeMillis();  
        System.out.println("thread Time: "+(endTime-startTime));  
    }  
  
    private static void m1() {  
        //只用一个线程处理  
        long startTime=System.currentTimeMillis();  
        try{TimeUnit.MILLISECONDS.sleep(500);}catch (InterruptedException e){e.printStackTrace();}  
        try{TimeUnit.MILLISECONDS.sleep(300);}catch (InterruptedException e){e.printStackTrace();}  
        try{TimeUnit.MILLISECONDS.sleep(200);}catch (InterruptedException e){e.printStackTrace();}  
        long endTime=System.currentTimeMillis();  
        System.out.println("dont use thread Time: "+(endTime-startTime));  
    }  
}
```
运行结果：
![image.png](https://s2.loli.net/2024/02/19/SjM6acIKqiuFL8Y.webp)
可以看到，速度快了一倍左右

问题：阻塞等待结果： 在调用 `get` 方法获取任务的执行结果时，如果任务尚未完成，`get` 方法会阻塞等待任务完成。这可能导致程序在获取结果时被阻塞，影响整体性能。为了避免这种情况，可以使用带有超时参数的 `get` 方法，或者结合其他机制来处理。
轮询耗费CPU：
```java
FutureTask<String> futureTask = new FutureTask<>(() -> {  
    System.out.println("Hello, World!");  
    return "take over";  
});  
Thread thread = new Thread(futureTask);  
thread.start();  
while (true) {  
    if (futureTask.isDone()) {  
        System.out.println(futureTask.get());  
        break;    } else {  
        TimeUnit.MILLISECONDS.sleep(500);  
        System.out.println("waiting...");  
    }  
}
```

结论：Future对于结果的获取不是很友好，只能通过阻塞或轮询的方式得到任务的结果。
对于真正的异步处理我们希望是可以通过传入回调函数，在Future结束时自动调用该回调函数，这样，我们就不用等待结果。
改进：使用CompletableFuture
### CompletableFuture
`CompletableFuture` 类是 Java 并发编程中提供的一个强大的工具，用于处理异步操作。它支持通过回调函数（观察者模式）的方式处理异步计算的结果。
```java
public class CompletableFuture<T> implements Future<T>, CompletionStage<T>
```
在Java8中，CompletableFuture提供了非常强大的Future的扩展功能，可以帮助我们简化异步编程的复杂性，并且提供了函数式编程的能
力，可以通过回调的方式处理计算结果，也提供了转换和组合CompletableFuture的方法。
它可能代表一个明确完成的Future,也有可能代表一个完成阶段(CompletionStage)，它支持在计算完成以后触发一些函数或执行某些
动作。它实现了Future和CompletionStage接口，尽量不要使用new构建
创建CompletableFuture类：
+ 无返回值：runAsync
+ 有返回值：completedFuture
```java
CompletableFuture<Void> completableFuture=CompletableFuture.runAsync(()->{  
    System.out.println("Hello World");  
});  
System.out.println(completableFuture.get());
```
测试CompletableFuture：
> 如果没有ExecutorService线程池，那么程序会直接结束，不会等待异步线程
> 
```java
public static void main(String[] args) throws ExecutionException, InterruptedException {  
    ExecutorService executorService = Executors.newFixedThreadPool(3);  
    CompletableFuture.supplyAsync(() -> {  
        System.out.println("Thread: " + Thread.currentThread().getName() + " is running");  
        try {  
            TimeUnit.SECONDS.sleep(1);  
        } catch (InterruptedException e) {  
            throw new RuntimeException(e);  
        }  
        System.out.println("after 1 second sleep,get result" + 1);  
        return 1;  
    },executorService).whenComplete((v,e)->{  
        if (e==null){  
            System.out.println("Thread: " + Thread.currentThread().getName() + " is running");  
            System.out.println("result is " + v);  
        }  
    }).exceptionally(e->{  
        e.printStackTrace();  
        System.out.println("exception is "+e.getCause());  
        return null;    });  
    System.out.println(Thread.currentThread().getName()+"is running");  
    executorService.shutdown();  
}
```
函数式接口

|函数式接口|方法名|参数|返回类型|示例|
|---|---|---|---|---|
|`Runnable`|`run`|无|`void`|`Runnable myRunnable = () -> { /* 任务执行 */ };`|
|`Function<T, R>`|`apply`|`T`|`R`|`Function<Integer, String> intToString = (integer) -> "数字: " + integer;`|
|`Consumer<T>`|`accept`|`T`|`void`|`Consumer<String> printUpperCase = (str) -> System.out.println(str.toUpperCase());`|
|`Supplier<T>`|`get`|无|`T`|`Supplier<Double> randomNumber = () -> Math.random();`|
|`BiConsumer<T, U>`|`accept`|`T, U`|`void`|`BiConsumer<Integer, String> printKeyValue = (key, value) -> System.out.println(key + ": " + value);`|

真实案例：
1. 需求说明
+ 同一款产品，同时搜索出同款产品在各大电商平台的售价；
+ 同一款产品，同时搜索出本产品在同一个电商平台下，各个入驻卖家售价是多少
2. 输出返回：
出来结果希望是同款产品的在不同地方的价格清单列表，返回一个`List<String>`
+ 《mysql》)in jd price is88.05
+ 《mysql》)in dangdang price is86.11
+ 《mysql》)in taobao price is90.43
3. 解决方案，比对同一个商品在各个平台上的价格，要求获得一个清单列表，
+ step by step,按部就班，查完京东查淘宝，查完淘宝查天猫.
+ all in 万箭齐发，一口气多线程异步任务同时查询。

单步查询：
```java
public class Test {  
    static List<NetMall> list = Arrays.asList(  
            new NetMall("jd"),  
            new NetMall("taobao"),  
            new NetMall("dangdang")  
    );  
  
    public static List<String> getPrice(List<NetMall> list, String productName) {  
        return list.stream()  
                .map(netMall -> {  
                    return String.format(productName + "in %s price is %.2f", netMall.getNetMallName(), netMall.calPrice(productName));  
                }).toList();  
    }  
  
    public static void main(String[] args) {  
        long start = System.currentTimeMillis();  
        System.out.println(getPrice(list, "mysql"));  
        System.out.println("Done in " + (System.currentTimeMillis() - start) + "ms");  
    }  
}  
  
class NetMall {  
    private String netMallName;  
  
    public NetMall(String netMallName) {  
        this.netMallName = netMallName;  
    }  
  
    public String getNetMallName() {  
        return netMallName;  
    }  
  
    public double calPrice(String productName) {  
        try {  
            TimeUnit.SECONDS.sleep(1);  
        } catch (Exception e) {  
            throw new RuntimeException(e);  
        }  
        return ThreadLocalRandom.current().nextDouble() * 2 + productName.charAt(0);  
    }  
  
}
```

修改：
使用CompletableFuture提高性能
```java
public static List<String> getPriceByCompletableFuture(List<NetMall> list, String productName) {  
    return list.stream().map(netMall -> {  
                return CompletableFuture.supplyAsync(() -> {  
                    return String.format(productName + "in %s price is %.2f", netMall.getNetMallName(), netMall.calPrice(productName));  
                });  
            }).collect(Collectors.toList())  
            .stream().map(s -> s.join())  
            .collect(Collectors.toList());  
}
```

结果如下：

![image-20240219210521570](https://s2.loli.net/2024/02/19/qVUXYGxkjFgbRle.webp)

几个获取异步结果的对比：

| 方法 | 返回值 | 阻塞行为 | 异常处理 | 用途 |
| ---- | ---- | ---- | ---- | ---- |
| `join()` | `T` | 是 | 无异常处理 | 等待异步计算完成，获取结果。 |
| `get()` | `T` | 是 | 需要处理异常 | 等待异步计算完成，获取结果。可能抛出 `InterruptedException` 和 `ExecutionException` 异常。 |
| `getNow(defaultValue)` | `T` | 否 | 无异常处理 | 如果异步计算已经完成，返回结果；否则返回指定的默认值。 |
| `complete(value)` | `boolean` | 否 | 无异常处理 | 如果此CompletableFuture尚未完成，则将其设置为已完成，并返回true；否则返回false。用于手动完成异步计算。 |
|  |  |  |  |  |

thenApply和handle区别
> - **`thenApply`：** 不处理异常情况，如果计算过程中出现异常，则该异常会传递到下一个阶段。
> - **`handle`：** 可以处理正常结果和异常结果。你可以提供一个处理异常的函数，以便在出现异常时返回一个默认值或执行其他操作。

```java
public static void main(String[] args) throws Exception {  
    ExecutorService threadPool = Executors.newFixedThreadPool(3);  
    CompletableFuture.supplyAsync(() -> {  
        try {  
            TimeUnit.SECONDS.sleep(1);  
        } catch (InterruptedException e) {  
            throw new RuntimeException(e);  
        }  
        System.out.println("111");  
        return 1;  
    }, threadPool).thenApply(res -> {  
        System.out.println("222");  
        return res + 2;  
    }).whenComplete((res, e) -> {  
        if (e == null) {  
            System.out.println("计算结果:" + res);  
        } else {  
            System.out.println("异常");  
        }  
    }).exceptionally(e -> {  
        e.printStackTrace();  
        return null;    });  
    threadPool.shutdown();  
}
```

thenAccept:对结果消费，没有返回值
```java
CompletableFuture.supplyAsync(() -> {  
            System.out.println("111");  
            return 1;  
        }, threadPool).thenApply(res -> {  
            System.out.println("222");  
            return res + 2;  
        }).thenAccept(res -> {  
            System.out.println("333");  
            System.out.println(res);  
        })
```
对比

| 方法         | 描述                                       | 返回类型                | 示例                                                          |
|-------------|--------------------------------------------|-------------------------|---------------------------------------------------------------|
| `thenRun`    | 在上一阶段完成后执行一个`Runnable`           | `CompletableFuture<Void>` | `CompletableFuture.supplyAsync(() -> "Hello").thenRun(() -> System.out.println("Task completed"));` |
| `thenAccept` | 在上一阶段完成后对结果进行处理，不返回结果   | `CompletableFuture<Void>` | `CompletableFuture.supplyAsync(() -> "Hello").thenAccept(result -> System.out.println("Result: " + result));` |
| `thenApply`  | 在上一阶段完成后对结果进行转换，返回新结果   | `CompletableFuture<U>`   | `CompletableFuture.supplyAsync(() -> "Hello").thenApply(s -> s + " World");` |

总结：
1. **`thenRun`方法：**
    - `thenRun`方法默认在调用该方法的线程中执行，即在调用`thenRun`的线程中执行`Runnable`。
    - 该方法不关心`Runnable`的执行是否涉及异步操作，因此可能会阻塞当前线程，特别是如果`Runnable`中包含耗时的操作。
2. **`thenRunAsync`方法：**
    - `thenRunAsync`方法会使用默认的`ForkJoinPool`或者通过传递给它的`Executor`在一个新的线程中执行`Runnable`。
    - 该方法更适用于处理异步操作，避免阻塞调用线程，尤其是当`Runnable`包含耗时的操作时。

1. 没有传入自定义线程池，都用默认线程池ForkJoinPool
2. 传入了一个自定义线程池，
+ 如果你执行第一个任务的时候，传入了一个自定义线程池：
+ 调用thenRun方法执行第二个任务时，则第二个任务和第一个任务是共用同一个线程池。
+ 调用thenRunAsync执行第二个任务时，则第一个任务使用的是你自己传入的线程池，第二个任务使用的是ForkJoin线程池
3. 有可能处理太快，系统优化切换原则，直接使用main线程处理

applyToEither:
```java
public <U> CompletableFuture<U> applyToEither( CompletionStage<? extends T> other, Function<? super T, U> fn )
```
> - `other`：另一个`CompletionStage`，当它或当前`CompletableFuture`中的任何一个完成时，就会触发`fn`函数的执行。
> - `fn`：一个转换函数，接受一个参数（当前`CompletableFuture`或`other`的计算结果），并返回一个结果。


```java
private static void test() {  
    CompletableFuture<Character> A = CompletableFuture.supplyAsync(() -> {return 'A';});  
    CompletableFuture<Character> B = CompletableFuture.supplyAsync(() -> {return 'B';});  
  
    CompletableFuture<Character> res = A.applyToEither(B, (result) -> {  
        System.out.println("Result: " + result);  
        return result;  
    });  
    System.out.println(Thread.currentThread().getName()+"---:"+res.join());  
}
```

对计算结果进行合并：
```java
private static void test() {  
    CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {  
        return 10;  
    });  
    CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {  
        return 11;  
    });  
    CompletableFuture<Integer> result = future1.thenCombine(future2, (x, y) -> {  
        return x + y;  
    });  
    System.out.println(result.join());  
}
```

## 多线程锁
### 乐观锁和悲观锁
悲观锁：
悲观锁是一种并发控制机制，它假设在多线程环境下，对数据的访问总是会导致冲突。因此，在对数据进行任何操作之前，悲观锁都会先对数据进行加锁，以确保数据的原子性和一致性。
> 适合写操作多的场景，先加锁可以保证写操作时数据正确
 > 显式的锁定之后再操作同步资源
  synchronized和Lock都是悲观锁。
 

乐观锁：
认为自己在使用数据时不会有别的线程修改数据或资源，所以不会添加锁。
在Jva中是通过使用无锁编程来实现，只是在更新数据的时候去判断，之前有没有别的线程更新了这个数据。
如果这个数据没有被更新，当前线程将自己修改的数据成功写入，
如果这个数据已经被其它线程更新，则根据不同的实现方式执行不同的操作，比如放弃修改、重试抢锁等等
判断规则：
+ 版本号机制version
+ 最常采用的是CAS算法，Java原子类中的递增操作就通过CAS自旋实现的。
> 适合读操作多的场景，不加锁的特点能够使其读操作的性能大幅提升。
  乐观锁则直接去操作同步资源，是种无锁算法，得之我幸不得我命，再努力就是

### synchronized三种应用方式
作用于实例方法，当前实例加锁，进入同步代码前要获得当前实例的锁；
作用于代码块，对括号里配置的对象加锁。
作用于静态方法，当前类加锁，进去同步代码前要获得当前类对象的锁；
#### 同步代码块
```java
public class Test {  
    Object object=new Object();  
    public void test1(){  
        synchronized (object){  
            System.out.println("test1");  
        }  
    }  
    public static void main(String[] args) throws Exception {  
    }  
}
```

对代码进行反编译：`javap -c Test.class`
可以看到如下锁的获取和释放
![image.png](https://s2.loli.net/2024/02/20/2YEtusUbAhqOday.webp)

#### 同步方法
```java
public synchronized void m2(){  
    System.out.println("m2");  
}
```
![image.png](https://s2.loli.net/2024/02/20/jKewt97gLUQcbOI.webp)

#### 静态同步方法
```java
public static synchronized void m3(){  
    System.out.println("m3");  
}
```
![image.png](https://s2.loli.net/2024/02/20/U3MuTkXv24JEOoP.webp)

#### 反编译synchronized锁的是什么
每个对象天生都带着一个对象监视器，每一个被锁住的对象都会和Monitor关联起来

### 公平锁和非公平锁
```java
import java.util.concurrent.locks.ReentrantLock;  
  
public class Test {  
    private int number = 50;  
    ReentrantLock lock = new ReentrantLock();  
  
    public void sale() {  
        lock.lock();  
        try {  
            if (number > 0) {  
                System.out.println(Thread.currentThread().getName() + "卖出了" + (number--) + "张票，剩余：" + number);  
            }  
        } finally {  
            lock.unlock();  
        }  
    }  
  
    public static void main(String[] args) {  
        Test test = new Test();  
        new Thread(() -> {  
            for (int i = 0; i < 60; i++) {  
                test.sale();  
            }  
        }, "A").start();  
        new Thread(() -> {  
            for (int i = 0; i < 60; i++) {  
                test.sale();  
            }  
        }, "B").start();  
        new Thread(() -> {  
            for (int i = 0; i < 60; i++) {  
                test.sale();  
            }  
        }, "C").start();  
  
    }  
}
```

公平锁：是指多个线程按照申请锁的顺序来获取锁，这里类似排队买票，先来的人先买后来的人在队尾排着，这是公平的
Lock lock=new ReentrantLock(true);/true表示公平锁，先来先得
非公平锁：是指多个线程获取锁的顺序并不是按照申请锁的顺序，有可能后申请的线程比先申请的线程优先获取锁，在高并发环境下，有可能造成优先级翻转或者饥饿的状态（某个线程一直得不到锁）
Lock lock=new ReentrantLock(false);/false表示非公平锁，后来的也可能先获得锁
Lock lock=new ReentrantLock();/默认非公平锁
> 使用多线程很重要的考量点是线程切换的开销，当采用非公平锁时，当1个线程请求锁获取同步状态，然后释放同步状态，所以刚释放锁的线程在此
 刻再次获取同步状态的概率就变得非常大，所以就减少了线程的开销

### 可重入锁(递归锁)
是指在同一线程在外层方法获取到锁的时侯，在进入该线程的内层方法会自动获取锁（前提，锁对象的是同一个对象），不会因为之前已经获取过还没释放而阻塞---------优点之一就是可一定程度避免死锁。
- **隐式锁**：由 Java 虚拟机（JVM）自动管理，无需程序员显式操作。Java 中的 synchronized 关键字就是一种隐式锁。
- **显示锁**：需要程序员显式地获取和释放锁。Java 中的 Lock 接口就是一种显示锁。

```java
private static void a() {  
    final Object o = new Object();  
    new Thread(() -> {  
        synchronized (o) {  
            System.out.println("---------------外层调用");  
            synchronized (o) {  
                System.out.println("---------------中层调用");  
                synchronized (o) {  
                    System.out.println("---------------内层调用");  
                }  
            }  
        }  
    }, "t1").start();  
    Lock lock = new ReentrantLock();  
    new Thread(() -> {  
        lock.lock();  
        try {  
            System.out.println("---------------外层调用");  
            lock.lock();  
            try {  
                System.out.println("---------------中层调用");  
                lock.lock();  
                try {  
                    System.out.println("---------------内层调用");  
                } finally {  
                    lock.unlock();  
                }  
            } finally {  
                lock.unlock();  
            }  
        } finally {  
            lock.unlock();  
        }  
    }, "t2").start();  
}
```

synchronized 重入锁的实现原理：
+ 每个锁对象拥有一个锁计数器和一个指向持有该锁的线程的指针。
+ 当执行monitorenterl时，如果目标锁对象的计数器为零，那么说明它没有被其他线程所持有，Java虚拟机会将该锁对象的持有线程设置为当前线程，并且将其计数器加1。
+ 在目标锁对象的计数器不为零的情况下，如果锁对象的持有线程是当前线程，那么Jva虚拟机可以将其计数器加1，否则需要等待，直至持有线程释放该锁。
+ 当执行monitorexith时，Java虚拟机则需将锁对象的计数器减1。计数器为零代表锁已被释了

```java
private static void a() {  
    Lock lock = new ReentrantLock();  
    new Thread(()->{  
        lock.lock();  
        System.out.println("外层");  
        lock.lock();  
        System.out.println("内层");  
        lock.unlock();  
        lock.unlock();  
    }).start();  
}
```

### 死锁
死锁是指两个或多个线程在执行过程中，由于竞争资源或者由于彼此通信而造成的一种阻塞的现象，若无外力作用，它们都将无法推进下去。此时称系统处于死锁状态或系统产生了死锁，这些永远在互相等待的进程称为死锁进程。

```java
public class DeadLockDemo {
    static  Object a=new Object();
    static  Object b=new Object();

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (a){
                System.out.println("t1线程持有a锁，试图获取b锁");
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (b){
                    System.out.println("t1线程获取到b锁");
                }
            }
         },"t1").start();

        new Thread(() -> {
            synchronized (b){
                System.out.println("t2线程持有a锁，试图获取a锁");
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (a){
                    System.out.println("t2线程获取到a锁");
                }
            }
        },"t2").start();
    }
}
```

**产生原因**
- **资源竞争**：多个进程或线程同时请求同一资源，而该资源数量不足时，就会产生死锁。
- **相互等待**：一个进程或线程在等待另一个进程或线程释放资源，而另一个进程或线程也在等待第一个进程或线程释放资源，形成循环等待，就会产生死锁。
**预防**
- **资源分配**：尽量避免资源竞争，合理分配资源。
- **避免相互等待**：采用一些策略，如按顺序分配资源、使用超时机制等，避免相互等待。
**检测**
- **死锁检测算法**：定期检查系统状态，检测是否存在死锁。
- **超时机制**：为每个资源请求设置超时时间，超时后自动释放资源。
**解除**
- **终止进程或线程**：强制终止死锁进程或线程中的一个或多个，释放资源。
- **抢占资源**：从一个或多个死锁进程或线程中抢占资源，分配给其他进程或线程。

## LockSupport与线程中断

### 线程中断


什么是中断机制？
1. 首先,一个线程不应该由其他线程来强制中断或停止，而是应该由线程自己自行停止，自己来决定自己的命运。所以，Thread.stop,Thread.suspend,Thread.resume都己经被废弃了。
2. 其次,在Jva中没有办法立即停止一条线程，然而停止线程却显得尤为重要，如取消一个耗时操作。因此，Java提供了一种用于停止线程的协商机制一一中断，也即中断标识协商机制。中断只是一种协作协商机制，Java没有给中断增加任何语法，中断的过程完全需要程序员自己实现。若要中断一个线程，你需要手动调用该线程的interrupt,方法，该方法也仅仅是将线程对象的中断标识设成true;
3. 接着你需要自己写代码不断地检测当前线程的标识位，如果为tue,表示别的线程请求这条线程中断，此时究竞该做什么需要你自己写代码实现。
4. 每个线程对象中都有一个中断标识位，用于表示线程是否被中断；该标识位为true表示中断，为false表示未中断；通过调用线程对象的interrupt方法将该线程的标识位设为true;可以在别的线程中调用，也可以在自己的线程中调用。

中断大三API
- `interrupt()`: 中断线程。仅仅是将线程的中断标志设置为 `true`。
- `isInterrupted()`: 判断线程是否被中断并清除当前中断状态。这个方法做了两件事：1返回当前线程的中断状态，测试当前线程是否已被中断2将当前线程的中断状态清零并重新设为fase,清除线程的中断状态
- `interrupted()`: 静态方法，检查当前线程是否已被中断，并清除中断标志。
3. **特点：**
- 中断是一种协作机制，线程可以检查中断标志并相应地终止执行，但不是强制性的。
- 中断通常与异常一起使用，例如，`InterruptedException` 用于处理线程在等待某些条件时被中断的情况。

面试题 ：
如何停止中断中的线程 ？

第一种办法 ：通过volatile变量实现 
> `volatile` 是 Java 中的关键字，主要用于修饰实例变量。它的主要作用是保证该变量对所有线程的可见性，即当一个线程修改了这个变量的值，其他线程能够立即看到最新的值，而不会使用本地缓存。
```java
static volatile boolean isStop = false;  
  
private static void a() throws InterruptedException {  
    new Thread(() -> {  
        while (true) {  
            if (isStop) {  
                System.out.println("stop");  
                break;            }  
            System.out.println("running");  
        }  
    }, "t1").start();  
  
    TimeUnit.MILLISECONDS.sleep(2);  
    new Thread(()->{  
        isStop = true;  
    }, "t2").start();  
}
```

第二种方法：
> `AtomicBoolean` 是 Java 并发包 (`java.util.concurrent.atomic` 包) 中提供的一个原子性布尔变量类。它使用了底层的原子性操作，可以保证对布尔变量的读取和写入操作是原子的，从而提供了一种线程安全的方式来处理布尔值。
> 主要特点和用法包括：
> 1. **原子性操作：** `AtomicBoolean` 提供了一系列的原子性操作，包括 `get`、`set`、`getAndSet`、`compareAndSet` 等，这些操作是不可中断的，并且保证了对布尔变量的操作是原子性的。
>2. **比较与设置：** `compareAndSet(expectedValue, newValue)` 方法用于比较当前值与期望值，如果相等则设置新值。这个方法可以用于实现一些有条件的更新操作。
>3. **适用于多线程环境：** 由于 `AtomicBoolean` 的操作是原子的，因此可以在多线程环境下安全地使用它，而不需要额外的同步措施。

```java
static AtomicBoolean atomicBoolean = new AtomicBoolean(false);  
  
private static void b() throws InterruptedException {  
    new Thread(() -> {  
        while (true) {  
            if (atomicBoolean.get()) {  
                System.out.println("stop");  
                break;            }  
            System.out.println("running");  
        }  
    }, "t1").start();  
  
    TimeUnit.MILLISECONDS.sleep(2);  
    new Thread(() -> {  
        atomicBoolean.set(true);  
    }, "t2").start();  
}
```


第三种方式 ：
使用API，interrupt，isInterrupted
```java
private static void c() throws InterruptedException {  
    Thread thread = new Thread(() -> {  
        while (true) {  
            if (Thread.currentThread().isInterrupted()) {  
                System.out.println("stop");  
                break;            }  
            System.out.println("running");  
        }  
    }, "t1");  
    thread.start();  
    TimeUnit.MILLISECONDS.sleep(2);  
    thread.interrupt();  
}
```

当前线程的中断标识为tue,是不是线程就立刻停止？
>1. 如果线程处于正常活动状态，那么会将该线程的中断标志设置为tue,仅此而已。被设置中断标志的线程将继续正常运行，不受影响。所以，interrupt()并不能真正的中断线程，需要被调用的线程自己进行配合才行。
>2.  如果线程处于被阻塞状态（例如处于sleep,wait,join等状态），在别的线程中调用当前线程对象的interrupt方法，那么线程将立即退出被阻塞状态，并抛出一个InterruptedException异常。

sleep方法抛出InterruptedException.后，中断标识也被清空置为false,我们在catch没有通过调用th.interrupt()方法再次将中断标识置为true,这就导致无限循环了

### LockSupport
线程等待和唤醒 的办法：
方式1：使用Object中的wait方法让线程等待，使用Object中的notify方法唤醒线程
方式2：使用JUc包中Condition的wait()方法让线程等待，使用signal方法唤醒线程
方式3：LockSupport类可以阻塞当前线程以及唤醒指定被阻塞的线程


第一种方式问题：
```java
public class Test {  
    public static void main(String[] args) throws InterruptedException {  
        Object objectLock= new Object();  
        new Thread(()->{  
//            synchronized (objectLock){  
                System.out.println("Thread 1: Holding lock");  
                try {  
                    objectLock.wait();  
                } catch (InterruptedException e) {  
                    e.printStackTrace();  
                }  
                System.out.println("Thread 1: Released lock");  
//            }  
        }).start();  
        TimeUnit.SECONDS.sleep(1);  
        new Thread(()->{  
//            synchronized (objectLock){  
                System.out.println("Thread 2: Holding lock");  
                objectLock.notify();  
                System.out.println("Thread 2: Released lock");  
//            }  
        }).start();  
    }  
}
```

如果不加synchronized会报错
![image.png](https://s2.loli.net/2024/02/25/rZwugbRvHfOo62T.webp)

第二个 问题：如果notify在wait前面，会导致程序卡死，无法执行


第二种方式：
```java
public class Test {  
    public static void main(String[] args) throws InterruptedException {  
        Lock lock = new ReentrantLock();  
        Condition condition = lock.newCondition();  
        new Thread(() -> {  
            lock.lock();  
            try {  
                System.out.println("Thread 1 waiting");  
                condition.await();  
                System.out.println("Thread 1 is awake");  
            } catch (InterruptedException e) {  
                e.printStackTrace();  
            } finally {  
                lock.unlock();  
            }  
        }).start();  
  
        TimeUnit.SECONDS.sleep(1);  
  
        new Thread(() -> {  
            lock.lock();  
            try {  
                System.out.println("Thread 2 waiting");  
                condition.signal();  
                System.out.println("Thread 2 is awake");  
            } finally {  
                lock.unlock();  
            }  
        }).start();  
    }  
}
```

如果把`lock.unlock();  ` 去掉，那么也会报上面的错误
同理，先signal后wait，也会卡死

使用LockSupport
```java
public static void main(String[] args) throws InterruptedException {  
    Thread thread = new Thread(() -> {  
        LockSupport.park();  
        System.out.println("Hello from new thread");  
    });  
    thread.start();  
  
  
    TimeUnit.SECONDS.sleep(1);  
    new Thread(() -> {  
        LockSupport.unpark(thread);  
        System.out.println("Hello from new thread");  
    }).start();  
}
```

优点：
+ 正常+无锁块要求
+ 之前错误的先唤醒后等待，LockSupport照样支持
+ LockSupport类使用了一种名为Permit(许可)的概念来做到阻塞和唤醒线程的功能，每个线程都有一个许可(permit)

总结：
LockSupport是用来创建锁和其他同步类的基本线程阻塞原语。
LockSupport是一个线程阻塞工具类，所有的方法都是静态方法，可以让线程在任意位置阻塞，阻塞之后也有对应的唤醒方法。归根结底，LockSupporti调用的Unsafe中的native代码。
LockSupport提供park()和unpark()方法实现阻塞线程和解除线程阻塞的过程
LockSupport和每个使用它的线程都有一个许可(permit)关联。
每个线程都有一个相关的permit,,permiti最多只有一个，重复调用unpark也不会积累凭证。
形象的理解
线程阻塞需要消耗凭证(permit),这个凭证最多只有1个。
当调用park方法时
+ 如果有凭证，则会直接消耗掉这个凭证然后正常退出：
+ 如果无凭证，就必须阻塞等待凭证可用；
而unpark则相反，它会增加一个凭证，但凭证最多只能有1个，累加无效。


为什么可以突破wait/notify的原有调用顺序？
> 因为unpark获得了一个凭证之后再调用park方法，就可以名正言顺的凭证消费，故不会阻塞。
> 先发放了凭证后续可以畅通无阻。

为什么唤醒两次后阻塞两次，但最终结果还会阻塞线程？
>因为凭证的数量最多为1，连续调用两次unpark和调用一次unpark效果一样，只会增加一个凭证；
> 而调用两次pak却需要消费两个凭证，证不够，不能放行。


## JAVA内存模型之JMM
JVM规范中试图定义一种Java内存模型(java Memory Model.,简称JMM)来屏蔽掉各种硬件和操作系统的内存访问差异，以实现让Java程序在各种平台下都能达到一致的内存访问效果。

JMM(Java内存模型Java Memory Model,,简称JMM)本身是一种抽象的概念并不真实存在它仅仅描述的是一组约定或规范，通过这组规范定义了程序中（尤其是多线程）各个变量的读写访问方式并决定一个线程对共享变量的写入何时以及如何变成对另一个线程可见，关键技术点都是围绕多线程的原子性、可见性和有序性展开的。
原则：
+ JMM的关键技术点都是围绕多线程的原子性、可见性和有序性展开的
能干嘛？
+ 通过JMM来实现线程和主内存之间的抽象关系。
+ 屏蔽各个硬件平台和操作系统的内存访问差异以实现让Jva程序在各种平台下都能达到一致的内存访问效果。

### JMM规范三大特性 

1. **原子性（Atomicity）：**
    - 原子性指的是一个操作是不可中断的。在 Java 中，对基本数据类型的读取和赋值操作（例如，`int`、`long`等）通常是原子性的。但对于复合操作，例如 `i++` 这种非原子性的操作，就需要额外的同步手段来保证其原子性。
2. **可见性（Visibility）：**
    - 可见性指的是当一个线程修改了共享变量的值时，其他线程能够立即看到最新的值。在 Java 中，可见性问题通常涉及到缓存和主内存之间的数据同步。为了确保可见性，可以使用 `volatile` 关键字或者其他同步手段，例如 `synchronized`、`Lock` 等。
3. **有序性（Ordering）：**
    - 有序性指的是程序执行的顺序和代码中的顺序保持一致。在 Java 中，编译器和处理器为了提高执行效率，可能对指令进行重排序。JMM 通过指令重排序规则来保证代码的执行顺序符合程序员的预期。此外，`volatile` 和 `synchronized` 也提供了一定的有序性保证。

系统主内存共享变量数据修改被写入的时机是不确定的，多线程并发下很可能出现"脏读"，所以每个线程都有自己的工作内存，线程自己的工作内存保存了该线程使用到的变量的主内存副本拷贝，线程对变量的所有操作（读取，赋值等）都必需在线程自己的工作内存中进行，而不能够直接读写主内存中的变量。不同线程之间也无法直接访问对方工作内存中的变量，线程间变量值的传递均需要通过主内存来完成

我们定义的所有共享变量都储存在物理主内存中，每个线程都有自己独立的工作内存，里面保存该线程使用到的变量的副本（住内存中该变量的一份拷贝）线程对共享变量所有的操作都必须先在线程自己的工作内存中进行后写回主内存，不能直接从主内存中读写（不能越级），不同线程之间也无法直接访问其他线程的工作内存中的变量，线程间变量值的传递需要通过主内存来进行（同级不能相互访问）

### happens-before
Java 内存模型（JMM）中的 `happens-before` 是一种保证多线程之间操作顺序的概念，用于描述在不同线程中的操作之间建立的先行发生关系。如果一个操作 `happens-before` 另一个操作，那么在执行的顺序上，前一个操作的结果对后一个操作是可见的。
以下是 `happens-before` 的一些规则：
1. **程序次序规则：** 在一个线程中，按照程序代码的顺序，前面的操作 `happens-before` 后面的操作。
2. **锁定规则：** 一个解锁操作 `happens-before` 于后续对同一把锁的加锁操作。这确保了锁的释放对于随后获取该锁的线程是可见的。
3. **volatile变量规则：** 对一个 `volatile` 变量的写操作 `happens-before` 于后续对该变量的读操作。这确保了对 `volatile` 变量的修改对于其他线程是可见的。
4. **线程启动规则：** 一个线程的启动操作 `happens-before` 于该线程的任何操作。
5. **线程终止规则：** 一个线程的所有操作 `happens-before` 于该线程的终止操作。
6. **中断规则：** 对线程的中断操作 `happens-before` 于被中断线程检测到中断事件的发生。
7. **对象终结规则：** 一个对象的构造函数结束 `happens-before` 于该对象的 `finalize` 方法的开始。
8. **传递性：** 如果 A `happens-before` B，且 B `happens-before` C，则 A `happens-before` C。这是 `happens-before` 关系的传递性。

JMM的设计分为两部分：
一部分是面向我们程序员提供的，也就是happens-before?规则,它通俗易懂的向我们程序员阐述了一个强内存模型，我们只要理解happens-before规则，就可以编写并发安全的程序了。
另一部分是针对JVM实现的，为了尽可能少的对编译器和处理器做约束从而提高性能，JMM在不影响程序执行结果的前提下对其不做要求，即允许优化重排序。我们只需要关注前者就好了，也就是理解happens-before规则即可，其它繁杂的内容有JMM规范结合操作系统给我们搞定，我们只写好代码即可。


## volatile与JMM
被volatile修饰的变量有两个特点：可见性，有序性
+ 当写一个volatile变量时，JMM会把该线程对应的本地内存中的共享变量值立即刷新回主内存中。
+ 当读一个volatile变量时，JMM会把该线程对应的本地内存设置为无效，重新回到主内存中读取最新共享变量
+ 所以volatile的写内存语义是直接刷新到主内存中，读的内存语义是直接从主内存中读取。

### 内存屏障
volatile为什么可以做到，
内存屏障（也称内存栅栏，屏障指令等，是一类同步屏障指令，是CPU或编译器在对内存随机访问的操作中的一个同步点，使得此点之前的所有读写操作都执行后才可以开始执行此点之后的操作)，避免代码重排序。内存屏障其实就是一种JVM指令，Jva内存模型的重排规则会要求Java编译器在生成JVM指令时插入特定的内存屏障指令，通过这些内存屏障指令，volatile实现了Java内存模型中的可见性和有序性（禁重排），但volatile无法保证原子性。
+ 内存屏障之前的所有写操作都要回写到主内存，
+ 内存屏障之后的所有读操作都能获得内存屏障之前的所有写操作的最新结果（实现了可见性）。

写屏障（Store Memory Barrier):告诉处理器在写屏障之前将所有存储在缓存(store bufferes)中的数据同步到主内存。也就是说当看到Store屏障指令，就必须把该指令之前所有写入指令执行完毕才能继续往下执行。

读屏障(Load Memory Barrier):处理器在读屏障之后的读操作，都在读屏障之后执行。也就是说在Load屏障指令之后就能够保证后面的读取数据指令一定能够读取到最新的数据。

因此重排序时，不允许把内存屏障之后的指令重排序到内存屏障之前。一句话：对一个volatile变量的写，先行发生于任意后续对这volatile变量的读，也叫写后读。

