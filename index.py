from http.server import BaseHTTPRequestHandler
import os
import uuid
import time
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import threading
import sqlite3
from datetime import datetime
from urllib.parse import parse_qs

# 创建Flask应用
app = Flask(__name__)
CORS(app)  # 启用跨域资源共享

# 配置上传文件存储路径
UPLOAD_FOLDER = '/tmp/uploads'  # Vercel使用/tmp目录
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 限制上传文件大小为10MB

# 确保上传目录存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 任务状态存储（简化版本，适用于Vercel）
tasks = {}

# 数据库文件路径（Vercel环境）
DB_FILE = '/tmp/homework_app.db'

# 检查文件扩展名是否允许
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 初始化数据库
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
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
def save_result(result_id, original_text, explanation_json, image_path):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO results (id, original_text, explanation_json, image_path, created_at) VALUES (?, ?, ?, ?, ?)",
        (result_id, original_text, explanation_json, image_path, datetime.now().isoformat())
    )
    
    conn.commit()
    conn.close()

# 从数据库获取结果
def get_result(result_id):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM results WHERE id = ?", (result_id,))
    result = cursor.fetchone()
    
    conn.close()
    
    if not result:
        return None
    
    return {
        'id': result[0],
        'original_text': result[1],
        'explanation': json.loads(result[2]),
        'image_path': result[3],
        'created_at': result[4]
    }

# 模拟OCR识别（演示版本）
def mock_ocr(image_path):
    # 演示版本，返回固定文本
    return "已知函数f(x)=ln(x+1)，求f'(x)的表达式。"

# 模拟AI生成讲解（演示版本）
def mock_generate_explanation(text):
    # 演示版本，返回固定讲解
    return {
        "problem_type": "求导",
        "difficulty": "中等",
        "key_points": ["对数函数求导", "链式法则"],
        "solution_steps": [
            "对于函数f(x)=ln(x+1)，我们需要求它的导数f'(x)",
            "根据对数函数的求导公式，如果f(x)=ln(g(x))，那么f'(x)=g'(x)/g(x)",
            "在这里，g(x)=x+1，所以g'(x)=1",
            "代入公式得到：f'(x)=1/(x+1)"
        ],
        "final_answer": "f'(x)=1/(x+1)",
        "common_mistakes": ["忘记使用链式法则", "分母写成x而不是x+1"],
        "related_knowledge": ["对数函数求导公式", "链式法则", "初等函数求导"]
    }

# 异步处理图片
def process_image_async(task_id, image_path):
    try:
        # 初始化数据库
        init_db()
        
        # 模拟OCR识别文字
        text = mock_ocr(image_path)
        
        # 模拟AI生成讲解
        explanation = mock_generate_explanation(text)
        
        # 生成结果ID
        result_id = uuid.uuid4().hex
        
        # 保存结果到数据库
        save_result(result_id, text, json.dumps(explanation), image_path)
        
        # 更新任务状态
        tasks[task_id] = {
            'status': 'completed',
            'result_id': result_id
        }
    except Exception as e:
        tasks[task_id] = {
            'status': 'failed',
            'error': str(e)
        }

# API路由：上传并分析图片
@app.route('/api/upload-and-analyze', methods=['POST'])
def upload_and_analyze():
    if 'file' not in request.files:
        return jsonify({'error': '没有文件'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': '没有选择文件'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': '不支持的文件类型'}), 400
    
    filename = secure_filename(file.filename)
    unique_filename = f"{int(time.time())}_{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)
    
    task_id = uuid.uuid4().hex
    tasks[task_id] = {'status': 'processing'}
    
    # 启动异步处理线程
    thread = threading.Thread(target=process_image_async, args=(task_id, file_path))
    thread.daemon = True
    thread.start()
    
    return jsonify({'task_id': task_id})

# API路由：检查分析结果
@app.route('/api/check-result', methods=['GET'])
def check_result():
    task_id = request.args.get('task_id')
    
    if not task_id or task_id not in tasks:
        return jsonify({'error': '无效的任务ID'}), 400
    
    return jsonify(tasks[task_id])

# API路由：获取讲解内容
@app.route('/api/get-explanation', methods=['GET'])
def get_explanation():
    result_id = request.args.get('result_id')
    
    if not result_id:
        return jsonify({'error': '无效的结果ID'}), 400
    
    result = get_result(result_id)
    
    if not result:
        return jsonify({'error': '找不到结果'}), 404
    
    return jsonify(result)

# 健康检查路由
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': '作业不吼后端服务运行正常'})

# 根路由
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': '作业不吼 - 后端API服务',
        'version': '1.0.0',
        'endpoints': {
            'upload': '/api/upload-and-analyze',
            'check': '/api/check-result',
            'explanation': '/api/get-explanation',
            'health': '/health'
        }
    })

# 初始化数据库
init_db()

# Vercel Serverless Function处理函数
# 将现有的handler函数替换为以下内容
from serverless_wsgi import handle_request

def handler(event, context):
    return handle_request(app, event, context)

# 本地开发服务器
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)