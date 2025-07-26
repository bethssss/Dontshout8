# 前端实现 - 展示结果

## 任务三：前端实现 - 展示结果

### 讲解库页面实现

以下是讲解库页面的HTML、CSS和JavaScript代码，用于展示后端返回的多种讲解方式：

```html
<!-- library.html - 讲解库页面 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>作业不吼 - 讲解库</title>
    <!-- TailwindCSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- 通用样式 -->
    <link rel="stylesheet" href="css/styles.css">
    <!-- 讲解库特定样式 -->
    <link rel="stylesheet" href="css/library.css">
</head>
<body class="bg-[#F5F5F5] h-screen w-screen flex items-center justify-center">
    <!-- iPhone 外观容器 -->
    <div class="iphone-container">
        <!-- 主内容区域 -->
        <div id="main-content" class="flex flex-col h-full py-10 px-6 overflow-y-auto">
            <!-- 顶部导航 -->
            <div class="flex items-center justify-between mb-6">
                <a href="home.html" class="text-gray-600 flex items-center">
                    <i class="fas fa-arrow-left mr-1"></i>
                    <span>返回</span>
                </a>
                <h1 class="text-xl font-bold text-gray-800">题目讲解</h1>
                <div class="w-16"></div> <!-- 占位，保持标题居中 -->
            </div>
            
            <!-- 题目内容 -->
            <div class="bg-white p-4 rounded-lg mb-4">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-lg font-semibold text-gray-800">题目内容</h2>
                    <span id="difficulty-badge" class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">中等难度</span>
                </div>
                <div class="image-preview bg-gray-100 mb-3">
                    <img id="problem-image" src="" alt="题目图片" class="max-h-full max-w-full object-contain hidden">
                    <p id="image-placeholder" class="text-gray-500">题目图片预览区域</p>
                </div>
                <p id="problem-text" class="text-gray-700 text-sm">加载中...</p>
            </div>
            
            <!-- 考点分析 -->
            <div class="bg-white p-4 rounded-lg mb-4">
                <h2 class="text-lg font-semibold text-gray-800 mb-2">考点分析</h2>
                <div id="analysis-content">
                    <div class="mb-2">
                        <h3 class="text-sm font-medium text-gray-700">主要考点</h3>
                        <p id="main-point" class="text-sm text-gray-600">加载中...</p>
                    </div>
                    <div class="mb-2">
                        <h3 class="text-sm font-medium text-gray-700">次要考点</h3>
                        <ul id="secondary-points" class="text-sm text-gray-600 list-disc list-inside">
                            <li>加载中...</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gray-700">能力要求</h3>
                        <ul id="ability-requirements" class="text-sm text-gray-600 list-disc list-inside">
                            <li>加载中...</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- 讲解方式选择 -->
            <h2 class="text-lg font-semibold text-gray-800 mb-3">选择讲解方式</h2>
            
            <!-- 讲解方式Tab切换 -->
            <div class="mb-4">
                <div class="flex border-b border-gray-200">
                    <button id="tab-standard" class="tab-button flex-1 py-2 px-4 text-center border-b-2 border-blue-500 text-blue-600 font-medium">
                        标准讲解
                    </button>
                    <button id="tab-analogy" class="tab-button flex-1 py-2 px-4 text-center border-b-2 border-transparent text-gray-500">
                        生活类比
                    </button>
                    <button id="tab-game" class="tab-button flex-1 py-2 px-4 text-center border-b-2 border-transparent text-gray-500">
                        游戏互动
                    </button>
                </div>
            </div>
            
            <!-- 讲解内容区域 -->
            <div class="bg-white rounded-lg overflow-hidden">
                <!-- 标准讲解内容 -->
                <div id="content-standard" class="tab-content p-4">
                    <div id="standard-steps" class="space-y-4">
                        <p class="text-gray-500 text-center">加载中...</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">答案</h3>
                        <p id="standard-answer" class="text-sm text-gray-600">加载中...</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">要点提示</h3>
                        <p id="standard-tips" class="text-sm text-gray-600">加载中...</p>
                    </div>
                </div>
                
                <!-- 生活类比内容 -->
                <div id="content-analogy" class="tab-content p-4 hidden">
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">类比主题</h3>
                        <p id="analogy-theme" class="text-sm text-gray-600">加载中...</p>
                    </div>
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">类比说明</h3>
                        <p id="analogy-description" class="text-sm text-gray-600">加载中...</p>
                    </div>
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">引导问题</h3>
                        <ul id="analogy-questions" class="text-sm text-gray-600 list-disc list-inside">
                            <li>加载中...</li>
                        </ul>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">总结</h3>
                        <p id="analogy-summary" class="text-sm text-gray-600">加载中...</p>
                    </div>
                </div>
                
                <!-- 游戏互动内容 -->
                <div id="content-game" class="tab-content p-4 hidden">
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">游戏名称</h3>
                        <p id="game-name" class="text-sm text-gray-600">加载中...</p>
                    </div>
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">游戏规则</h3>
                        <p id="game-rules" class="text-sm text-gray-600">加载中...</p>
                    </div>
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">教学目标</h3>
                        <p id="game-objective" class="text-sm text-gray-600">加载中...</p>
                    </div>
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">材料准备</h3>
                        <ul id="game-materials" class="text-sm text-gray-600 list-disc list-inside">
                            <li>加载中...</li>
                        </ul>
                    </div>
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">游戏步骤</h3>
                        <ol id="game-steps" class="text-sm text-gray-600 list-decimal list-inside">
                            <li>加载中...</li>
                        </ol>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <h3 class="text-sm font-medium text-gray-700 mb-2">知识连接</h3>
                        <p id="game-connection" class="text-sm text-gray-600">加载中...</p>
                    </div>
                </div>
            </div>
            
            <!-- 底部提示 -->
            <p class="text-xs text-gray-500 text-center mt-6">
                <i class="fa-solid fa-star text-yellow-500 mr-1"></i>
                AI分析结果仅供参考，如有疑问请咨询老师
            </p>
        </div>
    </div>

    <!-- 讲解库特定脚本 -->
    <script src="js/library.js"></script>
</body>
</html>
```

