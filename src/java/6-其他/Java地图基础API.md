---
title: Java地图基础API
date: 2024-03-08
category:
  - Java
  - 地图API
tag:
  - Java
  - 地图API
---
# Java地图基础API

百度地图API：https://lbsyun.baidu.com/
应用创建：
![image.png](https://s2.loli.net/2024/03/08/XqOkF2f6l5LutQm.webp)

为了方便，白名单设计为所有：
![image.png](https://s2.loli.net/2024/03/08/Lfs1SNpGMFeHKTU.webp)

## 基本使用
### 创建地图

展示地图：https://lbsyun.baidu.com/index.php?title=jspopularGL/guide/show
修改script里面的ak为自己的ak

```html
<!DOCTYPE html>  
<html>  
<head>  
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />  
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  
    <title>Baidu Map </title>  
    <style type="text/css">  
        html{height:100%}  
        body{height:100%;margin:0px;padding:0px}  
        #container{height:100%}  
    </style>  
    <script type="text/javascript" src="https://api.map.baidu.com/api?v=1.0&type=webgl&ak=xxx"></script>  
</head>  
<body>  
<div id="container"></div>  
<script>  
    var map = new BMapGL.Map("container");          // 创建地图实例  
    var point = new BMapGL.Point(116.404, 39.915);  // 创建点坐标  
    map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别  
</script>  
</body>  
</html>
```

开启鼠标滚轮缩放
```js
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
```

设置地图的旋转角度和倾斜角度
```js
map.setHeading(64.5);   //设置地图旋转角度
map.setTilt(73);       //设置地图的倾斜角度

// 禁止地图旋转和倾斜可以通过配置项进行设置
var map = new BMapGL.Map("allmap",{
    enableRotate: false,
    enableTilt: false
});
```

### 添加覆盖物
添加一个标注：
```js
var point = new BMapGL.Point(116.404, 39.915);   
var marker = new BMapGL.Marker(point);        // 创建标注   
map.addOverlay(marker);                     // 将标注添加到地图中
```

要想知道点的位置：https://api.map.baidu.com/lbsapi/getpoint/index.html
可以使用百度提供的坐标提取系统

向地图中添加标注
```js
var myIcon = new BMapGL.Icon("markers.png", new BMapGL.Size(23, 25), {   
    // 指定定位位置。  
    // 当标注显示在地图上时，其所指向的地理位置距离图标左上   
    // 角各偏移10像素和25像素。您可以看到在本例中该位置即是  
    // 图标中央下端的尖角位置。   
    anchor: new BMapGL.Size(10, 25),   
    // 设置图片偏移。  
    // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您  
    // 需要指定大图的偏移位置，此做法与css sprites技术类似。   
    imageOffset: new BMapGL.Size(0, 0 - 25)   // 设置图片偏移   
});     
    // 创建标注对象并添加到地图  
var marker = new BMapGL.Marker(point, {icon: myIcon});   
map.addOverlay(marker); 
```

添加折线
```js
var polyline = new BMapGL.Polyline([
		new BMapGL.Point(116.399, 39.910),
		new BMapGL.Point(116.405, 39.920),
		new BMapGL.Point(116.425, 39.900)
	], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
map.addOverlay(polyline);
```
效果如下：
![image.png](https://s2.loli.net/2024/03/08/zZc8dARm5e9gQio.webp)

添加地图点击事件：
```js
map.addEventListener('click', function(e) {
    alert('点击的经纬度：' + e.latlng.lng + ', ' + e.latlng.lat);
    var mercator = map.lnglatToMercator(e.latlng.lng, e.latlng.lat);
    alert('点的墨卡托坐标：' + mercator[0] + ', ' + mercator[1]);
});
```

更换地图类型：
```js
map.setMapType(BMAP_EARTH_MAP);      // 设置地图类型为地球模式
```

1.标准地图：BMAP_NORMAL_MAP  
2.地球模式：BMAP_EARTH_MAP  
3.普通卫星地图：BMAP_SATELLITE_MAP

### 检索服务

```js
	var local = new BMapGL.LocalSearch(map, {
		renderOptions:{map: map}
	});
	local.search("景点");
```
![image.png](https://s2.loli.net/2024/03/08/64PvtdapmTWoVnE.webp)

## WebAPI使用
创建ak的时候：白名单设置为：0.0.0.0/0

### 坐标转换
https://lbsyun.baidu.com/faq/api?title=webapi/guide/changeposition-base
```java
    @Test
    public void test() {
        String url = "https://api.map.baidu.com/geoconv/v1/?coords=114.21892734521,29.575429778924&from=1&to=5&ak=" + ak;
        String body = HttpRequest.get(url).execute().body();
        System.out.println(body);
    }
```
运行结果：
```json
{"status":0,"result":[{"x":114.2307519546763,"y":29.57908428837437}]}
```

### IP定位服务

https://lbs.baidu.com/faq/api?title=webapi/ip-api-base

```java
@Test  
public void test2(){  
    String url ="https://api.map.baidu.com/location/ip?ip=111.206.214.37&coor=bd09ll&ak="+ak;  
    String body = HttpRequest.get(url).execute().body();  
    System.out.println(body);  
}
```

运行结果：
```json
{"address":"CN|\u5317\u4eac\u5e02|\u5317\u4eac\u5e02|None|None|100|100","content":{"address":"\u5317\u4eac\u5e02","address_detail":{"adcode":"110000","city":"\u5317\u4eac\u5e02","city_code":131,"district":"","province":"\u5317\u4eac\u5e02","street":"","street_number":""},"point":{"x":"116.41338370","y":"39.91092455"}},"status":0}

```

### 地点检索联想
https://lbs.baidu.com/faq/api?title=webapi/guide/webservice-placeapi/use
```java
    @Test
    public void test3() {
        String url = "https://api.map.baidu.com/place/v2/search?query=ATM机&tag=银行&region=北京&output=json&ak=" + ak;
        String body = HttpRequest.get(url).execute().body();
        System.out.println(body);
    }
```

运行结果：
```json
{
    "status":0,
    "message":"ok",
    "result_type":"poi_type",
    "results":[
        {
            "name":"中国工商银行24小时自助银行(北京回龙观支行)",
            "location":{
                "lat":40.086878,
                "lng":116.361511
            },
            "address":"北京市昌平区回龙观镇天龙苑25号楼1单元102室",
            "province":"北京市",
            "city":"北京市",
            "area":"昌平区",
            "street_id":"da9b8387f72f1c529de32146",
            "detail":1,
            "uid":"da9b8387f72f1c529de32146"
        },
        {
            "name":"招商银行24小时自助银行服务(望京融科支行)",
            "location":{
                "lat":40.003785,
                "lng":116.489532
            },
            "address":"北京市朝阳区望京东园523号融科望京中心A座101号",
            "province":"北京市",
            "city":"北京市",
            "area":"朝阳区",
            "street_id":"647a352e9bbbaa226268580a",
            "detail":1,
            "uid":"647a352e9bbbaa226268580a"
        },
        {
            "name":"中国建设银行24小时自助银行(北京广顺北大街支行)",
            "location":{
                "lat":40.010135,
                "lng":116.47503
            },
            "address":"北京市朝阳区望京西园二区211号",
            "province":"北京市",
            "city":"北京市",
            "area":"朝阳区",
            "street_id":"2f1f2bfb43807615d23ce33c",
            "detail":1,
            "uid":"2f1f2bfb43807615d23ce33c"
        },
        {
            "name":"中国工商银行24小时自助银行(北京府学路支行)",
            "location":{
                "lat":40.227332,
                "lng":116.263379
            },
            "address":"北京市昌平区府学路福地家园7号楼07号1-2层",
            "province":"北京市",
            "city":"北京市",
            "area":"昌平区",
            "street_id":"22e11407287926b4d5b74e09",
            "detail":1,
            "uid":"22e11407287926b4d5b74e09"
        },
        {
            "name":"北京银行24小时自助银行服务",
            "location":{
                "lat":40.086083,
                "lng":116.344453
            },
            "address":"北京市昌平区回龙观西大街19号北店时代广场E座",
            "province":"北京市",
            "city":"北京市",
            "area":"昌平区",
            "street_id":"0ed20a155aedbde956bfff9e",
            "detail":1,
            "uid":"0ed20a155aedbde956bfff9e"
        },
        {
            "name":"中国建设银行ATM(昌平沙河支行)",
            "location":{
                "lat":40.12088,
                "lng":116.289465
            },
            "address":"北京市昌平区京藏高速碧水庄园",
            "province":"北京市",
            "city":"北京市",
            "area":"昌平区",
            "street_id":"3eda5f5002bdd6fc40afe6d9",
            "detail":1,
            "uid":"3eda5f5002bdd6fc40afe6d9"
        },
        {
            "name":"广发银行24小时自助银行服务",
            "location":{
                "lat":40.085671,
                "lng":116.599251
            },
            "address":"北京市朝阳区航管南路北京首都国际机场T2航站楼P2停车场F1",
            "province":"北京市",
            "city":"北京市",
            "area":"朝阳区",
            "street_id":"",
            "detail":1,
            "uid":"e6ff32edf4232929fda778a3"
        },
        {
            "name":"招商银行24小时自助银行(回龙观支行)",
            "location":{
                "lat":40.085153,
                "lng":116.344808
            },
            "address":"北京市昌平区龙冠商务中心1层",
            "province":"北京市",
            "city":"北京市",
            "area":"昌平区",
            "street_id":"5165c94b870f3ec5d92f289b",
            "detail":1,
            "uid":"5165c94b870f3ec5d92f289b"
        },
        {
            "name":"中国工商银行24小时自助银行服务(京奥嘉园支行)",
            "location":{
                "lat":39.967008,
                "lng":116.551822
            },
            "address":"北京市朝阳区东坝乡京奥家园186幢一楼西侧",
            "province":"北京市",
            "city":"北京市",
            "area":"朝阳区",
            "street_id":"f757e6eee5b37817260bd043",
            "detail":1,
            "uid":"f757e6eee5b37817260bd043"
        },
        {
            "name":"中国农业银行24小时自助银行(北京航天城支行)",
            "location":{
                "lat":40.085405,
                "lng":116.274654
            },
            "address":"北京市海淀区友谊路193号",
            "province":"北京市",
            "city":"北京市",
            "area":"海淀区",
            "street_id":"dffd631c453f76bf38221c7a",
            "detail":1,
            "uid":"dffd631c453f76bf38221c7a"
        }
    ]
}
```


### 地图导航

https://lbs.baidu.com/faq/api?title=webapi/webservice-direction/dirve

```java
@Test  
public void test4() {  
    String url = "https://api.map.baidu.com/direction/v2/driving?origin=40.01116,116.339303" +  
            "&destination=39.936404,116.452562&ak=" + ak;  
    String body = HttpRequest.get(url).execute().body();  
    System.out.println(body);  
}
```


