<template>
  <section class="dashboard-layout">
    <div class="metric-row">
      <article v-for="metric in metrics" :key="metric.label" class="metric">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
      </article>
    </div>
    <div class="chart-grid">
      <div class="chart-panel">
        <div class="panel-head">
          <h3>问答趋势</h3>
          <span>近 7 天</span>
        </div>
        <div ref="trendRef" class="chart"></div>
      </div>
      <div class="chart-panel">
        <div class="panel-head">
          <h3>问题分类</h3>
          <span>本月</span>
        </div>
        <div ref="categoryRef" class="chart"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as echarts from "echarts/core";
import { LineChart, PieChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { categoryData, metrics, trendData } from "../mockData";

echarts.use([LineChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const trendRef = ref<HTMLDivElement | null>(null);
const categoryRef = ref<HTMLDivElement | null>(null);
let trendChart: echarts.ECharts | null = null;
let categoryChart: echarts.ECharts | null = null;

function renderCharts() {
  if (!trendRef.value || !categoryRef.value) return;
  trendChart = echarts.init(trendRef.value);
  categoryChart = echarts.init(categoryRef.value);

  trendChart.setOption({
    tooltip: { trigger: "axis" },
    grid: { top: 28, right: 20, bottom: 28, left: 36 },
    xAxis: { type: "category", data: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"] },
    yAxis: { type: "value" },
    series: [
      {
        name: "问答次数",
        type: "line",
        smooth: true,
        data: trendData,
        areaStyle: { opacity: 0.12 },
        lineStyle: { width: 3 },
      },
    ],
  });

  categoryChart.setOption({
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [
      {
        name: "问题分类",
        type: "pie",
        radius: ["42%", "68%"],
        center: ["50%", "43%"],
        data: categoryData,
      },
    ],
  });
}

function resizeCharts() {
  trendChart?.resize();
  categoryChart?.resize();
}

onMounted(async () => {
  await nextTick();
  renderCharts();
  window.addEventListener("resize", resizeCharts);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeCharts);
  trendChart?.dispose();
  categoryChart?.dispose();
});
</script>
