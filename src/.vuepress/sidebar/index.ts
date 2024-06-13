import {sidebar} from "vuepress-theme-hope";

export default sidebar({
    //开源项目
    "/project/": [
        {
            text: "项目", // 分组显示名称
            icon: "community", // 分组显示图标
            children: "structure", // 分组下的子分组或页面 structure代表自动获取
            // collapsible: false,
        },
    ],
    //算法专题
    "/algorithm/": [
        {
            text: "算法专题", // 分组显示名称
            icon: "community", // 分组显示图标
            children: "structure", // 分组下的子分组或页面 structure代表自动获取
            // collapsible: true,
        },
    ],

    "/posts/": [
        {
            text: "文章", // 分组显示名称
            icon: "book", // 分组显示图标
            children: "structure", // 分组下的子分组或页面 structure代表自动获取
        },
    ],
    "/java/": [
        {
            text: "Java", // 分组显示名称
            icon: "book", // 分组显示图标
            children: "structure", // 分组下的子分组或页面 structure代表自动获取
        },
    ],
    "/fullstack/": [
        {
            text: "全栈开发", // 分组显示名称
            icon: "book", // 分组显示图标
            children: "structure", // 分组下的子分组或页面 structure代表自动获取
        },
    ],
    "/minecraft/": [
        {
            text: "我的世界", // 分组显示名称
            icon: "book", // 分组显示图标
            children: "structure", // 分组下的子分组或页面 structure代表自动获取
        },
    ],
    "/reflection/": [
        {
            text: "狂人日记", // 分组显示名称
            icon: "creative", // 分组显示图标
            children: "structure", // 分组下的子分组或页面 structure代表自动获取
        },
    ]
});


