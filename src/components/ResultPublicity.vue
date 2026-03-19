<template>
  <div class="result-publicity">
    <div class="page-header">
      <div>
        <h2 class="page-title">结果公示推送</h2>
        <p class="page-desc">汇总最终星级评定结果。</p>
      </div>
    </div>

    <el-card class="table-card" shadow="never">
      <!-- 预览筛选器 -->
      <div class="table-toolbar">
         <el-input v-model="search" placeholder="输入服务店名称或代码搜索" style="width: 300px">
           <template #prefix><el-icon><Search /></el-icon></template>
         </el-input>
      </div>

      <el-table :data="filteredData" stripe style="width: 100%">
        <el-table-column prop="shopCode" label="服务店代码" width="140" />
        <el-table-column prop="shopName" label="服务店名称" min-width="200" />
        <el-table-column prop="totalScore" label="星级评定总得分" width="160" align="center">
          <template #default="scope">
             <span class="score-emphasis">{{ scope.row.totalScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="starLevel" label="评定星级" width="160" align="center">
          <template #default="scope">
            <el-rate
              v-model="scope.row.starValue"
              disabled
              text-color="#ff9900"
            />
            <div style="font-size: 12px; color: #666;">{{ scope.row.starLevel }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="period" label="现场检查周期" width="160" align="center" />
      </el-table>

      <div class="pagination-container">
        <el-pagination layout="total, prev, pager, next" :total="publicityData.length" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Promotion, Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const search = ref('');
const publicityData = ref([]);

const generatePublicityData = () => {
  const provinces = ['GD', 'BJ', 'SH', 'JS', 'ZJ'];
  const levels = ['五星级', '四星级', '三星级'];
  const stars = [5, 4, 3];
  
  const data = [];
  for (let i = 1; i <= 20; i++) {
    const province = provinces[i % provinces.length];
    const levelIdx = i % 3;
    data.push({
      id: i,
      shopCode: `BYD${province}${String(i).padStart(3, '0')}W`,
      shopName: i === 1 ? '深圳某迪销售服务有限公司' : `${province}某迪销售店 ${i}`,
      totalScore: 600 - (i * 5),
      starLevel: levels[levelIdx],
      starValue: stars[levelIdx],
      period: '2026年Q1'
    });
  }
  publicityData.value = data;
};

const filteredData = computed(() => {
  if (!search.value) return publicityData.value;
  return publicityData.value.filter(item => 
    item.shopName.includes(search.value) || item.shopCode.includes(search.value)
  );
});

const handlePush = (row) => {
  ElMessage.success(`推送成功：已将结果发送至 ${row.shopName}`);
};

const handleBatchPush = () => {
  ElMessageBox.confirm('确定要将当前的评定结果批量推送给所有服务店吗？', '确认推送', {
    confirmButtonText: '确定推送',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
     ElMessage.success('批量推送任务已启动，由智能体自动分发中...');
  });
};

onMounted(() => {
  generatePublicityData();
});
</script>

<style scoped>
.result-publicity {
  background: transparent;
}

.table-card {
  border: none;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.table-toolbar {
  margin-bottom: 20px;
}

.score-emphasis {
  font-weight: bold;
  font-size: 18px;
  color: #2563eb;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-rate__icon) {
  margin-right: 2px;
}
</style>
