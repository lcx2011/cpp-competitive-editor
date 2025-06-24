# C++ 竞赛编辑器

<div align="center">

![C++ Competitive Editor](https://img.shields.io/badge/C%2B%2B-Competitive%20Editor-blue)
![Electron](https://img.shields.io/badge/Electron-25.0-47848F)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6)
![License](https://img.shields.io/badge/License-MIT-green)

一个专为信息竞赛设计的C++代码编辑器，基于Electron + React + TypeScript + Monaco Editor构建。

[功能特性](#功能特性) • [安装使用](#安装使用) • [开发指南](#开发指南) • [贡献](#贡献)

</div>

## ✨ 功能特性

### 🎯 专为竞赛设计
- **快速编译运行**: 一键编译并运行C++代码 (F5)
- **仅编译检查**: 快速语法检查 (Ctrl+F5)
- **执行时间显示**: 实时显示程序运行时间
- **错误提示**: 详细的编译错误信息显示

### 💻 现代化编辑体验
- **自定义代码编辑器**: 专为C++优化的编辑器
- **语法高亮**: C++关键字、字符串、注释高亮
- **智能编辑**: Tab键缩进、括号自动匹配
- **行号显示**: 清晰的行号指示
- **多标签页**: 支持同时编辑多个文件
- **深色主题**: 类似VSCode的专业界面

### 🛠️ 开发工具
- **文件管理**: 新建、编辑、切换文件
- **状态指示**: 文件修改状态实时显示
- **快捷操作**: 便捷的工具栏按钮
- **响应式布局**: 可调节的界面面板

## 系统要求

- Windows 10/11
- 已安装 GCC/MinGW 编译器
- Node.js 16+ (仅开发时需要)

## 🚀 安装使用

### 📦 下载可执行文件（推荐）
1. 从 [Releases](../../releases) 页面下载最新版本
2. 运行安装程序并按提示安装
3. 确保系统已安装GCC编译器并添加到PATH环境变量

### 🛠️ 从源码构建
```bash
# 克隆项目
git clone https://github.com/your-username/cpp-competitive-editor.git
cd cpp-competitive-editor

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build
npm start

# 打包为可执行文件
npm run dist
```

### 📋 系统要求
- **操作系统**: Windows 10/11, macOS 10.14+, Linux
- **编译器**: GCC 7.0+ 或 MinGW (Windows)
- **内存**: 4GB+ RAM
- **存储**: 500MB+ 可用空间

## 使用说明

### 基本操作
1. **新建文件**: Ctrl+N 或点击标签栏的"+"按钮
2. **打开文件**: Ctrl+O 或使用菜单"文件 > 打开"
3. **保存文件**: Ctrl+S 或使用菜单"文件 > 保存"
4. **编译运行**: F5 或点击"运行"按钮
5. **仅编译**: Ctrl+F5 或点击"编译"按钮

### 代码模板
1. 点击编辑器工具栏的"📋 模板"按钮
2. 从模板列表中选择合适的模板
3. 预览模板代码
4. 点击"使用模板"应用到当前文件

### 输入输出
1. 在下方面板切换到"输入"标签页
2. 输入程序运行时需要的测试数据
3. 点击"运行"按钮执行程序
4. 在"输出"标签页查看程序输出结果和执行时间

## 内置模板

- **基础模板**: 最基本的C++程序结构
- **竞赛模板**: 包含常用头文件和宏定义
- **图论模板**: DFS、BFS等图论算法框架
- **动态规划模板**: DP问题的基本结构
- **数学模板**: GCD、快速幂、素数判断等数学函数

## 快捷键

| 功能 | 快捷键 |
|------|--------|
| 新建文件 | Ctrl+N |
| 打开文件 | Ctrl+O |
| 保存文件 | Ctrl+S |
| 另存为 | Ctrl+Shift+S |
| 编译并运行 | F5 |
| 仅编译 | Ctrl+F5 |
| 撤销 | Ctrl+Z |
| 重做 | Ctrl+Y |
| 复制 | Ctrl+C |
| 粘贴 | Ctrl+V |
| 全选 | Ctrl+A |

## 🏗️ 技术栈

- **Electron 25.0**: 跨平台桌面应用框架
- **React 18.2**: 现代化用户界面库
- **TypeScript 5.0**: 类型安全的JavaScript超集
- **自定义编辑器**: 专为C++优化的代码编辑器
- **Webpack 5**: 模块打包和构建工具

## 📁 项目结构

项目结构：
```
src/
├── main/           # Electron主进程
│   ├── main.ts     # 主进程入口
│   ├── menu.ts     # 菜单配置
│   ├── compiler.ts # 编译器服务
│   └── preload.ts  # 预加载脚本
├── renderer/       # 渲染进程(前端)
│   ├── components/ # React组件
│   ├── contexts/   # React上下文
│   ├── data/       # 数据文件
│   └── styles/     # 样式文件
└── shared/         # 共享代码
```

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License
