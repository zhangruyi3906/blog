---
title: Vue3入门
date: 2023-06-28 11:37:19
category: 
  - 前端
  - Vue3
tag:
  - 前端
  - Vue3
---

# Vue3

## Vite构建+配置

使用yarn初始化项目

```shell
yarn create vite
```

### Vite配置

#### 修改默认端口

```typescript
server: {
  port: 8081
}
```

#### 跨域问题

```typescript
server: {
    port: 8081,
    proxy: {
        '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
        }
    }
}
```

## Vue

### Ref与Reactive

ref修改需要value，reactive不需要

> - ref 能将任意类型的数据变为【响应式】的,Ref也可以像reactive一样包装对象
> - reactive 只能将对象类型变为【响应式】，对基本类型无效（例如 string，number，boolean）

```typescript
const msg = ref("hello world")
const user = reactive({
    name: "zhangsan",
    age: 18
})
function change() {
    msg.value = "hello vue3"
    user.name = "lisi"
    user.age = 20
}

```

> 页面中使用：不需要value
>
> ```vue
> <h1>{{ msg }}</h1>
> 姓名: {{ user.name }}<br>
> 年龄: {{ user.age }}
> ```

### 属性绑定

- 【:属性名】用来将标签属性与【响应式】变量绑定

> 这个是单向绑定，代码中属性变量，页面也变，但是页面变了，代码中不会改变
>
> 要双向绑定需要使用v-model

```ts
const buttonName=ref("按钮")
<input type="button" :value="buttonName">
```

### 事件绑定

+ 使用@click进行绑定

```vue
<h2>{{count}}</h2>
<input type="button" value="+" @click="add">
<input type="button" value="-" @click="del">
```

```typescript
const count = ref(0)
function add() {
    count.value++
}
function del() {
    count.value--
}
```

### 表单绑定

- 用 v-model 实现双向绑定，即
  - javascript 数据可以同步到表单标签
  - 反过来用户在表单标签输入的新值也会同步到 javascript 这边
- 双向绑定只适用于表单这种带【输入】功能的标签，其它标签的数据绑定，单向就足够了
- 复选框这种标签，双向绑定的 javascript 数据类型一般用数组

```ts
const user1 = ref({
    name: "zhangsan",
    age: 18,
    sex: "男",
    hobby: ["吃饭", "睡觉", "打豆豆"]
})
```

```vue
<div class="outer">
    <div>
        <label for="name">姓名:</label>
        <input type="text" id="name" v-model="user1.name">
    </div>
    <div>
        <label for="age">年龄:</label>
        <input type="text" id="age" v-model="user1.age">
    </div>
    <div>
        <label for="sex">性别:</label>
        男 <input type="radio" value="男" v-model="user1.sex">
        女 <input type="radio" value="女" v-model="user1.sex">
    </div>
    <div>
        <label for="hobby">爱好:</label>
        吃饭 <input type="checkbox" value="吃饭" v-model="user1.hobby">
        睡觉 <input type="checkbox" value="睡觉" v-model="user1.hobby">
        打豆豆 <input type="checkbox" value="打豆豆" v-model="user1.hobby">
    </div>
    <div>
        <input type="button" value="提交" @click="saveUser">
    </div>
</div>
```

### 计算属性

+ 有缓存功能

```typescript
const firstName = ref("张")
const lastName = ref("三")
const fullName = computed(() => {
    return firstName.value + lastName.value
})
```

```vue
{{ fullName}}
```

### 监听器

```typescript
const name = ref("张三")
watch(name, (newVal, oldVal) => {
    console.log(newVal, oldVal)
})
```

```vue
<input type="text" v-model="name">
```

### 组件

子组件如下：

通过defineProps定义属性，使用插值表达式使用，非可选加？

```vue
<template>
    <div class="container">
        <div class="card">
            <div>
                <p class="name">{{ name }}</p>
                <p class="location">{{ country }}</p>
            </div>
            <img :src="avatar || '/src/assets/vue.svg'"/>
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps<{ name: string, country: string, avatar?: string }>()
</script>
```

父组件使用：

```vue
<Child country="北京" name="蔡徐坤" />
<Child country="南京" name="蔡徐坤啊" avatar="/vite.svg" />
```

## Vueuse

### 安装

```shell
npm i @vueuse/core
```

### 使用

```vue
<div>
    X:{{ X }} <br>
    Y:{{ Y }}
</div>
```

```typescript
const {X, Y} = useMouse()
```

## VueRequest

### 安装

```shell
yarn add vue-request
```

### 使用

配合计算属性一起用

```typescript
const {data} = useRequest<AxiosRespList<Student>>(() => axios.get("/api/students"))
const students = computed(() => {
    return data?.value?.data.data || []
})
```

```vue
<h3 v-if="students.length===0">暂无数据</h3>
<ul v-else>
    <li v-for="item in students" :key="item.id">
        {{ item.name }}
    </li>
</ul>
```

## Axios

### 安装

```shell
yarn add axios
```

简单实用

```typescript
const getStudent = async () => {
    // const res = await axios.get("http://localhost:8080/api/students")
    const res = await axios.get("/api/students")
    console.log(res)
}

onMounted(() => {
    getStudent()
})
```

> 注意跨域问题：
>
> 本地发请求必须是：http://localhost:7070/ ，不可以写为127.0.0.1

### 环境变量

区分开发环境和生产环境，这件事交给构建工具 vite 来做

