# Vite React 项目 GitHub Pages 部署完整指南

本文档详细记录了将 Vite + React 项目成功部署到 GitHub Pages 的完整过程，包括遇到的问题和解决方案。

## 📋 问题背景

当将 Vite + React 项目部署到 GitHub Pages 时，会遇到以下常见问题：

1. **资源路径 404 错误** - GitHub Pages 部署在子路径下，但资源引用使用了根路径
2. **部署源代码而非构建文件** - GitHub Pages 默认部署源代码，而不是构建后的 `dist` 目录
3. **双重部署冲突** - GitHub 自动创建的工作流与自定义工作流冲突
4. **权限问题** - GitHub Actions 没有足够权限部署到 Pages

## ✅ 完整解决方案

### 1. 配置 Vite 基础路径

**文件**: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/SnakeGame/', // 设置 GitHub Pages 的 base path
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 5173,
  },
})
```

**关键点**:
- `base: '/项目名/'` - 必须与 GitHub 仓库名一致
- 确保路径以 `/` 开头和结尾

### 2. 创建 GitHub Actions 工作流

**文件**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ master ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages-deployment"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

**关键配置说明**:

#### 权限配置 (必需)
```yaml
permissions:
  contents: read    # 读取代码
  pages: write      # 写入 Pages
  id-token: write   # 身份验证
```

#### 并发控制 (避免冲突)
```yaml
concurrency:
  group: "pages-deployment"
  cancel-in-progress: true
```

#### 环境配置 (必需)
```yaml
environment:
  name: github-pages
  url: ${{ steps.deployment.outputs.page_url }}
```

### 3. 配置 GitHub Pages 设置

1. 访问仓库设置: `https://github.com/用户名/仓库名/settings/pages`
2. 在 "Source" 部分选择 **"GitHub Actions"**（重要！）
3. **不要**选择任何分支（如 gh-pages）

### 4. 验证部署

1. **推送代码后检查**:
   - GitHub Actions 是否成功运行
   - 是否只有一个工作流在运行（避免双重部署）

2. **访问测试**:
   - 部署 URL: `https://用户名.github.io/仓库名/`
   - 检查所有资源是否正确加载

## 🚨 常见问题及解决方案

### 问题 1: 403 权限错误
```
remote: Permission to 用户名/仓库名.git denied to github-actions[bot].
```

**解决方案**: 确保在工作流中添加了完整的权限配置（见上方权限配置）

### 问题 2: 缺少环境配置错误
```
Missing environment. Ensure your workflow's deployment job has an environment.
```

**解决方案**: 在 job 中添加 environment 配置（见上方环境配置）

### 问题 3: 双重部署
GitHub 同时运行两个工作流：自定义工作流和自动创建的 pages 工作流。

**解决方案**: 
1. 确保 Pages 设置源为 "GitHub Actions"
2. 在并发控制中使用唯一的组名: `"pages-deployment"`

### 问题 4: 资源 404 错误
部署后访问游戏，但 JS/CSS 文件返回 404。

**解决方案**: 
1. 检查 `vite.config.js` 中的 `base` 配置
2. 确保与仓库名称一致

## 📁 项目结构

正确的项目结构应该包含：

```
项目根目录/
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions 配置
├── src/                   # 源代码目录
├── dist/                  # 构建输出目录（自动生成）
├── vite.config.js        # Vite 配置文件
├── package.json
└── index.html
```

## 🔧 最佳实践

1. **路径配置**:
   - 在 `index.html` 中保持绝对路径: `/src/main.jsx`
   - 不建议改为相对路径，除非有特殊需求

2. **开发vs生产**:
   - 开发时：Vite 处理路径转换
   - 生产时：构建后路径自动包含 base 前缀

3. **调试技巧**:
   - 检查构建后的 `dist/index.html` 确认路径正确
   - 使用浏览器开发者工具检查资源加载

## 🎯 完整流程总结

1. **修改 `vite.config.js`** - 添加 base 配置
2. **创建 `.github/workflows/deploy.yml`** - 配置自动部署
3. **设置 GitHub Pages 源** - 选择 "GitHub Actions"
4. **推送代码** - 触发自动部署
5. **验证部署** - 检查网站是否正常访问

遵循以上步骤，可以确保 Vite + React 项目成功部署到 GitHub Pages，避免常见的路径和权限问题。

## 📚 参考资源

- [Vite 官方部署文档](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 部署 Pages 文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-github-actions-workflows-with-github-pages)

---

> 本文档基于实际部署经验总结，已验证可行。如遇到其他问题，请参考官方文档或提交 Issue。