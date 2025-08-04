<template>
  <div v-if="showSEOStatus && isDev" class="seo-status-panel">
    <div class="seo-header" @click="togglePanel">
      <i class="pi pi-search"></i>
      <span>SEO 状态</span>
      <div class="seo-score" :class="scoreClass">
        {{ report?.summary.score || 0 }}
      </div>
      <i
        class="pi"
        :class="isExpanded ? 'pi-chevron-up' : 'pi-chevron-down'"
      ></i>
    </div>

    <div v-if="isExpanded" class="seo-content">
      <div v-if="report" class="seo-summary">
        <div class="summary-item">
          <span class="label">通过:</span>
          <span class="value success">{{ report.summary.passed }}</span>
        </div>
        <div class="summary-item">
          <span class="label">警告:</span>
          <span class="value warning">{{ report.summary.warnings }}</span>
        </div>
        <div class="summary-item">
          <span class="label">失败:</span>
          <span class="value error">{{ report.summary.failed }}</span>
        </div>
      </div>

      <div v-if="report?.checks" class="seo-checks">
        <div
          v-for="check in report.checks"
          :key="check.name"
          class="check-item"
          :class="check.status"
        >
          <div class="check-header">
            <i class="pi" :class="getCheckIcon(check.status)"></i>
            <span class="check-name">{{ check.name }}</span>
          </div>
          <div class="check-message">{{ check.message }}</div>
          <div v-if="check.suggestions.length > 0" class="check-suggestions">
            <div
              v-for="suggestion in check.suggestions"
              :key="suggestion"
              class="suggestion"
            >
              💡 {{ suggestion }}
            </div>
          </div>
        </div>
      </div>

      <div class="seo-actions">
        <button @click="runCheck" class="action-btn">
          <i class="pi pi-refresh"></i>
          重新检查
        </button>
        <button @click="exportReport" class="action-btn">
          <i class="pi pi-download"></i>
          导出报告
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { seoChecker } from "@/utils/seoChecker";

const isDev = import.meta.env.DEV;
const showSEOStatus = ref(isDev);
const isExpanded = ref(false);
const report = ref(null);

const scoreClass = computed(() => {
  const score = report.value?.summary.score || 0;
  if (score >= 80) return "score-good";
  if (score >= 60) return "score-warning";
  return "score-poor";
});

const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
};

const runCheck = () => {
  report.value = seoChecker.runAllChecks();
};

const getCheckIcon = (status) => {
  switch (status) {
    case "pass":
      return "pi-check-circle";
    case "warning":
      return "pi-exclamation-triangle";
    case "fail":
      return "pi-times-circle";
    default:
      return "pi-info-circle";
  }
};

const exportReport = () => {
  if (!report.value) return;

  const dataStr = JSON.stringify(report.value, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `seo-report-${new Date().toISOString().split("T")[0]}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

onMounted(() => {
  if (isDev) {
    // 延迟运行检查，确保页面完全加载
    setTimeout(() => {
      runCheck();
    }, 2000);
  }
});
</script>

<style scoped>
.seo-status-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-size: 14px;
}

.dark .seo-status-panel {
  background: rgba(31, 41, 55, 0.95);
  border-color: #374151;
}

.seo-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.dark .seo-header {
  border-bottom-color: #374151;
}

.seo-header:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dark .seo-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.seo-header i:first-child {
  margin-right: 8px;
  color: #2a9d8f;
}

.seo-header span {
  flex: 1;
  font-weight: 600;
  color: #1f2937;
}

.dark .seo-header span {
  color: #f9fafb;
}

.seo-score {
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: bold;
  margin-right: 8px;
  min-width: 32px;
  text-align: center;
}

.score-good {
  background: #10b981;
  color: white;
}

.score-warning {
  background: #f59e0b;
  color: white;
}

.score-poor {
  background: #ef4444;
  color: white;
}

.seo-content {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.seo-summary {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.dark .seo-summary {
  background: #374151;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-item .label {
  font-size: 12px;
  color: #6b7280;
}

.dark .summary-item .label {
  color: #9ca3af;
}

.summary-item .value {
  font-weight: bold;
  font-size: 18px;
}

.value.success {
  color: #10b981;
}

.value.warning {
  color: #f59e0b;
}

.value.error {
  color: #ef4444;
}

.seo-checks {
  margin-bottom: 16px;
}

.check-item {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid;
}

.check-item.pass {
  background: #f0fdf4;
  border-left-color: #10b981;
}

.check-item.warning {
  background: #fffbeb;
  border-left-color: #f59e0b;
}

.check-item.fail {
  background: #fef2f2;
  border-left-color: #ef4444;
}

.dark .check-item.pass {
  background: rgba(16, 185, 129, 0.1);
}

.dark .check-item.warning {
  background: rgba(245, 158, 11, 0.1);
}

.dark .check-item.fail {
  background: rgba(239, 68, 68, 0.1);
}

.check-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.check-header i {
  margin-right: 8px;
}

.check-item.pass .check-header i {
  color: #10b981;
}

.check-item.warning .check-header i {
  color: #f59e0b;
}

.check-item.fail .check-header i {
  color: #ef4444;
}

.check-name {
  font-weight: 600;
  color: #1f2937;
}

.dark .check-name {
  color: #f9fafb;
}

.check-message {
  color: #6b7280;
  margin-bottom: 8px;
}

.dark .check-message {
  color: #9ca3af;
}

.check-suggestions {
  font-size: 12px;
}

.suggestion {
  color: #6b7280;
  margin-bottom: 4px;
}

.dark .suggestion {
  color: #9ca3af;
}

.seo-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: #2a9d8f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #238b7a;
}

/* 响应式 */
@media (max-width: 768px) {
  .seo-status-panel {
    right: 10px;
    width: 280px;
  }
}

/* 滚动条样式 */
.seo-content::-webkit-scrollbar {
  width: 4px;
}

.seo-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.seo-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.dark .seo-content::-webkit-scrollbar-track {
  background: #374151;
}

.dark .seo-content::-webkit-scrollbar-thumb {
  background: #6b7280;
}
</style>
