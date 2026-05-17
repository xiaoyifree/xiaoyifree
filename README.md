# FitPulse Lab

一个适合部署到 GitHub Pages 的静态健身科普网站。

## 站点定位

- 纯静态网站
- 不需要服务器
- 适合长期维护图片、文字和外部视频链接
- 视频可使用任意外部分享链接

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
- `images/`

## 你以后主要怎么更新

最常见的更新只需要改 `site-data.js`：

1. 新增一条内容
2. 修改标题、摘要、分类、标签
3. 如果是视频，把 `ctaUrl` 换成外部视频链接
4. 如果有本地图片，把图片放进 `images/` 文件夹后把 `image` 改成图片路径
5. 提交并推送到 GitHub

图片命名参考：

- 直接看 [images/README.md](/Users/xiaoyifree/Documents/项目1/images/README.md)

你可以在两个地方操作：

- 本地项目文件夹里修改，然后 `git push`
- 直接在 GitHub 仓库网页里编辑 `site-data.js` 和上传图片

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
- `ctaUrl`：跳转链接，比如任意视频平台或文章页面链接

图文内容还可以补这两个字段：

- `content`：正文分段数组
- `takeaways`：重点提示数组

## 以后新增图文怎么做

1. 把图片放进 `images/` 文件夹
2. 打开 `site-data.js`
3. 在 `posts` 数组里复制一条图文模板
4. 改标题、摘要、分类、图片路径和正文
5. `git add .`
6. `git commit -m "Update content"`
7. `git push`

图文模板：

```js
{
  id: "science-article-003",
  title: "训练平台期，到底该先加量还是先恢复",
  category: "science",
  type: "article",
  summary: "用一篇图文把平台期判断、训练调整和恢复优先级讲清楚。",
  content: [
    {
      heading: "先判断是不是真的平台期",
      body: "短期表现波动很常见，不一定代表训练失效。"
    },
    {
      heading: "训练调整不要一次改太多",
      body: "优先改最关键的一项，比如总量、频率或恢复安排。"
    }
  ],
  takeaways: ["先判断问题来源", "每次只改一个关键变量"],
  image: "./images/science-plateau-cover.jpg",
  tags: ["平台期", "训练安排", "恢复"],
  featured: false,
  readTime: "4 分钟",
  ctaLabel: "阅读内容",
  ctaUrl: "#post-science-article-003"
}
```

## 以后新增视频怎么做

1. 打开 `site-data.js`
2. 在 `posts` 数组里复制一条视频模板
3. 把 `ctaUrl` 换成你的外部视频链接
4. 如果有封面图，也可以放进 `images/` 文件夹并填写 `image`
5. `git add .`
6. `git commit -m "Update video links"`
7. `git push`

视频模板：

```js
{
  id: "rehab-video-003",
  title: "膝关节训练前，热身怎么安排更稳妥",
  category: "rehab",
  type: "video",
  summary: "适合挂接外部视频链接，集中放进运动康复分类里。",
  image: "./images/rehab-knee-warmup-cover.jpg",
  tags: ["膝关节", "热身", "康复训练"],
  featured: false,
  readTime: "视频",
  ctaLabel: "打开视频",
  ctaUrl: "https://你的视频链接"
}
```

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
- 新增视频入口
- 调整精选内容顺序

## 不适合的功能

这个版本不包含：

- 后台管理
- 本地上传视频到网站
- 用户登录
- 服务端数据库

如果以后你想回到“自己上传视频、网站直接托管视频”的模式，那就需要重新做成动态站。
