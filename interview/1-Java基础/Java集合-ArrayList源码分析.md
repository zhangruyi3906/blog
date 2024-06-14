---
title: Java集合-ArrayList源码分析
date: 2023-10-28
category:
  - Java
  - ArrayList
tag:
  - Java
  - ArraryList
---

# Java集合-ArrayList

ArrayList底层实现是数组
数组是一种用连续的内存空间存储相同数据类型数据的线性数据结构。
> 栈内存：在方法中定义的一些基本类型的变量和对象的引用变量都在方法的栈内存中分配,当在一段代码块中定义一个变量时,Java就在栈内存中为这个变量分配内存空间,当超出变量的作用域后,Java会自动释放掉为该变量所分配的内存空间。
> 堆内存：堆内存用来存放 new 运算符创建的对象和数组,在堆中分配的内存,由Java虚拟机的自动垃级回收器来管理。

## 数组
在Java中定义数组：

```java
int a[] = {1, 2, 3};
```


在栈内存中指向的堆内存数组的首地址，此时想要获取到堆内存里的数据，就需要用到寻址公式
```java
a[i] = baseAddress + i * dataTypeSize
```

> dataTypeSize：代表数组中元素类型的大小，目前数组重存储的是int型的数据，dataTypeSize=4个字节

数组操作的时间复杂度分析：
查询：随机访问$O(1)$,查询$O(n)$
插入：最好$O(1)$,最坏$O(n)$ ,因为元素需要后移
删除：$O(n)$

## ArrayList源码分析

分析源码主要从三个方面考虑：成员变量，构造函数，关键方法

### 成员变量

```java
/**  
* Default initial capacity.  
*/  
private static final int DEFAULT_CAPACITY = 10;  
  
/**  
* Shared empty array instance used for empty instances.  
*/  
private static final Object[] EMPTY_ELEMENTDATA = {};  
  
/**  
* Shared empty array instance used for default sized empty instances. We  
* distinguish this from EMPTY_ELEMENTDATA to know how much to inflate when  
* first element is added.  
*/  
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};  
  
/**  
* The array buffer into which the elements of the ArrayList are stored.  
* The capacity of the ArrayList is the length of this array buffer. Any  
* empty ArrayList with elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA  
* will be expanded to DEFAULT_CAPACITY when the first element is added.  
*/  
transient Object[] elementData; // non-private to simplify nested class access  
  
/**  
* The size of the ArrayList (the number of elements it contains).  
*  
* @serial  
*/  
private int size;
```

可以看出：默认容量为10，底层是将数据存储在elementData这个数组中的，size是这个数组的长度

### 构造方法
```java
    /**
     * Constructs an empty list with the specified initial capacity.
     *
     * @param  initialCapacity  the initial capacity of the list
     * @throws IllegalArgumentException if the specified initial capacity
     *         is negative
     */
    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+
                                               initialCapacity);
        }
    }

    /**
     * Constructs an empty list with an initial capacity of ten.
     */
    public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }

    /**
     * Constructs a list containing the elements of the specified
     * collection, in the order they are returned by the collection's
     * iterator.
     *
     * @param c the collection whose elements are to be placed into this list
     * @throws NullPointerException if the specified collection is null
     */
    public ArrayList(Collection<? extends E> c) {
        Object[] a = c.toArray();
        if ((size = a.length) != 0) {
            if (c.getClass() == ArrayList.class) {
                elementData = a;
            } else {
                elementData = Arrays.copyOf(a, size, Object[].class);
            }
        } else {
            // replace with empty array.
            elementData = EMPTY_ELEMENTDATA;
        }
    }
```

第一个构造方法可以穿入一个整数，是默认的集合大小，如果值大于0 ，那么就会将elementData开到这么大，否则，将elementData赋值为成员变量里的EMPTY_ELEMENTDATA

第二个构造函数为无参构造，会把DEFAULTCAPACITY_EMPTY_ELEMENTDATA赋值为elementData

第三个构造函数为可以穿入一个collection对象，将collection对象转换成数组，然后将数组的地址的赋给elementData

### 关键方法

#### 添加元素add

