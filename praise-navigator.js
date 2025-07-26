/**
 * 情景式夸夸导航页面逻辑
 */

// 当前选中的场景类别
let currentCategory = '';

// 每个场景的文案索引，用于避免连续重复
let categoryIndexes = {
    '夸努力与坚韧': 0,
    '夸思维与策略': 0,
    '夸态度与合作': 0,
    '夸创意与想象': 0
};

/**
 * 核心函数：根据场景生成夸夸文案
 * @param {string} category - 场景类别
 * @returns {object} - 包含quote和analysis的对象
 */
function generatePraise(category) {
    switch (category) {
        case '夸努力':
            const effortPraises = [
                {
                    quote: "这道题是今天的大Boss吧？你跟它战斗了好几个回合，你是个真正的勇士！",
                    analysis: "教练提示：将难题'角色化'，能极大降低孩子的挫败感。"
                },
                {
                    quote: "我看到你刚才皱眉头、咬笔头，然后又重新开始，这种'永不言败'的精神太棒了！",
                    analysis: "教练提示：描述具体的坚持行为，让孩子意识到自己的韧性。"
                },
                {
                    quote: "你已经尝试了三种方法了，每一次都比上一次更接近答案，这就是'螺旋式上升'！",
                    analysis: "教练提示：用专业术语包装孩子的努力过程，提升成就感。"
                },
                {
                    quote: "别人可能早就放弃了，但你还在坚持，这种'逆风翻盘'的能力将来会很有用！",
                    analysis: "教练提示：对比他人突出孩子的特质，并预测未来价值。"
                },
                {
                    quote: "你刚才说'再试一次'的时候，眼神特别坚定，像个小小科学家在做实验！",
                    analysis: "教练提示：捕捉孩子的微表情和话语，给予身份认同。"
                },
                {
                    quote: "这个难题让你'卡关'了，但你没有发脾气，而是选择继续挑战，这份冷静太珍贵了！",
                    analysis: "教练提示：同时夸奖坚持和情绪管理，双重强化正向行为。"
                },
                {
                    quote: "你现在的状态让我想起了'愚公移山'，一点一点，总会成功的！",
                    analysis: "教练提示：用经典故事类比，增强孩子的文化认同感。"
                },
                {
                    quote: "我数了一下，你已经坚持了15分钟了，这种'马拉松精神'比聪明更重要！",
                    analysis: "教练提示：量化时间让坚持变得具体可感，强调品格胜过天赋。"
                },
                {
                    quote: "你刚才自言自语说'不能放弃'，这种自我激励的能力，是成功者的标配！",
                    analysis: "教练提示：表扬孩子的自我对话，培养内在动机。"
                },
                {
                    quote: "看你一遍遍检查答案，这种'精益求精'的态度，比做对题目更让我骄傲！",
                    analysis: "教练提示：强调过程胜过结果，培养孩子的工匠精神。"
                }
            ];
            return getRandomPraise(effortPraises, category);
            
        case '夸思维':
            const thinkingPraises = [
                {
                    quote: "你用画图的方法来解题，简直是开了'上帝视角'！",
                    analysis: "教练提示：肯定孩子的具体策略，并用流行词汇让他感觉自己很'高明'。"
                },
                {
                    quote: "你刚才说'换个角度试试'，这种思维转换能力，是天才的特征！",
                    analysis: "教练提示：捕捉孩子的元认知表达，强化其思维灵活性。"
                },
                {
                    quote: "你把复杂的问题拆解成了三个小步骤，这种'化繁为简'的能力太厉害了！",
                    analysis: "教练提示：表扬分解问题的策略，培养系统性思维。"
                },
                {
                    quote: "你居然想到了用类比的方法，把数学题变成了生活场景，这脑洞绝了！",
                    analysis: "教练提示：夸奖抽象思维能力，鼓励跨领域联想。"
                },
                {
                    quote: "你刚才的推理过程像侦探破案一样，一步步找线索，逻辑清晰得不得了！",
                    analysis: "教练提示：用角色扮演的方式夸奖逻辑思维，增加趣味性。"
                },
                {
                    quote: "你说'这个方法不行，我换一个'，这种快速调整策略的能力，是高手的标志！",
                    analysis: "教练提示：表扬策略调整能力，培养适应性思维。"
                },
                {
                    quote: "你用举例子的方法来理解概念，这种'具象化思维'让抽象变得简单！",
                    analysis: "教练提示：夸奖学习策略的有效性，强化元学习能力。"
                },
                {
                    quote: "你刚才问的那个'为什么'，直击问题本质，这种批判性思维太宝贵了！",
                    analysis: "教练提示：鼓励质疑精神，培养深度思考习惯。"
                },
                {
                    quote: "你把今天学的知识和昨天的联系起来，这种'知识串联'能力，学霸都是这样练成的！",
                    analysis: "教练提示：强化知识迁移能力，建立学习的成就感。"
                },
                {
                    quote: "你用'假如'来思考问题，这种假设性思维，是创新的起点！",
                    analysis: "教练提示：鼓励假设性思维，培养创新意识。"
                }
            ];
            return getRandomPraise(thinkingPraises, category);
            
        case '夸态度':
            const attitudePraises = [
                {
                    quote: "我刚才说话有点急，谢谢你的耐心。我们是最好的'学习搭档'，对吗？",
                    analysis: "教练提示：父母主动'示弱'，能瞬间将对立关系转变为合作关系。"
                },
                {
                    quote: "你刚才主动收拾桌子，这种'自我管理'的意识，比做对题目更让我开心！",
                    analysis: "教练提示：表扬主动性行为，强化责任感的价值。"
                },
                {
                    quote: "你说'我们一起想办法'，这种团队精神，是未来领导者的品质！",
                    analysis: "教练提示：将合作意识与未来成功联系，提升行为价值感。"
                },
                {
                    quote: "你刚才遇到困难没有发脾气，而是深呼吸，这种情绪调节能力太棒了！",
                    analysis: "教练提示：及时捕捉并强化孩子的情绪管理行为。"
                },
                {
                    quote: "你说'没关系，我们慢慢来'，这种平和的心态，是智者的风范！",
                    analysis: "教练提示：表扬积极心态，培养成长型思维。"
                },
                {
                    quote: "你主动问我'需要帮忙吗'，这种体贴，让我们的关系更像朋友了！",
                    analysis: "教练提示：强化互助行为，建立平等的学习关系。"
                },
                {
                    quote: "你刚才认真听我解释，还点头回应，这种专注的态度，是学习的最佳状态！",
                    analysis: "教练提示：表扬倾听行为，强化良好的沟通习惯。"
                },
                {
                    quote: "你说'我错了，重新来'，这种勇于承认错误的勇气，比完美更珍贵！",
                    analysis: "教练提示：鼓励承认错误，培养成长型心态。"
                },
                {
                    quote: "你今天的学习状态特别好，专注、配合、还有笑容，这就是最棒的学习态度！",
                    analysis: "教练提示：综合表扬多个正向行为，强化整体状态。"
                },
                {
                    quote: "你刚才说'谢谢妈妈/爸爸'，这种感恩的心，让我们的努力都变得有意义！",
                    analysis: "教练提示：强化感恩表达，增进亲子情感连接。"
                }
            ];
            return getRandomPraise(attitudePraises, category);
            
        case '夸创意':
            const creativePraises = [
                {
                    quote: "你给这个故事的结尾，比参考答案有趣一百倍！",
                    analysis: "教练提示：旗帜鲜明地站在孩子这边，是保护其创造力的最佳方式。"
                },
                {
                    quote: "你刚才的想法让我眼前一亮，这种'脑洞大开'的创意，是无价之宝！",
                    analysis: "教练提示：用夸张的表达强化创意的价值，鼓励发散思维。"
                },
                {
                    quote: "你把数学题编成了小故事，这种'跨界融合'的能力，艺术家都是这样的！",
                    analysis: "教练提示：将创意行为与艺术家身份联系，提升认同感。"
                },
                {
                    quote: "你的这个想法很特别，虽然和标准答案不同，但逻辑完全说得通！",
                    analysis: "教练提示：在肯定创意的同时强调逻辑性，平衡创新与理性。"
                },
                {
                    quote: "你刚才说'如果我是...'，这种角色代入的想象力，让问题变得生动有趣！",
                    analysis: "教练提示：鼓励角色扮演式思维，培养同理心和想象力。"
                },
                {
                    quote: "你用颜色来记忆知识点，这种'视觉化学习'的创意，太聪明了！",
                    analysis: "教练提示：表扬学习方法的创新，强化个性化学习策略。"
                },
                {
                    quote: "你刚才的比喻让我笑了，学习原来可以这么有趣，你是个天生的'段子手'！",
                    analysis: "教练提示：用幽默感夸奖创意，让学习氛围更轻松。"
                },
                {
                    quote: "你把抽象的概念画成了具体的图像，这种'可视化思维'，设计师都要学习！",
                    analysis: "教练提示：将创意能力与职业技能联系，增强未来价值感。"
                },
                {
                    quote: "你刚才的'奇思妙想'虽然看起来不现实，但这正是创新的种子！",
                    analysis: "教练提示：保护看似'不切实际'的想法，培养创新思维。"
                },
                {
                    quote: "你用自己的方式重新组织了这些信息，这种'个性化表达'，是独一无二的！",
                    analysis: "教练提示：强调个性化的价值，鼓励独特的表达方式。"
                }
            ];
            return getRandomPraise(creativePraises, category);
            
        default:
            return {
                quote: "你的表现真的很棒！",
                analysis: "继续保持这种积极的态度！"
            };
    }
}

