---
title: Java集合-HashMap
date: 2023-10-28
category:
  - Java
  - HashMap
tag:
  - Java
  - HashMap
---
# Java集合-HashMap

Java的HashMap是一种基于哈希表实现的数据结构，用于存储键值对。在HashMap中，每个键都映射到一个值。

## HashMap源码分析

### 成员变量

```java
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

    /**
     * The maximum capacity, used if a higher value is implicitly specified
     * by either of the constructors with arguments.
     * MUST be a power of two <= 1<<30.
     */
    static final int MAXIMUM_CAPACITY = 1 << 30;

    /**
     * The load factor used when none specified in constructor.
     */
    static final float DEFAULT_LOAD_FACTOR = 0.75f;
```

这三个变量分别是 默认的初始容量，最大容量，以及默认的加载因子
公式如下：
扩容阈值=数组容量\*加载因子

```java
    /**
     * The table, initialized on first use, and resized as
     * necessary. When allocated, length is always a power of two.
     * (We also tolerate length zero in some operations to allow
     * bootstrapping mechanics that are currently not needed.)
     */
    transient Node<K,V>[] table;

    /**
     * Holds cached entrySet(). Note that AbstractMap fields are used
     * for keySet() and values().
     */
    transient Set<Map.Entry<K,V>> entrySet;

    /**
     * The number of key-value mappings contained in this map.
     */
    transient int size;

    /**
     * The number of times this HashMap has been structurally modified
     * Structural modifications are those that change the number of mappings in
     * the HashMap or otherwise modify its internal structure (e.g.,
     * rehash).  This field is used to make iterators on Collection-views of
     * the HashMap fail-fast.  (See ConcurrentModificationException).
     */
    transient int modCount;

    /**
     * The next size value at which to resize (capacity * load factor).
     *
     * @serial
     */
    // (The javadoc description is true upon serialization.
    // Additionally, if the table array has not been allocated, this
    // field holds the initial array capacity, or zero signifying
    // DEFAULT_INITIAL_CAPACITY.)
    int threshold;

    /**
     * The load factor for the hash table.
     *
     * @serial
     */
    final float loadFactor;
```

`table` 是哈希表的核心数据结构，它存储了键值对的桶（buckets），每个桶可以包含一个链表或红黑树，用于解决哈希冲突。在 HashMap 或 Hashtable 这类哈希表的实现中，`table` 是用于存储实际键值对的地方。

使用 `transient` 修饰 `table` 字段通常是因为在对象序列化时，哈希表的内部状态不需要被序列化。这是因为在反序列化时，哈希表可以根据其他序列化的信息（如容量、负载因子等）来重新构建。如果 `table` 不被标记为 `transient`，那么在序列化和反序列化过程中，可能会导致不必要的数据传输和资源浪费，因为 `table` 可能很大，不需要被序列化和反序列化。

`transient Set<Map.Entry<K, V>> entrySet;`: 这个字段用于缓存`entrySet()`，也就是哈希表中的键值对集合

`transient int size;`: 这个字段用于存储哈希表中键值对的数量，表示哈希表的大小。

 `transient int modCount;`: 这个字段用于记录结构性修改的次数。结构性修改是指那些改变哈希表的键值对数量或修改其内部结构的操作，例如重新哈希。`modCount` 用于使对哈希表的 Collection 视图（如迭代器）进行快速失败（fail-fast）处理，以便在并发环境下及时检测到其他线程的修改。

`int threshold;`: 这个字段存储下一次需要调整哈希表大小的阈值，通常是容量乘以负载因子。当键值对数量达到这个阈值时，哈希表会进行扩容。
`final float loadFactor;`: 这个字段存储了哈希表的负载因子。负载因子是一个在扩容时用于确定新容量的参数。

### 构造函数