```css
/* library.css - 讲解库页面特定样式 */

/* 题目图片预览区域 */
.image-preview {
    border: 2px dashed #CBD5E0;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    overflow: hidden;
}

/* 难度标签样式 */
.difficulty-easy {
    background-color: #DEF7EC;
    color: #03543E;
}

.difficulty-medium {
    background-color: #FEF3C7;
    color: #92400E;
}

.difficulty-hard {
    background-color: #FEE2E2;
    color: #991B1B;
}

/* Tab切换样式 */
.tab-button {
    transition: all 0.3s ease;
}

.tab-button:hover {
    background-color: #F9FAFB;
}

.tab-button.active {
    border-color: #3B82F6;
    color: #3B82F6;
    font-weight: 500;
}

/* 步骤卡片样式 */
.step-card {
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
    background-color: #F9FAFB;
    transition: all 0.3s ease;
}

.step-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
}

.step-number {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background-color: #3B82F6;
    color: white;
    border-radius: 50%;
    font-size: 0.8rem;
    margin-right: 8px;
}

/* 公式样式 */
.formula {
    font-family: 'Times New Roman', serif;
    background-color: #EFF6FF;
    padding: 8px 12px;
    border-radius: 4px;
    margin: 8px 0;
    display: inline-block;
}

/* 动画效果 */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.fade-in {
    animation: fadeIn 0.5s ease-in-out;
}
```

