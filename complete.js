/**
 * 冷静成功页面脚本 - 游戏/闯关风格
 * 功能：随机显示成功文案、按钮点击事件处理
 */

// 成功文案库 - 游戏风格
const successQuotes = [
    "恭喜你解锁【情绪控制】成就！",
    "冷静值已满，解锁新技能：理性沟通！",
    "你已晋级为【情绪管理大师】！",
    "成就达成：内心平静 +100",
    "战胜了情绪BOSS，获得【智慧勋章】！",
    "冷静技能升级！解锁新对话选项。",
    "恭喜！你已完成【情绪调节】任务！",
    "成功抵抗了【暴躁】debuff，获得【平和】buff加成！",
    "你的【耐心】属性提升了！",
    "关卡完成！解锁【和谐亲子关系】成就。",
    "你已掌握【深呼吸】技能，冷却时间缩短50%！",
    "成功通过【情绪挑战】，获得经验值+200！",
    "恭喜！你的【自控力】等级提升了！",
    "任务完成：平静之心 - 奖励：亲子和谐度+10",
    "你已成功驯服了【愤怒】野兽，获得【智慧】宝石！"
];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 显示随机成功文案
    displayRandomSuccessQuote();
    
    // 设置按钮点击事件
    setupButtonListeners();
    
    // 添加闪亮效果
    addShiningEffect();
});

/**
 * 从文案库中随机选择一条并显示
 */
function displayRandomSuccessQuote() {
    // 获取文本显示元素
    const quoteElement = document.querySelector('.subtitle');
    
    if (quoteElement) {
        // 随机选择一条文案
        const randomIndex = Math.floor(Math.random() * successQuotes.length);
        const randomQuote = successQuotes[randomIndex];
        
        // 设置文本内容
        quoteElement.textContent = randomQuote;
    }
}

/**
 * 设置按钮点击事件监听
 */
function setupButtonListeners() {
    // 获取按钮元素
    const praiseButton = document.getElementById('praise-button');
    const libraryButton = document.getElementById('library-button');
    const homeButton = document.getElementById('home-button');
    
    // 设置夸夸咒按钮点击事件
    if (praiseButton) {
        praiseButton.addEventListener('click', function() {
            window.location.href = 'praise-navigator.html';
        });
    }
    
    // 设置讲解页按钮点击事件
    if (libraryButton) {
        libraryButton.addEventListener('click', function() {
            window.location.href = 'library.html';
        });
    }
    
    // 设置返回首页按钮点击事件
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }
}

/**
 * 添加闪亮效果和动画
 */
function addShiningEffect() {
    // 获取勋章图标
    const medalIcon = document.querySelector('.medal-icon');
    
    if (medalIcon) {
        // 随机添加闪亮效果
        setInterval(() => {
            // 随机决定是否添加额外闪光
            if (Math.random() > 0.7) {
                medalIcon.style.textShadow = '0 0 30px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.8)';
                
                // 短暂闪光后恢复
                setTimeout(() => {
                    medalIcon.style.textShadow = '';
                }, 300);
            }
        }, 2000);
    }
}