```java
    /**
     * Constructs an empty <tt>HashMap</tt> with the specified initial
     * capacity and load factor.
     *
     * @param  initialCapacity the initial capacity
     * @param  loadFactor      the load factor
     * @throws IllegalArgumentException if the initial capacity is negative
     *         or the load factor is nonpositive
     */
    public HashMap(int initialCapacity, float loadFactor) {
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " +
                                               initialCapacity);
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " +
                                               loadFactor);
        this.loadFactor = loadFactor;
        this.threshold = tableSizeFor(initialCapacity);
    }

    /**
     * Constructs an empty <tt>HashMap</tt> with the specified initial
     * capacity and the default load factor (0.75).
     *
     * @param  initialCapacity the initial capacity.
     * @throws IllegalArgumentException if the initial capacity is negative.
     */
    public HashMap(int initialCapacity) {
        this(initialCapacity, DEFAULT_LOAD_FACTOR);
    }

    /**
     * Constructs an empty <tt>HashMap</tt> with the default initial capacity
     * (16) and the default load factor (0.75).
     */
    public HashMap() {
        this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
    }

    /**
     * Constructs a new <tt>HashMap</tt> with the same mappings as the
     * specified <tt>Map</tt>.  The <tt>HashMap</tt> is created with
     * default load factor (0.75) and an initial capacity sufficient to
     * hold the mappings in the specified <tt>Map</tt>.
     *
     * @param   m the map whose mappings are to be placed in this map
     * @throws  NullPointerException if the specified map is null
     */
    public HashMap(Map<? extends K, ? extends V> m) {
        this.loadFactor = DEFAULT_LOAD_FACTOR;
        putMapEntries(m, false);
    }
```


1. `public HashMap(int initialCapacity, float loadFactor)`: 这个构造函数用于创建一个空的`HashMap`，并允许指定初始容量和负载因子。初始容量表示哈希表的初始大小，负载因子表示在扩容之前哈希表的容量利用率。如果初始容量为负数或负载因子为非正数，将抛出`IllegalArgumentException`异常。

2. `public HashMap(int initialCapacity)`: 这个构造函数允许指定初始容量，但负载因子使用默认值（0.75）。如果初始容量为负数，将抛出`IllegalArgumentException`异常。

3. `public HashMap()`: 这个构造函数创建一个空的`HashMap`，使用默认的初始容量（16）和负载因子（0.75）。

4. `public HashMap(Map<? extends K, ? extends V> m)`: 这个构造函数允许你创建一个新的`HashMap`，其初始内容是由给定的`Map`对象`m`提供的。这个构造函数使用默认的负载因子（0.75）和足够容纳`m`中所有键值对的初始容量。

在这些构造函数中，`loadFactor` 表示了哈希表的负载因子，它是在哈希表需要扩容时触发的阈值。`initialCapacity` 是哈希表的初始容量，这是哈希表的桶数，可以在后续的操作中动态调整。`DEFAULT_LOAD_FACTOR` 是默认的负载因子值（0.75），`MAXIMUM_CAPACITY` 是哈希表的最大容量限制。

### 关键方法
#### 添加元素put

```java
    /**
     * Associates the specified value with the specified key in this map.
     * If the map previously contained a mapping for the key, the old
     * value is replaced.
     *
     * @param key key with which the specified value is to be associated
     * @param value value to be associated with the specified key
     * @return the previous value associated with <tt>key</tt>, or
     *         <tt>null</tt> if there was no mapping for <tt>key</tt>.
     *         (A <tt>null</tt> return can also indicate that the map
     *         previously associated <tt>null</tt> with <tt>key</tt>.)
     */
    public V put(K key, V value) {
        return putVal(hash(key), key, value, false, true);
    }

    /**
     * Implements Map.put and related methods.
     *
     * @param hash hash for key
     * @param key the key
     * @param value the value to put
     * @param onlyIfAbsent if true, don't change existing value
     * @param evict if false, the table is in creation mode.
     * @return previous value, or null if none
     */
    final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        Node<K,V>[] tab; Node<K,V> p; int n, i;
        if ((tab = table) == null || (n = tab.length) == 0)
            n = (tab = resize()).length;
        if ((p = tab[i = (n - 1) & hash]) == null)
            tab[i] = newNode(hash, key, value, null);
        else {
            Node<K,V> e; K k;
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                e = p;
            else if (p instanceof TreeNode)
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                for (int binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        p.next = newNode(hash, key, value, null);
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash);
                        break;
                    }
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
        if (++size > threshold)
            resize();
        afterNodeInsertion(evict);
        return null;
    }
```


