/**
 * 首页脚本
 * 功能：处理选择卡片的点击事件，跳转到对应页面
 */

document.addEventListener('DOMContentLoaded', function() {
    // 获取选择卡片元素
    const abilityCard = document.getElementById('ability-card');
    const emotionCard = document.getElementById('emotion-card');
    const premiumLink = document.querySelector('.premium-link');
    
    // 能力辅导卡片点击事件
    abilityCard.addEventListener('click', function() {
        // 添加点击反馈效果
        abilityCard.classList.add('bg-gray-100');
        
        // 延迟跳转，让用户看到点击效果
        setTimeout(function() {
            window.location.href = 'camera.html'; // 跳转到拍照页面
        }, 150);
    });
    
    // 情绪疏导卡片点击事件
    emotionCard.addEventListener('click', function() {
        // 添加点击反馈效果
        emotionCard.classList.add('bg-gray-100');
        
        // 延迟跳转，让用户看到点击效果
        setTimeout(function() {
            window.location.href = 'cooldown.html'; // 跳转到战术冷却页面
        }, 150);
    });
    
    // VIP链接点击事件（可选，因为已经有href属性）
    premiumLink.addEventListener('click', function(e) {
        e.preventDefault(); // 阻止默认行为
        
        // 添加点击反馈效果
        premiumLink.classList.add('bg-[#F9A825]');
        premiumLink.classList.add('text-white');
        
        // 延迟跳转，让用户看到点击效果
        setTimeout(function() {
            window.location.href = 'payment.html'; // 跳转到付费引导页
        }, 150);
    });
    
    console.log('首页加载完成，选择卡片点击事件已绑定');
});