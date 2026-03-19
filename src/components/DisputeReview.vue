<template>
  <div class="dispute-review">
    <div class="page-header">
      <div>
        <h2 class="page-title">审核与评审中心</h2>
        <p class="page-desc">处理服务店对各类成绩评定的异议申请。</p>
      </div>
    </div>

    <el-tabs v-model="activeTab" type="border-card" class="review-tabs">
      <el-tab-pane label="非现场成绩异议评审" name="offsite">
        <!-- 搜索栏 -->
        <div class="table-toolbar">
           <el-input v-model="search" placeholder="输入服务店代码或名称" style="width: 300px" clearable>
             <template #prefix><el-icon><Search /></el-icon></template>
           </el-input>
        </div>

        <el-table :data="filteredOffsiteData" stripe style="width: 100%">
          <el-table-column prop="shopCode" label="服务店代码" width="140" />
          <el-table-column prop="shopName" label="服务店名称" min-width="180" />
          <el-table-column prop="standardItem" label="非现场标准项目" width="160" />
          <el-table-column prop="score" label="非现场项目得分" width="150" align="center">
            <template #default="scope">
              <span class="score-num">{{ scope.row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="starLevel" label="非现场星级" width="140" align="center">
            <template #default="scope">
              <el-tag effect="dark" :type="scope.row.starLevel === '五星级' ? 'warning' : ''">
                {{ scope.row.starLevel }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="period" label="非现场周期" width="140" align="center" />
          <el-table-column prop="status" label="异议审核状态" width="160" align="center">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)" effect="light">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination layout="total, prev, pager, next" :total="offsiteData.length" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="现场成绩异议评审" name="onsite">
        <div class="table-toolbar">
           <el-input v-model="onsiteSearch" placeholder="输入服务店代码或名称" style="width: 300px" clearable>
             <template #prefix><el-icon><Search /></el-icon></template>
           </el-input>
        </div>

        <el-table :data="filteredOnsiteData" stripe style="width: 100%">
          <el-table-column prop="shopCode" label="服务店代码" width="140" />
          <el-table-column prop="shopName" label="服务店名称" min-width="180" />
          <el-table-column prop="standardItem" label="现场标准项目" width="160" />
          <el-table-column prop="score" label="现场项目得分" width="150" align="center">
            <template #default="scope">
              <span class="score-num">{{ scope.row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="starLevel" label="现场星级" width="140" align="center" />
          <el-table-column prop="period" label="星评" width="140" align="center" />
          <el-table-column prop="status" label="状态" width="160" align="center">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)" effect="light">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination layout="total, prev, pager, next" :total="onsiteData.length" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';

const activeTab = ref('offsite');
const search = ref('');
const onsiteSearch = ref('');
const offsiteData = ref([]);
const onsiteData = ref([]);

const generateReviewData = () => {
  const provinces = ['GD', 'BJ', 'SH', 'JS', 'ZJ'];
  const statusOptions = ['通过', '不通过', '无异议'];
  
  // 非现场
  const items = ['服务总监', '技术总监', '索赔员'];
  const data1 = [];
  for (let i = 1; i <= 15; i++) {
    const province = provinces[i % provinces.length];
    data1.push({
      id: i,
      shopCode: `BYD${province}${String(i).padStart(3, '0')}W`,
      shopName: i === 1 ? '深圳某迪销售服务有限公司' : `${province}某迪销售店 ${i}`,
      standardItem: items[i % items.length],
      score: 10,
      starLevel: '五星级',
      period: '2026年Q1',
      status: i < 3 ? '待处理' : statusOptions[i % 3]
    });
  }
  offsiteData.value = data1;

  // 现场
  const onsiteItems = ['免费工作服装', '形象墙标准', '前台接待流程'];
  const data2 = [];
  for (let i = 1; i <= 12; i++) {
    const province = provinces[i % provinces.length];
    data2.push({
      id: i + 100,
      shopCode: `BYD${province}${String(i).padStart(3, '0')}W`,
      shopName: i === 1 ? '深圳某迪销售服务有限公司' : `${province}某迪销售店 ${i}`,
      standardItem: onsiteItems[i % onsiteItems.length],
      score: 8,
      starLevel: '五星级',
      period: '2026年Q1',
      status: i < 3 ? '待处理' : statusOptions[i % 3]
    });
  }
  onsiteData.value = data2;
};

const getStatusType = (status) => {
  if (status === '通过') return 'success';
  if (status === '不通过') return 'danger';
  if (status === '无异议') return 'info';
  if (status === '待处理') return 'warning';
  return '';
};

const filteredOffsiteData = computed(() => {
  if (!search.value) return offsiteData.value;
  return offsiteData.value.filter(item => 
    item.shopCode.includes(search.value) || item.shopName.includes(search.value)
  );
});

const filteredOnsiteData = computed(() => {
  if (!onsiteSearch.value) return onsiteData.value;
  return onsiteData.value.filter(item => 
    item.shopCode.includes(onsiteSearch.value) || item.shopName.includes(onsiteSearch.value)
  );
});

onMounted(() => {
  generateReviewData();
});
</script>

<style scoped>
.dispute-review {
  background: transparent;
}

.review-tabs {
  border: none;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

:deep(.el-tabs--border-card) {
  border: none;
}

:deep(.el-tabs__content) {
  padding: 24px;
}

.table-toolbar {
  margin-bottom: 20px;
}

.score-num {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
