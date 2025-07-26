# 前端实现 - 图片上传与展示

## 阶段1：前端实现 - 图片上传

### HTML 和 JavaScript 代码

以下是一个完整的图片上传组件实现，包括调用相机和从相册选择图片的功能：

```html
<!-- camera.html - 拍照搜题页面 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>作业不吼 - 拍照搜题</title>
    <!-- TailwindCSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- 通用样式 -->
    <link rel="stylesheet" href="css/styles.css">
    <!-- 拍照页面特定样式 -->
    <link rel="stylesheet" href="css/camera.css">
</head>
<body class="bg-[#F5F5F5] h-screen w-screen flex items-center justify-center">
    <!-- iPhone 外观容器 -->
    <div class="iphone-container">
        <!-- 主内容区域 -->
        <div id="main-content" class="flex flex-col items-center justify-center h-full py-10 px-6">
            <!-- 返回按钮 -->
            <div class="absolute top-12 left-6">
                <a href="home.html" class="text-gray-600 flex items-center">
                    <i class="fas fa-arrow-left mr-1"></i>
                    <span>返回</span>
                </a>
            </div>
            
            <!-- 拍照区域 -->
            <div id="camera-area" class="w-full h-3/4 flex flex-col items-center justify-center cursor-pointer">
                <div class="camera-icon-container mb-6">
                    <i class="fa-solid fa-camera-retro text-6xl text-blue-500"></i>
                </div>
                <p class="text-center text-gray-600 max-w-xs">
                    点击此处，拍照或从相册上传题目
                </p>
            </div>
            
            <!-- 隐藏的文件输入框 -->
            <input type="file" accept="image/*" id="image-input" style="display: none;" capture="environment">
        </div>
    </div>

    <!-- 拍照页面特定脚本 -->
    <script src="js/camera.js"></script>
</body>
</html>
```

```javascript
// camera.js - 拍照搜题页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const cameraArea = document.getElementById('camera-area');
    const imageInput = document.getElementById('image-input');
    
    // 拍照区域点击事件
    cameraArea.addEventListener('click', function() {
        // 添加点击反馈效果
        cameraArea.classList.add('bg-blue-50');
        
        // 延迟触发文件选择，让用户看到点击效果
        setTimeout(function() {
            // 触发隐藏的文件输入框的点击事件
            imageInput.click();
            
            // 恢复原样式
            cameraArea.classList.remove('bg-blue-50');
        }, 150);
    });
    
    // 监听文件选择变化事件
    imageInput.addEventListener('change', function(event) {
        // 检查是否选择了文件
        if (event.target.files && event.target.files[0]) {
            // 获取选择的文件
            const selectedFile = event.target.files[0];
            
            // 文件类型和大小的验证
            if (!selectedFile.type.match('image.*')) {
                alert('请选择图片文件！');
                return;
            }
            
            // 文件大小限制（10MB）
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert('图片大小不能超过10MB！');
                return;
            }
            
            // 显示加载动画或反馈
            cameraArea.innerHTML = '<div class="loading-spinner"></div><p class="mt-4 text-blue-500">图片已选择，正在上传...</p>';
            
            // 创建FormData对象，用于上传文件
            const formData = new FormData();
            formData.append('image', selectedFile);
            
            // 使用fetch API上传图片到后端
            fetch('https://api.yourdomain.com/api/upload-and-analyze', {
                method: 'POST',
                body: formData,
                // 不需要设置Content-Type，fetch会自动设置为multipart/form-data
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.json();
            })
            .then(data => {
                // 上传成功，跳转到加载页面
                // 可以将返回的任务ID传递给加载页面，用于轮询结果
                window.location.href = `loading.html?task_id=${data.task_id}`;
            })
            .catch(error => {
                console.error('上传失败:', error);
                // 显示错误信息
                cameraArea.innerHTML = `
                    <div class="camera-icon-container mb-6">
                        <i class="fa-solid fa-exclamation-circle text-6xl text-red-500"></i>
                    </div>
                    <p class="text-center text-red-500 max-w-xs">
                        上传失败，请重试！
                    </p>
                    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg" id="retry-button">
                        重新上传
                    </button>
                `;
                
                // 为重试按钮添加点击事件
                document.getElementById('retry-button').addEventListener('click', function() {
                    window.location.reload();
                });
            });
            
            // 如果后端暂时不可用，可以使用以下代码模拟上传过程
            /*
            setTimeout(function() {
                window.location.href = 'loading.html?task_id=demo123';
            }, 1500);
            */
        }
    });
});
```

