import {defineUserConfig} from "vuepress";
import theme from "./theme.js";
import {searchProPlugin} from "vuepress-plugin-search-pro";
import {registerComponentsPlugin} from "@vuepress/plugin-register-components";

export default defineUserConfig({
    base: "/",
    lang: "zh-CN",
    title: "全民制作人ikun",
    description: "vuepress-theme-hope 博客",
    theme,
    plugins: [
        // 搜索插件
        searchProPlugin({
            // 索引全部内容
            indexContent: true,
        }),

    ],


});