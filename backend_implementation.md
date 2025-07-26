# 后端实现 - 接收与处理

## 阶段2：后端实现 - 接收与处理

### Python Flask 后端框架搭建

以下是使用Python Flask框架实现的后端API服务，用于接收前端上传的图片并进行处理：

```python
# app.py - Flask后端主文件

import os
import uuid
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import threading

# 导入自定义模块
from ocr_service import recognize_text
from llm_service import generate_explanation
from db_service import save_result, get_result

# 创建Flask应用
app = Flask(__name__)
CORS(app)  # 启用跨域资源共享

# 配置上传文件存储路径
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 限制上传文件大小为10MB

# 确保上传目录存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 任务状态存储（实际应用中应使用Redis等）
tasks = {}

# 检查文件扩展名是否允许
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 异步处理图片的函数
def process_image_async(task_id, image_path):
    try:
        # 步骤1：调用OCR服务识别文字
        text = recognize_text(image_path)
        if not text:
            tasks[task_id] = {'status': 'failed', 'error': 'OCR识别失败'}
            return
        
        # 步骤2：调用大语言模型生成讲解
        explanation_json = generate_explanation(text)
        if not explanation_json:
            tasks[task_id] = {'status': 'failed', 'error': 'AI生成讲解失败'}
            return
        
        # 步骤3：保存结果到数据库
        result_id = save_result(text, explanation_json, image_path)
        
        # 更新任务状态为完成
        tasks[task_id] = {
            'status': 'completed',
            'result_id': result_id
        }
    except Exception as e:
        # 处理过程中出现异常
        tasks[task_id] = {'status': 'failed', 'error': str(e)}

# API路由：上传并分析图片
@app.route('/api/upload-and-analyze', methods=['POST'])
def upload_and_analyze():
    # 检查是否有文件部分
    if 'image' not in request.files:
        return jsonify({'error': '没有文件部分'}), 400
    
    file = request.files['image']
    
    # 检查文件名是否为空
    if file.filename == '':
        return jsonify({'error': '没有选择文件'}), 400
    
    # 检查文件类型是否允许
    if not allowed_file(file.filename):
        return jsonify({'error': '不支持的文件类型'}), 400
    
    # 生成安全的文件名并保存文件
    filename = secure_filename(file.filename)
    # 添加时间戳和UUID，确保文件名唯一
    unique_filename = f"{int(time.time())}_{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)
    
    # 生成任务ID
    task_id = uuid.uuid4().hex
    
    # 初始化任务状态
    tasks[task_id] = {'status': 'processing'}
    
    # 启动异步处理线程
    thread = threading.Thread(target=process_image_async, args=(task_id, file_path))
    thread.daemon = True
    thread.start()
    
    # 返回任务ID给前端
    return jsonify({'task_id': task_id})

# API路由：检查分析结果
@app.route('/api/check-result', methods=['GET'])
def check_result():
    task_id = request.args.get('task_id')
    
    if not task_id or task_id not in tasks:
        return jsonify({'error': '无效的任务ID'}), 400
    
    # 返回当前任务状态
    return jsonify(tasks[task_id])

# API路由：获取讲解内容
@app.route('/api/get-explanation', methods=['GET'])
def get_explanation():
    result_id = request.args.get('result_id')
    
    if not result_id:
        return jsonify({'error': '无效的结果ID'}), 400
    
    # 从数据库获取结果
    result = get_result(result_id)
    
    if not result:
        return jsonify({'error': '找不到结果'}), 404
    
    # 返回讲解内容
    return jsonify(result)

# 启动服务器
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

## 阶段3：调用AI服务 - 实现"智能"

### OCR服务实现

以下是调用百度AI OCR服务的实现代码：

```python
# ocr_service.py - OCR服务模块

import os
import requests
import base64
import json
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 百度AI OCR配置
API_KEY = os.getenv('BAIDU_API_KEY')
SECRET_KEY = os.getenv('BAIDU_SECRET_KEY')

# 获取百度AI访问令牌
def get_access_token():
    url = "https://aip.baidubce.com/oauth/2.0/token"
    params = {
        "grant_type": "client_credentials",
        "client_id": API_KEY,
        "client_secret": SECRET_KEY
    }
    response = requests.post(url, params=params)
    result = response.json()
    return result.get("access_token")

