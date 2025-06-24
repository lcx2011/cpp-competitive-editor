# 贡献指南

感谢您对C++竞赛编辑器项目的关注！我们欢迎各种形式的贡献。

## 🤝 如何贡献

### 报告问题
- 使用 [Issues](../../issues) 报告bug或提出功能请求
- 请先搜索现有的issues，避免重复
- 提供详细的问题描述和复现步骤
- 包含您的操作系统和软件版本信息

### 提交代码
1. Fork 这个仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 🛠️ 开发环境设置

### 前置要求
- Node.js 16+
- npm 或 yarn
- Git
- GCC编译器 (用于测试编译功能)

### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/your-username/cpp-competitive-editor.git
cd cpp-competitive-editor

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 在另一个终端启动Electron
npm run start:dev
```

## 📝 代码规范

### TypeScript/React
- 使用TypeScript进行类型检查
- 遵循React Hooks最佳实践
- 组件使用函数式组件
- 使用ESLint进行代码检查

### 提交信息
使用约定式提交格式：
- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

示例：
```
feat: 添加代码模板选择功能
fix: 修复编译错误显示问题
docs: 更新README安装说明
```

## 🧪 测试

在提交PR之前，请确保：
- [ ] 代码能够正常构建 (`npm run build`)
- [ ] 没有TypeScript错误
- [ ] 没有ESLint警告
- [ ] 应用程序能够正常启动和运行
- [ ] 编译运行功能正常工作

## 📋 Pull Request 检查清单

- [ ] 我已经阅读了贡献指南
- [ ] 我的代码遵循了项目的代码规范
- [ ] 我已经进行了自我代码审查
- [ ] 我已经添加了必要的注释，特别是在复杂的代码区域
- [ ] 我已经更新了相关文档
- [ ] 我的更改没有产生新的警告
- [ ] 我已经测试了我的更改
- [ ] 新功能和修复都有相应的测试用例

## 🎯 优先级功能

我们特别欢迎以下方面的贡献：

### 高优先级
- 代码模板系统
- 输入数据管理
- 文件保存/打开功能
- 更多快捷键支持

### 中优先级
- 设置面板
- 主题自定义
- 代码片段功能
- 性能优化

### 低优先级
- 插件系统
- 代码调试功能
- 云端同步

## 📞 联系方式

如果您有任何问题或建议，可以通过以下方式联系我们：
- 创建 [Issue](../../issues)
- 发起 [Discussion](../../discussions)

再次感谢您的贡献！🙏