默认情况下，vite 支持上面两种环境，分别对应根目录下两个配置文件

- .env.development - 开发环境
- .env.production - 生产环境

针对以上需求，分别在两个文件中加入

```
VITE_BACKEND_API_BASE_URL = 'http://localhost:8080'
```

```
VITE_BACKEND_API_BASE_URL = 'http://xxx.com'
```

然后在代码中使用 vite 给我们提供的特殊对象 `import.meta.env`，就可以获取到 `VITE_BACKEND_API_BASE_URL` 在不同环境下的值

```typescript
import.meta.env.VITE_BACKEND_API_BASE_URL
```

#### 编辑器智能提示

做如下配置：新增文件 `src/env.d.ts` 并添加如下内容

```typescript
interface ImportMetaEnv {
  readonly VITE_BACKEND_API_BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 封装自己的axios

在/src/api下面新建一个文件request.ts

```typescript
import axios from "axios";

const _axios = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL
})

export default _axios

```

### 请求与响应拦截

```typescript
// 请求拦截器
_axios.interceptors.request.use(
    (config) => { // 统一添加请求头
        config.headers['Authorization'] = 'cxk';
        return config
    },
    (error) => { // 请求出错时的处理
        return Promise.reject(error)
    }
)

// 响应拦截器
_axios.interceptors.response.use(
    (response) => { // 状态码  2xx
        // 这里的code是自定义的错误码
        if (response.data.code === 200) {
            return response
        } else if (response.data.code === 401) {
            // 情况1
            return Promise.resolve({})
        }
        // ... 
    },
    (error) => { // 状态码 > 2xx, 400,401,403,404,500
        console.error(error) // 处理了异常
        if (error.response.status === 400) {
            // 情况1
        } else if (error.response.status === 401) {
            // 情况2
        }
        // ...
        return Promise.resolve({})
    }
)
```

请求例子，封装类型interface

```typescript
interface Student {
    id: number,
    name: string,
    sex: string,
    age: number
}
const students = ref<Student[]>([])
const getStudents = async () => {
    const res = await axios.get('/api/students');
    console.log(res.data);
    students.value = res.data.data;
}
```

使用：

```vue
<div class="tbody">
  <div v-if="students.length === 0">暂无数据</div>
  <template v-else>
    <div class="row" v-for="s of students">
      <div class="col">{{ s.id }}</div>
      <div class="col">{{ s.name }}</div>
      <div class="col">{{ s.sex }}</div>
      <div class="col">{{ s.age }}</div>
    </div>
  </template>
</div>
```

### 前端封装后端传来的类型

在src/model文件夹下面新建文件Model8080.ts

```typescript
export interface Student {
    id: number,
    name: string,
    sex: string,
    age: number
}

// 如果 spring 错误，返回的对象格式
export interface SpringError {
    timestamp: string,
    status: number,
    error: string,
    message: string,
    path: string
}

// 如果 spring 成功，返回 list 情况
export interface SpringList<T> {
    data: T[],
    message?: string,
    code: number
}

// 如果 spring 成功，返回 page 情况
export interface SpringPage<T> {
    code: number,
    data: { list: T[], total: number },
    message?: string
}
```

更改axios范型返回值

```typescript
const res = await axios.get<SpringList<Student>>('/api/students');
```

## Vue-router

### 安装

```shell
yarn add vue-router@4
```

### 创建路由

```typescript
import {createRouter, createWebHashHistory} from 'vue-router'
import A51 from '../views/A51.vue'
import A52 from '../views/A52.vue'
// 路由 => 路径和组件之间的对应关系
const routes = [
    {
        path: '/a1',
        component: A51
    },
    {
        path: '/a2',
        component: A52
    }
]

const router = createRouter({
    history: createWebHashHistory(), // 路径格式
    routes: routes // 路由数组
})

export default router

```

动态导入(推荐)：

```typescript
{
    path: '/a3',
    component: () => import('../views/A53.vue')
}
```

### 使用

在main.ts中：

```typescript
createApp(App)
    .use(router)
    .mount('#app')
```

在父级容器中使用router-view

```typescript
<template>
    <div class="a5">
        <router-view> </router-view>
    </div>
</template>
```

### 嵌套路由

```typescript
{
    path: '/a3',
    component: () => import('../views/A53.vue'),
    children: [
        {
            path: 'student',
            component: () => import('../views/A531.vue')
        },
        {
            path: 'teacher',
            component: () => import('../views/A532.vue')
        }
    ]
}
```

### 重定向

访问/a3跳到/a3/student

访问不存在的跳到404页面，即a2

```typescript
{
    path: '/a3',
    component: () => import('../views/A53.vue'),
    redirect: '/a3/student',// 重定向 访问/a3时，自动跳转到/a3/student
    children: [
        {
            path: 'student',
            component: () => import('../views/A531.vue')
        },
        {
            path: 'teacher',
            component: () => import('../views/A532.vue')
        }
    ]
},
{
    //匹配不到路由时，跳转到404页面
    path: '/:pathMatch(.*)*',
    redirect: '/a2'
}
```



## Pinia

### 安装

```shell
yarn add pinia
```

### 引入

在main.ts中引入pinia

```typescript
import {createPinia} from "pinia";

createApp(App)
    .use(router)
    .use(createPinia())
    .mount('#app')
```



## Vuex

### 安装

```shell
yarn add vuex@next --save
```

### 使用



## Ant Design of Vue

### 安装

```shell
yarn add ant-design-vue
```



