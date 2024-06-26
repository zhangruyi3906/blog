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

  "/everyday/": [
        {
            text: "学习记录", // 分组显示名称
            icon: "ability", // 分组显示图标
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
