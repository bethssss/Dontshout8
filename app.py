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
def save_result(original_text, explanation_json, image_path):
    if not os.path.exists(DB_FILE):
        init_db()
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    result_id = uuid.uuid4().hex
    created_at = datetime.now().isoformat()
    
    if isinstance(explanation_json, dict):
        explanation_json_str = json.dumps(explanation_json, ensure_ascii=False)
    else:
        explanation_json_str = explanation_json
    
    cursor.execute(
        'INSERT INTO results (id, original_text, explanation_json, image_path, created_at) VALUES (?, ?, ?, ?, ?)',
        (result_id, original_text, explanation_json_str, image_path, created_at)
    )
    
    conn.commit()
    conn.close()
    
    return result_id

# 从数据库获取结果
def get_result(result_id):
    if not os.path.exists(DB_FILE):
        return None
    
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM results WHERE id = ?', (result_id,))
    row = cursor.fetchone()
    
    if not row:
        conn.close()
        return None
    
    result = {
        'id': row['id'],
        'original_text': row['original_text'],
        'explanation': json.loads(row['explanation_json']),
        'image_path': row['image_path'],
        'created_at': row['created_at']
    }
    
    conn.close()
    return result

# 模拟OCR识别（演示版本）
def recognize_text_demo(image_path):
    # 这里返回演示文本，实际部署时需要接入真实OCR服务
    return "一个长方形的长为6厘米，宽为4厘米，求这个长方形的面积。"

# 模拟AI生成讲解（演示版本）
def generate_explanation_demo(text):
    # 返回演示数据，实际部署时需要接入真实AI服务
    return {
        "diagnose": {
            "main_point": "本题考查：长方形周长与面积",
            "pain_point": "孩子易错：周长与面积概念混淆",
            "parent_tip": "温馨提示：先别急着讲公式，从下面的方法一开始吧！"
        },
        "guidance_strategies": [
            {
                "strategy_id": "standard_teach",
                "is_pro": False,
                "title": "家长速通讲解",
                "description": "让你自己先'秒懂'解题思路和关键点。",
                "coach_script": [
                    "首先，确认题目要求：计算长方形的面积，已知长为6厘米，宽为4厘米。",
                    "向孩子解释长方形面积的计算公式：面积 = 长 × 宽。",
                    "带领孩子代入数据：面积 = 6厘米 × 4厘米 = 24平方厘米。",
                    "提醒孩子注意单位：长度单位是厘米，面积单位是平方厘米。"
                ]
            },
            {
                "strategy_id": "life_analogy",
                "is_pro": True,
                "title": "生活类比讲解",
                "description": "用孩子最熟悉的生活场景打比方。",
                "coach_script": [
                    "宝贝，想象一下你的床是一个长方形，如果我们要铺一张床单，需要知道床单要多大对吧？",
                    "如果你的床长6厘米（用手比划），宽4厘米，我们怎么算出需要多大的床单呢？",
                    "对，我们可以数一数，这个长方形区域里可以放几个1厘米×1厘米的小方块。",
                    "我们可以排成6列，每列4个小方块，总共有多少个？对，是24个！所以床单的面积是24平方厘米。"
                ]
            },
            {
                "strategy_id": "game_interaction",
                "is_pro": True,
                "title": "游戏互动讲解",
                "description": "提供可以和孩子一起动手的游戏。",
                "coach_script": [
                    "拿出一张纸，让孩子在纸上画一个6厘米×4厘米的长方形。",
                    "让孩子用1厘米×1厘米的小正方形纸片（可以事先准备好）铺满这个长方形。",
                    "数一数总共用了多少个小正方形？这就是长方形的面积！",
                    "挑战升级：让孩子尝试不同尺寸的长方形，看看面积如何变化。"
                ]
            }
        ]
    }

# 异步处理图片的函数
def process_image_async(task_id, image_path):
    try:
        # 步骤1：调用OCR服务识别文字（演示版本）
        text = recognize_text_demo(image_path)
        if not text:
            tasks[task_id] = {'status': 'failed', 'error': 'OCR识别失败'}
            return
        
        # 步骤2：调用大语言模型生成讲解（演示版本）
        explanation_json = generate_explanation_demo(text)
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
        tasks[task_id] = {'status': 'failed', 'error': str(e)}

# API路由：上传并分析图片
@app.route('/api/upload-and-analyze', methods=['POST'])
def upload_and_analyze():
    if 'image' not in request.files:
        return jsonify({'error': '没有文件部分'}), 400
    
    file = request.files['image']
    
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

# Vercel需要的处理函数
def handler(request):
    return app(request)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)