1. `public V put(K key, V value)`: 这是 HashMap 类的 `put` 方法，用于将指定的键 `key` 和对应的值 `value` 关联在 HashMap 中。如果之前已经存在相同的键，则新的值会替代旧值。
2. `final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict)`: 这是 `put` 方法的底层实现，负责实际的键值对插入和处理。以下是参数的解释：
    - `hash`: 表示键的哈希值，用于确定键值对的存储位置。
    - `key`: 表示要插入的键。
    - `value`: 表示要插入的值。
    - `onlyIfAbsent`: 如果为 `true`，则表示只在键不存在时才插入值，不会替代已存在的值。
    - `evict`: 如果为 `false`，表示 HashMap 处于创建模式，而不是正常的插入模式。
3. 方法内部进行了以下操作：
    - 首先，检查是否已经存在哈希表，如果没有，则尝试进行哈希表的初始化。
    - 然后，根据键的哈希值找到存储位置，尝试插入键值对。
    - 如果存储位置已经有值，需要根据键是否已存在来决定是否替代值。
    - 如果哈希冲突发生，会通过链表或红黑树解决，具体取决于链表长度。
    - 最后，根据需要触发哈希表的扩容。

而插入的时候里面的计算哈希函数实现如下：
```java
    /**
     * Computes key.hashCode() and spreads (XORs) higher bits of hash
     * to lower.  Because the table uses power-of-two masking, sets of
     * hashes that vary only in bits above the current mask will
     * always collide. (Among known examples are sets of Float keys
     * holding consecutive whole numbers in small tables.)  So we
     * apply a transform that spreads the impact of higher bits
     * downward. There is a tradeoff between speed, utility, and
     * quality of bit-spreading. Because many common sets of hashes
     * are already reasonably distributed (so don't benefit from
     * spreading), and because we use trees to handle large sets of
     * collisions in bins, we just XOR some shifted bits in the
     * cheapest possible way to reduce systematic lossage, as well as
     * to incorporate impact of the highest bits that would otherwise
     * never be used in index calculations because of table bounds.
     */
    static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }
```

1. `key.hashCode()`: 这部分计算对象的原始哈希码。每个 Java 对象都有一个 `hashCode` 方法，它返回一个 `int` 类型的哈希码。这个哈希码通常是根据对象的内部状态计算的，不同对象的哈希码可能不同。`hashCode` 方法的默认实现通常是基于对象的内存地址计算的，但它可以被子类重写以提供更有意义的哈希码。
2. `h >>> 16`: 这部分执行位移操作，将 `h` 的二进制表示向右移动 16 位。这是因为 `h` 的高 16 位和低 16 位可能包含对象的不同信息，我们希望将高位的信息也包括在哈希码中，以确保更好的均匀性。
3. `key.hashCode() ^ (h >>> 16)`: 最后，这部分通过异或操作（`^`）将原始哈希码和经过位移的哈希码合并在一起，生成最终的哈希码 `h`。这个操作将低位和高位信息混合在一起，以减少哈希冲突的概率。


关于插入的时候产生碰撞使用链表还是红黑树：
- 首先，它检查当前索引位置的节点是否与要插入的键匹配，如果匹配，表示找到了相同的键，不需要插入新节点，只需更新值。
- 如果当前节点是红黑树节点（`p` 是 `TreeNode` 类型），则调用红黑树的插入方法进行处理。
- 否则，进入一个循环，继续查找下一个节点。如果找到链表的末尾，将新节点插入到链表末尾，并检查链表长度是否达到了转换为红黑树的阈值（`TREEIFY_THRESHOLD=8`），如果达到阈值，将链表转换为红黑树。

