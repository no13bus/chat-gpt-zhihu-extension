# 插件说明

一个知乎的 chatgpt 浏览器小插件，可作为你回复问题的参考，也可以复制 chatgpt 的结果到回答的编辑器中进行相应的修改。

注意: 插件使用的前提是你需要有一个自己的 chatgpt 账号, 注册地址 https://chat.openai.com

## 软件截图和操作视频

[操作视频](https://www.bilibili.com/video/BV1T84y1r7wy/?share_source=copy_web&vd_source=ae0fecf5ed4742e42e47340480aa174f)

![Screenshot](screenshot.png?raw=true)

## 安装

### chrome 应用商店安装

[点击安装](https://chrome.google.com/webstore/detail/chatgpt-for-zhihu/dgoinfidjelfolhnkaableghhppplbak)

### Firefox 应用商店安装
[点击安装](https://addons.mozilla.org/zh-CN/firefox/addon/chatgpt-for-zhihu)

### 本地安装

1. 下载 `chrome.zip` from [Releases](https://github.com/no13bus/chat-gpt-zhihu-extension/releases)
2. 解压 zip
3. 打开网址 `chrome://extensions`.
4. 打开开发者模式.
5. 将解压包拖到当前页面，或者手动引入也可以.

## 本地构建

1. clone
2. 运行命令 `npm install`
3. 执行 `./build.sh`
4. 加载 `build` 文件夹到你的 chrome 中

## 新增加功能
- 增加try again按钮，可以重新请求chatgpt，获取知乎问题新的答案

## 产品反馈群

- [小飞机](https://t.me/chat_gpt_zhihu_extension)

## todos

- [x] chrome 应用市场审核通过
- [ ] 直接在回答的编辑器里面增加按钮，点击按钮即可把 chatgpt 的回答放置到编辑器中。

## 致谢

项目的想法来自于 wong2 的项目 [wong2/chat-gpt-google-extension](https://github.com/wong2/chat-gpt-google-extension), 感谢他做了这么棒的项目，让我看到了更多的可能性。

我也在想，未来会不会我们自己也分辨不清，有些文章和回答是人写的呢，还是机器写的呢？whatever.
