/**
 * 智能讲解库页面脚本
 * 功能：获取讲解内容、展示不同讲解方式、处理交互
 */

// 全局变量，标记用户是否拥有PRO权限
window.userHasPro = true; // 临时设置为true以测试PRO功能

document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const resultId = urlParams.get('result_id');
    
    // 初始化讲解策略卡片点击事件
    initStrategyCardClick();
    
    // 初始化PRO角标点击事件
    initProBadgeClick();
    
    // 初始化冷却按钮点击事件
    initCoolingButtonClick();
    
    // 初始化表扬按钮点击事件
    initPraiseButtonClick();
    
    // 获取讲解内容
    fetchExplanation(resultId);
    
    console.log('智能讲解库页面初始化完成');
});

// 初始化讲解策略卡片点击事件
function initStrategyCardClick() {
    // 获取所有讲解策略卡片
    const strategyCards = document.querySelectorAll('.solution-card');
    
    // 为每个卡片添加点击事件
    strategyCards.forEach(card => {
        const button = card.querySelector('button');
        const strategyId = card.getAttribute('data-strategy');
        
        button.addEventListener('click', function() {
            // 显示对应的讲解内容
            showStrategyContent(strategyId);
        });
    });
    
    console.log('讲解策略卡片点击事件初始化完成');
}

// 显示对应的讲解策略内容
function showStrategyContent(strategyId) {
    // 获取当前加载的讲解数据
    const explanationData = window.currentExplanationData;
    
    if (!explanationData) {
        console.error('讲解数据未加载');
        return;
    }
    
    // 查找对应的策略
    const strategy = explanationData.guidance_strategies.find(s => s.strategy_id === strategyId);
    
    if (!strategy) {
        console.error('未找到对应的讲解策略:', strategyId);
        return;
    }
    
    // 检查是否是PRO功能，如果是PRO功能但用户没有PRO权限，则跳转到付费页面
    if (strategy.is_pro && !window.userHasPro) {
        window.location.href = 'payment.html';
        return;
    }
    
    // 创建模态框
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // 创建内容容器
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modalOverlay);
    });
    
    // 添加标题
    const title = document.createElement('h2');
    title.className = 'text-xl font-bold text-gray-800 mb-4';
    title.textContent = strategy.title;
    
    // 添加内容区域
    const content = document.createElement('div');
    content.className = 'text-gray-700 space-y-4';
    
    // 根据策略ID设置不同的内容
    if (strategyId === 'standard_teach') {
        // 家长速通讲解 - 步骤式展示
        strategy.coach_script.forEach((step, index) => {
            const stepCard = document.createElement('div');
            stepCard.className = 'step-card';
            
            const stepHeader = document.createElement('div');
            stepHeader.className = 'flex items-center mb-2';
            stepHeader.innerHTML = `
                <span class="step-number">${index + 1}</span>
                <span class="font-medium text-gray-800">步骤 ${index + 1}</span>
            `;
            
            const stepContent = document.createElement('p');
            stepContent.className = 'text-sm text-gray-600';
            stepContent.textContent = step;
            
            stepCard.appendChild(stepHeader);
            stepCard.appendChild(stepContent);
            content.appendChild(stepCard);
        });
    } else if (strategyId === 'life_analogy') {
        // 生活类比讲解 - 对话式展示
        strategy.coach_script.forEach(script => {
            const scriptCard = document.createElement('div');
            scriptCard.className = 'bg-gray-50 p-3 rounded-lg';
            scriptCard.textContent = script;
            content.appendChild(scriptCard);
        });
    } else if (strategyId === 'game_interaction') {
        // 游戏互动讲解 - 游戏式展示
        const gameIntro = document.createElement('div');
        gameIntro.className = 'bg-purple-50 p-4 rounded-lg mb-4';
        gameIntro.innerHTML = `
            <h3 class="font-medium text-purple-800 mb-2">互动游戏说明</h3>
            <p class="text-sm text-gray-700">通过以下互动游戏，让孩子在玩中学习，更容易理解和记忆知识点。</p>
        `;
        content.appendChild(gameIntro);
        
        strategy.coach_script.forEach((step, index) => {
            const gameStep = document.createElement('div');
            gameStep.className = 'bg-white border border-purple-100 p-3 rounded-lg';
            gameStep.innerHTML = `
                <div class="font-medium text-purple-700 mb-1">第 ${index + 1} 关</div>
                <p class="text-sm text-gray-700">${step}</p>
            `;
            content.appendChild(gameStep);
        });
    }
    
    // 组装模态框
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(content);
    modalOverlay.appendChild(modalContent);
    
    // 添加到页面
    document.body.appendChild(modalOverlay);
    
    // 添加关闭事件（点击模态框背景关闭）
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    });
    
    // 添加动画效果
    setTimeout(() => {
        modalOverlay.classList.add('fade-in');
        modalContent.classList.add('fade-in');
    }, 10);
    
    console.log(`显示${strategy.title}内容`);
}

