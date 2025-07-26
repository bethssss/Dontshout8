/**
 * 启动页脚本
 * 功能：页面加载1.5秒后自动跳转到首页
 */

document.addEventListener('DOMContentLoaded', function() {
    // 设置1.5秒后自动跳转到首页
    setTimeout(function() {
        window.location.href = 'home.html';
    }, 1500); // 1500毫秒 = 1.5秒
    
    console.log('启动页加载完成，将在1.5秒后跳转到首页...');
});