---
title: Mac的iterm2安装插件
date: 2023-05-12 21:12:35
category:
  - Mac
  - iterm2
tag:
  - Mac
  - iterm2
---

# Shell相关

mac有两种shell，zsh和bash，zsh兼容bash

查看当前使用的shell

```shell
echo $SHELL
```

切换bash

```shell
chsh -s /bin/bash
```

切换zsh

```shell
chsh -s /bin/zsh
```

bash:读取`~/.bash_profile`文件

zsh:读取`~/.zshrc`文件

## 环境变量

在 macOS 系统下，四个文件都可以用来设置 shell 的环境变量和控制用户的 shell 行为。但是，它们各自有不同的作用范围和加载时机：

1. `/etc/profile`：在用户登录系统时被读取，定义系统级别的环境变量，并且对所有用户都生效。
2. `/etc/bashrc`：在交互式 shell 启动时被读取，定义系统级别的 bash 命令别名和 shell 函数，并且对所有用户都生效。
3. `~/.bashrc`：在交互式 shell 启动时被读取，定义个人级别的 bash 命令别名和 shell 函数，并且只对当前用户生效。
4. `~/.bash_profile`：在用户登录系统时被读取，定义个人级别的环境变量和用户特定的 shell 配置，并且只对当前用户生效。
5. `~/.zshrc` 是 Zsh shell 的配置文件，是使用 Zsh 时读取的主要配置文件之一。它存放在用户目录下的 `~/.zshrc` 文件中。

简单说来，`/etc/profile` 和 `/etc/bashrc` 是系统级别的配置文件，用于所有用户，而 `~/.bashrc` 和 `~/.bash_profile` 是个人级别的配置文件，只对个人生效。其中，个人配置文件的优先级高于系统配置文件，即如果同一个环境变量在两个文件中都存在，那么个人配置文件中的会覆盖系统配置文件中的。

## 安装 Oh My Zsh

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## 安装语法高亮插件

```shell
 git clone https://github.com/zsh-users/zsh-syntax-highlighting.git
```

配置，加入到环境变量中，可以加入到`~/.zshrc`或者`~/.bash_profile`,注意加到是zsh-syntax-highlighting文件夹里面的那个zsh-syntax-highlighting.zsh,可以先去复制这个文件，

```shell
source /Users/houyunfei/tools/on-my-zsh-beautification/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh	
```

![image-20230512223627668](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305122236724.png)

之后就可以看到语法高亮了，

> 未打完的source，显示红色

![image-20230512223824347](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305122238372.png)

> 打完的source，显示绿色，同时后面的文件可以按住command打开

![image-20230512223924777](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305122239810.png)

## 安装命令自动补全插件

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions
```

接着配置环境变量，跟上面一样

安装好之后，就可以看到终端会猜测你接下来要使用的命令了

![image-20230512224707126](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202305122247160.png)

## 其他美化

### powerline

```shell
  pip install powerline-status --user
  
  # clone
git clone https://github.com/powerline/fonts.git --depth=1
# install
cd fonts
./install.sh
# clean-up a bit
cd ..
rm -rf fonts
```

