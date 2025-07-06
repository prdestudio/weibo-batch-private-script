/*
 * == Weibo Batch Set Posts to Private Script ==
 *
 * @name        微博批量转为自己可见脚本
 * @description 在微博个人主页，通过浏览器控制台执行此脚本，可批量将已加载的微博设为“转为自己可见”。
 * @version     1.0.0 (2025-07-06)
 * @author      prdestudio
 * @license     MIT
 *
 * 本脚本通过模拟用户点击行为实现自动化，解决了微博官方没有提供批量设置私密功能的痛点。
 * 核心技术点：
 * 1. 使用 article:not(.gm-processed) 选择器来定位未处理的微博，避免了无限循环。
 * 2. 通过为已处理的微博DOM元素添加 'gm-processed' class 来“做记号”，确保不重复操作。
 * 3. 专为微博2025年后的新版“虚拟滚动”页面设计，需要配合“手动滚动->分批执行”的工作流使用。
 * 4. 可根据自己需求将自己可见替换成删除等
 */
(async function() {
    'use strict';

    // --- 配置区 (Configuration) ---
    const PROCESS_INTERVAL = 3000; // 每条微博的处理间隔（毫秒），建议不低于2000，以防操作过快。
    const MENU_WAIT_TIME = 1500;   // 点击下拉菜单后等待其弹出的时间（毫秒）。
    const MAX_OPERATIONS = 500;    // 安全阀：为防止意外的无限循环，设定一个最大操作次数。

    // --- 辅助函数 (Helper Function) ---
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    // --- 主程序 (Main Logic) ---
    console.log("▶️ [微博批量转为自己可见脚本] 启动...");
    
    let successCount = 0;
    let failedCount = 0;
    let operationCount = 0;

    // 使用 while 循环来应对微博的“虚拟滚动”机制，确保脚本的健壮性。
    while (operationCount < MAX_OPERATIONS) {
        operationCount++;
        
        // 精确制导选择器：寻找在<article>内、且没有被处理过的(not .gm-processed)“更多”按钮核心<i>图标。
        const nextButton = document.querySelector('article:not(.gm-processed) span.woo-pop-ctrl i.woo-font');

        // 如果在页面上再也找不到未处理的按钮，说明任务完成。
        if (!nextButton) {
            console.log("✅ 在页面上已找不到任何未处理的按钮，任务圆满完成。");
            break;
        }

        console.log(`--- [ 第 ${operationCount} 次尝试 ] ---`);
        
        const parentArticle = nextButton.closest('article');
        if (!parentArticle) {
            console.error("❌ 找到了按钮，但找不到它的父级<article>，跳过。");
            // 为有问题的按钮本身做标记，防止下次循环还找到它
            nextButton.classList.add('gm-processed');
            failedCount++;
            continue;
        }

        // 开始处理这条微博
        nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await sleep(500);
        nextButton.click();
        console.log("  ...已点击“更多”按钮(v)");
        await sleep(MENU_WAIT_TIME);

        let foundAndClicked = false;
        const allMenuItems = document.querySelectorAll('.woo-pop-item-main');
        for (const item of allMenuItems) {
            if (item.textContent.trim() === '转换为自己可见') {
                item.click();
                console.log("  ✅ 已点击“转换为自己可见”");
                successCount++;
                foundAndClicked = true;
                break;
            }
        }
        
        // 【核心机制】无论成功与否，都为这条微博的<article>盖上“已处理”的戳，确保循环能向前推进。
        parentArticle.classList.add('gm-processed');

        if (foundAndClicked) {
             console.log("  👍 已为该条微博盖上“成功处理”标记。");
        } else {
            failedCount++;
            console.warn("  ⚠️ 未能找到“转换为自己可见”选项(可能是转发或特殊微博)，已跳过。");
            
            // 【清理现场】尝试关闭可能异常打开的菜单，防止干扰后续操作。
            const openMenu = document.querySelector('.woo-pop-wrap-main[aria-hidden="false"]');
            if (openMenu) {
                openMenu.style.display = 'none';
                console.log("  🧹 已清理异常弹窗。");
            }
        }
        
        await sleep(PROCESS_INTERVAL);
    }

    // --- 任务结束报告 ---
    if (operationCount >= MAX_OPERATIONS) {
        console.warn(`达到最大操作次数限制(${MAX_OPERATIONS}次)，脚本自动停止以防意外。`);
    }
    const summaryMessage = `🎉 全部任务结束！\n\n成功处理: ${successCount} 条\n失败/跳过: ${failedCount} 条`;
    alert(summaryMessage);
    console.log("========================================");
    console.log(summaryMessage);
})();
