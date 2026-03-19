// 纯前端 Demo 版 Request 模拟工具
// 使用 localStorage 模拟数据库存储

const DELAY = 500; // 模拟网络延迟

// 初始化 Mock 数据
const initMockData = () => {
  // 强制重置数据以应用新规则
  const provinces = ['GD', 'BJ', 'SH', 'JS', 'ZJ', 'SC', 'HB', 'HN'];
  const stars = ['三星级', '四星级', '五星级'];
  const statuses = ['PENDING', 'APPROVED', 'REJECTED'];
  const mockData = [];

  for (let i = 1; i <= 12; i++) {
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    const num = String(i).padStart(3, '0');
    const suffix = 'W';
    const shopCode = `BYD${province}${num}${suffix}`;
    
    mockData.push({
      id: i,
      shopCode: shopCode,
      shopName: `${province} 示范店 ${num}`,
      category: stars[Math.floor(Math.random() * stars.length)],
      status: i % 3 === 0 ? 'PENDING' : (i % 3 === 1 ? 'APPROVED' : 'REJECTED'),
      createTime: new Date(Date.now() - i * 3600000).toISOString(),
      rejectReason: i % 3 === 2 ? '材料不齐全' : ''
    });
  }
  localStorage.setItem('mock_registrations', JSON.stringify(mockData));

  if (!localStorage.getItem('mock_config')) {
    localStorage.setItem('mock_config', JSON.stringify({
      startTime: '2024-01-01T00:00:00',
      endTime: '2025-12-31T23:59:59'
    }));
  }
};

initMockData();

const request = {
  async get(url) {
    console.log(`[Mock GET] ${url}`);
    await new Promise(resolve => setTimeout(resolve, DELAY));

    if (url.startsWith('/registrations/list')) {
      const all = JSON.parse(localStorage.getItem('mock_registrations') || '[]');
      const params = new URLSearchParams(url.split('?')[1]);
      const shopCode = params.get('shopCode');
      return shopCode ? all.filter(item => item.shopCode === shopCode) : all;
    }

    if (url === '/config/registration_period') {
      return { configValue: localStorage.getItem('mock_config') };
    }

    return null;
  },

  async post(url, data) {
    console.log(`[Mock POST] ${url}`, data);
    await new Promise(resolve => setTimeout(resolve, DELAY));

    // 登录模拟
    if (url === '/auth/login') {
      if (data.username === '6666666' && data.password === '88888888') {
        return { token: 'mock_admin_token', role: 'ADMIN' };
      } else if (data.username === 'BYDGD100W' && data.password === '88888888') {
        return { token: 'mock_shop_token', role: 'SHOP', shopCode: 'BYDGD100W', shopName: '东莞 100W 服务店' };
      }
      throw { response: { data: { message: '账号或密码错误 (Demo: 6666666/88888888 或 BYDGD100W/88888888)' } } };
    }

    // 提交报名
    if (url === '/registrations/submit') {
      const all = JSON.parse(localStorage.getItem('mock_registrations') || '[]');
      const newEntry = {
        ...data,
        id: Date.now(),
        status: 'PENDING',
        createTime: new Date().toISOString()
      };
      all.unshift(newEntry);
      localStorage.setItem('mock_registrations', JSON.stringify(all));
      return { success: true };
    }

    // 配置更新
    if (url === '/config/period') {
      localStorage.setItem('mock_config', JSON.stringify(data));
      return { success: true };
    }

    // 审核操作
    if (url.includes('/approve') || url.includes('/reject')) {
      const match = url.match(/\/registrations\/(\d+)\/(approve|reject)/);
      if (match) {
        const id = parseInt(match[1]);
        const type = match[2];
        const all = JSON.parse(localStorage.getItem('mock_registrations') || '[]');
        const index = all.findIndex(item => item.id === id);
        if (index !== -1) {
          all[index].status = type === 'approve' ? 'APPROVED' : 'REJECTED';
          if (data && data.reason) all[index].rejectReason = data.reason;
          localStorage.setItem('mock_registrations', JSON.stringify(all));
          return { success: true };
        }
      }
    }

    return { success: true };
  }
};

export default request;
