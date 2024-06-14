---
title: MinIO对象存储服务
date: 2023-11-24
category:
  - 中间件
  - MinIO
tag:
  - 中间件
  - MinIO
---

# MinIO

MinIO基于Apache License v2.0开源协议的对象存储服务，可以做为云存储的解决方案用来保存海量的图片，视频，文档。

官网网站：官网文档：http://docs.minio.org.cn/docs/



## 快速入门

使用docker 安装：

1. 搜索镜像：https://hub.docker.com/r/minio/minio

```shell
docker search minio
```

2. 拉取镜像：

```shell
docker pull minio/minio
```

3. 运行(无法访问)：

```shell
docker run -p 9000:9000 --name minio -d --restart=always \
  -e "MINIO_ACCESS_KEY=minio" \
  -e "MINIO_SECRET_KEY=minio123" \
  -v ~/tools/docker-volumes/minio:/data \
  -v ~/tools/docker-volumes/minio-config:/root/.minio \
  minio/minio server /data
```

参数解释：

+ `-v ~/tools/docker-volumes/minio:/data` 表示将本地系统中的 `~/tools/docker-volumes/minio` 目录挂载到 MinIO 容器中的 `/data` 目录。
+ `-v ~/tools/docker-volumes/minio-config:/root/.minio` 表示将本地系统中的 `~/tools/docker-volumes/minio-config` 目录挂载到 MinIO 容器中的 `/root/.minio` 目录。
+ `9000:9000` 是将本地系统的9000端口映射到MinIO容器的9000端口，以便通过该端口访问MinIO服务。
+ `server /data` 部分表示在MinIO容器内运行MinIO服务器，并将数据存储在容器内的 `/data` 目录。

此时如果启动会发现访问本地的`localhost:9000`会自动跳转到其他静态端口，例如我的是：33625

