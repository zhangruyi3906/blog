import {defineUserConfig} from "vuepress";
import theme from "./theme.js";
import {searchProPlugin} from "vuepress-plugin-search-pro";
import {registerComponentsPlugin} from "@vuepress/plugin-register-components";
import {path} from "@vuepress/utils";

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

        // 注册全局组件的插件
        registerComponentsPlugin({
            componentsDir: path.resolve(__dirname, "./components"),
        }),
    ],


});
