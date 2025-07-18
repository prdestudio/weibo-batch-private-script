# 微博批量设为私密脚本 (Weibo Batch Set Posts to Private)

这是一个浏览器控制台脚本，用于在微博网页版上，批量将个人发布的原创微博权限设置为“仅自己可见”。
还可以自己调整一下，批量删除微博。

## 背景

微博官方并未提供批量修改微博权限的功能，我理解就是和vip设置多久以前的微博不可见功能冲突了，因为看网友的说法以前是有批量管理微博的设置选项的，狗日的微博。当用户希望将大量历史微博转为私密时，只能手动逐条操作，费时费力。本脚本旨在通过自动化模拟用户点击，解决这一痛点。

由于微博前端页面会不定期更新，脚本的选择器可能会失效。本脚本是针对2025年7月左右的新版微博页面结构编写的。

## 功能特性

- **自动化操作**：自动完成“点击更多 -> 点击设为私密”的流程。
- **智能跳过**：能够自动识别并跳过没有“设为私密”选项的微博（如转发、视频、文章等），避免出错中断。
- **防止重复**：通过为已处理的微博添加标记，确保脚本在重复运行时不会操作同一条微博。
- **适应动态页面**：专为微博的“虚拟滚动”加载机制设计，可配合手动滚动进行分批处理。

## 使用方法

本脚本无需安装任何浏览器扩展，直接在浏览器开发者工具中运行即可。

1.  **登录微博**：在浏览器中登录你的微博账号，并进入个人主页（ `weibo.com/u/你的ID` ）。
2.  **加载微博**：**用鼠标奋力向下滚动页面**，加载出尽可能多的你希望处理的微博。这是最关键的一步，脚本只能处理已加载的微博。
3.  **打开控制台**：
    -   按下 `F12` 键，打开开发者工具。
    -   在工具面板中，找到并点击 **`Console` (控制台)** 选项卡。
4.  **执行脚本**：
    -   复制 `weibo-batch-private.js` 文件中的全部代码。
    -   将其粘贴到控制台中，然后按下 `Enter` 键。
5.  **观察与重复**：
    -   脚本会自动开始运行，你可以在控制台看到实时的处理日志。
    -   当脚本处理完当前已加载的微博并弹出“任务结束”的提示后，如果你还有更早的微博需要处理，请**继续向下滚动页面**加载它们，然后**再次执行第4步**（重复粘贴并运行脚本）。脚本会自动跳过之前处理过的内容。

## 注意事项

- **账号安全**：本脚本仅在你的浏览器本地运行，不涉及任何服务器通信或账号信息窃取，是安全的。但任何自动化操作都存在被官方风控的极小可能性，请勿将处理间隔时间(`PROCESS_INTERVAL`)设置得过低。
- **选择器失效风险**：如果未来微博再次大幅更新页面HTML结构，脚本中的选择器(`document.querySelector(...)`部分)可能会失效，届时需要参照我们的探索过程，手动更新选择器。
- **处理范围**：本脚本目前只针对**原创图文微博**设计，会主动忽略转发和其他特殊类型的微博。

## 许可证

本项目采用 [MIT许可证](LICENSE)。