![image-20231125190002591](https://s2.loli.net/2023/11/25/OdUAJsFnlhQBzNW.webp)

在 官网 ：https://www.minio.org.cn/docs/cn/minio/container/operations/install-deploy-manage/deploy-minio-single-node-single-drive.html

找到，发现需要 设置两个端口，

![image-20231125190917362](https://s2.loli.net/2023/11/25/Ck4PLwp2S1nDoxX.webp)

成功运行的命令如下：

```shell
docker run -p 9000:9000 -p 9090:9090 \
   --name minio -d --restart=always \
  -e "MINIO_ACCESS_KEY=minio" \
  -e "MINIO_SECRET_KEY=minio123" \
  -v ~/tools/docker-volumes/minio:/data \
  -v ~/tools/docker-volumes/minio-config:/root/.minio \
  minio/minio server /data --console-address ":9090"
```

此时发现端口对应 上了：

![image-20231125191201427](https://s2.loli.net/2023/11/25/fxco6JhbreZQOtd.webp)

可以 正常访问：

![image-20231125191235242](https://s2.loli.net/2023/11/25/brE7lSTtu5YFXnH.webp)

基本概念说明：

+ Bucket 类似于文件系统的目录
+ Object类似于文件系统的文件
+ keys类似于文件名

## Springboot中使用

依赖：
```xml
    <dependencies>

        <dependency>
            <groupId>io.minio</groupId>
            <artifactId>minio</artifactId>
            <version>7.1.0</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
        </dependency>
    </dependencies>
```

进行上传之前先设置一下权限：

![image-20231125213224807](https://s2.loli.net/2023/11/25/gpnwzosW3lhdAcu.webp)

```java
public class MinIOTest {
    public static final String MY_FILE = "/tmp/list.html";
    public static final String ACCESS_KEY = "minio";
    public static final String SECRET_KEY = "minio123";
    public static void main(String[] args) {
        FileInputStream fileInputStream = null;
        try {
            fileInputStream =  new FileInputStream(MY_FILE);
            //1.创建minio链接客户端
            MinioClient minioClient = MinioClient.builder().credentials(ACCESS_KEY, SECRET_KEY)
                    .endpoint("http://localhost:9000").build();
            //2.上传
            PutObjectArgs putObjectArgs = PutObjectArgs.builder()
                    .object("list.html")//文件名
                    .contentType("text/html")//文件类型
                    .bucket("leadnews")//桶名词  与minio创建的名词一致
                    .stream(fileInputStream, fileInputStream.available(), -1) //文件流
                    .build();
            minioClient.putObject(putObjectArgs);
            System.out.println("http://localhost:9000/leadnews/list.html");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
```

运行代码，此时可以进行访问.http://localhost:9000/leadnews/list.html

## 封装为starter

配置类：

```java
@Data
@ConfigurationProperties(prefix = "minio")  // 文件上传 配置前缀file.oss
public class MinIOConfigProperties implements Serializable {
    private String accessKey;
    private String secretKey;
    private String bucket;
    private String endpoint;
    private String readPath;
}
```

```java
@Data
@Configuration
@EnableConfigurationProperties({MinIOConfigProperties.class})
//当引入FileStorageService接口时
@ConditionalOnClass(FileStorageService.class)
public class MinIOConfig {

    @Autowired
    private MinIOConfigProperties minIOConfigProperties;

    @Bean
    public MinioClient buildMinioClient() {
        return MinioClient
                .builder()
                .credentials(minIOConfigProperties.getAccessKey(), minIOConfigProperties.getSecretKey())
                .endpoint(minIOConfigProperties.getEndpoint())
                .build();
    }
}
```

业务实现：
```java
public interface FileStorageService {


    /**
     *  上传图片文件
     * @param prefix  文件前缀
     * @param filename  文件名
     * @param inputStream 文件流
     * @return  文件全路径
     */
    public String uploadImgFile(String prefix, String filename,InputStream inputStream);

    /**
     *  上传html文件
     * @param prefix  文件前缀
     * @param filename   文件名
     * @param inputStream  文件流
     * @return  文件全路径
     */
    public String uploadHtmlFile(String prefix, String filename,InputStream inputStream);

    /**
     * 删除文件
     * @param pathUrl  文件全路径
     */
    public void delete(String pathUrl);

    /**
     * 下载文件
     * @param pathUrl  文件全路径
     * @return
     *
     */
    public byte[]  downLoadFile(String pathUrl);

}
```

```java
@Slf4j
@EnableConfigurationProperties(MinIOConfigProperties.class)
@Import(MinIOConfig.class)
public class MinIOFileStorageService implements FileStorageService {

    @Autowired
    private MinioClient minioClient;

    @Autowired
    private MinIOConfigProperties minIOConfigProperties;

    private final static String separator = "/";

    /**
     * @param dirPath
     * @param filename  yyyy/mm/dd/file.jpg
     * @return
     */
    public String builderFilePath(String dirPath,String filename) {
        StringBuilder stringBuilder = new StringBuilder(50);
        if(!StringUtils.isEmpty(dirPath)){
            stringBuilder.append(dirPath).append(separator);
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        String todayStr = sdf.format(new Date());
        stringBuilder.append(todayStr).append(separator);
        stringBuilder.append(filename);
        return stringBuilder.toString();
    }

    /**
     *  上传图片文件
     * @param prefix  文件前缀
     * @param filename  文件名
     * @param inputStream 文件流
     * @return  文件全路径
     */
    @Override
    public String uploadImgFile(String prefix, String filename,InputStream inputStream) {
        String filePath = builderFilePath(prefix, filename);
        try {
            PutObjectArgs putObjectArgs = PutObjectArgs.builder()
                    .object(filePath)
                    .contentType("image/jpg")
                    .bucket(minIOConfigProperties.getBucket()).stream(inputStream,inputStream.available(),-1)
                    .build();
            minioClient.putObject(putObjectArgs);
            StringBuilder urlPath = new StringBuilder(minIOConfigProperties.getReadPath());
            urlPath.append(separator+minIOConfigProperties.getBucket());
            urlPath.append(separator);
            urlPath.append(filePath);
            return urlPath.toString();
        }catch (Exception ex){
            log.error("minio put file error.",ex);
            throw new RuntimeException("上传文件失败");
        }
    }

    /**
     *  上传html文件
     * @param prefix  文件前缀
     * @param filename   文件名
     * @param inputStream  文件流
     * @return  文件全路径
     */
    @Override
    public String uploadHtmlFile(String prefix, String filename,InputStream inputStream) {
        String filePath = builderFilePath(prefix, filename);
        try {
            PutObjectArgs putObjectArgs = PutObjectArgs.builder()
                    .object(filePath)
                    .contentType("text/html")
                    .bucket(minIOConfigProperties.getBucket()).stream(inputStream,inputStream.available(),-1)
                    .build();
            minioClient.putObject(putObjectArgs);
            StringBuilder urlPath = new StringBuilder(minIOConfigProperties.getReadPath());
            urlPath.append(separator+minIOConfigProperties.getBucket());
            urlPath.append(separator);
            urlPath.append(filePath);
            return urlPath.toString();
        }catch (Exception ex){
            log.error("minio put file error.",ex);
            ex.printStackTrace();
            throw new RuntimeException("上传文件失败");
        }
    }

    /**
     * 删除文件
     * @param pathUrl  文件全路径
     */
    @Override
    public void delete(String pathUrl) {
        String key = pathUrl.replace(minIOConfigProperties.getEndpoint()+"/","");
        int index = key.indexOf(separator);
        String bucket = key.substring(0,index);
        String filePath = key.substring(index+1);
        // 删除Objects
        RemoveObjectArgs removeObjectArgs = RemoveObjectArgs.builder().bucket(bucket).object(filePath).build();
        try {
            minioClient.removeObject(removeObjectArgs);
        } catch (Exception e) {
            log.error("minio remove file error.  pathUrl:{}",pathUrl);
            e.printStackTrace();
        }
    }


    /**
     * 下载文件
     * @param pathUrl  文件全路径
     * @return  文件流
     *
     */
    @Override
    public byte[] downLoadFile(String pathUrl)  {
        String key = pathUrl.replace(minIOConfigProperties.getEndpoint()+"/","");
        int index = key.indexOf(separator);
        String bucket = key.substring(0,index);
        String filePath = key.substring(index+1);
        InputStream inputStream = null;
        try {
            inputStream = minioClient.getObject(GetObjectArgs.builder().bucket(minIOConfigProperties.getBucket()).object(filePath).build());
        } catch (Exception e) {
            log.error("minio down file error.  pathUrl:{}",pathUrl);
            e.printStackTrace();
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        byte[] buff = new byte[100];
        int rc = 0;
        while (true) {
            try {
                if (!((rc = inputStream.read(buff, 0, 100)) > 0)) break;
            } catch (IOException e) {
                e.printStackTrace();
            }
            byteArrayOutputStream.write(buff, 0, rc);
        }
        return byteArrayOutputStream.toByteArray();
    }
}
```

在其他模块中使用：

1. 导入依赖：

```xml
        <dependency>
            <groupId>com.heima</groupId>
            <artifactId>heima-file-starter</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
```

2. 创建配置文件

```yml
minio:
  accessKey: minio
  secretKey: minio123
  bucket: leadnews
  endpoint: http://localhost:9000
  readPath: http://localhost:9000
```

3. 使用：

```java
@SpringBootTest
class MinIOApplicationTest {

    @Autowired
    private FileStorageService fileStorageService;

    @Test
    void test() throws Exception{
        FileInputStream fs = null;
            fs = new FileInputStream("/tmp/list.html");
            String path = fileStorageService.uploadHtmlFile("", "list.html", fs);
            System.out.println(path);
    }
}
```

得到结果，可以直接访问页面：http://localhost:9000/leadnews/2023/11/25/list.html
