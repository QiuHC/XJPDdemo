# 静态网页部署指南

针对你的 Vue 项目，我推荐以下几种最简单且免费的部署方案：

## 1. 方案推荐

| 平台 | 推荐理由 | 难度 |
| :--- | :--- | :--- |
| **Vercel (最推荐)** | 原生支持 Vue/Vite，自动化构建，国内访问速度快，支持自定义域名。 | ⭐ |
| **GitHub Pages** | 完全免费，直接关联仓库，适合个人展示。 | ⭐⭐ |
| **Netlify** | 功能非常强大，自带 CDN 加速和 Forms 功能。 | ⭐ |

---

## 2. 部署前的准备工作

在部署之前，我们需要先在本地生成生产环境的静态文件。

1. **运行构建命令**：
   在终端运行：
   ```bash
   npm run build
   ```
2. **生成文件夹**：
   构建完成后，项目根目录下会生成一个 `dist` 文件夹。这个文件夹里的内容就是我们要部署到服务器上的所有代码。

---

## 3. 操作步骤 (以 Vercel 为例 - 最快)

Vercel 是目前前端部署体验最好的平台，只需几分钟即可上线。

### 方法 A：通过 GitHub 自动部署（推荐）
1. 将你的代码上传到 **GitHub** 私有或公开仓库。
2. 登录 [Vercel 官网](https://vercel.com/)。
3. 点击 **"Add New" -> "Project"**。
4. 导入你的 GitHub 仓库。
5. **无需修改设置**（Vercel 会自动识别 Vite 项目），直接点击 **"Deploy"**。
6. 完成！你会获得一个 `xxx.vercel.app` 的临时网址，也可以绑定自己的域名。

### 方法 B：命令行快速部署
如果你不想使用 Git，可以安装 Vercel CLI：
```bash
npm install -g vercel
vercel deploy
```
然后按照提示操作即可。

---

## 4. 特别说明 (Vite 路径问题)

如果你打算部署在 **GitHub Pages** 的子目录下（例如 `https://username.github.io/my-project/`），你需要修改 `vite.config.js`：

```javascript
// vite.config.js
export default defineConfig({
  base: '/你的仓库名称/', // 只有部署在子目录下才需要改这里
  plugins: [vue()],
})
```

---

> [!TIP]
> **如果你已经有自己的云服务器 (Nginx)**:
> 只需将 `dist` 文件夹上传到服务器的网页根目录即可。
