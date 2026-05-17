把你以后要用到的网站图片放在这个文件夹里。

推荐做法：

1. 文件名用英文或拼音，尽量不要带空格
2. 横图更适合内容卡片，比如 `strength-bench-cover.jpg`
3. 上传到仓库后，在 `site-data.js` 里把 `image` 写成：

```js
"./images/strength-bench-cover.jpg"
```

如果某条内容不需要图片，可以继续留空：

```js
""
```

推荐命名规则：

- 力量训练图文：`strength-article-001-cover.jpg`
- 力量训练视频：`strength-video-001-cover.jpg`
- 有氧运动图文：`cardio-article-001-cover.jpg`
- 有氧运动视频：`cardio-video-001-cover.jpg`
- 科学原理图文：`science-article-001-cover.jpg`
- 科学原理视频：`science-video-001-cover.jpg`
- 运动康复图文：`rehab-article-001-cover.jpg`
- 运动康复视频：`rehab-video-001-cover.jpg`
- 营养指南图文：`nutrition-article-001-cover.jpg`
- 营养指南视频：`nutrition-video-001-cover.jpg`

你以后最省事的方式：

1. 先决定这条内容属于哪个分类
2. 再决定它是图文还是视频
3. 按上面的格式给图片命名
4. 把图片放进这个 `images/` 文件夹
5. 在 `site-data.js` 里把 `image` 写成对应路径

例如：

```js
"./images/rehab-video-001-cover.jpg"
```

如果你后面更新很多内容，继续按编号往后排就行：

- `strength-article-002-cover.jpg`
- `strength-article-003-cover.jpg`
- `nutrition-video-002-cover.jpg`