```java
    /**
     * Appends the specified element to the end of this list.
     *
     * @param e element to be appended to this list
     * @return <tt>true</tt> (as specified by {@link Collection#add})
     */
    public boolean add(E e) {
        ensureCapacityInternal(size + 1);  // Increments modCount!!
        elementData[size++] = e;
        return true;
    }

    /**
     * Inserts the specified element at the specified position in this
     * list. Shifts the element currently at that position (if any) and
     * any subsequent elements to the right (adds one to their indices).
     *
     * @param index index at which the specified element is to be inserted
     * @param element element to be inserted
     * @throws IndexOutOfBoundsException {@inheritDoc}
     */
    public void add(int index, E element) {
        rangeCheckForAdd(index);

        ensureCapacityInternal(size + 1);  // Increments modCount!!
        System.arraycopy(elementData, index, elementData, index + 1,
                         size - index);
        elementData[index] = element;
        size++;
    }
```

由第一个添加元素的方法可以看出，加入元素 之前会先去进行扩容操作，代码如下：

```java
    private void ensureCapacityInternal(int minCapacity) {
        ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
    }

    private void ensureExplicitCapacity(int minCapacity) {
        modCount++;

        // overflow-conscious code
        if (minCapacity - elementData.length > 0)
            grow(minCapacity);
    }

    /**
     * The maximum size of array to allocate.
     * Some VMs reserve some header words in an array.
     * Attempts to allocate larger arrays may result in
     * OutOfMemoryError: Requested array size exceeds VM limit
     */
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
    /**
     * Increases the capacity to ensure that it can hold at least the
     * number of elements specified by the minimum capacity argument.
     *
     * @param minCapacity the desired minimum capacity
     */
    private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }

    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
            Integer.MAX_VALUE :
            MAX_ARRAY_SIZE;
    }
```

添加逻辑：确保数组已使用长度（size）加1之后足够存下下一个数据
如果要添加元素长度大于当前底层elementData的长度了，那么就进行grow扩容操作，否则不扩容
扩容的时候，一次会扩容为原来的1.5倍，`oldCapacity + (oldCapacity >> 1)`就相当于1.5,然后再根据条件确定newCapacity的大小，最后，使用 `Arrays.copyOf()` 方法来创建一个新的数组，将旧数组中的元素复制到新数组中，并将新数组赋给 `elementData`，以实现容量的扩展。

### 结论
+ ArrayList底层是用动态的数组实现的
+ ArrayList初始容量为0，当第一次添加数据的时候才会初始化容量为10
+ ArrayList在进行扩容的时候是原来容量的1.5倍，每次扩容都需要拷贝数组

## 面试题

1. ArrayList list=new ArrayList(10)list扩容几次
回答：该语句只是声明和实例了一个 ArrayList，指定了容量为 10，未扩容

2. 如何实现数组和List之间的转换
```java
    public void test() {
        //Array to List
        String[] a = {"1", "2", "3"};
        List<String> list = Arrays.asList(a);

        //List to Array
        ArrayList<String> strings = new ArrayList<>();
        strings.add("2");
        strings.add("3");
        strings.add("5");
        String[] stringsArray = strings.toArray(new String[strings.size()]);
    }
```
可以使用asList方法，将数组转为List
可以使用toArray方法，将List转为数组

用Arrays.asList转List后，如果修改了数组内容，**list受影响**，因为底层是使用的Arrays类中的一个内部类ArrayList来构造的集合，在这个集合的构造器中，把我们传入的这个集合进行了包装而已，最终指向的都是同一个内存地址，asList代码如下：
```java
    @SafeVarargs
    @SuppressWarnings("varargs")
    public static <T> List<T> asList(T... a) {
        return new ArrayList<>(a);
    }
```

List用toArray转数组后，如果修改了List内容,数组不受影响,因为底层是进行了数组拷贝，跟原来的元素没关系了

```java
    public <T> T[] toArray(T[] a) {
        if (a.length < size)
            // Make a new array of a's runtime type, but my contents:
            return (T[]) Arrays.copyOf(elementData, size, a.getClass());
        System.arraycopy(elementData, 0, a, 0, size);
        if (a.length > size)
            a[size] = null;
        return a;
    }
```
