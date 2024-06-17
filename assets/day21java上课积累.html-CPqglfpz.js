import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as t,c as o,d as a}from"./app-Cxh2L1Vs.js";const i={},p=a(`<p><img src="https://s2.loli.net/2024/06/17/iY7pfDdBXHewoJx.png" alt="image-20240617092744058"></p><p>第4题：</p><p>两种解法：</p><pre><code> 1. select  a.mc,a.count-b.count from (select AAA.mc,AAA.sum(sl) count from AAA) a,(select BBB.mc,BBB.sum(sl) count from BBB)b where a.mc=b.mc;
 1. select a.mc,(a.sl-sum(b.sl)) from AAA a,BBB b where a.mc=b.mc group by b.mc;
</code></pre><p><img src="https://s2.loli.net/2024/06/17/Gpfa9tAcOoix6n3.jpg" alt="img"><img src="https://s2.loli.net/2024/06/17/VxuYQRab379UOGI.jpg" alt="img"></p><p>安卓方面涉及到的技术有：</p><ol><li><p>java语言开发</p></li><li><p>安卓软件开发包（android SDK）</p></li><li><p>安卓应用程序架构</p><p>安卓应用程序采用MVC（Model-View-Controller）、MVVM（Model=View-ViewModel）等架构模式。</p></li><li><p>数据存储（SQLite数据库）</p></li><li><p>网络通信</p><p>安卓应用需要与网络进行交互，使用内置的HttpURLConnection等库进行网络请求和数据传输。</p></li><li><p>多媒体支持</p><p>安卓支持图像、视频、音频等多媒体格式</p></li><li><p>后台任务和多线程处理</p><p>支持各种后台任务</p></li><li></li></ol>`,7),r=[p];function l(c,n){return t(),o("div",null,r)}const d=e(i,[["render",l],["__file","day21java上课积累.html.vue"]]),A=JSON.parse('{"path":"/everyday/java%E5%AD%A6%E4%B9%A0/%E9%9D%A2%E8%AF%95%E9%A2%98/day21java%E4%B8%8A%E8%AF%BE%E7%A7%AF%E7%B4%AF.html","title":"面试积累","lang":"en-US","frontmatter":{"title":"面试积累","date":"2024-06-17T00:00:00.000Z","category":["面试题"],"tag":["面试题"],"description":"image-20240617092744058 第4题： 两种解法： imgimg 安卓方面涉及到的技术有： java语言开发 安卓软件开发包（android SDK） 安卓应用程序架构 安卓应用程序采用MVC（Model-View-Controller）、MVVM（Model=View-ViewModel）等架构模式。 数据存储（SQLite数据库）...","head":[["meta",{"property":"og:url","content":"https://github.com/zhangruyi3906/blog/everyday/java%E5%AD%A6%E4%B9%A0/%E9%9D%A2%E8%AF%95%E9%A2%98/day21java%E4%B8%8A%E8%AF%BE%E7%A7%AF%E7%B4%AF.html"}],["meta",{"property":"og:site_name","content":"乘风破浪（长风破浪会有时，直挂云帆济沧海）"}],["meta",{"property":"og:title","content":"面试积累"}],["meta",{"property":"og:description","content":"image-20240617092744058 第4题： 两种解法： imgimg 安卓方面涉及到的技术有： java语言开发 安卓软件开发包（android SDK） 安卓应用程序架构 安卓应用程序采用MVC（Model-View-Controller）、MVVM（Model=View-ViewModel）等架构模式。 数据存储（SQLite数据库）..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://s2.loli.net/2024/06/17/iY7pfDdBXHewoJx.png"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-06-17T02:57:09.000Z"}],["meta",{"property":"article:author","content":"dreamchaser"}],["meta",{"property":"article:tag","content":"面试题"}],["meta",{"property":"article:published_time","content":"2024-06-17T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-17T02:57:09.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"面试积累\\",\\"image\\":[\\"https://s2.loli.net/2024/06/17/iY7pfDdBXHewoJx.png\\",\\"https://s2.loli.net/2024/06/17/Gpfa9tAcOoix6n3.jpg\\",\\"https://s2.loli.net/2024/06/17/VxuYQRab379UOGI.jpg\\"],\\"datePublished\\":\\"2024-06-17T00:00:00.000Z\\",\\"dateModified\\":\\"2024-06-17T02:57:09.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"dreamchaser\\",\\"url\\":\\"https://github.com/zhangruyi3906\\"}]}"]]},"headers":[],"git":{"createdTime":1718593029000,"updatedTime":1718593029000,"contributors":[{"name":"zhangruyi3906","email":"3023208132@qq.com","commits":1}]},"readingTime":{"minutes":0.74,"words":221},"filePathRelative":"everyday/java学习/面试题/day21java上课积累.md","localizedDate":"June 17, 2024","excerpt":"<p><img src=\\"https://s2.loli.net/2024/06/17/iY7pfDdBXHewoJx.png\\" alt=\\"image-20240617092744058\\"></p>\\n<p>第4题：</p>\\n<p>两种解法：</p>\\n<pre><code> 1. select  a.mc,a.count-b.count from (select AAA.mc,AAA.sum(sl) count from AAA) a,(select BBB.mc,BBB.sum(sl) count from BBB)b where a.mc=b.mc;\\n 1. select a.mc,(a.sl-sum(b.sl)) from AAA a,BBB b where a.mc=b.mc group by b.mc;\\n</code></pre>","autoDesc":true}');export{d as comp,A as data};
