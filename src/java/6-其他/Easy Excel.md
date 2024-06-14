---
title: Easy Excel
date: 2024-03-07
category:
  - Java
  - Easy Excel
tag:
  - Java
  - EasyExcel
---
# Easy Excel

官网：https://easyexcel.opensource.alibaba.com/
依赖：
```java
<dependency>  
    <groupId>org.projectlombok</groupId>  
    <artifactId>lombok</artifactId>  
    <version>1.18.30</version>  
</dependency>  
<dependency>  
    <groupId>com.alibaba</groupId>  
    <artifactId>easyexcel</artifactId>  
    <version>3.3.2</version>  
</dependency>
```
## 写Excel
TestFileUtil
工具类 ：
```java
package test;  
  
import java.io.File;  
import java.io.InputStream;  
import java.util.ArrayList;  
import java.util.List;  
  
import org.apache.commons.collections4.CollectionUtils;  
  
public class TestFileUtil {  
  
    public static InputStream getResourcesFileInputStream(String fileName) {  
        return Thread.currentThread().getContextClassLoader().getResourceAsStream("" + fileName);  
    }  
  
    public static String getPath() {  
        return TestFileUtil.class.getResource("/").getPath();  
    }  
  
    public static TestPathBuild pathBuild() {  
        return new TestPathBuild();  
    }  
  
    public static File createNewFile(String pathName) {  
        File file = new File(getPath() + pathName);  
        if (file.exists()) {  
            file.delete();  
        } else {  
            if (!file.getParentFile().exists()) {  
                file.getParentFile().mkdirs();  
            }  
        }  
        return file;  
    }  
  
    public static File readFile(String pathName) {  
        return new File(getPath() + pathName);  
    }  
  
    public static File readUserHomeFile(String pathName) {  
        return new File(System.getProperty("user.home") + File.separator + pathName);  
    }  
  
    /**  
     * build to test file path     **/    public static class TestPathBuild {  
        private TestPathBuild() {  
            subPath = new ArrayList<>();  
        }  
  
        private final List<String> subPath;  
  
        public TestPathBuild sub(String dirOrFile) {  
            subPath.add(dirOrFile);  
            return this;        }  
  
        public String getPath() {  
            if (CollectionUtils.isEmpty(subPath)) {  
                return TestFileUtil.class.getResource("/").getPath();  
            }  
            if (subPath.size() == 1) {  
                return TestFileUtil.class.getResource("/").getPath() + subPath.get(0);  
            }  
            StringBuilder path = new StringBuilder(TestFileUtil.class.getResource("/").getPath());  
            path.append(subPath.get(0));  
            for (int i = 1; i < subPath.size(); i++) {  
                path.append(File.separator).append(subPath.get(i));  
            }  
            return path.toString();  
        }  
  
    }  
  
}
```

先创建一个实体类,使用ExcelProperty注解标注列的名字：
```java
  
@Getter  
@Setter  
@EqualsAndHashCode  
public class DemoData {  
    @ExcelProperty("字符串标题")  
    private String string;  
    @ExcelProperty("日期标题")  
    private Date date;  
    @ExcelProperty("数字标题")  
    private Double doubleData;  
    /**  
     * 忽略这个字段  
     */  
    @ExcelIgnore  
    private String ignore;  
}
```

写入Excel
```java
package test;  
  
import com.alibaba.excel.EasyExcel;  
import com.alibaba.excel.util.ListUtils;  
  
import java.util.Date;  
import java.util.List;  
  
public class Test {  
    private List<DemoData> data() {  
        List<DemoData> list = ListUtils.newArrayList();  
        for (int i = 0; i < 10; i++) {  
            DemoData data = new DemoData();  
            data.setString("字符串" + i);  
            data.setDate(new Date());  
            data.setDoubleData(0.56);  
            list.add(data);  
        }  
        return list;  
    }  
  
    @Test
    public void doWrite() {
        String fileName = TestFileUtil.getPath() + "simpleWrite" + System.currentTimeMillis() + ".xlsx";
        EasyExcel.write(fileName, DemoData.class).sheet("模板").doWrite(data());
    }
}
```

结果：
![image.png](https://s2.loli.net/2024/03/11/71DiOlPXF6jZEmV.webp)


### 百万数据写入 
```java
@Test  
public void doWrite100() {  
    // 方法2: 如果写到不同的sheet 同一个对象  
    String fileName = TestFileUtil.getPath() + "repeatedWrite" + System.currentTimeMillis() + ".xlsx";  
    // 这里 指定文件  
    long begin = System.currentTimeMillis();  
    try (ExcelWriter excelWriter = EasyExcel.write(fileName, DemoData.class).build()) {  
        // 去调用写入,这里我调用了五次，实际使用时根据数据库分页的总的页数来。这里最终会写到5个sheet里面  
        for (int i = 0; i < 100; i++) {  
            // 每次都要创建writeSheet 这里注意必须指定sheetNo 而且sheetName必须不一样  
            WriteSheet writeSheet = EasyExcel.writerSheet(i, "模板" + i).build();  
            // 分页去数据库查询数据 这里可以去数据库查询每一页的数据  
            List<DemoData> data = data(10000);  
            excelWriter.write(data, writeSheet);  
        }  
    }  
    long end = System.currentTimeMillis();  
    System.out.println("耗时：" + (end - begin) + "ms");  
}
```

### 使用模版写入
![image.png](https://s2.loli.net/2024/03/11/HasPJGL69o41hFX.webp)


```java
@Test  
public void testMoban() {  
    // 方案2 分多次 填充 会使用文件缓存（省内存）  
    String fileName = TestFileUtil.getPath() + "listFill" + System.currentTimeMillis() + ".xlsx";  
    String templateFileName = TestFileUtil.getPath() + "moban" + ".xlsx";  
    try (ExcelWriter excelWriter = EasyExcel.write(fileName).withTemplate(templateFileName).build()) {  
        WriteSheet writeSheet = EasyExcel.writerSheet().build();  
        for (int i = 0; i < 5; i++) {  
            excelWriter.fill(data(10), writeSheet);  
        }  
    }  
}
```


## 读Excel

```java
@Test  
public void doRead() {  
    String fileName = TestFileUtil.getPath() + "simpleWrite1710133712129.xlsx";  
    EasyExcel.read(fileName, DemoData.class, new PageReadListener<DemoData>(dataList -> {  
        for (DemoData demoData : dataList) {  
            System.out.println(demoData);  
        }  
    })).sheet().doRead();  
}
```
