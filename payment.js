/**
 * 付费引导页交互逻辑
 */

document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const paymentSheet = document.getElementById('payment-sheet');
    const closeBtn = document.getElementById('close-btn');
    const yearlyPlan = document.getElementById('yearly-plan');
    const monthlyPlan = document.getElementById('monthly-plan');
    const paymentBtn = document.getElementById('payment-btn');
    
    // 当前选中的计划（默认年付）
    let selectedPlan = 'yearly';
    
    // 初始化时显示底部抽屉
    // 确保DOM完全加载后再显示
    setTimeout(() => {
        console.log('显示付费抽屉');
        paymentSheet.classList.remove('hidden');
    }, 800);
    
    // 关闭按钮点击事件
    closeBtn.addEventListener('click', function() {
        paymentSheet.classList.add('hidden');
        
        // 延迟后跳转回首页
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 300);
    });
    
    // 年付计划点击事件
    yearlyPlan.addEventListener('click', function() {
        selectedPlan = 'yearly';
        updatePlanSelection();
    });
    
    // 月付计划点击事件
    monthlyPlan.addEventListener('click', function() {
        selectedPlan = 'monthly';
        updatePlanSelection();
    });
    
    // 更新计划选择状态
    function updatePlanSelection() {
        // 重置所有卡片样式
        yearlyPlan.classList.remove('selected');
        monthlyPlan.classList.remove('selected');
        
        // 根据选择设置样式
        if (selectedPlan === 'yearly') {
            yearlyPlan.classList.add('selected');
            yearlyPlan.classList.add('yearly');
            monthlyPlan.classList.remove('yearly');
        } else {
            monthlyPlan.classList.add('selected');
            monthlyPlan.classList.add('yearly');
            yearlyPlan.classList.remove('yearly');
        }
    }
    
    // 付费按钮点击事件
    paymentBtn.addEventListener('click', function() {
        if (selectedPlan === 'yearly') {
            alert('您已选择年付计划，正在跳转到支付...');
        } else {
            alert('您已选择月付计划，正在跳转到支付...');
        }
    });
});