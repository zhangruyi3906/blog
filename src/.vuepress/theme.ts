import {hopeTheme} from "vuepress-theme-hope";
import navbar from "./navbar/index";
import sidebar from "./sidebar/index";

export default hopeTheme({
    // 当前网站部署到的域名
    hostname: "https://github.com/yunfeidog",
    author: {
        name: "全民制作人ikun",
        url: "https://github.com/yunfeidog",
    },
    // 使用官方提供的图标库-也可以构建自己的图标库
    iconAssets: "iconfont",
    // 网站图标
    logo: "/site_logo.png",
    docsDir: "src",
    // navbar
    navbar,

    // sidebar
    sidebar,
    headerDepth: 6,

    // 默认为 GitHub. 同时也可以是一个完整的 URL
    repo: "https://github.com/yunfeidog",
    // 自定义仓库链接文字。默认从 `repo` 中自动推断为
    // "GitHub" / "GitLab" / "Gitee" / "Bitbucket" 其中之一，或是 "Source"。
    repoLabel: "GitHub",
    // 是否在导航栏内显示仓库链接，默认为 `true`
    repoDisplay: true,
    footer:  '<a href="https://beian.miit.gov.cn/" target="_blank">皖ICP备2023022209</a>',
    pageInfo: ["Category", "Tag", "ReadingTime", "Date", "Word", "Author", "PageView"],
    // 路径导航
    breadcrumb: true,
    // 路径导航的图标显示
    breadcrumbIcon: true,
    themeColor: true,
    displayFooter: true,
    // 暗黑模式切换-在深色模式和浅色模式中切换
    darkmode: "toggle",
    // 全屏按钮
    fullscreen: true,
    // 返回顶部按钮-下滑300px后显示
    backToTop: true,
    // 纯净模式-禁用
    pure: false,
    // 文章的最后更新时间
    lastUpdated: true,

    blog: {
        description: "一个全栈开发者",
        intro: "/intro.html",
        medias: {
            Email: "1844025705@qq.com",
            GitHub: "https://github.com/yunfeidog",
            Gmail: "hyf1844025705@gmail.com",
            QQ: "1844025705",
            Wechat: "17851302691",
        },
        avatar: "/site_logo.png",
        roundAvatar: true,// 头像是否为圆形
        articlePerPage: 10, // 首页每页显示的文章数量
        // 博客的侧边栏设置
        sidebarDisplay: "mobile",
    },

    encrypt: {
        config: {
            "/about": ["12345"],
        },
    },

    // page meta
    metaLocales: {
        editLink: "在 GitHub 上编辑此页",
    },
    editLink: false,
    plugins: {
        autoCatalog: {
            index: true
        },
        // 打开博客功能
        blog: {
            // 在文章列表页面自动提取文章的摘要进行显示
            excerpt: true,
        },
        copyright: {
            author: "全民制作人cxk",
            canonical: "",
            global: true,
            license: "CC-BY-NC-SA-4.0",
            triggerLength: 200,
        },
        // @ts-ignore
        components: ["BiliBili"],
        // all features are enabled for demo, only preserve features you need here
        mdEnhance: {
            align: true,
            attrs: true,
            chart: true,
            codetabs: true,
            demo: true,
            echarts: true,
            figure: true,
            flowchart: true,
            gfm: true,
            imgLazyload: true,
            imgSize: true,
            include: true,
            katex: true,
            mark: true,
            mermaid: true,
            playground: {
                presets: ["ts", "vue"],
            },

            presentation: ["highlight", "math", "search", "notes", "zoom"],
            stylize: [
                {
                    matcher: "Recommended",
                    replacer: ({tag}) => {
                        if (tag === "em")
                            return {
                                tag: "Badge",
                                attrs: {type: "tip"},
                                content: "Recommended",
                            };
                    },
                },
            ],
            sub: true,
            sup: true,
            tabs: true,
            vPre: true,
            vuePlayground: true,
        },


    },
});
