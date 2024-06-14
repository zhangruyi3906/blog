---
title: 使用策略模式消除ifelse
date: 2024-05-18
category:
  - Java
  - 设计模式
tag:
  - Java
  - 设计模式
  - 策略模式
---

# 使用策略模式消除ifelse

> 有这样的场景，根据不同的套餐，有不同的计算方式，全部在一个函数里面，使用if+else不停的判断，导致一个方法堆了成百上千行，而且不同的service里面都有这个关于不同套餐的计算方式。为了解决这个问题，学习使用策略模式消除，使得代码遵循开闭原则，新增新的套餐会变得容易

## 策略模式

代码

现在有一个coding函数，我们想要根据传入的codeType来进行判断使用那个编辑器coding，如果这样ifelse写的话，每次新加一个编辑器，这边都要进行修改，不符合软件设计的开闭原则。

```java
public void coding(String codeType) {
    if (Objects.equals("IDEA", codeType)) {
        System.out.println("使用IDEA编码");
    } else if (Objects.equals("Eclipse", codeType)) {
        System.out.println("使用Eclipse编码");
    }
    //...
}
```

修改

我们先定义一个编码接口

```java
public interface Program {
    void coding();
}
```

然后去实现不同种的编码方案：

```java
public class Eclipse implements Program{
    @Override
    public void coding() {
        System.out.println("使用Eclipse编码");
    }
}

public class IDEA implements Program{
    @Override
    public void coding() {
        System.out.println("使用IDEA编码");
    }
}
```

使用

定义一个操作类，注入Program

```java
private Program program;

public StrategyPattern(Program program) {
    this.program = program;
}

public Program getProgram() {
    return program;
}

public void setProgram(Program program) {
    this.program = program;
}

public void startCoding(){
    program.coding();
}


```

测试

```java
    public void coding(String codeType) {
        switch (codeType) {
            case "Eclipse":
                new StrategyPattern(new Eclipse()).startCoding();
                break;
            case "IDEA":
                new StrategyPattern(new IDEA()).startCoding();
                break;
            default:
                System.out.println("使用其他IDE编码");
        }
    }
```

这样其实还是ifelse，但是代码会简洁很多更容易维护，下面进行消除

## 策略模式+工厂模式+模版方法

上面的代码其实还是有点冗余问题，我们可以使用策略模式+工厂模式+模版方法接口，

todo



## 策略枚举

定义一个枚举类，表示有哪些分支：

```java
public enum ProgramEnums {
    ECLIPSE("Eclipse"),
    IDEA("IDEA");

    private String codeType;

    ProgramEnums(String codeType) {
        this.codeType = codeType;
    }

    public String getCodeType() {
        return codeType;
    }
}
```

定义一个工厂类，用来根据type获取对应的实现

```java
public class ProgramFactory {
    private static final Map<String, Program> PROGRAM_MAP = new HashMap<>();

    static {
        PROGRAM_MAP.put("Eclipse", new Eclipse());
        PROGRAM_MAP.put("IDEA", new IDEA());
    }

    public static Map<String, Program> getProgramMap(String codeType) {
        return PROGRAM_MAP;
    }
}
```

使用：

```java
public static void main(String[] args) {
    String codeType = "IDEA";
    Program programMap = ProgramFactory.getProgramMap(codeType);
    programMap.coding();
}
```