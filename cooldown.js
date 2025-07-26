/**
 * 战术冷却页面脚本
 * 功能：随机显示冷静文案，5秒后自动跳转
 */

// 降温文案库
const calmDownQuotes = [
    "你的目标是教会他，不是赢得争吵。",
    "停5秒，好过吼5分钟。",
    "发火是你的本能，但控制情绪是你的本事。",
    "你不是在对抗孩子，你是在对抗一道难题。",
    "先处理心情，再处理事情。",
    "慢一点，他只是个孩子，你曾经也是。",
    "想象一下他2岁时蹒跚学步的样子，你对他充满了耐心。",
    "忘掉分数，记住亲情。",
    "把期待目光，变成欣赏的眼光。",
    "你已经做得很好了，全世界的爸妈都在经历这一刻。",
    "此刻的抓狂，只是因为你太爱他。",
    "别担心，这不会影响你是个好妈妈/好爸爸。",
    "深呼吸，你不是一个人在战斗。",
    "允许自己不完美，也允许孩子慢慢来。",
    "十年后，你只会记得今晚的拥抱，而不是这道错题。"
];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化返回按钮
    initBackButton();
    
    // 显示随机文案
    displayRandomQuote();
    
    // 添加按钮事件监听
    setupButtonListeners();
    
    // 设置呼吸动画结束监听，每个周期结束后更换文案
    setupBreathingAnimationListener();
});

/**
 * 从文案库中随机选择一条并显示，使用淡入淡出效果
 */
function displayRandomQuote() {
    // 获取文本显示元素
    const quoteElement = document.getElementById('quote-text');
    
    // 随机选择一条文案，确保不重复
    let randomIndex;
    let randomQuote;
    
    do {
        randomIndex = Math.floor(Math.random() * calmDownQuotes.length);
        randomQuote = calmDownQuotes[randomIndex];
    } while (randomQuote === quoteElement.textContent && calmDownQuotes.length > 1);
    
    // 使用淡入淡出效果更新文本
    // 先淡出
    quoteElement.style.opacity = '0';
    
    // 等待淡出完成后更新文本并淡入
    setTimeout(() => {
        quoteElement.textContent = randomQuote;
        quoteElement.style.opacity = '1';
    }, 500); // 500ms与CSS中的transition时间匹配
}

/**
 * 设置呼吸动画结束监听
 * 注意：动画周期为8秒
 */
function setupBreathingAnimationListener() {
    // 获取呼吸动画元素
    const breathingCircle = document.getElementById('breathing-circle');
    
    // 初始化文案显示
    const quoteElement = document.getElementById('quote-text');
    quoteElement.style.opacity = '1';
    
    // 使用animationiteration事件监听每次动画循环结束（8秒一个周期）
    breathingCircle.addEventListener('animationiteration', function() {
        // 每个呼吸周期结束后更换文案，但在动画的缩小阶段进行
        // 这样可以避免在动画最大化时更换文案导致的视觉跳动
        setTimeout(() => {
            displayRandomQuote();
        }, 1000); // 延迟1秒，确保在动画缩小阶段更新文案
    });
}

/**
 * 设置按钮事件监听
 */
function setupButtonListeners() {
    // 获取冷静成功按钮元素
    const completeCooldownBtn = document.getElementById('complete-cooldown');
    
    // 冷静成功按钮点击事件
    completeCooldownBtn.addEventListener('click', function() {
        // 跳转到冷却完成页
        window.location.href = 'complete.html';
    });
}

/**
 * 初始化返回按钮
 */
function initBackButton() {
    const backButton = document.getElementById('back-button');
    
    backButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 检查来路
        const referrer = document.referrer;
        
        // 如果有来路且来路是同域名，返回来路页面
        if (referrer && referrer.includes(window.location.origin)) {
            window.history.back();
        }
        // 如果有历史记录，使用浏览器后退
        else if (window.history.length > 1) {
            window.history.back();
        }
        // 默认返回首页
        else {
            window.location.href = 'home.html';
        }
    });
    
    console.log('返回按钮初始化完成');
}