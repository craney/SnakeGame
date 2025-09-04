# 🐍 贪吃蛇游戏

一个使用 React + Vite 构建的现代化贪吃蛇游戏网站！

## ✨ 特性

- 🎮 **经典游戏体验** - 传统贪吃蛇游戏的完整实现
- 🎨 **现代化界面** - 精美的渐变背景和动画效果
- 🔊 **音效系统** - 吃食物、游戏结束等音效反馈
- ⚙️ **多难度模式** - 简单、普通、困难、地狱四种难度
- 📱 **响应式设计** - 支持桌面和移动设备
- 💾 **本地存储** - 自动保存最高分记录
- ⚡ **动态难度** - 随着分数增加，游戏速度自动提升

## 🎯 游戏规则

- 使用方向键（↑↓←→）控制蛇的移动
- 吃到食物（🍎）获得 10 分
- 每达到 50 分，游戏速度会自动增加
- 碰到墙壁或自己的身体游戏结束
- 按空格键可暂停/继续游戏

## 🛠️ 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式**: CSS3 + CSS Variables
- **音效**: Web Audio API
- **状态管理**: React Hooks

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

服务器启动后，您可以通过以下方式访问：
- 本地访问：http://localhost:5173/
- 局域网访问：http://192.168.31.168:5173/

**局域网访问说明：**
- 同一局域网内的其他设备（手机、平板、其他电脑）都可以通过 `http://192.168.31.168:5173/` 访问游戏
- 确保防火墙允许5173端口的连接

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/
│   ├── SnakeGame.jsx      # 主游戏组件
│   ├── SnakeGame.css      # 游戏样式
│   ├── GameSettings.jsx   # 设置面板组件
│   └── GameSettings.css   # 设置面板样式
├── utils/
│   └── SoundManager.js    # 音效管理器
├── App.jsx               # 应用入口组件
├── App.css              # 应用样式
├── index.css            # 全局样式
└── main.jsx             # 应用入口文件
```

## 🎮 游戏控制

| 按键 | 功能 |
|------|------|
| ↑ | 向上移动 |
| ↓ | 向下移动 |
| ← | 向左移动 |
| → | 向右移动 |
| 空格 | 暂停/继续 |

## 🔧 自定义配置

### 游戏参数

在 `SnakeGame.jsx` 中可以调整以下参数：

```javascript
const BOARD_SIZE = 20;           // 游戏板大小
const INITIAL_SNAKE = [{ x: 10, y: 10 }];  // 初始蛇位置
const INITIAL_FOOD = { x: 15, y: 15 };     // 初始食物位置
```

### 难度设置

在 `GameSettings.jsx` 中可以修改难度配置：

```javascript
const difficulties = [
  { name: '简单', speed: 200, color: '#4CAF50' },
  { name: '普通', speed: 150, color: '#FF9800' },
  { name: '困难', speed: 100, color: '#F44336' },
  { name: '地狱', speed: 70, color: '#9C27B0' }
];
```

## 🎨 样式定制

游戏使用 CSS 变量，可以轻松定制主题颜色：

```css
:root {
  --snake-color: #4CAF50;
  --food-color: #FF6B6B;
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 📱 移动端适配

游戏包含响应式设计，在移动设备上会自动调整：
- 游戏板格子大小自适应
- 触摸友好的按钮设计
- 优化的布局和字体大小

## 🔊 音效说明

游戏包含以下音效（使用 Web Audio API 生成）：
- 吃食物音效：高频短促的提示音
- 游戏开始音效：上升音调的启动音
- 游戏结束音效：下降音调的结束音
- 按键音效：简短的反馈音

## 🚀 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 连接 Vercel 账户
3. 导入项目并自动部署

### Netlify 部署

1. 运行 `npm run build`
2. 将 `dist` 文件夹上传到 Netlify

### 传统服务器部署

1. 运行 `npm run build`
2. 将 `dist` 文件夹内容上传到服务器
3. 配置服务器指向 `index.html`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🎉 致谢

感谢所有为开源项目做出贡献的开发者们！
