---
title: RabbitMQ消息队列笔记
date: 2024-02-15
category:
  - 中间件
  - RabbitMQ
tag:
  - 中间件
  - RabbitMQ
---

# RabbitMQ消息队列

官网：https://www.rabbitmq.com/

## RabbitMQ基础

同步与异步对比：

同步：两个人实时打电话，问题：拓展性差，性能下降，级联失败

异步：微信聊天，交互不实时

异步调用模型：

![image-20240215133211036](https://s2.loli.net/2024/02/15/DSqg8HiebWYBkrz.webp)

常见的MQ消息队列对比：

|            | RabbitMQ                | ActiveMQ                       | RocketMQ   | Kafka      |
| ---------- | ----------------------- | ------------------------------ | ---------- | ---------- |
| 公司/社区  | Rabbit                  | Apache                         | 阿里       | Apache     |
| 开发语言   | Erlang                  | Java                           | Java       | Scala&Java |
| 协议支持   | AMQP，XMPP，SMTP，STOMP | OpenWire,STOMP，REST,XMPP,AMQP | 自定义协议 | 自定义协议 |
| 可用性     | 高                      | 一般                           | 高         | 高         |
| 单机吞吐量 | 一般                    | 差                             | 高         | 非常高     |
| 消息延迟   | 微秒级                  | 毫秒级                         | 毫秒级     | 毫秒以内   |
| 消息可靠性 | 高                      | 一般                           | 高         | 一般       |

### docker安装

拉取镜像

```sh
docker pull rabbitmq:3.8-management
```

运行：

```sh
docker run \
 -e RABBITMQ_DEFAULT_USER=admin \
 -e RABBITMQ_DEFAULT_PASS=admin \
 --name mq \
 --hostname mq \
 -p 15672:15672 \
 -p 5672:5672 \
 -d \
 rabbitmq:3.8-management
```

访问：http://localhost:15672/#/

### 收发消息

创建消息队列：

![image-20240215143301472](https://s2.loli.net/2024/02/15/mWeoyAsuFOYkXx7.webp)

将交换机与消息队列绑定：

![image-20240215144419856](https://s2.loli.net/2024/02/15/dPHl2ckhXvQ9Umj.webp)

发送消息：

![image-20240215144638488](https://s2.loli.net/2024/02/15/ZsMlBpwaYD26QNX.webp)

接收消息：

![image-20240215144651425](https://s2.loli.net/2024/02/15/ihmR4xrzg1KlW8u.webp)

### 数据隔离

添加一个用户：

![image-20240215152307250](https://s2.loli.net/2024/02/15/Kwnasy793vNLEZu.webp)

新加虚拟主机

![image-20240215152448596](https://s2.loli.net/2024/02/15/xGyHt8knZvMulOQ.webp)

达到隔离效果：

![image-20240215152603248](https://s2.loli.net/2024/02/15/d37SrtqQvs4x5wo.webp)

### AMQP

#### 快速入门

AMQP的全称为：Advanced Message Queuing Protocol（高级消息队列协议）

Spring-AMQP：https://spring.io/projects/spring-amqp

Spring AMQP是一个基于AMQP协议的消息中间件框架，它提供了一个简单的API来发送和接收异步、可靠的消息。它是Spring框架的一部分，可以与Spring Boot和其他Spring项目一起使用。

依赖：

```xml
    <!--AMQP依赖，包含RabbitMQ-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
```

为了测试方便，我们也可以直接向队列发送消息，跳过交换机。

配置：

```yml
spring:
  rabbitmq:
    host: 192.168.150.101 # 你的虚拟机IP
    port: 5672 # 端口
    virtual-host: /hmall # 虚拟主机
    username: hmall # 用户名
    password: 123 # 密码
```

发送消息：

```java
@SpringBootTest
public class PublisherApplicationTest {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Test
    public void test(){
        String queueName = "simple.queue";
        String message = "hello springboot";
        rabbitTemplate.convertAndSend(queueName,message);
    }
}
```

接收消息：

```java
@Component
public class SpringRabbitListener {
    @RabbitListener(queues = "simple.queue")
    public void listenSimpleQueueMessage(String msg) throws InterruptedException {
        System.out.println("spring 消费者接收到消息：【" + msg + "】");
    }
}
```

#### WorkQueues模式

多个消费者共同处理消息处理,

发送消息：

```java
@Test
public void testWorkQueue() throws InterruptedException {
    // 队列名称
    String queueName = "work.queue";
    // 消息
    String message = "hello, message_";
    for (int i = 0; i < 50; i++) {
        // 发送消息，每20毫秒发送一次，相当于每秒发送50条消息
        rabbitTemplate.convertAndSend(queueName, message + i);
        Thread.sleep(20);
    }
}
```

接收消息：

```java
@RabbitListener(queues = "work.queue")
public void listenWorkQueue1(String msg) throws InterruptedException {
    System.out.println("消费者1接收到消息：【" + msg + "】" + LocalTime.now());
    Thread.sleep(20);
}

@RabbitListener(queues = "work.queue")
public void listenWorkQueue2(String msg) throws InterruptedException {
    System.err.println("消费者2........接收到消息：【" + msg + "】" + LocalTime.now());
    Thread.sleep(200);
}
```

这样两个消费者接收到的消息数量是相同的，时间却没有均匀分配，导致第一个消费者处理完了，空闲了很多时间，后面都是2在干活

![image-20240215181439375](https://s2.loli.net/2024/02/15/jUPZwaN9gY3thm8.webp)

为了解决这个问题，使用能者多劳策略：

```yml
spring:
  rabbitmq:
    listener:
      simple:
        prefetch: 1 # 每次只能获取一条消息，处理完成才能获取下一个消息
```

运行结果：

![image-20240215182522776](https://s2.loli.net/2024/02/15/TymAPgip4eM9qx2.webp)

可以发现，由于消费者1处理速度较快，所以处理了更多的消息；消费者2处理速度较慢，所以处理了较少的消息

### 交换机

Exchange（交换机）只负责转发消息，不具备存储消息的能力，因此如果没有任何队列与Exchange绑定，或者没有符合路由规则的队列，那么消息会丢失！

交换机的类型有四种：

- **Fanout**：广播，将消息交给所有绑定到交换机的队列。我们最早在控制台使用的正是Fanout交换机
- **Direct**：订阅，基于RoutingKey（路由key）发送给订阅了消息的队列
- **Topic**：通配符订阅，与Direct类似，只不过RoutingKey可以使用通配符
- **Headers**：头匹配，基于MQ的消息头匹配，用的较少。

#### Fanout交换机

发布者发布消息：

```java
@Test
public void testFanoutExchange() {
    // 交换机名称
    String exchangeName = "cxk.fanout";
    // 消息
    String message = "hello, everyone!";
    rabbitTemplate.convertAndSend(exchangeName, "", message);
}
```

消费者接收消息：

```java
@RabbitListener(queues = "fanout.q1")
public void listenFanoutQueue1(String msg) {
    System.out.println("消费者1接收到Fanout消息：【" + msg + "】");
}

@RabbitListener(queues = "fanout.q2")
public void listenFanoutQueue2(String msg) {
    System.out.println("消费者2接收到Fanout消息：【" + msg + "】");
}
```

#### Direct交换机

Fanout会被所有队列消费，direct需要指定key，根据消息的`Routing Key`进行判断，只有队列的`Routingkey`与消息的 `Routing key`完全一致，才会接收到消息

创建交换机，和队列进行绑定，同时绑定key

![image-20240216083039583](https://s2.loli.net/2024/02/16/whyQSWqNx2fgX1b.webp)

消费者接收代码：

```java
@RabbitListener(queues = "direct.q1")
public void listenDirectQueue1(String msg) {
    System.out.println("消费者1接收到direct.queue1的消息：【" + msg + "】");
}

@RabbitListener(queues = "direct.q2")
public void listenDirectQueue2(String msg) {
    System.out.println("消费者2接收到direct.queue2的消息：【" + msg + "】");
}
```

生产者：

```java
@Test
public void testSendDirectExchange() {
    // 交换机名称
    String exchangeName = "cxk.direct";
    // 消息
    String message = "红色警报！日本乱排核废水，导致海洋生物变异，惊现哥斯拉！";
    // 发送消息
    rabbitTemplate.convertAndSend(exchangeName, "red", message);
}
```

将`red`改为blue，只有1可以接受

#### Topic交换机

`Topic`类型`Exchange`可以让队列在绑定`BindingKey` 的时候使用通配符，规则如下：

![image-20240216083922014](https://s2.loli.net/2024/02/16/ZzHLD38nGBbiFhl.webp)

创建交换机和队列绑定：

![image-20240216084043657](https://s2.loli.net/2024/02/16/7kCqu9jaVZvH23f.webp)

接受者：

```java
@RabbitListener(queues = "topic.q1")
public void listenTopicQueue1(String msg){
    System.out.println("消费者1接收到topic.queue1的消息：【" + msg + "】");
}

@RabbitListener(queues = "topic.q2")
public void listenTopicQueue2(String msg){
    System.out.println("消费者2接收到topic.queue2的消息：【" + msg + "】");
}
```

发送者：

```java
@Test
public void testSendTopicExchange() {
    // 交换机名称
    String exchangeName = "cxk.topic";
    // 消息
    String message = "喜报！孙悟空大战哥斯拉，胜!";
    // 发送消息
    rabbitTemplate.convertAndSend(exchangeName, "china.news", message);
}
```

#### 声明队列和交换机

SpringAMQP提供了一个Exchange接口，来表示所有不同类型的交换机：

![image-20240216090210938](https://s2.loli.net/2024/02/16/8YxsegFk2owHnaM.webp)

可以通过ExchangeBuilder来简化这个过程：

![image-20240216090351838](https://s2.loli.net/2024/02/16/3E7JvQAV5iCMGI6.webp)

在绑定队列和交换机时，则需要使用BindingBuilder来创建Binding对象

Fanout交换机：

```java
@Configuration
public class FanoutConfig {
    @Bean
    public FanoutExchange fanoutExchange(){
        return new FanoutExchange("cxk.fanout");
    }

    @Bean
    public Queue fanoutQueue1(){
        return new Queue("fanout.queue1");
    }

    /**
     * 绑定队列和交换机
     */
    @Bean
    public Binding bindingQueue1(Queue fanoutQueue1, FanoutExchange fanoutExchange){
        return BindingBuilder.bind(fanoutQueue1).to(fanoutExchange);
    }

    @Bean
    public Queue fanoutQueue2(){
        return new Queue("fanout.queue2");
    }
    @Bean
    public Binding bindingQueue2(Queue fanoutQueue2, FanoutExchange fanoutExchange){
        return BindingBuilder.bind(fanoutQueue2).to(fanoutExchange);
    }
}
```

Direct交换机

```java
@Configuration
public class DirectConfig {


    @Bean
    public DirectExchange directExchange() {
        return ExchangeBuilder.directExchange("cxk.direct").build();
    }

    @Bean
    public Queue directQueue1() {
        return new Queue("direct.queue1");
    }


    @Bean
    public Binding bindingQueue1WithRed(Queue directQueue1, DirectExchange directExchange) {
        return BindingBuilder.bind(directQueue1).to(directExchange).with("red");
    }

    @Bean
    public Binding bindingQueue1WithBlue(Queue directQueue1, DirectExchange directExchange) {
        return BindingBuilder.bind(directQueue1).to(directExchange).with("blue");
    }

    @Bean
    public Queue directQueue2() {
        return new Queue("direct.queue2");
    }

    @Bean
    public Binding bindingQueue2WithRed(Queue directQueue2, DirectExchange directExchange) {
        return BindingBuilder.bind(directQueue2).to(directExchange).with("red");
    }

    @Bean
    public Binding bindingQueue2WithYellow(Queue directQueue2, DirectExchange directExchange) {
        return BindingBuilder.bind(directQueue2).to(directExchange).with("yellow");
    }
}
```

显然这种方式比较麻烦，还可以使用注解方式来声明：

Direct交换机

```java
@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "direct.queue1"),
        exchange = @Exchange(name = "cxk.direct", type = ExchangeTypes.DIRECT),
        key = {"red", "blue"}
))
public void listenDirectQueue3(String msg) {
    System.out.println("消费者1接收到direct.queue1的消息：【" + msg + "】");
}

@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "direct.queue2"),
        exchange = @Exchange(name = "cxk.direct", type = ExchangeTypes.DIRECT),
        key = {"red", "yellow"}
))
public void listenDirectQueue4(String msg) {
    System.out.println("消费者2接收到direct.queue2的消息：【" + msg + "】");
}
```

Topic交换机：

```java
@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "topic.queue1"),
        exchange = @Exchange(name = "cxk.topic", type = ExchangeTypes.TOPIC),
        key = "china.#"
))
public void listenTopicQueue3(String msg){
    System.out.println("消费者1接收到topic.queue1的消息：【" + msg + "】");
}

@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "topic.queue2"),
        exchange = @Exchange(name = "cxk.topic", type = ExchangeTypes.TOPIC),
        key = "#.news"
))
public void listenTopicQueue4(String msg){
    System.out.println("消费者2接收到topic.queue2的消息：【" + msg + "】");
}
```

#### 消息转换器

默认的消息转换器是JDK序列化，问题如下：

- 数据体积过大
- 有安全漏洞
- 可读性差

测试发送

```java
@Test
public void testSendMap() throws InterruptedException {
    Map<String,Object> msg = new HashMap<>();
    msg.put("name", "蔡徐坤");
    msg.put("age", 21);
    rabbitTemplate.convertAndSend("object.queue", msg);
}
```

结果如下：

![image-20240216092030639](https://s2.loli.net/2024/02/16/WAUMV1k3OQndp5P.webp)

使用jackson转换：

```XML
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
    <version>2.9.10</version>
</dependency>
```

配置消息转换器：

```java
@Bean
public MessageConverter messageConverter(){
    // 1.定义消息转换器
    Jackson2JsonMessageConverter jackson2JsonMessageConverter = new Jackson2JsonMessageConverter();
    // 2.配置自动创建消息id，用于识别不同消息，也可以在业务中基于ID判断是否是重复消息
    jackson2JsonMessageConverter.setCreateMessageIds(true);
    return jackson2JsonMessageConverter;
}
```

![image-20240216094211110](https://s2.loli.net/2024/02/16/hFmG7O9wfWJHv3i.webp)

接收：

```Java
@RabbitListener(queues = "object.queue")
public void listenSimpleQueueMessage(Map<String, Object> msg) throws InterruptedException {
    System.out.println("消费者接收到object.queue消息：【" + msg + "】");
}
```

## RabbitMQ高级

导入依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

配置：

```yml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: cxk
    password: cxk
```

配置消息转换器：

```java
@Bean
public MessageConverter jackson2JsonMessageConverter(){
    return new Jackson2JsonMessageConverter();
}
```

修改代码：

```java
@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "mark.order.pay.queue", durable = "true"),
        exchange = @Exchange(name = "pay.topic", type = ExchangeTypes.TOPIC),
        key = "pay.success"
))
public void listenOrderPay(Long orderId) {
    orderService.markOrderPaySuccess(orderId);
}
```

下单后修改状态，发送消息：

```java
try {
    rabbitTemplate.convertAndSend("pay.topic", "pay.success", po.getBizOrderNo());
} catch (AmqpException e) {
    log.error("支付成功，但是通知交易服务失败",  e);
}
```

如果MQ通知失败，支付服务中支付流水显示支付成功，而交易服务中的订单状态却显示未支付，就会导致数据出现了不一致。

问题：

- 我们该如何确保MQ消息的可靠性？
- 如果发送失败，有没有其它的兜底方案？

### 发送者可靠性

消息队列的流程：

![image-20240216163341801](https://s2.loli.net/2024/02/16/yYEvPNWJ3ULBHQT.webp)

消息从生产者到消费者的每一步都可能导致消息丢失：

- 发送消息时丢失：
  - 生产者发送消息时连接MQ失败
  - 生产者发送消息到达MQ后未找到`Exchange`
  - 生产者发送消息到达MQ的`Exchange`后，未找到合适的`Queue`
  - 消息到达MQ后，处理消息的进程发生异常
- MQ导致消息丢失：
  - 消息到达MQ，保存到队列后，尚未消费就突然宕机
- 消费者处理消息时：
  - 消息接收后尚未处理突然宕机
  - 消息接收后处理过程中抛出异常

综上，我们要解决消息丢失问题，保证MQ的可靠性，就必须从3个方面入手：

- 确保生产者一定把消息发送到MQ
- 确保MQ不会将消息弄丢
- 确保消费者一定要处理消息

#### 生产者重试机制

当`RabbitTemplate`与MQ连接超时后，多次重试。

```YAML
spring:
  rabbitmq:
    connection-timeout: 1s # 设置MQ的连接超时时间
    template:
      retry:
        enabled: true # 开启超时重试机制
        initial-interval: 1000ms # 失败后的初始等待时间
        multiplier: 1 # 失败后下次的等待时长倍数，下次等待时长 = initial-interval * multiplier
        max-attempts: 3 # 最大重试次数
```

SpringAMQP提供的重试机制是**阻塞式**的重试，也就是说多次重试等待的过程中，当前线程是被阻塞的。

#### 生产者确认机制

RabbitMQ提供了生产者消息确认机制，包括`Publisher Confirm`和`Publisher Return`两种。在开启确认机制的情况下，当生产者发送消息给MQ后，MQ会根据消息处理的情况返回不同的**回执**。

![image-20240216164433519](https://s2.loli.net/2024/02/16/sJcECYObr247hKS.webp)

总结如下：

- 当消息投递到MQ，但是路由失败时，通过**Publisher Return**返回异常信息，同时返回ack的确认信息，代表投递成功
- 临时消息投递到了MQ，并且入队成功，返回ACK，告知投递成功
- 持久消息投递到了MQ，并且入队完成持久化，返回ACK ，告知投递成功
- 其它情况都会返回NACK，告知投递失败

其中`ack`和`nack`属于**Publisher Confirm**机制，`ack`是投递成功；`nack`是投递失败。而`return`则属于**Publisher Return**机制。

默认两种机制都是关闭状态，需要通过配置文件来开启。

#### 实现生产者确认

```YAML
spring:
  rabbitmq:
    publisher-confirm-type: correlated # 开启publisher confirm机制，并设置confirm类型
    publisher-returns: true # 开启publisher return机制
```

- `none`：关闭confirm机制
- `simple`：同步阻塞等待MQ的回执
- `correlated`：MQ异步回调返回回执

每个`RabbitTemplate`只能配置一个`ReturnCallback`，因此我们可以在配置类中统一设置

```java
@Slf4j
@Configuration
public class MqConfirmConfig implements ApplicationContextAware {
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        RabbitTemplate rabbitTemplate = applicationContext.getBean(RabbitTemplate.class);
        // 配置回调
        rabbitTemplate.setReturnsCallback(new RabbitTemplate.ReturnsCallback() {
            @Override
            public void returnedMessage(ReturnedMessage returned) {
                log.debug("收到消息的return callback，exchange:{}, key:{}, msg:{}, code:{}, text:{}",
                        returned.getExchange(), returned.getRoutingKey(), returned.getMessage(),
                        returned.getReplyCode(), returned.getReplyText());
            }
        });
    }
}
```

定义ConfirmCallback：

测试

```java
    @Test
    void testConfirmCallback() throws InterruptedException {
        // 1.创建cd
        CorrelationData cd = new CorrelationData(UUID.randomUUID().toString());
        // 2.添加ConfirmCallback
        cd.getFuture().addCallback(new ListenableFutureCallback<CorrelationData.Confirm>() {
            @Override
            public void onFailure(Throwable ex) {
                log.error("消息回调失败", ex);
            }

            @Override
            public void onSuccess(CorrelationData.Confirm result) {
                log.debug("收到confirm callback回执");
                if(result.isAck()){
                    // 消息发送成功
                    log.debug("消息发送成功，收到ack");
                }else{
                    // 消息发送失败
                    log.error("消息发送失败，收到nack， 原因：{}", result.getReason());
                }
            }
        });

        rabbitTemplate.convertAndSend("cxk.direct", "red", "hello", cd);

        Thread.sleep(2000);
    }
```

> 开启生产者确认比较消耗MQ性能，一般不建议开启。

### MQ可靠性

#### 数据持久化

默认情况下MQ的数据都是在内存存储的临时数据，重启后就会消失。

+ 交换机持久化
+ 队列持久化
+ 消息持久化

交换机：

![image-20240216174625963](https://s2.loli.net/2024/02/16/Co8NH2KqZhwl6S3.webp)

设置为`Durable`就是持久化模式，`Transient`就是临时模式。

#### LazyQueue持久化

默认情况下，RabbitMQ会将接收到的信息保存在内存中以降低消息收发的延迟。但在某些特殊情况下，这会导致消息积压，比如：

- 消费者宕机或出现网络故障
- 消息发送量激增，超过了消费者处理速度
- 消费者处理业务发生阻塞

一旦出现消息堆积问题，RabbitMQ的内存占用就会越来越高，直到触发内存预警上限。此时RabbitMQ会将内存消息刷到磁盘上，这个行为成为`PageOut`. `PageOut`会耗费一段时间，并且会阻塞队列进程。因此在这个过程中RabbitMQ不会再处理新的消息，生产者的所有请求都会被阻塞。为了解决这个问题，从RabbitMQ的3.6.0版本开始，就增加了Lazy Queues的模式，也就是惰性队列。惰性队列的特征如下：

- 接收到消息后直接存入磁盘而非内存
- 消费者要消费消息时才会从磁盘中读取并加载到内存（也就是懒加载）
- 支持数百万条的消息存储

配置lazy模式

![](https://s2.loli.net/2024/02/16/TLfdtaUhP6Svl34.webp)

代码配置

```Java
@Bean
public Queue lazyQueue(){
    return QueueBuilder
            .durable("lazy.queue")
            .lazy() // 开启Lazy模式
            .build();
}
```

或者：

```Java
@RabbitListener(queuesToDeclare = @Queue(
        name = "lazy.queue",
        durable = "true",
        arguments = @Argument(name = "x-queue-mode", value = "lazy")
))
public void listenLazyQueue(String msg){
    log.info("接收到 lazy.queue的消息：{}", msg);
}
```

测试代码：

```java
@Test
void testPageOut() {
    Message message = MessageBuilder
            .withBody("hello".getBytes(StandardCharsets.UTF_8))
            .setDeliveryMode(MessageDeliveryMode.NON_PERSISTENT).build();
    for (int i = 0; i < 1000000; i++) {
        rabbitTemplate.convertAndSend("lazy.queue", message);
    }
}
```

### 消费者可靠性

RabbitMQ 消费者可靠性是指确保消费者能够成功消费消息，并且不会丢失或重复消费消息。

#### 消费者确认机制

消息确认机制是 RabbitMQ 确保消息可靠性的核心机制。它允许消费者在消费消息后向 RabbitMQ 发送确认消息，表示消息已成功消费。RabbitMQ 在收到确认消息后才会从队列中删除该消息。

RabbitMQ提供了消费者确认机制（**Consumer Acknowledgement**）。即：当消费者处理消息结束后，应该向RabbitMQ发送一个回执，告知RabbitMQ自己消息处理状态。回执有三种可选值：

- ack：成功处理消息，RabbitMQ从队列中删除该消息
- nack：消息处理失败，RabbitMQ需要再次投递消息
- reject：消息处理失败并拒绝该消息，RabbitMQ从队列中删除该消息



RabbitMQ 提供了三种消息确认模式：

- **`none`**：不处理。即消息投递给消费者后立刻ack，消息会立刻从MQ删除。非常不安全，不建议使用
- **`manual`**：手动模式。需要自己在业务代码中调用api，发送`ack`或`reject`，存在业务入侵，但更灵活
- **`auto`**：自动模式。SpringAMQP利用AOP对我们的消息处理逻辑做了环绕增强，当业务正常执行时则自动返回`ack`.  当业务出现异常时，根据异常判断返回不同结果：
  - 如果是**业务异常**，会自动返回`nack`；
  - 如果是**消息处理或校验异常**，自动返回`reject`;

配置如下

```YAML
spring:
  rabbitmq:
    listener:
      simple:
        acknowledge-mode: none # 不做处理
```

#### 失败重试机制

当消费者出现异常后，消息会不断requeue（重入队）到队列，再重新发送给消费者。如果消费者再次执行依然出错，消息会再次requeue到队列，再次投递，直到消息处理成功为止。

>  极端情况就是消费者一直无法执行成功，那么消息requeue就会无限循环，导致mq的消息处理飙升，带来不必要的压力：

配置文件

```YAML
spring:
  rabbitmq:
    listener:
      simple:
        retry:
          enabled: true # 开启消费者失败重试
          initial-interval: 1000ms # 初识的失败等待时长为1秒
          multiplier: 1 # 失败的等待时长倍数，下次等待时长 = multiplier * last-interval
          max-attempts: 3 # 最大重试次数
          stateless: true # true无状态；false有状态。如果业务中包含事务，这里改为false
```

> 测试发现，消费者在失败后消息没有重新回到MQ无限重新投递，而是在本地重试了3次,3次失败后消息被删除，reject

#### 失败处理策略

策略是由`MessageRecovery`接口来定义的，它有3个不同实现：

-  `RejectAndDontRequeueRecoverer`：重试耗尽后，直接`reject`，丢弃消息。默认就是这种方式 
-  `ImmediateRequeueMessageRecoverer`：重试耗尽后，返回`nack`，消息重新入队 
-  `RepublishMessageRecoverer`：重试耗尽后，将失败消息投递到指定的交换机 

较好的处理方案是`RepublishMessageRecoverer`，失败后将消息投递到一个指定的，专门存放异常消息的队列，后续由人工集中处理。

consumer中定义失败交换机和队列：

```Java
@Bean
public DirectExchange errorMessageExchange(){
    return new DirectExchange("error.direct");
}
@Bean
public Queue errorQueue(){
    return new Queue("error.queue", true);
}
@Bean
public Binding errorBinding(Queue errorQueue, DirectExchange errorMessageExchange){
    return BindingBuilder.bind(errorQueue).to(errorMessageExchange).with("error");
}
```

定义一个RepublishMessageRecoverer，关联队列和交换机

```Java
@Bean
public MessageRecoverer republishMessageRecoverer(RabbitTemplate rabbitTemplate){
    return new RepublishMessageRecoverer(rabbitTemplate, "error.direct", "error");
}
```

完整代码：

```Java
@Configuration
@ConditionalOnProperty(name = "spring.rabbitmq.listener.simple.retry.enabled", havingValue = "true")
public class ErrorMessageConfig {
    @Bean
    public DirectExchange errorMessageExchange(){
        return new DirectExchange("error.direct");
    }
    @Bean
    public Queue errorQueue(){
        return new Queue("error.queue", true);
    }
    @Bean
    public Binding errorBinding(Queue errorQueue, DirectExchange errorMessageExchange){
        return BindingBuilder.bind(errorQueue).to(errorMessageExchange).with("error");
    }

    @Bean
    public MessageRecoverer republishMessageRecoverer(RabbitTemplate rabbitTemplate){
        return new RepublishMessageRecoverer(rabbitTemplate, "error.direct", "error");
    }
}
```

#### 业务幂等性

业务幂等性是指无论对一个操作执行多少次，其结果应该与执行一次的结果相同。在分布式系统和消息队列中，确保业务操作的幂等性是非常重要的，因为可能会出现重试、消息重复传递或者其他原因导致同一个操作被执行多次。

不幂等场景：

+ 取消订单，恢复库存，多次恢复会出现库存增加现象
+ 退款，多次退款堆商家有损失

实际业务场景中，经常会出现业务被重复执行的情况，例如：

- 页面卡顿时频繁刷新导致表单重复提交
- 服务间调用的重试
- MQ消息的重复投递

解决方案：

- 唯一消息ID
- 业务状态判断

唯一消息ID：

1. 每一条消息都生成一个唯一的id，与消息一起投递给消费者。
2. 消费者接收到消息后处理自己的业务，业务处理成功后将消息ID保存到数据库
3. 如果下次又收到相同消息，去数据库查询判断是否存在，存在则为重复消息放弃处理。

如何给消息添加唯一ID：SpringAMQP的MessageConverter自带了MessageID的功能，只要开启这个功能即可

```Java
@Bean
public MessageConverter messageConverter(){
    // 1.定义消息转换器
    Jackson2JsonMessageConverter jjmc = new Jackson2JsonMessageConverter();
    // 2.配置自动创建消息id，用于识别不同消息，也可以在业务中基于ID判断是否是重复消息
    jjmc.setCreateMessageIds(true);
    return jjmc;
}
```

业务判断，类似于乐观锁

```Java
    @Override
    public void markOrderPaySuccess(Long orderId) {
        // 1.查询订单
        Order old = getById(orderId);
        // 2.判断订单状态
        if (old == null || old.getStatus() != 1) {
            // 订单不存在或者订单状态不是1，放弃处理
            return;
        }
        // 3.尝试更新订单
        Order order = new Order();
        order.setId(orderId);
        order.setStatus(2);
        order.setPayTime(LocalDateTime.now());
        updateById(order);
    }
```

或者

```Java
@Override
public void markOrderPaySuccess(Long orderId) {
    // UPDATE order SET status = ? , pay_time = ? WHERE id = ? AND status = 1
    lambdaUpdate()
            .set(Order::getStatus, 2)
            .set(Order::getPayTime, LocalDateTime.now())
            .eq(Order::getId, orderId)
            .eq(Order::getStatus, 1)
            .update();
}
```

兜底方案：思想很简单：既然MQ通知不一定发送到交易服务，那么交易服务就必须自己**主动去查询**支付状态。这样即便支付服务的MQ通知失败，我们依然能通过主动查询来保证订单状态的一致。

通常我们采取的措施就是利用**定时任务**定期查询，例如每隔20秒就查询一次，并判断支付状态。如果发现订单已经支付，则立刻更新订单状态为已支付即可。

### 延迟消息

订单支付超时时间为30分钟，则我们应该在用户下单后的第30分钟检查订单支付状态，如果发现未支付，应该立刻取消订单，释放库存。问题：如何准确的实现在下单后第30分钟去检查支付状态呢？

**延迟任务**:在一段时间以后才执行的任务.

解决方案：

- 死信交换机+TTL
- 延迟消息插件

#### 死信交换机

死信交换机（Dead Letter Exchange，简称 DLX）是 RabbitMQ 中一个特殊的交换机，用于接收和路由成为死信的消息。

- 消息被拒绝 (basic.reject 或 basic.nack)
- 消息队列满了
- 消息 TTL 超时

如果一个队列中的消息已经成为死信，并且这个队列通过**`dead-letter-exchange`**属性指定了一个交换机，那么队列中的死信就会投递到这个交换机中，而这个交换机就称为**死信交换机**（Dead Letter Exchange）。而此时加入有队列与死信交换机绑定，则最终死信就会被投递到这个队列中。

使用死信交换机实现延迟消息的原理是：

1. 将消息发送到一个 TTL 超时时间为指定延迟时间的队列中。
2. 消息在队列中存活时间超过 TTL 时，会成为死信。
3. 死信会被路由到死信交换机
4. 死信交换机将死信路由到指定的队列，以便进行处理。

#### DelayExchange插件

地址：https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/tag/3.8.9

下载好后：

```sh
docker exec -it mq rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

声明交换机：

```Java
@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "delay.queue", durable = "true"),
        exchange = @Exchange(name = "delay.direct", delayed = "true"),
        key = "delay"
))
public void listenDelayMessage(String msg){
    log.info("接收到delay.queue的延迟消息：{}", msg);
}
```

发送延迟消息：

```Java
@Test
void testPublisherDelayMessage() {
    // 1.创建消息
    String message = "hello, delayed message";
    // 2.发送消息，利用消息后置处理器添加消息头
    rabbitTemplate.convertAndSend("delay.direct", "delay", message, new MessagePostProcessor() {
        @Override
        public Message postProcessMessage(Message message) throws AmqpException {
            // 添加延迟消息属性
            message.getMessageProperties().setDelay(5000);
            return message;
        }
    });
}
```

超时订单问题

> 假如订单超时支付时间为30分钟，理论上说我们应该在下单时发送一条延迟消息，延迟时间为30分钟。这样就可以在接收到消息时检验订单支付状态，关闭未支付订单。
>
> 但是大多数情况下用户支付都会在1分钟内完成，我们发送的消息却要在MQ中停留30分钟，额外消耗了MQ的资源。因此，我们最好多检测几次订单支付状态，而不是在最后第30分钟才检测。
>
> 例如：我们在用户下单后的第10秒、20秒、30秒、45秒、60秒、1分30秒、2分、...30分分别设置延迟消息，如果提前发现订单已经支付，则后续的检测取消即可。

定义记录消息延迟时间的消息体

```Java
@Data
public class MultiDelayMessage<T> {
    /**
     * 消息体
     */
    private T data;
    /**
     * 记录延迟时间的集合
     */
    private List<Long> delayMillis;
    public MultiDelayMessage(T data, List<Long> delayMillis) {
        this.data = data;
        this.delayMillis = delayMillis;
    }
    public static <T> MultiDelayMessage<T> of(T data, Long ... delayMillis){
        return new MultiDelayMessage<>(data, CollUtils.newArrayList(delayMillis));
    }

    /**
     * 获取并移除下一个延迟时间
     * @return 队列中的第一个延迟时间
     */
    public Long removeNextDelay(){
        return delayMillis.remove(0);
    }

    /**
     * 是否还有下一个延迟时间
     */
    public boolean hasNextDelay(){
        return !delayMillis.isEmpty();
    }
}
```

实现

```Java
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderStatusListener {

    private final IOrderService orderService;

    private final PayClient payClient;

    private final RabbitTemplate rabbitTemplate;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = MqConstants.DELAY_ORDER_QUEUE, durable = "true"),
            exchange = @Exchange(name = MqConstants.DELAY_EXCHANGE, type = ExchangeTypes.TOPIC),
            key = MqConstants.DELAY_ORDER_ROUTING_KEY
    ))
    public void listenOrderCheckDelayMessage(MultiDelayMessage<Long> msg) {
        // 1.获取消息中的订单id
        Long orderId = msg.getData();
        // 2.查询订单，判断状态：1是未支付，大于1则是已支付或已关闭
        Order order = orderService.getById(orderId);
        if (order == null || order.getStatus() > 1) {
            // 订单不存在或交易已经结束，放弃处理
            return;
        }
        // 3.可能是未支付，查询支付服务
        PayOrderDTO payOrder = payClient.queryPayOrderByBizOrderNo(orderId);
        if (payOrder != null && payOrder.getStatus() == 3) {
            // 支付成功，更新订单状态
            orderService.markOrderPaySuccess(orderId);
            return;
        }
        // 4.确定未支付，判断是否还有剩余延迟时间
        if (msg.hasNextDelay()) {
            // 4.1.有延迟时间，需要重发延迟消息，先获取延迟时间的int值
            int delayVal = msg.removeNextDelay().intValue();
            // 4.2.发送延迟消息
            rabbitTemplate.convertAndSend(MqConstants.DELAY_EXCHANGE, MqConstants.DELAY_ORDER_ROUTING_KEY, msg,
                    message -> {
                        message.getMessageProperties().setDelay(delayVal);
                        return message;
                    });
            return;
        }
        // 5.没有剩余延迟时间了，说明订单超时未支付，需要取消订单
        orderService.cancelOrder(orderId);
    }
}
```