/**
 * 获取随机的夸夸文案，避免连续重复
 * @param {Array} praises - 文案数组
 * @param {string} category - 场景类别
 * @returns {object} - 随机选择的文案对象
 */
function getRandomPraise(praises, category) {
    const currentIndex = categoryIndexes[category];
    let newIndex;
    
    // 如果只有一条文案，直接返回
    if (praises.length === 1) {
        return praises[0];
    }
    
    // 避免连续重复，选择不同的索引
    do {
        newIndex = Math.floor(Math.random() * praises.length);
    } while (newIndex === currentIndex && praises.length > 1);
    
    categoryIndexes[category] = newIndex;
    return praises[newIndex];
}

/**
 * 显示妙计内容
 * @param {object} praise - 包含quote和analysis的对象
 */
function displayPraise(praise) {
    const quoteElement = document.getElementById('praise-quote');
    const analysisElement = document.getElementById('praise-analysis');
    
    // 添加更新动画
    quoteElement.classList.add('praise-update');
    
    quoteElement.textContent = praise.quote;
    analysisElement.textContent = praise.analysis;
    
    // 隐藏解析区域
    const analysisSection = document.getElementById('analysis-section');
    analysisSection.classList.add('hidden');
    
    // 重置为什么按钮状态
    const whyIcon = document.getElementById('why-icon');
    whyIcon.classList.remove('icon-rotate');
    
    // 移除动画类
    setTimeout(() => {
        quoteElement.classList.remove('praise-update');
    }, 400);
}