#### 删除元素remove
```java
    /**
     * Removes the mapping for the specified key from this map if present.
     *
     * @param  key key whose mapping is to be removed from the map
     * @return the previous value associated with <tt>key</tt>, or
     *         <tt>null</tt> if there was no mapping for <tt>key</tt>.
     *         (A <tt>null</tt> return can also indicate that the map
     *         previously associated <tt>null</tt> with <tt>key</tt>.)
     */
    public V remove(Object key) {
        Node<K,V> e;
        return (e = removeNode(hash(key), key, null, false, true)) == null ?
            null : e.value;
    }

    /**
     * Implements Map.remove and related methods.
     *
     * @param hash hash for key
     * @param key the key
     * @param value the value to match if matchValue, else ignored
     * @param matchValue if true only remove if value is equal
     * @param movable if false do not move other nodes while removing
     * @return the node, or null if none
     */
    final Node<K,V> removeNode(int hash, Object key, Object value,
                               boolean matchValue, boolean movable) {
        Node<K,V>[] tab; Node<K,V> p; int n, index;
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (p = tab[index = (n - 1) & hash]) != null) {
            Node<K,V> node = null, e; K k; V v;
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                node = p;
            else if ((e = p.next) != null) {
                if (p instanceof TreeNode)
                    node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
                else {
                    do {
                        if (e.hash == hash &&
                            ((k = e.key) == key ||
                             (key != null && key.equals(k)))) {
                            node = e;
                            break;
                        }
                        p = e;
                    } while ((e = e.next) != null);
                }
            }
            if (node != null && (!matchValue || (v = node.value) == value ||
                                 (value != null && value.equals(v)))) {
                if (node instanceof TreeNode)
                    ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
                else if (node == p)
                    tab[index] = node.next;
                else
                    p.next = node.next;
                ++modCount;
                --size;
                afterNodeRemoval(node);
                return node;
            }
        }
        return null;
    }
```


1. `public V remove(Object key)`: 这是 HashMap 类的 `remove` 方法，用于移除 HashMap 中指定键 `key` 的映射。如果存在这个键的映射，它将返回先前与该键关联的值；如果没有映射与该键，它将返回 `null`。
2. `final Node<K,V> removeNode(int hash, Object key, Object value, boolean matchValue, boolean movable)`: 这是 `remove` 方法的底层实现，负责实际的移除操作。以下是参数的解释：
    - `hash`: 表示键的哈希值，用于确定键值对的位置。
    - `key`: 表示要移除的键。
    - `value`: 如果 `matchValue` 为 `true`，则表示只有在键的值与 `value` 匹配时才移除，否则 `value` 参数被忽略。
    - `matchValue`: 如果为 `true`，表示只有在值匹配时才移除键值对，否则忽略值。
    - `movable`: 如果为 `false`，表示在移除节点时不移动其他节点。
3. 方法内部进行了以下操作：
- 首先，它检查哈希表是否为空，数组长度大于0，以及指定索引位置是否存在节点。
- 然后，它在哈希表中查找键的位置。这可能涉及到遍历链表或红黑树，以找到匹配的节点。
- 如果找到了匹配的节点 `node`，然后检查是否需要匹配值（根据 `matchValue` 参数），如果需要匹配值，检查值是否匹配。如果匹配，表示找到了要移除的节点。
- 如果 `node` 是红黑树节点，则调用红黑树的移除方法进行处理。
- 否则，根据节点的位置，将节点从链表中移除。
- 最后，更新哈希表的 `modCount`（用于迭代器的快速失败机制）和 `size`（键值对数量），并调用 `afterNodeRemoval` 方法来执行移除后的操作。


## 面试题
### 说一下HashMap的实现原理
底层使用hash表数据结构，即数组和链表或红黑树
存储过程如下：
1. **计算键的哈希值：** 当你要将键值对存储到 `HashMap` 中时，首先会计算键的哈希值。这通常是通过调用键的 `hashCode` 方法来完成的。哈希值是一个整数，用于确定键值对在哈希表中的存储位置。
2. **计算存储位置：** 使用哈希值和哈希函数，确定键值对在哈希表中的存储位置（也称为桶或存储槽）。
3. **查找位置：** 在确定了存储位置之后， `HashMap` 将查找这个位置，看是否已经有键值对存储在这里。如果这个位置是空的，表示没有发生哈希冲突，可以直接将键值对存储在这里。
4. **处理哈希冲突：** 如果确定位置不为空，表示发生了哈希冲突，即多个键的哈希值相同。在这种情况下， `HashMap` 会根据以下情况进行处理：
    a. 如果新键与已有键相同（通过 `equals` 方法比较），则新值将覆盖旧值，不会增加新的键值对数量。
    b. 如果新键与已有键不同（通过 `equals` 方法比较），则新的键值对将被添加到同一桶中，可能会形成链表或红黑树结构，具体取决于桶内键值对的数量。
