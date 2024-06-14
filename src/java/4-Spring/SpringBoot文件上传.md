---
title: SpringBoot文件上传
date: 2023-10-08
category:
  - Java
  - SpringBoot
tag:
  - Java
  - SpringBoot
  - OSS
---

## 前端
```html
<form action="/upload" method="post" enctype="multipart/form-data">
  姓名: <input type="text" name="username"><br>
  年龄: <input type="text" name="age"><br>
  头像: <input type="file" name="image"><br>
  <input type="submit" value="提交">
</form>
```
三要素：

- method 为post，因为post适合上传大文件
- enctype="multipart/form-data"
- type="file"
## 后端
Springboot默认单个文件最大为1M，可以在配置文件中进行设置
```yaml
spring:
  #文件上传的配置
  servlet:
    multipart:
      max-file-size: 10MB # 单个文件
      max-request-size: 100MB #多个文件总大小
```
### 本地存储
```java
@PostMapping("/upload")
public Result upload(String username , Integer age , MultipartFile image) throws Exception {
    log.info("文件上传: {}, {}, {}", username, age, image);
    //获取原始文件名
    String originalFilename = image.getOriginalFilename();
    //构造唯一的文件名 (不能重复) - uuid(通用唯一识别码)
    int index = originalFilename.lastIndexOf(".");
    //获取文件的后缀名
    String extname = originalFilename.substring(index);
    String newFileName = UUID.randomUUID() + extname;
    log.info("新的文件名: {}", newFileName);
    //将文件存储在服务器的磁盘目录中
    String path = "D:\\upload"+newFileName;
    image.transferTo(new File(path));
    return Result.success();
}
```
### 阿里云OSS存储

