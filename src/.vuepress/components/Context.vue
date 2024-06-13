<template>
  <el-table :data="data" style="width: 100%">
    <el-table-column prop="source" label="OJ名称" width="180"/>
    <el-table-column prop="name" label="比赛名称" width="180">
      <template #default="scope">
        <a :href="scope.row.link" target="_blank">{{ scope.row.name }}</a>
      </template>

    </el-table-column>
    <el-table-column prop="start_time" label="开始时间" width="200">
      <template #default="scope">
        {{ filterDate(new Date(scope.row.start_time)) }}
      </template>
    </el-table-column>
    <el-table-column prop="end_time" label="结束时间" width="200">
      <template #default="scope">
        {{ filterDate(new Date(scope.row.end_time)) }}
      </template>
    </el-table-column>
    <el-table-column prop="name" label="状态" width="180">
      <template #default="scope">
        <el-tag>{{ filterTag(scope) }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const filterDate = (date: Date) => {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString()
}

const filterTag = (scope) => {
  const row = scope.row
  const start_time = row.start_time

  //是否已经开始
  if (new Date(start_time).getTime() < new Date().getTime()) {
    return "进行中"
  }

  //计算 start_time 的时间戳
  const start_time_stamp = new Date(start_time).getTime()
  //计算当前时间的时间戳
  const now_time_stamp = new Date().getTime()
  //计算间隔
  const interval = start_time_stamp - now_time_stamp
  //计算间隔天数
  const interval_day = interval / (24 * 60 * 60 * 1000)
  //如果小于 1 天，返回即将开始
  if (interval_day < 1) {
    return "即将开始"
  }
  //如果大于 1 天，返回倒计时
  return "倒计时 " + Math.ceil(interval_day) + " 天"


}

const data = ref()
const getData = () => {
  const url = "https://contests.sdutacm.cn/contests.json";
  axios.get(url).then((res) => {
    console.log(res)
    data.value = res.data
    console.log(data.value)
  })
}

onMounted(async () => {
  await getData()
})

</script>