### 加载页面实现

```html
<!-- loading.html - 加载页面 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>作业不吼 - 加载中</title>
    <!-- TailwindCSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- 通用样式 -->
    <link rel="stylesheet" href="css/styles.css">
    <style>
        /* 进度条 */
        .progress-bar {
            width: 100%;
            height: 6px;
            background-color: #E5E7EB;
            border-radius: 3px;
            overflow: hidden;
            margin: 1.5rem 0;
        }
        
        .progress-bar-fill {
            height: 100%;
            background-color: #3B82F6;
            border-radius: 3px;
            animation: fill 6s ease-in-out forwards;
        }
        
        @keyframes fill {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        
        /* 机器人动画 */
        .robot-container {
            width: 120px;
            height: 120px;
            position: relative;
            margin-bottom: 1.5rem;
        }
        
        .robot-head {
            width: 60px;
            height: 50px;
            background-color: #3B82F6;
            border-radius: 10px;
            position: absolute;
            top: 20px;
            left: 30px;
            animation: think 1.5s infinite;
        }
        
        .robot-eye {
            width: 10px;
            height: 10px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            top: 15px;
        }
        
        .robot-eye.left {
            left: 15px;
            animation: blink 3s infinite;
        }
        
        .robot-eye.right {
            right: 15px;
            animation: blink 3s infinite 0.5s;
        }
        
        .robot-antenna {
            width: 5px;
            height: 15px;
            background-color: #3B82F6;
            position: absolute;
            top: 5px;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .robot-antenna::after {
            content: '';
            width: 10px;
            height: 10px;
            background-color: #F59E0B;
            border-radius: 50%;
            position: absolute;
            top: -8px;
            left: -2.5px;
            animation: glow 2s infinite;
        }
        
        .robot-body {
            width: 70px;
            height: 40px;
            background-color: #60A5FA;
            border-radius: 5px;
            position: absolute;
            top: 70px;
            left: 25px;
        }
        
        .magic-particles {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            overflow: hidden;
        }
        
        .particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: #F59E0B;
            border-radius: 50%;
            opacity: 0;
        }
        
        .particle:nth-child(1) {
            top: 20%;
            left: 10%;
            animation: float 3s infinite 0.2s;
        }
        
        .particle:nth-child(2) {
            top: 30%;
            left: 85%;
            animation: float 2.5s infinite 0.5s;
        }
        
        .particle:nth-child(3) {
            top: 70%;
            left: 20%;
            animation: float 3.5s infinite 0.7s;
        }
        
        .particle:nth-child(4) {
            top: 60%;
            left: 75%;
            animation: float 3s infinite 1s;
        }
        
        .particle:nth-child(5) {
            top: 40%;
            left: 40%;
            animation: float 4s infinite 1.5s;
        }
        
        @keyframes think {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
        }
        
        @keyframes blink {
            0%, 90%, 100% { transform: scale(1); }
            95% { transform: scale(0.1); }
        }
        
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px 2px rgba(245, 158, 11, 0.5); }
            50% { box-shadow: 0 0 10px 5px rgba(245, 158, 11, 0.8); }
        }
        
        @keyframes float {
            0% { transform: translateY(0); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-20px); opacity: 0; }
        }
        
        /* 文字淡入淡出动画 */
        .fade-text {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        
        .fade-text.active {
            opacity: 1;
        }
    </style>
</head>
<body class="bg-[#F5F5F5] h-screen w-screen flex items-center justify-center">
    <!-- iPhone 外观容器 -->
    <div class="iphone-container">
        <!-- 主内容区域 -->
        <div id="main-content" class="flex flex-col items-center justify-center h-full py-10 px-6">
            <!-- 机器人老师动画 -->
            <div class="robot-container">
                <div class="robot-antenna"></div>
                <div class="robot-head">
                    <div class="robot-eye left"></div>
                    <div class="robot-eye right"></div>
                </div>
                <div class="robot-body"></div>
                <div class="magic-particles">
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                </div>
            </div>
            
            <!-- 加载文字 -->
            <h2 class="text-xl font-semibold text-gray-800 mb-2">AI老师正在思考</h2>
            <p id="loading-text" class="text-gray-600 text-center mb-4 h-6 fade-text active">正在识别题目文字...</p>
            
            <!-- 进度条 -->
            <div class="progress-bar w-full max-w-xs">
                <div class="progress-bar-fill"></div>
            </div>
            
            <!-- 提示信息 -->
            <p class="text-sm text-gray-500 text-center mt-6">
                <i class="fa-solid fa-lightbulb text-yellow-500 mr-1"></i>
                提示：我们会为您提供多种讲解方式
            </p>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const loadingText = document.getElementById('loading-text');
            const texts = [
                "正在识别题目文字...",
                "AI教练正在分析考点...",
                "马上为你生成讲解方法！"
            ];
            const delays = [2000, 3000, 1000]; // 各文案显示时间（毫秒）
            let currentIndex = 0;
            
            // 获取URL中的task_id参数
            const urlParams = new URLSearchParams(window.location.search);
            const taskId = urlParams.get('task_id');
            
            // 文字切换函数
            function changeText() {
                loadingText.classList.remove('active');
                
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % texts.length;
                    loadingText.textContent = texts[currentIndex];
                    loadingText.classList.add('active');
                    
                    if (currentIndex < texts.length - 1) {
                        setTimeout(changeText, delays[currentIndex]);
                    } else {
                        // 最后一条文案显示完后，开始轮询结果
                        setTimeout(() => {
                            checkAnalysisResult(taskId);
                        }, delays[currentIndex]);
                    }
                }, 500); // 淡出后等待500ms再更换文字
            }
            
            // 轮询分析结果
            function checkAnalysisResult(taskId) {
                // 如果没有taskId，直接跳转到演示页面
                if (!taskId) {
                    window.location.href = 'library.html';
                    return;
                }
                
                // 轮询后端API获取分析结果
                fetch(`https://api.yourdomain.com/api/check-result?task_id=${taskId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'completed') {
                        // 分析完成，跳转到讲解库页面
                        window.location.href = `library.html?result_id=${data.result_id}`;
                    } else if (data.status === 'failed') {
                        // 分析失败，显示错误信息
                        alert('分析失败，请重试！');
                        window.location.href = 'camera.html';
                    } else {
                        // 继续等待，1秒后再次轮询
                        setTimeout(() => checkAnalysisResult(taskId), 1000);
                    }
                })
                .catch(error => {
                    console.error('检查结果失败:', error);
                    // 出错时也跳转到讲解库页面（演示模式）
                    window.location.href = 'library.html';
                });
            }
            
            // 启动文字切换
            setTimeout(changeText, delays[0]);
            
            // 如果后端暂时不可用，可以使用以下代码模拟处理过程
            /*
            setTimeout(function() {
                window.location.href = 'library.html';
            }, 6000); // 6秒后自动跳转
            */
        });
    </script>
</body>
</html>
```

## 关键点说明

1. **图片上传功能**：
   - 使用`<input type="file" accept="image/*">`实现文件选择
   - 添加`capture="environment"`属性优先使用后置相机
   - 使用FormData对象封装图片数据
   - 通过fetch API发送到后端接口

2. **用户体验优化**：
   - 添加点击反馈效果
   - 文件类型和大小验证
   - 上传失败时的错误处理和重试机制
   - 加载动画和进度提示

3. **加载页面功能**：
   - 动态文字切换，显示不同阶段的处理状态
   - 进度条动画，提供视觉反馈
   - 轮询机制，检查后端处理结果
   - 错误处理和降级策略

这些代码实现了完整的前端图片上传流程，包括用户交互、数据验证、上传处理和状态反馈，为后续的后端处理和AI分析奠定了基础。