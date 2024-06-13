import {navbar} from "vuepress-theme-hope";

export default navbar([
    // { text: "快速导航", icon: "home", link: "/navigation/" },
    {text: "博客主页", icon: "blog", link: "/blog/"},
    {text: "代码笔记", icon: "code", link: "/posts/"},
    {text: "Java专题", icon: "java", link: "/java/"},
    {text: "算法专题", icon: "code", link: "/algorithm/"},
    {text: "每日一记", icon: "code", link: "/everyday/"},
    {text: "全栈开发", icon: "java", link: "/fullstack/"},
    //{text: "我的世界", icon: "java", link: "/minecraft/"},
    {text: "项目实战", icon: "workingDirectory", link: "/project/"},
    {text: "分类", icon: "categoryselected", link: "/category/",},
    // {text: "简历", icon: "info", link: "/about/",},
    {text: "时间线", icon: "timeline", link: "/timeline/",},
]);