5. **更新元素数量和结构：** 每次插入键值对时， `HashMap` 会更新元素的数量（键值对数量），并检查是否需要进行扩容，以保持适当的负载因子。此外，它会记录结构修改次数（`modCount`）以用于快速失败迭代器。
6. **完成插入：** 当上述步骤完成后，键值对已经成功存储在 `HashMap` 中。

### 链表和红黑树转换
jdk1.8在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8） 时并且数组长度达到64时，将链表转化为红黑树，以减少搜索时间。扩容 resize( ) 时，红黑树拆分成的树的结点数小于等于临界值6个，则退化成链表


### 讲一讲HashMap的扩容机制

```java
//扩容、初始化数组
final Node<K,V>[] resize() {
        Node<K,V>[] oldTab = table;
    	//如果当前数组为null的时候，把oldCap老数组容量设置为0
        int oldCap = (oldTab == null) ? 0 : oldTab.length;
        //老的扩容阈值
    	int oldThr = threshold;
        int newCap, newThr = 0;
        //判断数组容量是否大于0，大于0说明数组已经初始化
    	if (oldCap > 0) {
            //判断当前数组长度是否大于最大数组长度
            if (oldCap >= MAXIMUM_CAPACITY) {
                //如果是，将扩容阈值直接设置为int类型的最大数值并直接返回
                threshold = Integer.MAX_VALUE;
                return oldTab;
            }
            //如果在最大长度范围内，则需要扩容  OldCap << 1等价于oldCap*2
            //运算过后判断是不是最大值并且oldCap需要大于16
            else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                     oldCap >= DEFAULT_INITIAL_CAPACITY)
                newThr = oldThr << 1; // double threshold  等价于oldThr*2
        }
    	//如果oldCap<0，但是已经初始化了，像把元素删除完之后的情况，那么它的临界值肯定还存在，       			如果是首次初始化，它的临界值则为0
        else if (oldThr > 0) // initial capacity was placed in threshold
            newCap = oldThr;
        //数组未初始化的情况，将阈值和扩容因子都设置为默认值
    	else {               // zero initial threshold signifies using defaults
            newCap = DEFAULT_INITIAL_CAPACITY;
            newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
        }
    	//初始化容量小于16的时候，扩容阈值是没有赋值的
        if (newThr == 0) {
            //创建阈值
            float ft = (float)newCap * loadFactor;
            //判断新容量和新阈值是否大于最大容量
            newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                      (int)ft : Integer.MAX_VALUE);
        }
    	//计算出来的阈值赋值
        threshold = newThr;
        @SuppressWarnings({"rawtypes","unchecked"})
        //根据上边计算得出的容量 创建新的数组       
    	Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    	//赋值
    	table = newTab;
    	//扩容操作，判断不为空证明不是初始化数组
        if (oldTab != null) {
            //遍历数组
            for (int j = 0; j < oldCap; ++j) {
                Node<K,V> e;
                //判断当前下标为j的数组如果不为空的话赋值个e，进行下一步操作
                if ((e = oldTab[j]) != null) {
                    //将数组位置置空
                    oldTab[j] = null;
                    //判断是否有下个节点
                    if (e.next == null)
                        //如果没有，就重新计算在新数组中的下标并放进去
                        newTab[e.hash & (newCap - 1)] = e;
                   	//有下个节点的情况，并且判断是否已经树化
                    else if (e instanceof TreeNode)
                        //进行红黑树的操作
                        ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                    //有下个节点的情况，并且没有树化（链表形式）
                    else {
                        //比如老数组容量是16，那下标就为0-15
                        //扩容操作*2，容量就变为32，下标为0-31
                        //低位：0-15，高位16-31
                        //定义了四个变量
                        //        低位头          低位尾
                        Node<K,V> loHead = null, loTail = null;
                        //        高位头		   高位尾
                        Node<K,V> hiHead = null, hiTail = null;
                        //下个节点
                        Node<K,V> next;
                        //循环遍历
                        do {
                            //取出next节点
                            next = e.next;
                            //通过 与操作 计算得出结果为0
                            if ((e.hash & oldCap) == 0) {
                                //如果低位尾为null，证明当前数组位置为空，没有任何数据
                                if (loTail == null)
                                    //将e值放入低位头
                                    loHead = e;
                                //低位尾不为null，证明已经有数据了
                                else
                                    //将数据放入next节点
                                    loTail.next = e;
                                //记录低位尾数据
                                loTail = e;
                            }
                            //通过 与操作 计算得出结果不为0
                            else {
                                 //如果高位尾为null，证明当前数组位置为空，没有任何数据
                                if (hiTail == null)
                                    //将e值放入高位头
                                    hiHead = e;
                                //高位尾不为null，证明已经有数据了
                                else
                                    //将数据放入next节点
                                    hiTail.next = e;
                               //记录高位尾数据
                               	hiTail = e;
                            }
                            
                        } 
                        //如果e不为空，证明没有到链表尾部，继续执行循环
                        while ((e = next) != null);
                        //低位尾如果记录的有数据，是链表
                        if (loTail != null) {
                            //将下一个元素置空
                            loTail.next = null;
                            //将低位头放入新数组的原下标位置
                            newTab[j] = loHead;
                        }
                        //高位尾如果记录的有数据，是链表
                        if (hiTail != null) {
                            //将下一个元素置空
                            hiTail.next = null;
                            //将高位头放入新数组的(原下标+原数组容量)位置
                            newTab[j + oldCap] = hiHead;
                        }
                    }
                }
            }
        }
    	//返回新的数组对象
        return newTab;
    }
```

