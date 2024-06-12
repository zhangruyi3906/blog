---
title: Codeforces与洛谷题目之间跳转油猴插件
date: 2023-05-04 15:32:39
category: 
  - 插件
  - 开源项目
tag:
  - 插件
  - 开源项目
---

# Codeforces与洛谷题目之间跳转油猴插件

> 第一次用油猴写插件，记录一下，
>
> 写本插件主要是因为Codeforces题目都是英文的，看了头疼，但是洛谷有对Codeforces的翻译，并且有题解也是中文的，还支持远程提交。

## 说明

codeforces直接获取元素，然后添加按钮即可，

洛谷需要等待页面全部加载完成，才能获取到页面的元素，然后再去添加按钮跳转。

插件链接：[https://github.com/yunfeidog/CodeforcesToLuogu](https://greasyfork.org/zh-CN/scripts/465489-codeforces与洛谷题目链接跳转)

## 参考页面如下：

### CF跳转洛谷：

![image-20230504161631850](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305041616922.png)

### 洛谷跳转CF：

![image-20230504161702863](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305041617886.png)

## 代码

```js

(()=>{
    if(window.location.host==="codeforces.com"){
        let str=window.location.href
        let bigBox=document.querySelector("#sidebar");
        let myButton=document.createElement('button');
        myButton.textContent="点击我去洛谷";
        bigBox.appendChild(myButton);

        let problemId=getProblemId(str);
        let problemChar=getProblemChar(str);
        console.log(problemId);
        console.log(problemChar);
        //给按钮添加点击事件
        myButton.addEventListener('click',()=>{
            location.assign("https://www.luogu.com.cn/problem/CF"+problemId+problemChar);
        })
    }else{
        let str=window.location.href
        // 找到最后一个 / 的位置
        var lastSlashIndex = str.lastIndexOf("/");
        // 从 URL 中截取出 ID 和最后的字符
        var idStr = str.slice(lastSlashIndex + 1, -1); // "CF1714D"
        let idNum =''+ parseInt(idStr.slice(2, 6)); // 1714
        let lastChar ='' +idStr.charAt(idStr.length - 1); // "D"
        var url='https://codeforces.com/contest/'+idNum+"/problem/"+lastChar;
        console.log(url);
        window.addEventListener('load', ()=>{
            let mybutton=document.createElement('button');
            mybutton.textContent="去打CF";
            mybutton.addEventListener('click',()=>{location.assign(url)});
            // 在这里编写需要在页面全部加载完毕后执行的操作
            let cf=document.querySelector("#app > div.main-container > main > div > section.side > div:nth-child(1) > div > div:nth-child(1) > span:nth-child(2)");
            let bigBox=document.querySelector("#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > div.functional > div.operation");
            console.log(cf);
            cf.addEventListener('click',()=>{location.assign(url)});
            bigBox.appendChild(mybutton)
        });
    }
})();


function getProblemId(str){
    let pos = str.indexOf("contest/") + "contest/".length;
    let contestNum = "";
    while (str[pos] >= '0' && str[pos] <= '9') {
        contestNum += str[pos];
        pos++;
    }
    return contestNum;
}

function getProblemChar(str){
    let pos = str.indexOf("problem/") + "problem/".length;
    let problemLetter = str.substr(pos);
    return problemLetter;
}
```

