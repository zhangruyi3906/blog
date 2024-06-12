---
title: TypeScript入门
date: 2023-06-28 11:01:12
category: 
  - 前端
  - TypeScript
tag:
  - 前端
  - TypeScript
---

# TypeScript

## 安装

```shell
npm install -g typescript
```

编译ts文件：

```shell
tsc +文件名
```

## 类型

| 类型        | 例                                    | 备注                         |
| :---------- | :------------------------------------ | :--------------------------- |
| 字符串类型  | string                                |                              |
| 数字类型    | number                                |                              |
| 布尔类型    | boolean                               |                              |
| 数组类型    | number[],string[], boolean[] 依此类推 |                              |
| 任意类型    | any                                   | 相当于又回到了没有类型的时代 |
| 复杂类型    | type 与 interface                     |                              |
| 函数类型    | () => void                            | 对函数的参数和返回值进行说明 |
| 字面量类型  | "a"\|"b"\|"c"                         | 限制变量或参数的取值         |
| nullish类型 | null 与 undefined                     |                              |
| 泛型        | `<T>`，`<T extends 父类型>`           |                              |

例如：

```typescript
//加在变量后面
let message: string = 'Hello World'

//函数参数
function test(obj: string) {
    console.log(obj)
}

const names = ['Alice', 'Bob', 'Eve']
const lowerNames = names.map((name: string) => name.toLowerCase())
console.log(lowerNames)

//返回值
function add(a: number, b: number): number {
    return a + b
}
```

### Type和Interface

比较常用 ,建议使用interface，加？代表可选

```typescript
//type
type  Cat = {
    name: string,
    age: number
}
const cat1: Cat = {name: 'Tom', age: 3}
const cat2: Cat = {name: 'Jerry', age: 5}

//interface

interface Dog {
    name: string,
    age: number
}

const dog1: Dog = {name: 'Tom', age: 3}
const dog2: Dog = {name: 'Jerry', age: 5}

interface Ref<T> {
  value: T
}

const r1: Ref<string> = { value: 'hello' }
const r2: Ref<number> = { value: 123 }
const r3: Ref<boolean> = { value: true }
```

### 给对象的方法定义类型

```typescript
interface Api {
    foo(): void

    bar(str: string): string
}

function test(api: Api) {
    api.foo();
    api.bar('hello')
}

test({
    foo() {
        console.log('foo');
    },
    bar(str) {
        return str.toUpperCase()
    }
})

```