// 获取讲解内容
function fetchExplanation(resultId) {
    // 如果没有resultId，使用演示数据
    if (!resultId) {
        loadDemoData();
        return;
    }
    
    // 从API获取数据（实际项目中应替换为真实API地址）
    fetch(`/api/get-explanation?result_id=${resultId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('获取讲解内容失败');
        }
        return response.json();
    })
    .then(data => {
        // 处理返回的讲解内容
        displayExplanation(data);
        
        // 如果有图片路径，显示图片
        if (data.image_path) {
            const imagePreview = document.querySelector('.image-preview');
            imagePreview.innerHTML = `<img src="${data.image_path}" alt="题目图片" class="max-w-full max-h-full object-contain">`;
        }
    })
    .catch(error => {
        console.error('获取讲解内容出错:', error);
        // 出错时加载演示数据
        loadDemoData();
    });
}

// 显示讲解内容
function displayExplanation(data) {
    // 保存数据到全局变量，供策略卡片点击时使用
    window.currentExplanationData = data;
    
    // 更新诊断卡片内容
    if (data.diagnose) {
        document.getElementById('main-point').textContent = data.diagnose.main_point;
        document.getElementById('pain-point').textContent = data.diagnose.pain_point;
        document.getElementById('parent-tip').textContent = data.diagnose.parent_tip;
    }
    
    // 更新策略卡片状态（PRO标签等）
    if (data.guidance_strategies && Array.isArray(data.guidance_strategies)) {
        data.guidance_strategies.forEach(strategy => {
            const card = document.querySelector(`[data-strategy="${strategy.strategy_id}"]`);
            if (card) {
                // 如果是PRO策略，确保PRO标签显示
                if (strategy.is_pro) {
                    const proBadge = card.querySelector('.pro-badge');
                    if (proBadge) {
                        proBadge.style.display = 'inline-flex';
                    }
                } else {
                    const proBadge = card.querySelector('.pro-badge');
                    if (proBadge) {
                        proBadge.style.display = 'none';
                    }
                }
            }
        });
    }
    
    console.log('讲解数据加载完成:', data);
}

// 加载演示数据
function loadDemoData() {
    console.log('加载演示数据');
    
    // 创建演示数据
    const demoData = {
        diagnose: {
            main_point: "本题考查：长方形周长与面积",
            pain_point: "孩子易错：周长与面积概念混淆",
            parent_tip: "温馨提示：先别急着讲公式，从下面的方法一开始吧！"
        },        guidance_strategies: [
            // 固定的三种讲解策略
        ]
    };
    
    // 更新题目图片预览区域
    const imagePreview = document.querySelector('.image-preview');
    imagePreview.innerHTML = `
        <div class="w-full h-full flex items-center justify-center">
            <div class="text-center">
                <p class="text-gray-700 font-medium mb-2">长方形面积计算</p>
                <p class="text-sm text-gray-600">一个长方形的长为6厘米，宽为4厘米，求这个长方形的面积。</p>
            </div>
        </div>
    `;
    
    // 显示演示数据
    displayExplanation(demoData);
}

// 初始化PRO角标点击事件
function initProBadgeClick() {
    const proBadges = document.querySelectorAll('.pro-badge');
    
    proBadges.forEach(badge => {
        badge.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击事件
            // 跳转到付费引导页
            window.location.href = 'payment.html';
        });
    });
    
    console.log('PRO角标点击事件初始化完成');
}

// 初始化冷却按钮点击事件
function initCoolingButtonClick() {
    const coolingButton = document.getElementById('cooling-button');
    const tooltip = document.getElementById('button-tooltip');
    const tooltipContent = tooltip.querySelector('.tooltip-content');
    
    if (coolingButton) {
        // 鼠标悬停显示提示
        coolingButton.addEventListener('mouseenter', function() {
            tooltipContent.textContent = '上头了？点击冷静一下';
            tooltip.style.right = '6px';
            tooltip.style.bottom = '12px';
            tooltip.classList.add('visible');
        });
        
        // 鼠标离开隐藏提示
        coolingButton.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
            // 重置提示框位置
            setTimeout(() => {
                tooltip.style.bottom = '12px';
            }, 300);
        });
        
        // 点击事件
        coolingButton.addEventListener('click', function() {
            // 添加点击反馈效果
            this.classList.add('scale-95');
            setTimeout(() => {
                this.classList.remove('scale-95');
            }, 200);
            
            // 延迟跳转，给用户视觉反馈
            setTimeout(() => {
                window.location.href = 'cooldown.html';
            }, 300);
        });
    }
}

// 初始化表扬按钮点击事件
function initPraiseButtonClick() {
    const praiseButton = document.getElementById('praise-button');
    const tooltip = document.getElementById('button-tooltip');
    const tooltipContent = tooltip.querySelector('.tooltip-content');
    
    if (praiseButton) {
        // 鼠标悬停显示提示
        praiseButton.addEventListener('mouseenter', function() {
            tooltipContent.textContent = '讲懂了？点击获取表扬和鼓励';
            tooltip.style.right = '6px';
            tooltip.style.bottom = '28px';
            tooltip.classList.add('visible');
        });
        
        // 鼠标离开隐藏提示
        praiseButton.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
            // 重置提示框位置
            setTimeout(() => {
                tooltip.style.bottom = '12px';
            }, 300);
        });
        
        // 点击事件
        praiseButton.addEventListener('click', function() {
            // 添加点击反馈效果
            this.classList.add('scale-95');
            setTimeout(() => {
                this.classList.remove('scale-95');
            }, 200);
            
            // 延迟跳转，给用户视觉反馈
            setTimeout(() => {
                window.location.href = 'praise-navigator.html';
            }, 300);
        });
    }
}