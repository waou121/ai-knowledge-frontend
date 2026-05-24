<template>
  <section class="login-view">
    <el-form class="login-panel" :model="form" @submit.prevent>
      <div class="brand-mark">K</div>
      <h1>AI 知识库问答平台</h1>

      <el-form-item label="账号">
        <el-input v-model="form.account" autocomplete="username" />
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" autocomplete="current-password" show-password />
      </el-form-item>

      <el-button type="primary" size="large" :loading="store.isLoading" @click="login">进入工作台</el-button>
    </el-form>
  </section>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useKnowledgeStore } from "../stores/knowledge";

const router = useRouter();
const store = useKnowledgeStore();
const form = reactive({
  account: "gaojunchi",
  password: "123456",
});

async function login() {
  try {
    await store.login(form);
    ElMessage.success("登录成功");
    await router.push("/chat");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "登录失败");
  }
}
</script>
