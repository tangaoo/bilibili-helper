/**
 * Author: Ruo
 * Create: 2018-06-12
 * Description: 扩展守护脚本
 */
import 'babel-polyfill';
import {createTab, hasNewVersion, getOption, version} from 'Utils';
import {
    DynamicCheck as FeatureDynamicCheck,
    Video as FeatureVideo,
    NewWatchPage as FeatureNewWatchPage,
} from 'Modules';

/**
 * ------------------------------------------------------------------------------------------
 * 权限获取
 * ------------------------------------------------------------------------------------------
 */

// 推送窗口弹出权限
//checkNotificationPermission();

/**
 * ------------------------------------------------------------------------------------------
 * 事件绑定
 * ------------------------------------------------------------------------------------------
 */
// 安装完成后事件
chrome.runtime.onInstalled.addListener(function(details) {
    const {reason, previousVersion} = details;
    if (reason === 'install') { // 安装成功后默认打开设置页面
        createTab(chrome.extension.getURL('options.html?mod=install'));
    } else if (reason === 'update' && !hasNewVersion(previousVersion)) {
        chrome.notifications.create('bilibili-helper-update', {
            type: 'basic',
            iconUrl: 'statics/imgs/icon-256.png',
            title: chrome.i18n.getMessage('notificationTitle'),
            message: chrome.i18n.getMessage('notificationExtensionUpdate').replace('%v', version),
        });
    }
});
/*
// 时钟时间
//chrome.alarms.onAlarm.addListener(function (alarm) {
//
//});

// 请求发送前触发的事件
// chrome.webRequest.onBeforeRequest.addListener(function(details) {
//
// });

const requestFilter = {
    urls: [
        //'*://*.bilibili.com/bangumi/play/ss*',
        //'*://*.bilibili.com/bangumi/play/ep*',
        //'*://*.bilibili.com/video/av*',
        //'*://api.bilibili.com/*',
        '*://api.bilibili.com/x/web-interface/view?aid=*',
    ],
    //types: ['main_frame'],
};

//
//chrome.webRequest.onBeforeRequest.addListener((details) => {
//    console.log('onBeforeRequest', details);
//}, requestFilter, ['requestBody', 'blocking']);
//
//// sendHeaders前触发的事件
//chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
//    console.log('onBeforeSendHeaders', details);
//}, requestFilter, ['requestHeaders', 'blocking']);
//
//chrome.webRequest.onSendHeaders.addListener((details) => {
//    console.log('onSendHeaders', details);
//}, requestFilter, ['requestHeaders']);
//// 接收到HTTP响应头时触发的事件
//chrome.webRequest.onHeadersReceived.addListener((details) => {
//    console.log('onHeadersReceived', details);
//}, requestFilter, ['responseHeaders', 'blocking']);
//// 请求开始相应时触发的事件
//chrome.webRequest.onResponseStarted.addListener((details) => {
//    console.log('onResponseStarted', details);
//}, requestFilter, ['responseHeaders']);
//
*/

/**
 * ------------------------------------------------------------------------------------------
 * 载入后台任务
 * ------------------------------------------------------------------------------------------
 */

/*
 * 卸载成功后自动跳到助手官网页面
 */
if (typeof (chrome.runtime.setUninstallURL) === 'function') {
    chrome.runtime.setUninstallURL('https://extlabs.io/analytics/uninstall/?uid=178&pid=264&finish_url=https%3A%2F%2Fbilihelper.guguke.net%2F%3Funinstall%26version%3D' + chrome.runtime.getManifest().version);
}

const Video = new FeatureVideo();
const DynamicCheck = new FeatureDynamicCheck();
const NewWatchPage = new FeatureNewWatchPage();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.commend === 'getOptions') {
        const options = {
            ...Video.optionArguments,
            ...DynamicCheck.optionArguments,
            ...NewWatchPage.optionArguments,
        };
        sendResponse(options);
    } else if (message.commend === 'getVideoFeatures') {
        sendResponse({
            ...Video.GUIArguments,
        });
    }
});