```javascript
// library.js - 讲解库页面脚本

document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const resultId = urlParams.get('result_id');
    
    // Tab切换相关元素
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 初始化Tab切换功能
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有tab的active状态
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('border-blue-500');
                btn.classList.remove('text-blue-600');
                btn.classList.add('border-transparent');
                btn.classList.add('text-gray-500');
            });
            
            // 添加当前tab的active状态
            this.classList.add('active');
            this.classList.add('border-blue-500');
            this.classList.add('text-blue-600');
            this.classList.remove('border-transparent');
            this.classList.remove('text-gray-500');
            
            // 隐藏所有内容
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            // 显示对应内容
            const contentId = this.id.replace('tab-', 'content-');
            document.getElementById(contentId).classList.remove('hidden');
            document.getElementById(contentId).classList.add('fade-in');
        });
    });
    
    // 获取讲解内容
    function fetchExplanation(resultId) {
        // 如果没有resultId，使用演示数据
        if (!resultId) {
            loadDemoData();
            return;
        }
        
        // 从API获取数据
        fetch(`https://api.yourdomain.com/api/get-explanation?result_id=${resultId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('获取讲解内容失败');
            }
            return response.json();
        })
        .then(data => {
            // 处理返回的讲解内容
            displayExplanation(data.explanation);
            
            // 如果有图片路径，显示图片
            if (data.image_path) {
                const imageUrl = `https://api.yourdomain.com/${data.image_path}`;
                document.getElementById('problem-image').src = imageUrl;
                document.getElementById('problem-image').classList.remove('hidden');
                document.getElementById('image-placeholder').classList.add('hidden');
            }
        })
        .catch(error => {
            console.error('获取讲解内容出错:', error);
            // 出错时加载演示数据
            loadDemoData();
        });
    }
    
    // 显示讲解内容
    function displayExplanation(explanation) {
        // 显示题目内容
        document.getElementById('problem-text').textContent = explanation.题目 || '无题目内容';
        
        // 显示难度
        const difficultyBadge = document.getElementById('difficulty-badge');
        const difficulty = explanation.难度评估?.难度等级 || '中等';
        difficultyBadge.textContent = `${difficulty}难度`;
        
        // 设置难度标签样式
        difficultyBadge.className = 'px-2 py-1 text-xs rounded-full';
        if (difficulty === '简单') {
            difficultyBadge.classList.add('difficulty-easy');
        } else if (difficulty === '中等') {
            difficultyBadge.classList.add('difficulty-medium');
        } else {
            difficultyBadge.classList.add('difficulty-hard');
        }
        
        // 显示考点分析
        const analysis = explanation.考点分析 || {};
        document.getElementById('main-point').textContent = analysis.主要考点 || '无主要考点';
        
        // 显示次要考点
        const secondaryPointsEl = document.getElementById('secondary-points');
        secondaryPointsEl.innerHTML = '';
        if (analysis.次要考点 && analysis.次要考点.length > 0) {
            analysis.次要考点.forEach(point => {
                const li = document.createElement('li');
                li.textContent = point;
                secondaryPointsEl.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '无次要考点';
            secondaryPointsEl.appendChild(li);
        }
        
        // 显示能力要求
        const abilityRequirementsEl = document.getElementById('ability-requirements');
        abilityRequirementsEl.innerHTML = '';
        if (analysis.能力要求 && analysis.能力要求.length > 0) {
            analysis.能力要求.forEach(ability => {
                const li = document.createElement('li');
                li.textContent = ability;
                abilityRequirementsEl.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '无特殊能力要求';
            abilityRequirementsEl.appendChild(li);
        }
        
        // 显示标准讲解
        const standardExplanation = explanation.讲解方式?.标准讲解 || {};
        const standardStepsEl = document.getElementById('standard-steps');
        standardStepsEl.innerHTML = '';
        
        if (standardExplanation.步骤 && standardExplanation.步骤.length > 0) {
            standardExplanation.步骤.forEach(step => {
                const stepCard = document.createElement('div');
                stepCard.className = 'step-card';
                
                const stepHeader = document.createElement('div');
                stepHeader.className = 'flex items-center mb-2';
                
                const stepNumber = document.createElement('span');
                stepNumber.className = 'step-number';
                stepNumber.textContent = step.步骤序号 || '?';
                
                const stepTitle = document.createElement('span');
                stepTitle.className = 'font-medium text-gray-800';
                stepTitle.textContent = step.步骤名称 || `步骤${step.步骤序号}`;
                
                stepHeader.appendChild(stepNumber);
                stepHeader.appendChild(stepTitle);
                
                const stepContent = document.createElement('p');
                stepContent.className = 'text-sm text-gray-600 mb-2';
                stepContent.textContent = step.步骤内容 || '无步骤内容';
                
                stepCard.appendChild(stepHeader);
                stepCard.appendChild(stepContent);
                
                // 如果有公式或要点
                if (step.公式或要点) {
                    const formula = document.createElement('div');
                    formula.className = 'formula text-sm';
                    formula.textContent = step.公式或要点;
                    stepCard.appendChild(formula);
                }
                
                standardStepsEl.appendChild(stepCard);
            });
        } else {
            standardStepsEl.innerHTML = '<p class="text-gray-500 text-center">无步骤内容</p>';
        }
        
        // 显示答案和要点
        document.getElementById('standard-answer').textContent = standardExplanation.答案 || '无答案';
        document.getElementById('standard-tips').textContent = standardExplanation.要点提示 || '无要点提示';
        
        // 显示生活类比
        const analogyExplanation = explanation.讲解方式?.生活类比法 || {};
        document.getElementById('analogy-theme').textContent = analogyExplanation.类比主题 || '无类比主题';
        document.getElementById('analogy-description').textContent = analogyExplanation.类比说明 || '无类比说明';
        
        // 显示引导问题
        const analogyQuestionsEl = document.getElementById('analogy-questions');
        analogyQuestionsEl.innerHTML = '';
        if (analogyExplanation.引导问题 && analogyExplanation.引导问题.length > 0) {
            analogyExplanation.引导问题.forEach(question => {
                const li = document.createElement('li');
                li.textContent = question;
                analogyQuestionsEl.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '无引导问题';
            analogyQuestionsEl.appendChild(li);
        }
        
        document.getElementById('analogy-summary').textContent = analogyExplanation.总结 || '无总结';
        
        // 显示游戏互动
        const gameExplanation = explanation.讲解方式?.游戏互动法 || {};
        document.getElementById('game-name').textContent = gameExplanation.游戏名称 || '无游戏名称';
        document.getElementById('game-rules').textContent = gameExplanation.游戏规则 || '无游戏规则';
        document.getElementById('game-objective').textContent = gameExplanation.教学目标 || '无教学目标';
        
        // 显示材料准备
        const gameMaterialsEl = document.getElementById('game-materials');
        gameMaterialsEl.innerHTML = '';
        if (gameExplanation.材料准备 && gameExplanation.材料准备.length > 0) {
            gameExplanation.材料准备.forEach(material => {
                const li = document.createElement('li');
                li.textContent = material;
                gameMaterialsEl.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '无需特殊材料';
            gameMaterialsEl.appendChild(li);
        }
        
        // 显示游戏步骤
        const gameStepsEl = document.getElementById('game-steps');
        gameStepsEl.innerHTML = '';
        if (gameExplanation.游戏步骤 && gameExplanation.游戏步骤.length > 0) {
            gameExplanation.游戏步骤.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step;
                gameStepsEl.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '无游戏步骤';
            gameStepsEl.appendChild(li);
        }
        
        document.getElementById('game-connection').textContent = gameExplanation.知识连接 || '无知识连接';
    }
    
    // 加载演示数据
    function loadDemoData() {
        const demoData = {
            "题目": "如果一个三角形的三边长分别为3cm、4cm和5cm，求这个三角形的面积。",
            "考点分析": {
                "主要考点": "三角形面积计算 - 海伦公式",
                "次要考点": ["三角形的性质", "平方根计算"],
                "能力要求": ["公式应用能力", "计算能力"]
            },
            "难度评估": {
                "难度等级": "中等",
                "难度原因": "需要应用海伦公式，涉及平方根计算，但公式较为常见"
            },
            "讲解方式": {
                "标准讲解": {
                    "步骤": [
                        {
                            "步骤序号": 1,
                            "步骤名称": "确认三角形是否存在",
                            "步骤内容": "首先，我们需要验证这三条边是否能构成三角形。三角形的任意两边之和必须大于第三边。检查：3+4=7>5，3+5=8>4，4+5=9>3。所以这三条边可以构成三角形。",
                            "公式或要点": "三角形任意两边之和 > 第三边"
                        },
                        {
                            "步骤序号": 2,
                            "步骤名称": "判断三角形类型",
                            "步骤内容": "根据边长关系，我们可以判断这是一个直角三角形，因为3²+4²=5²（9+16=25）。这符合勾股定理，所以是直角三角形。",
                            "公式或要点": "勾股定理：a²+b²=c²"
                        },
                        {
                            "步骤序号": 3,
                            "步骤名称": "计算面积 - 方法一",
                            "步骤内容": "对于直角三角形，我们可以直接用底乘高除以2来计算面积。以5cm为斜边，3cm和4cm为直角边，面积 = (3×4)÷2 = 12÷2 = 6平方厘米。",
                            "公式或要点": "直角三角形面积 = (底×高)÷2"
                        },
                        {
                            "步骤序号": 4,
                            "步骤名称": "计算面积 - 方法二",
                            "步骤内容": "我们也可以使用海伦公式计算。首先计算半周长s = (3+4+5)÷2 = 12÷2 = 6。然后代入海伦公式：面积 = √[s(s-a)(s-b)(s-c)] = √[6(6-3)(6-4)(6-5)] = √[6×3×2×1] = √36 = 6平方厘米。",
                            "公式或要点": "海伦公式：S = √[s(s-a)(s-b)(s-c)]，其中s=(a+b+c)÷2"
                        }
                    ],
                    "答案": "三角形的面积是6平方厘米。",
                    "要点提示": "这个问题可以用两种方法解决：直角三角形的面积公式或海伦公式。由于这是一个3-4-5的直角三角形（勾股数），所以计算相对简单。"
                },
                "生活类比法": {
                    "类比主题": "披萨切片",
                    "类比说明": "想象你有一块三角形的披萨，它的三条边分别是3厘米、4厘米和5厘米长。你想知道这块披萨有多大（面积），这样你就能知道它能提供多少食物。就像我们计算房间面积来知道需要多少地板砖一样，我们需要计算这个三角形披萨的面积。",
                    "引导问题": [
                        "如果你把这块三角形披萨沿着一条高线切成两个小三角形，会怎么样？",
                        "你能想到用什么日常物品来表示一个3-4-5的三角形吗？",
                        "为什么知道三角形的三条边长就能确定它的面积？"
                    ],
                    "总结": "通过这个披萨的例子，我们可以理解三角形面积的计算。无论是把它看作直角三角形（底×高÷2），还是用海伦公式，最终我们都能得到这块'披萨'的准确面积是6平方厘米。这就像知道了一块地的边界，就能计算出需要多少种子来覆盖它。"
                },
                "游戏互动法": {
                    "游戏名称": "三角形宝藏猎人",
                    "游戏规则": "在这个游戏中，宝藏被埋在一个三角形区域内。玩家需要根据给出的三条边长（3cm、4cm和5cm）确定这个三角形区域的面积，才能知道需要挖掘多大的区域来找到宝藏。",
                    "教学目标": "通过游戏化方式理解三角形面积的计算方法，特别是海伦公式的应用。",
                    "材料准备": [
                        "尺子或卷尺",
                        "铅笔和纸",
                        "剪刀",
                        "彩色卡纸"
                    ],
                    "游戏步骤": [
                        "用卡纸剪出一个三边长分别为3cm、4cm和5cm的三角形。",
                        "在纸上画一个坐标系，将这个三角形放在坐标系中，使一个顶点在原点，一条边在x轴上。",
                        "尝试通过计数坐标系中的小方格来估算三角形的面积。",
                        "使用海伦公式计算实际面积，并与估算结果比较。",
                        "讨论为什么知道三条边长就能确定三角形的面积。"
                    ],
                    "知识连接": "这个游戏帮助理解三角形面积的计算，特别是当我们只知道三条边长时。通过实际操作和可视化，学生可以直观地理解为什么3-4-5三角形的面积是6平方厘米，以及海伦公式是如何工作的。"
                }
            }
        };
        
        // 显示演示数据
        displayExplanation(demoData);
    }
    
    // 初始化页面
    fetchExplanation(resultId);
});
```

## 关键点说明

1. **页面结构**：
   - 题目内容区域：显示题目文本和图片
   - 考点分析区域：显示主要考点、次要考点和能力要求
   - Tab切换区域：提供标准讲解、生活类比和游戏互动三种讲解方式的切换
   - 内容展示区域：根据选择的Tab显示对应的讲解内容

2. **交互功能**：
   - Tab切换：点击不同的Tab按钮，切换显示不同的讲解方式
   - 动态内容加载：根据后端返回的JSON数据，动态渲染页面内容
   - 降级处理：当API请求失败时，加载演示数据

3. **视觉设计**：
   - 步骤卡片：每个解题步骤使用卡片形式展示，包含步骤序号、名称、内容和公式
   - 难度标签：根据题目难度显示不同颜色的标签（简单-绿色、中等-黄色、困难-红色）
   - 动画效果：Tab切换时使用淡入动画，提升用户体验

4. **数据处理**：
   - 从URL获取结果ID，请求后端API获取讲解内容
   - 解析JSON数据，填充页面各个部分
   - 处理数组类型的数据（如次要考点、引导问题等），动态生成列表项

这些代码实现了一个完整的讲解库页面，能够展示多种讲解方式，并提供良好的用户体验。通过Tab切换功能，用户可以根据自己的学习偏好选择不同的讲解方式，帮助更好地理解题目。