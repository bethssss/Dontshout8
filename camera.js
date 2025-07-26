/**
 * 拍照搜题页面脚本
 * 功能：处理拍照区域点击事件，触发文件选择，并在选择图片后跳转到加载页面
 */

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
            
            // 可以在这里添加文件类型和大小的验证
            if (!selectedFile.type.match('image.*')) {
                alert('请选择图片文件！');
                return;
            }
            
            // 显示加载动画或反馈
            cameraArea.innerHTML = '<div class="loading-spinner"></div><p class="mt-4 text-blue-500">图片已选择，正在处理...</p>';
            
            // 延迟跳转到加载页面，模拟上传和处理过程
            setTimeout(function() {
                // 跳转到加载页面
                window.location.href = 'loading.html';
                
                // 在实际应用中，这里应该有图片上传到服务器的代码
                // 例如使用FormData和fetch API上传图片
                /*
                const formData = new FormData();
                formData.append('image', selectedFile);
                
                fetch('your-upload-endpoint', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    // 处理响应数据
                    window.location.href = 'result.html?id=' + data.resultId;
                })
                .catch(error => {
                    console.error('上传失败:', error);
                    alert('上传失败，请重试');
                });
                */
            }, 800);
        }
    });
    
    console.log('拍照搜题页面加载完成，点击事件已绑定');
});