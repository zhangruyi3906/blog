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
            text: "代码笔记", // 分组显示名称
            icon: "book", // 分组显示图标
            children: "structure", // 分组下的子分组或页面 structure代表自动获取
        },
  ],

  "/everyday/":[
    {
      text: "学习记录",
      icon: "ability",
       children: "structure", // 分组下的子分组或页面 structure代表自动获取
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