[https://oss.console.aliyun.com/bucket](https://oss.console.aliyun.com/bucket)<br />
创建一个bucket<br />
![image.png](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202310091553222.png)<br />
点击右上角AccessKey管理，添加一个Key<br />![image.png](https://cdn.jsdelivr.net/gh/yunfeidog/picture-bed@main/img/202310091553577.png)<br />查看SDK帮助文档：<br />[https://oss.console.aliyun.com/sdk](https://oss.console.aliyun.com/sdk)<br />以及OSS文档<br />[https://help.aliyun.com/zh/oss/developer-reference/overview-21](https://help.aliyun.com/zh/oss/developer-reference/overview-21)

#### 使用

1. 引入maven依赖
```xml
<dependency>
  <groupId>com.aliyun.oss</groupId>
  <artifactId>aliyun-sdk-oss</artifactId>
  <version>3.15.1</version>
</dependency>
```
java9以上需要添加下面依赖
```xml
<dependency>
    <groupId>javax.xml.bind</groupId>
    <artifactId>jaxb-api</artifactId>
    <version>2.3.1</version>
</dependency>
<dependency>
    <groupId>javax.activation</groupId>
    <artifactId>activation</artifactId>
    <version>1.1.1</version>
</dependency>
<!-- no more than 2.3.3-->
<dependency>
    <groupId>org.glassfish.jaxb</groupId>
    <artifactId>jaxb-runtime</artifactId>
    <version>2.3.3</version>
</dependency>
```

2. 复制阿里云提供的示例代码
```java
import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSS;
import com.aliyun.oss.common.auth.*;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.model.PutObjectRequest;
import com.aliyun.oss.model.PutObjectResult;
import java.io.File;

public class Demo {

    public static void main(String[] args) throws Exception {
        // Endpoint以华东1（杭州）为例，其它Region请按实际情况填写。
        String endpoint = "https://oss-cn-hangzhou.aliyuncs.com";
        // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();
        // 填写Bucket名称，例如examplebucket。
        String bucketName = "examplebucket";
        // 填写Object完整路径，完整路径中不能包含Bucket名称，例如exampledir/exampleobject.txt。
        String objectName = "exampledir/exampleobject.txt";
        // 填写本地文件的完整路径，例如D:\\localpath\\examplefile.txt。
        // 如果未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
        String filePath= "D:\\localpath\\examplefile.txt";

        // 创建OSSClient实例。
        OSS ossClient = new OSSClientBuilder().build(endpoint, credentialsProvider);

        try {
            // 创建PutObjectRequest对象。
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, objectName, new File(filePath));
            // 如果需要上传时设置存储类型和访问权限，请参考以下示例代码。
            // ObjectMetadata metadata = new ObjectMetadata();
            // metadata.setHeader(OSSHeaders.OSS_STORAGE_CLASS, StorageClass.Standard.toString());
            // metadata.setObjectAcl(CannedAccessControlList.Private);
            // putObjectRequest.setMetadata(metadata);

            // 上传文件。
            PutObjectResult result = ossClient.putObject(putObjectRequest);           
        } catch (OSSException oe) {
            System.out.println("Caught an OSSException, which means your request made it to OSS, "
                               + "but was rejected with an error response for some reason.");
            System.out.println("Error Message:" + oe.getErrorMessage());
            System.out.println("Error Code:" + oe.getErrorCode());
            System.out.println("Request ID:" + oe.getRequestId());
            System.out.println("Host ID:" + oe.getHostId());
        } catch (ClientException ce) {
            System.out.println("Caught an ClientException, which means the client encountered "
                               + "a serious internal problem while trying to communicate with OSS, "
                               + "such as not being able to access the network.");
            System.out.println("Error Message:" + ce.getMessage());
        } finally {
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
    }
}
```
编辑`.bash_profile`文件
```java
export OSS_ACCESS_KEY_ID= 
export OSS_ACCESS_KEY_SECRET=
```
上面这种是为了演示Demo做的，在项目中是写在yml文件里面，可以定义下面属性：
```yaml
#阿里云OSS
aliyun:
  oss:
    endpoint: xxx
    accessKeyId: xxx
    accessKeySecret: xxx
    bucketName: xxx
```
通过文件读取 ：
```java
@Data
@Component
@ConfigurationProperties(prefix = "aliyun.oss")
public class AliOSSProperties {
    private String endpoint;
    private String accessKeyId;
    private String accessKeySecret;
    private String bucketName;
}
```
上传图片工具类：
```java

/**
 * 阿里云 OSS 工具类
 */
@Component
public class AliOSSUtils {

    @Autowired
    private AliOSSProperties aliOSSProperties;

    /**
     * 实现上传图片到OSS
     */
    public String upload(MultipartFile file) throws IOException {
        //获取阿里云OSS参数
        String endpoint = aliOSSProperties.getEndpoint();
        String accessKeyId = aliOSSProperties.getAccessKeyId();
        String accessKeySecret = aliOSSProperties.getAccessKeySecret();
        String bucketName = aliOSSProperties.getBucketName();

        // 获取上传的文件的输入流
        InputStream inputStream = file.getInputStream();

        // 避免文件覆盖
        String originalFilename = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + originalFilename.substring(originalFilename.lastIndexOf("."));

        //上传文件到 OSS
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        ossClient.putObject(bucketName, fileName, inputStream);

        //文件访问路径
        String url = endpoint.split("//")[0] + "//" + bucketName + "." + endpoint.split("//")[1] + "/" + fileName;
        // 关闭ossClient
        ossClient.shutdown();
        return url;// 把上传到oss的路径返回
    }
}
```
Controller中使用：
```java
@Autowired
private AliOSSUtils aliOSSUtils;

@PostMapping("/upload")
public Result upload(MultipartFile image) throws IOException {
    log.info("文件上传, 文件名: {}", image.getOriginalFilename());
    //调用阿里云OSS工具类进行文件上传
    String url = aliOSSUtils.upload(image);
    log.info("文件上传完成,文件访问的url: {}", url);
    return Result.success(url);
}
```
