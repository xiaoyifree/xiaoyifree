# FitPulse Lab

一个适合部署到 GitHub Pages 的静态健身科普网站。

## 站点定位

- 纯静态网站
- 不需要服务器
- 适合长期维护图片、文字和外部视频链接
- 视频推荐使用 Bilibili 分享链接

## 当前内容分类

- 力量训练
- 有氧运动
- 科学原理
- 运动康复
- 营养指南

## 核心文件

- `index.html`
- `styles.css`
- `script.js`
- `site-data.js`

## 你以后主要怎么更新

最常见的更新只需要改 `site-data.js`：

1. 新增一条内容
2. 修改标题、摘要、分类、标签
3. 如果是视频，把 `ctaUrl` 换成 Bilibili 分享链接
4. 如果有本地图片，把图片放进仓库后把 `image` 改成图片路径
5. 提交并推送到 GitHub

## 内容字段说明

每条内容都在 `site-data.js` 的 `posts` 数组里。

常用字段：

- `title`：标题
- `category`：分类 id
- `type`：`article` 或 `video`
- `summary`：摘要
- `image`：本地图片路径，不需要就留空
- `tags`：标签数组
- `featured`：是否进入精选区
- `readTime`：阅读时间或写 `视频`
- `ctaLabel`：按钮文字
- `ctaUrl`：跳转链接，比如 Bilibili 分享链接

## GitHub Pages 部署

1. 把项目推到 GitHub 仓库
2. 打开仓库 `Settings`
3. 进入 `Pages`
4. 在 `Build and deployment` 里选择：
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
5. 保存
6. 等待 GitHub Pages 生成网址

生成后网址通常类似：

```text
https://你的用户名.github.io/仓库名/
```

## 适合的更新方式

- 日常更新文字内容
- 替换图片
- 新增 Bilibili 视频入口
- 调整精选内容顺序

## 不适合的功能

这个版本不包含：

- 后台管理
- 本地上传视频到网站
- 用户登录
- 服务端数据库

如果以后你想回到“自己上传视频、网站直接托管视频”的模式，那就需要重新做成动态站。
