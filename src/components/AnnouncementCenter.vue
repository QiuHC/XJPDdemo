<template>
  <div class="announcement-center">
    <div class="page-header">
      <div>
        <h2 class="page-title">公示与通报中心</h2>
        <p class="page-desc">展示星级评定过程中的非现场成绩、公示结果及通报内容。</p>
      </div>
    </div>

    <!-- 子导航标签 -->
    <el-tabs v-model="activeTab" class="demo-tabs" type="border-card">
      <el-tab-pane label="现场检查成绩面板" name="onsite-score">
        <!-- 现有现场内容 -->
        <el-card class="filter-card" shadow="never" style="margin-bottom: 16px;">
          <el-form :inline="true" :model="onsiteFilters" class="demo-form-inline">
            <el-form-item label="服务店代码">
              <el-input v-model="onsiteFilters.shopCode" placeholder="服务店代码" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item label="标准项目">
              <el-input v-model="onsiteFilters.standardItem" placeholder="标准项目" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item label="申报星级">
              <el-select v-model="onsiteFilters.category" placeholder="全部" clearable style="width: 120px">
                <el-option label="五星级" value="五星级" />
                <el-option label="四星级" value="四星级" />
                <el-option label="三星级" value="三星级" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleOnsiteReset" plain>重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-table :data="onsitePagedData" stripe style="width: 100%">
          <el-table-column prop="shopCode" label="服务店代码" width="140" />
          <el-table-column prop="shopName" label="服务店名称" min-width="180" />
          <el-table-column prop="standardItem" label="标准项目" width="150" />
          <el-table-column prop="disputeStatus" label="异议审核状态" width="180">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.disputeStatus)" effect="light">
                {{ scope.row.disputeStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="项目得分情况" width="120" align="right" />
          <el-table-column prop="starLevel" label="申报星级" width="120" align="center">
            <template #default="scope">
              <el-tag effect="light">{{ scope.row.starLevel }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination v-model:current-page="onsiteCurrentPage" v-model:page-size="onsitePageSize" layout="total, prev, pager, next" :total="onsiteFilteredData.length" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="现场信息面板 (汇总)" name="onsite-summary">
        <el-table :data="onsiteSummaryData" stripe style="width: 100%">
          <el-table-column prop="shopCode" label="服务店代码" width="140" />
          <el-table-column prop="shopName" label="服务店名称" min-width="180" />
          <el-table-column prop="totalScore" label="现场总得分" width="120" align="center" />
          <el-table-column prop="starLevel" label="现场成绩星级" width="120" align="center" />
          <el-table-column prop="period" label="现场检查周期" width="120" align="center" />
          <el-table-column prop="disputeStatus" label="异议审核状态" width="180">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.disputeStatus)" effect="light">
                {{ scope.row.disputeStatus }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="非现场成绩面板" name="offsite-score">
        <!-- 筛选框 -->
        <el-card class="filter-card" shadow="never" style="margin-bottom: 16px;">
          <el-form :inline="true" :model="filters" class="demo-form-inline">
            <el-form-item label="服务店代码">
              <el-input v-model="filters.shopCode" placeholder="服务店代码" clearable style="width: 150px" />
            </el-form-item>
            <el-form-item label="标准项目">
              <el-select v-model="filters.standardItem" placeholder="全部" clearable style="width: 150px">
                <el-option label="服务总监" value="服务总监" />
                <el-option label="技术总监" value="技术总监" />
                <el-option label="索赔员" value="索赔员" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleReset" plain>重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-table :data="pagedData" stripe style="width: 100%">
          <el-table-column prop="shopCode" label="服务店代码" width="140" />
          <el-table-column prop="shopName" label="服务店名称" min-width="180" />
          <el-table-column prop="standardItem" label="标准项目" width="150" />
          <el-table-column prop="disputeStatus" label="异议审核状态" width="180">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.disputeStatus)" effect="light">
                {{ scope.row.disputeStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="项目得分情况" width="120" align="right" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="非现场信息面板 (汇总)" name="offsite-summary">
        <el-table :data="summaryPagedData" stripe style="width: 100%">
          <el-table-column prop="shopCode" label="服务店代码" width="140" />
          <el-table-column prop="shopName" label="服务店名称" min-width="180" />
          <el-table-column prop="totalScore" label="非现场总得分" width="120" align="center" />
          <el-table-column prop="starLevel" label="非现场星级" width="120" align="center" />
          <el-table-column prop="period" label="非现场周期" width="120" align="center" />
          <el-table-column prop="disputeStatus" label="异议审核状态" width="180">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.disputeStatus)" effect="light">
                {{ scope.row.disputeStatus }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const activeTab = ref('offsite-score');

// 非现场面板状态
const filters = ref({ shopCode: '', shopName: '', standardItem: '', disputeStatus: '' });
const currentPage = ref(1);
const pageSize = ref(10);

// 现场面板状态
const onsiteFilters = ref({ shopCode: '', standardItem: '', category: '' });
const onsiteCurrentPage = ref(1);
const onsitePageSize = ref(10);

const allData = ref([]);
const onsiteData = ref([]);

const generateData = () => {
  const provinces = ['GD', 'BJ', 'SH', 'JS', 'ZJ'];
  const items = ['服务总监', '技术总监', '索赔员'];
  const onsiteItems = ['免费工作服装', '形象墙标准', '前台接待流程'];
  const statusOptions = ['通过', '不通过', '无异议'];
  
  // 非现场
  const offsiteList = [];
  for (let i = 1; i <= 25; i++) {
    const province = provinces[i % provinces.length];
    offsiteList.push({
      id: i, shopCode: `BYD${province}${String(i).padStart(3, '0')}W`,
      shopName: i === 1 ? '深圳某迪销售服务有限公司' : `${province}某迪销售店 ${i}`,
      standardItem: items[i % items.length],
      disputeStatus: statusOptions[i % 3], score: 10, totalScore: 400,
      starLevel: '五星级', period: '2026年Q1'
    });
  }
  allData.value = offsiteList;

  // 现场
  const onsiteList = [];
  for (let i = 1; i <= 15; i++) {
    const province = provinces[i % provinces.length];
    onsiteList.push({
      id: i+25, shopCode: `BYD${province}${String(i).padStart(3, '0')}W`,
      shopName: i === 1 ? '深圳某迪销售服务有限公司' : `${province}某迪销售店 ${i}`,
      standardItem: onsiteItems[i % onsiteItems.length],
      disputeStatus: statusOptions[(i+1) % 3], score: 8, totalScore: 600,
      starLevel: '五星级', period: '2026年Q1'
    });
  }
  onsiteData.value = onsiteList;
};

const getStatusType = (status) => {
  if (status === '通过') return 'success';
  if (status === '不通过') return 'danger';
  if (status === '无异议') return 'info';
  return '';
};

// 非现场逻辑
const filteredData = computed(() => {
  return allData.value.filter(item => {
    return (!filters.value.shopCode || item.shopCode.includes(filters.value.shopCode)) &&
           (!filters.value.shopName || item.shopName.includes(filters.value.shopName)) &&
           (!filters.value.standardItem || item.standardItem === filters.value.standardItem) &&
           (!filters.value.disputeStatus || item.disputeStatus.includes(filters.value.disputeStatus));
  });
});
const pagedData = computed(() => filteredData.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value));
const summaryPagedData = computed(() => allData.value.slice(0, 10));

// 现场逻辑
const onsiteFilteredData = computed(() => {
  return onsiteData.value.filter(item => {
    return (!onsiteFilters.value.shopCode || item.shopCode.includes(onsiteFilters.value.shopCode)) &&
           (!onsiteFilters.value.standardItem || item.standardItem.includes(onsiteFilters.value.standardItem)) &&
           (!onsiteFilters.value.category || item.starLevel === onsiteFilters.value.category);
  });
});
const onsitePagedData = computed(() => onsiteFilteredData.value.slice((onsiteCurrentPage.value - 1) * onsitePageSize.value, onsiteCurrentPage.value * onsitePageSize.value));
const onsiteSummaryData = computed(() => onsiteData.value.slice(0, 10));

const handleReset = () => { filters.value = { shopCode: '', shopName: '', standardItem: '', disputeStatus: '' }; currentPage.value = 1; };
const handleOnsiteReset = () => { onsiteFilters.value = { shopCode: '', standardItem: '', category: '' }; onsiteCurrentPage.value = 1; };

onMounted(() => { generateData(); });
</script>

<style scoped>
.announcement-center {
  background: transparent;
}

.score-value {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-tabs--border-card) {
  border: none;
  box-shadow: var(--shadow-md);
  border-radius: 8px;
}

:deep(.el-tabs__content) {
  padding: 24px;
}
</style>