1. **初始容量和负载因子：** `HashMap` 在创建时可以指定初始容量和负载因子。初始容量表示哈希表的初始大小，负载因子表示在何时进行扩容操作。默认情况下，初始容量是16，负载因子是0.75。
2. **负载因子的作用：** 负载因子表示哈希表可以填充的程度。当元素数量超过初始容量与负载因子的乘积时，即 `size > initialCapacity * loadFactor`，`HashMap` 视为需要进行扩容操作。
3. **扩容操作：** 扩容操作会创建一个新的更大的哈希表，通常是原来大小的两倍，然后将所有键值对重新分布到新的哈希表中。扩容操作需要重新计算哈希值、确定新的存储位置等。
4. **扩容之后**，会新创建一个数组，需要把老数组中的数据挪动到新的数组中
- 没有hash冲突的节点，则直接使用 e.hash & (newCap - 1) 计算新数组的索引位置
- 如果是红黑树，走红黑树的添加
- 如果是链表，则需要遍历链表，可能需要拆分链表，判断(e.hash & oldCap)是否为0，该元素的位置要么停留在原始位置，要么移动到原始位置+增加的数组大小这个位置上


### hashMap的寻址算法

```java
    static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }
```

首先获取key的hashCode值，然后右移16位 异或运算 原来的hashCode值，主要作用就是使原来的hash值更加均匀，减少hash冲突

有了hash值之后，就很方便的去计算当前key的在数组中存储的下标，
```java
        if ((p = tab[i = (n - 1) & hash]) == null)
            tab[i] = newNode(hash, key, value, null);
```

(n-1)&hash : 得到数组中的索引，代替取模，性能更好，数组长度必须是2的n次幂

### 为何HashMap的数组长度一定是2的次幂？
1. 计算索引时效率更高：如果是 2 的 n 次幂可以使用位与运算代替取模
2.  扩容时重新计算索引效率更高： hash & oldCap == 0 的元素留在原来位置 ，否则新位置 = 旧位置 + oldCap