# 识别图片中的文字
def recognize_text(image_path):
    try:
        # 获取访问令牌
        access_token = get_access_token()
        
        # 准备请求URL
        url = f"https://aip.baidubce.com/rest/2.0/ocr/v1/accurate?access_token={access_token}"
        
        # 读取图片文件并进行base64编码
        with open(image_path, 'rb') as f:
            image_data = base64.b64encode(f.read())
        
        # 准备请求参数
        params = {
            "image": image_data,
            "language_type": "CHN_ENG",  # 中英文混合
            "detect_direction": "true",   # 检测图片方向
            "paragraph": "true",         # 输出段落信息
            "probability": "true"         # 输出置信度
        }
        
        # 发送OCR请求
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        response = requests.post(url, data=params, headers=headers)
        result = response.json()
        
        # 提取识别出的文字
        if 'words_result' in result:
            text = '\n'.join([item['words'] for item in result['words_result']])
            return text
        else:
            print("OCR识别失败:", result)
            return None
    except Exception as e:
        print(f"OCR服务异常: {str(e)}")
        return None
```

### 大语言模型服务实现

以下是调用OpenAI GPT-4模型生成讲解内容的实现代码：

```python
# llm_service.py - 大语言模型服务模块

import os
import json
import openai
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# OpenAI配置
openai.api_key = os.getenv('OPENAI_API_KEY')

# 超级Prompt模板
SUPER_PROMPT = """
你是一位专业的教育AI助手，专门帮助家长解析学生的题目并生成多种讲解方式。

请分析以下题目，并生成一个结构化的JSON响应，包含以下部分：
1. 考点分析：识别题目涉及的核心知识点和考察能力
2. 难度评估：评估题目难度（简单/中等/困难）并说明原因
3. 多种讲解方式：
   a. 标准讲解：按照教科书的标准方法，清晰地分步骤讲解解题过程
   b. 生活类比法：使用日常生活中的例子或比喻，让抽象概念具体化
   c. 游戏互动法：设计一个简单的游戏或互动活动，寓教于乐

题目内容：
{text}

请确保你的回答是一个有效的JSON对象，格式如下：
{{
  "题目": "原题目文本",
  "考点分析": {{
    "主要考点": "主要考察的知识点",
    "次要考点": ["次要知识点1", "次要知识点2"],
    "能力要求": ["需要的能力1", "需要的能力2"]
  }},
  "难度评估": {{
    "难度等级": "简单/中等/困难",
    "难度原因": "难度评估的理由"
  }},
  "讲解方式": {{
    "标准讲解": {{
      "步骤": [
        {{
          "步骤序号": 1,
          "步骤名称": "步骤1名称",
          "步骤内容": "详细解释",
          "公式或要点": "相关公式或要点"
        }},
        // 更多步骤...
      ],
      "答案": "最终答案",
      "要点提示": "解题要点和注意事项"
    }},
    "生活类比法": {{
      "类比主题": "类比的主题",
      "类比说明": "详细的类比解释",
      "引导问题": ["问题1", "问题2"],
      "总结": "通过类比得出的结论"
    }},
    "游戏互动法": {{
      "游戏名称": "游戏名称",
      "游戏规则": "游戏的规则和玩法",
      "教学目标": "通过游戏要达到的教学目标",
      "材料准备": ["需要的材料1", "需要的材料2"],
      "游戏步骤": ["步骤1", "步骤2"],
      "知识连接": "游戏与题目知识点的连接"
    }}
  }}
}}

请确保生成的JSON格式正确，可以被解析。每种讲解方式都应该针对不同学习风格的学生，帮助他们更好地理解题目。
"""