/**
 * 切换到妙计展示视图
 * @param {string} category - 场景类别
 */
function showPraiseView(category) {
    currentCategory = category;
    
    // 隐藏选择视图，显示妙计视图
    document.getElementById('selection-view').classList.add('hidden');
    const praiseView = document.getElementById('praise-view');
    praiseView.classList.remove('hidden');
    praiseView.classList.add('view-transition');
    
    // 设置当前场景标题
    document.getElementById('current-category').textContent = category;
    
    // 根据不同场景设置标签颜色
    const categoryTag = document.querySelector('.category-tag');
    
    // 移除所有可能的颜色类
    categoryTag.classList.remove('tag-effort', 'tag-thinking', 'tag-attitude', 'tag-creativity');
    
    // 添加对应的颜色类
    if (category === '夸努力') {
        categoryTag.classList.add('tag-effort');
    } else if (category === '夸思维') {
        categoryTag.classList.add('tag-thinking');
    } else if (category === '夸态度') {
        categoryTag.classList.add('tag-attitude');
    } else if (category === '夸创意') {
        categoryTag.classList.add('tag-creativity');
    }
    
    // 生成并显示妙计
    const praise = generatePraise(category);
    displayPraise(praise);
    
    // 移除过渡动画类
    setTimeout(() => {
        praiseView.classList.remove('view-transition');
    }, 300);
}

/**
 * 返回场景选择视图
 */
function showSelectionView() {
    document.getElementById('praise-view').classList.add('hidden');
    const selectionView = document.getElementById('selection-view');
    selectionView.classList.remove('hidden');
    selectionView.classList.add('view-transition');
    
    // 移除过渡动画类
    setTimeout(() => {
        selectionView.classList.remove('view-transition');
    }, 300);
}

/**
 * 切换解析显示状态
 */
function toggleAnalysis() {
    const analysisSection = document.getElementById('analysis-section');
    const whyIcon = document.getElementById('why-icon');
    
    if (analysisSection.classList.contains('hidden')) {
        analysisSection.classList.remove('hidden');
        analysisSection.classList.add('analysis-expand');
        whyIcon.classList.add('icon-rotate');
        
        // 移除动画类
        setTimeout(() => {
            analysisSection.classList.remove('analysis-expand');
        }, 300);
    } else {
        analysisSection.classList.add('hidden');
        whyIcon.classList.remove('icon-rotate');
    }
}

/**
 * 获取下一条同类妙计
 */
function getNextPraise() {
    if (currentCategory) {
        const praise = generatePraise(currentCategory);
        displayPraise(praise);
    }
}

/**
 * 初始化事件监听器
 */
function initEventListeners() {
    // 场景卡片点击事件
    const scenarioCards = document.querySelectorAll('.scenario-card');
    scenarioCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            showPraiseView(category);
        });
    });
    
    // 返回按钮点击事件
    document.getElementById('back-button').addEventListener('click', showSelectionView);
    
    
    
    // 为什么这样夸按钮点击事件
    document.getElementById('why-button').addEventListener('click', toggleAnalysis);
    
    // 换一句按钮点击事件
    document.getElementById('next-praise').addEventListener('click', getNextPraise);
}

/**
 * 智能返回功能
 */
function smartBack() {
    const referrer = document.referrer;
    
    // 如果有来路页面且不是当前页面
    if (referrer && !referrer.includes('praise-navigator.html')) {
        // 提取文件名
        const referrerFileName = referrer.split('/').pop().split('?')[0];
        
        // 检查是否是项目内的页面
        const validPages = ['home.html', 'camera.html', 'library.html', 'complete.html', 'cooldown.html'];
        if (validPages.includes(referrerFileName)) {
            window.location.href = referrerFileName;
            return;
        }
    }
    
    // 尝试使用浏览器历史记录后退
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // 默认返回首页
        window.location.href = 'home.html';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 首页按钮点击事件
    document.getElementById('home-btn-main').addEventListener('click', function() {
        window.location.href = 'home.html';
    });
    
    // 主返回按钮点击事件
    document.getElementById('main-back-button').addEventListener('click', smartBack);
    
    initEventListeners();
});