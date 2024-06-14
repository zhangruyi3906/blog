import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,d as t}from"./app-BgxpRbmw.js";const p={},e=t(`<h1 id="使用策略模式消除ifelse" tabindex="-1"><a class="header-anchor" href="#使用策略模式消除ifelse"><span>使用策略模式消除ifelse</span></a></h1><blockquote><p>有这样的场景，根据不同的套餐，有不同的计算方式，全部在一个函数里面，使用if+else不停的判断，导致一个方法堆了成百上千行，而且不同的service里面都有这个关于不同套餐的计算方式。为了解决这个问题，学习使用策略模式消除，使得代码遵循开闭原则，新增新的套餐会变得容易</p></blockquote><h2 id="策略模式" tabindex="-1"><a class="header-anchor" href="#策略模式"><span>策略模式</span></a></h2><p>代码</p><p>现在有一个coding函数，我们想要根据传入的codeType来进行判断使用那个编辑器coding，如果这样ifelse写的话，每次新加一个编辑器，这边都要进行修改，不符合软件设计的开闭原则。</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">coding</span><span class="token punctuation">(</span><span class="token class-name">String</span> codeType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">Objects</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span><span class="token string">&quot;IDEA&quot;</span><span class="token punctuation">,</span> codeType<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;使用IDEA编码&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">Objects</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span><span class="token string">&quot;Eclipse&quot;</span><span class="token punctuation">,</span> codeType<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;使用Eclipse编码&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改</p><p>我们先定义一个编码接口</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Program</span> <span class="token punctuation">{</span>
    <span class="token keyword">void</span> <span class="token function">coding</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后去实现不同种的编码方案：</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Eclipse</span> <span class="token keyword">implements</span> <span class="token class-name">Program</span><span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">coding</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;使用Eclipse编码&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">IDEA</span> <span class="token keyword">implements</span> <span class="token class-name">Program</span><span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">coding</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;使用IDEA编码&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用</p><p>定义一个操作类，注入Program</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token class-name">Program</span> program<span class="token punctuation">;</span>

<span class="token keyword">public</span> <span class="token class-name">StrategyPattern</span><span class="token punctuation">(</span><span class="token class-name">Program</span> program<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>program <span class="token operator">=</span> program<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token class-name">Program</span> <span class="token function">getProgram</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> program<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setProgram</span><span class="token punctuation">(</span><span class="token class-name">Program</span> program<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>program <span class="token operator">=</span> program<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">startCoding</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    program<span class="token punctuation">.</span><span class="token function">coding</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">coding</span><span class="token punctuation">(</span><span class="token class-name">String</span> codeType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">switch</span> <span class="token punctuation">(</span>codeType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">case</span> <span class="token string">&quot;Eclipse&quot;</span><span class="token operator">:</span>
                <span class="token keyword">new</span> <span class="token class-name">StrategyPattern</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Eclipse</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">startCoding</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token keyword">case</span> <span class="token string">&quot;IDEA&quot;</span><span class="token operator">:</span>
                <span class="token keyword">new</span> <span class="token class-name">StrategyPattern</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">IDEA</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">startCoding</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token keyword">default</span><span class="token operator">:</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;使用其他IDE编码&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样其实还是ifelse，但是代码会简洁很多更容易维护，下面进行消除</p><h2 id="策略模式-工厂模式-模版方法" tabindex="-1"><a class="header-anchor" href="#策略模式-工厂模式-模版方法"><span>策略模式+工厂模式+模版方法</span></a></h2><p>上面的代码其实还是有点冗余问题，我们可以使用策略模式+工厂模式+模版方法接口，</p><p>todo</p><h2 id="策略枚举" tabindex="-1"><a class="header-anchor" href="#策略枚举"><span>策略枚举</span></a></h2><p>定义一个枚举类，表示有哪些分支：</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">enum</span> <span class="token class-name">ProgramEnums</span> <span class="token punctuation">{</span>
    <span class="token function">ECLIPSE</span><span class="token punctuation">(</span><span class="token string">&quot;Eclipse&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token function">IDEA</span><span class="token punctuation">(</span><span class="token string">&quot;IDEA&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token class-name">String</span> codeType<span class="token punctuation">;</span>

    <span class="token class-name">ProgramEnums</span><span class="token punctuation">(</span><span class="token class-name">String</span> codeType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>codeType <span class="token operator">=</span> codeType<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getCodeType</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> codeType<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>定义一个工厂类，用来根据type获取对应的实现</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ProgramFactory</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Program</span><span class="token punctuation">&gt;</span></span> <span class="token constant">PROGRAM_MAP</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        <span class="token constant">PROGRAM_MAP</span><span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;Eclipse&quot;</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Eclipse</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token constant">PROGRAM_MAP</span><span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">&quot;IDEA&quot;</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">IDEA</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Program</span><span class="token punctuation">&gt;</span></span> <span class="token function">getProgramMap</span><span class="token punctuation">(</span><span class="token class-name">String</span> codeType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token constant">PROGRAM_MAP</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用：</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">String</span> codeType <span class="token operator">=</span> <span class="token string">&quot;IDEA&quot;</span><span class="token punctuation">;</span>
    <span class="token class-name">Program</span> programMap <span class="token operator">=</span> <span class="token class-name">ProgramFactory</span><span class="token punctuation">.</span><span class="token function">getProgramMap</span><span class="token punctuation">(</span>codeType<span class="token punctuation">)</span><span class="token punctuation">;</span>
    programMap<span class="token punctuation">.</span><span class="token function">coding</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,27),c=[e];function o(l,i){return s(),a("div",null,c)}const k=n(p,[["render",o],["__file","使用策略模式消除ifelse.html.vue"]]),d=JSON.parse('{"path":"/java/8-%E4%BB%A3%E7%A0%81%E4%BC%98%E5%8C%96/%E4%BD%BF%E7%94%A8%E7%AD%96%E7%95%A5%E6%A8%A1%E5%BC%8F%E6%B6%88%E9%99%A4ifelse.html","title":"使用策略模式消除ifelse","lang":"en-US","frontmatter":{"title":"使用策略模式消除ifelse","date":"2024-05-18T00:00:00.000Z","category":["Java","设计模式"],"tag":["Java","设计模式","策略模式"],"description":"使用策略模式消除ifelse 有这样的场景，根据不同的套餐，有不同的计算方式，全部在一个函数里面，使用if+else不停的判断，导致一个方法堆了成百上千行，而且不同的service里面都有这个关于不同套餐的计算方式。为了解决这个问题，学习使用策略模式消除，使得代码遵循开闭原则，新增新的套餐会变得容易 策略模式 代码 现在有一个coding函数，我们想要...","head":[["meta",{"property":"og:url","content":"https://github.com/zhangruyi3906/blog/java/8-%E4%BB%A3%E7%A0%81%E4%BC%98%E5%8C%96/%E4%BD%BF%E7%94%A8%E7%AD%96%E7%95%A5%E6%A8%A1%E5%BC%8F%E6%B6%88%E9%99%A4ifelse.html"}],["meta",{"property":"og:site_name","content":"乘风破浪（长风破浪会有时，直挂云帆济沧海）"}],["meta",{"property":"og:title","content":"使用策略模式消除ifelse"}],["meta",{"property":"og:description","content":"使用策略模式消除ifelse 有这样的场景，根据不同的套餐，有不同的计算方式，全部在一个函数里面，使用if+else不停的判断，导致一个方法堆了成百上千行，而且不同的service里面都有这个关于不同套餐的计算方式。为了解决这个问题，学习使用策略模式消除，使得代码遵循开闭原则，新增新的套餐会变得容易 策略模式 代码 现在有一个coding函数，我们想要..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-06-14T07:14:40.000Z"}],["meta",{"property":"article:author","content":"dreamchaser"}],["meta",{"property":"article:tag","content":"Java"}],["meta",{"property":"article:tag","content":"设计模式"}],["meta",{"property":"article:tag","content":"策略模式"}],["meta",{"property":"article:published_time","content":"2024-05-18T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-14T07:14:40.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"使用策略模式消除ifelse\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-05-18T00:00:00.000Z\\",\\"dateModified\\":\\"2024-06-14T07:14:40.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"dreamchaser\\",\\"url\\":\\"https://github.com/zhangruyi3906\\"}]}"]]},"headers":[{"level":2,"title":"策略模式","slug":"策略模式","link":"#策略模式","children":[]},{"level":2,"title":"策略模式+工厂模式+模版方法","slug":"策略模式-工厂模式-模版方法","link":"#策略模式-工厂模式-模版方法","children":[]},{"level":2,"title":"策略枚举","slug":"策略枚举","link":"#策略枚举","children":[]}],"git":{"createdTime":1718196522000,"updatedTime":1718349280000,"contributors":[{"name":"zhangruyi3906","email":"3023208132@qq.com","commits":3}]},"readingTime":{"minutes":1.91,"words":573},"filePathRelative":"java/8-代码优化/使用策略模式消除ifelse.md","localizedDate":"May 18, 2024","excerpt":"\\n<blockquote>\\n<p>有这样的场景，根据不同的套餐，有不同的计算方式，全部在一个函数里面，使用if+else不停的判断，导致一个方法堆了成百上千行，而且不同的service里面都有这个关于不同套餐的计算方式。为了解决这个问题，学习使用策略模式消除，使得代码遵循开闭原则，新增新的套餐会变得容易</p>\\n</blockquote>\\n<h2>策略模式</h2>\\n<p>代码</p>\\n<p>现在有一个coding函数，我们想要根据传入的codeType来进行判断使用那个编辑器coding，如果这样ifelse写的话，每次新加一个编辑器，这边都要进行修改，不符合软件设计的开闭原则。</p>","autoDesc":true}');export{k as comp,d as data};