# 生成讲解内容
def generate_explanation(text):
    try:
        # 准备Prompt
        prompt = SUPER_PROMPT.format(text=text)
        
        # 调用OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",  # 或使用其他可用模型
            messages=[
                {"role": "system", "content": "你是一位专业的教育AI助手，擅长分析题目并生成多种讲解方式。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,  # 控制创造性
            max_tokens=2000,  # 控制回答长度
            top_p=0.95,
            frequency_penalty=0,
            presence_penalty=0
        )
        
        # 提取回答内容
        content = response.choices[0].message.content
        
        # 尝试解析JSON
        try:
            # 如果回答包含```json和```标记，提取其中的JSON部分
            if "```json" in content and "```" in content.split("```json", 1)[1]:
                json_str = content.split("```json", 1)[1].split("```", 1)[0]
                explanation_json = json.loads(json_str)
            else:
                # 否则尝试直接解析整个内容
                explanation_json = json.loads(content)
                
            return explanation_json
        except json.JSONDecodeError as e:
            print(f"JSON解析错误: {str(e)}\n内容: {content}")
            # 如果解析失败，返回原始文本
            return {"error": "JSON解析失败", "raw_content": content}
    
    except Exception as e:
        print(f"LLM服务异常: {str(e)}")
        return None
```

### 数据库服务实现

以下是数据库操作的实现代码，用于存储和获取分析结果：

```python
# db_service.py - 数据库服务模块

import os
import json
import uuid
import sqlite3
from datetime import datetime

# 数据库文件路径
DB_FILE = 'homework_app.db'

# 初始化数据库
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 创建结果表
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS results (
        id TEXT PRIMARY KEY,
        original_text TEXT NOT NULL,
        explanation_json TEXT NOT NULL,
        image_path TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    ''')
    
    conn.commit()
    conn.close()

# 保存结果到数据库
def save_result(original_text, explanation_json, image_path):
    # 确保数据库已初始化
    if not os.path.exists(DB_FILE):
        init_db()
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 生成唯一ID
    result_id = uuid.uuid4().hex
    
    # 当前时间
    created_at = datetime.now().isoformat()
    
    # 将JSON对象转换为字符串
    if isinstance(explanation_json, dict):
        explanation_json_str = json.dumps(explanation_json, ensure_ascii=False)
    else:
        explanation_json_str = explanation_json
    
    # 插入数据
    cursor.execute(
        'INSERT INTO results (id, original_text, explanation_json, image_path, created_at) VALUES (?, ?, ?, ?, ?)',
        (result_id, original_text, explanation_json_str, image_path, created_at)
    )
    
    conn.commit()
    conn.close()
    
    return result_id

# 从数据库获取结果
def get_result(result_id):
    # 确保数据库已初始化
    if not os.path.exists(DB_FILE):
        return None
    
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row  # 启用行工厂，使结果可以通过列名访问
    cursor = conn.cursor()
    
    # 查询数据
    cursor.execute('SELECT * FROM results WHERE id = ?', (result_id,))
    row = cursor.fetchone()
    
    if not row:
        conn.close()
        return None
    
    # 构建结果对象
    result = {
        'id': row['id'],
        'original_text': row['original_text'],
        'explanation': json.loads(row['explanation_json']),
        'image_path': row['image_path'],
        'created_at': row['created_at']
    }
    
    conn.close()
    return result
```

## 阶段4：返回数据给前端

在上面的Flask应用中，我们已经实现了`/api/get-explanation`接口，用于将分析结果返回给前端。前端可以通过以下方式获取结果：

```javascript
// 前端获取讲解内容的示例代码
function fetchExplanation(resultId) {
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
    })
    .catch(error => {
        console.error('获取讲解内容出错:', error);
        showErrorMessage('获取讲解内容失败，请重试');
    });
}
```

## 关键点说明

1. **后端架构**：
   - 使用Flask框架构建轻量级API服务
   - 实现异步处理机制，避免长时间阻塞请求
   - 模块化设计，分离OCR、LLM和数据库服务

2. **OCR服务**：
   - 使用百度AI OCR服务，支持中英文混合识别
   - 处理图片方向自动检测和段落识别
   - 完善的错误处理和日志记录

3. **大语言模型服务**：
   - 使用OpenAI GPT-4模型生成多种讲解方式
   - 设计了详细的"超级Prompt"，引导模型生成结构化JSON
   - 包含标准讲解、生活类比和游戏互动三种讲解方式

4. **数据存储**：
   - 使用SQLite数据库存储分析结果
   - 支持结果持久化和历史查询
   - 可扩展为更强大的数据库系统（如MongoDB或MySQL）

5. **安全考虑**：
   - 文件上传安全处理（文件类型验证、大小限制）
   - 使用UUID生成唯一标识符
   - 环境变量管理API密钥

这些代码实现了完整的后端处理流程，包括图片接收、OCR识别、AI生成讲解和数据存储，为前端展示提供了强大的数据支持。