---
title: Linux系统定时脚本
date: 2024-01-02
category:
  - 服务器
  - Linux
tag:
  - 服务器
  - Linux
---

# Linux系统定时脚本

## 定时清空nohup.out

shell脚本`clear_nohup.sh`

```sh
#!/bin/bash

# 清空/opt/server/目录下每个子目录中的nohup.out文件

# 定义基础目录路径
base_dir="/opt/server/"

# 获取基础目录下的所有子目录列表
sub_dirs=($(find "$base_dir" -maxdepth 1 -mindepth 1 -type d))

# 遍历每个子目录
for dir in "${sub_dirs[@]}"; do
    # 构造当前子目录中nohup.out文件的路径
    nohup_out="$dir/nohup.out"

    # 检查当前子目录是否存在nohup.out文件
    if [ -f "$nohup_out" ]; then
        echo "清空 $nohup_out"
        
        # 使用cat和/dev/null清空nohup.out文件的内容
        cat /dev/null > "$nohup_out"
        
        echo "$nohup_out 已清空"
    else
        echo "$dir 中未找到 nohup.out 文件"
    fi
done

```

执行权限：
```sh
chmod +x clear_nohup.sh
```

定时任务

```sh
crontab -e 
10 0 * * * /bin/bash /path/to/clear_nohup.sh
```

