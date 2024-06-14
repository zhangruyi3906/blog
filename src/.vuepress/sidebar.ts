import { sidebar } from "vuepress-theme-hope";

export const Sidebar = sidebar({
//开源项目
    "/project/": [
        {
            text: "项目", // 分组显示名称
            icon: "community", // 分组显示图标
            children: "structure", // 分组下的子分组或页面 structure代表自动获取
            // collapsible: false,
        },
    ],
	"/java/": [
        {
            text: "Java", // 分组显示名称
            icon: "book", // 分组显示图标
            children: "structure", // 分组下的子分组或页面 structure代表自动获取
        },
    ],
  // 代码笔记的侧边栏
  "/docs/": [
    {
      text: "Java核心",
      icon: "java",
      collapsible: true,
      prefix: "/docs/javacore/",
      children: [
        {
          text: "Java基础-面向对象",
          icon: "write",
          link: "Java基础-面向对象.md",
        },
        {
          text: "Java基础-泛型机制",
          icon: "write",
          link: "Java基础-泛型机制.md",
        },
        {
          text: "Java基础-注解机制",
          icon: "write",
          link: "Java基础-注解机制.md",
        },
        {
          text: "Java基础-异常机制",
          icon: "write",
          link: "Java基础-异常机制.md",
        },
        {
          text: "Java基础-反射机制",
          icon: "write",
          link: "Java基础-反射机制.md",
        },
        {
          text: "Java集合-类关系图",
          icon: "write",
          link: "Java集合-类关系图.md",
        },
        {
          text: "Java集合-ArrayList",
          icon: "write",
          link: "Java集合-ArrayList.md",
        },
        {
          text: "Java8新特性",
          icon: "write",
          link: "Java8新特性.md",
        },
        {
          text: "Java中的SPI机制",
          icon: "write",
          link: "Java中的SPI机制.md",
        },
      ],
    },


    {
      text: "算法和数据结构",
      icon: "ability",
      collapsible: true,
      prefix: "/docs/algdata/",
      children: [
        {
          text: "算法小抄",
          icon: "like",
          collapsible: true,
          prefix: "lbld/",
          children: [
            "算法小抄核心套路.md",
            "算法小抄数学运算.md",
            "算法小抄动态规划.md",
            "算法小抄数据结构.md",
            "算法小抄算法思维.md",
            "算法小抄高频面试.md",
          ],
        },
      ],
    },

  ],

  "/everyday/":[
    {
      text: "学习记录",
      icon: "ability",
      collapsible: true,
      prefix: "/everyday/everydaystudy/",
      children: [
        {
          text: "每日学习",
          icon: "like",
          collapsible: true,
          prefix: "studyrecord/",
          children: [
            "2024.5.11-搭建博客升级版+学习.md",
          ],
        },
      ],
    },
  ],
"/interview/": [
        {
            text: "面试题", // 分组显示名称
            icon: "java", // 分组显示图标
            children: "structure", // 分组下的子分组或页面 structure代表自动获取
        },
    ],
  // 开源项目的侧边栏
  "/autodir/": "structure"
});
