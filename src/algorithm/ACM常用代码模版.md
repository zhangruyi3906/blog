---
title: ACM常用代码模版
date: 2023-07-28 10:30:53
category: 
  - Algorithm
  - ACM
tag:
  - Algorithm
  - ACM
---

# ACM常用代码模版

## 数据结构

### 并查集

```cpp
struct DSU {
    std::vector<int> f, siz;

    DSU(int n) {
        f.resize(n + 1);
        siz.resize(n + 1);
        for (int i = 1; i <= n; i++) {
            f[i] = i;
            siz[i] = 1;
        }
    }

    int find(int x) {
        if (x != f[x]) f[x] = find(f[x]);
        return f[x];
    }

    bool same(int x, int y) {
        return find(x) == find(y);
    }

    bool merge(int x, int y) {
        x = find(x);
        y = find(y);
        if (x == y) {
            return false;
        }
        siz[x] += siz[y];
        f[y] = x;
        return true;
    }

    int size(int x) {
        return siz[find(x)];
    }
};
```

