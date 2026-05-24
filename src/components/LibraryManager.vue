<template>
  <section class="library-layout">
    <div class="upload-panel">
      <div>
        <h3>文档上传</h3>
        <p>PDF / Word / Markdown / TXT</p>
      </div>
      <el-upload drag multiple :auto-upload="false" :show-file-list="false" :on-change="onUploadChange">
        <div class="upload-copy">
          <span>选择文件</span>
          <strong>{{ store.uploadHint }}</strong>
        </div>
      </el-upload>
    </div>

    <div class="table-panel">
      <div class="panel-head">
        <h3>知识库文档</h3>
        <el-button size="small" @click="parseAll">批量解析</el-button>
      </div>
      <el-table :data="store.currentLibrary.docs" height="100%" stripe>
        <el-table-column prop="name" label="文件名" min-width="220" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="size" label="大小" width="120" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template #default="{ row }">
            <el-button size="small" @click="parseDocument(row)">解析</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ElMessage, type UploadFile } from "element-plus";
import { useKnowledgeStore } from "../stores/knowledge";
import type { DocumentItem } from "../types";

const store = useKnowledgeStore();

function statusType(status: DocumentItem["status"]) {
  if (status === "已解析") return "success";
  if (status === "解析失败") return "danger";
  return "warning";
}

async function onUploadChange(uploadFile: UploadFile) {
  if (!uploadFile.raw) return;
  try {
    await store.addUploadedDocs([uploadFile.raw]);
    ElMessage.success("文件已加入解析队列");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "上传失败");
  }
}

async function parseDocument(doc: DocumentItem) {
  await store.parseDocument(doc);
  ElMessage.success("解析完成");
}

async function parseAll() {
  await store.parseAll();
  ElMessage.success("批量解析完成");
}
</script>
