import { navbar } from "vuepress-theme-hope";

export const Navbar = navbar([
  {text: "时间线", icon: "timeline", link: "/timeline/",},
  {text: "分类", icon: "categoryselected", link: "/category/",}, 
  { text: "快速导航", icon: "home", link: "/navigation/" },
  { text: "博客主页", icon: "blog", link: "/blog/" },
  { text: "代码笔记", icon: "code", link: "/docs/" },
  { text: "Java学习专题", icon: "free", link: "/java/" },
  { text: "面试", icon: "free", link: "/interview/" },
  { text: "每日一记", icon: "free", link: "/everyday/" },
  {text: "项目实战", icon: "workingDirectory", link: "/project/"},
  {
    text: "资源备忘录",
    icon: "advance",
    prefix: "/resources/",
    children: [
      {
        text: "书籍资源",
        icon: "animation",
        link: "books/",
      },
      {
        text: "宝藏工具",
        icon: "play",
        link: "tools/",
      },
    ],
  },
]);
