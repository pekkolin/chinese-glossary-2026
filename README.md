# 《Chinese Glossary 2026》中文生词教学与学习网页工具
## （集成 AP Chinese 官方全套 Unit 1 到 Unit 6 核心词汇库）

> **专为中文作为第二语言（CSL/CFL）与 AP 中文教学设计的现代化全功能 Web 教学工具**  
> 现已完整扩充并收录 **AP Chinese Unit 1 到 Unit 6 全套重点词汇** 以及原 `Chinese Glossary 2026.xlsx` 核心词汇（**共 728 词**），深度融合多模态第二语言习得（SLA）教学法。

---

## 🌟 核心特色与教学价值

### 1. 扩充整合 AP Chinese 官方全套 6 大主题（共 728 词）
系统支持按具体教学单元进行精准筛选与专项练习：
* 📖 **2026 基础核心词汇 (Core 2026)**：14 词
* 👨‍👩‍👧 **Unit 1: Families in Societies (家庭与社会)**：153 词（如：独生子女、四世同堂、望子成龙、长幼有序等）
* 🪪 **Unit 2: Personal and Public Identities (个人与公众身份)**：136 词
* 🎨 **Unit 3: Beauty and Aesthetics (美与审美)**：112 词（如：名胜古迹、兵马俑、文房四宝等）
* 🔬 **Unit 4: Science and Technology (科学与技术)**：53 词（如：移动支付、共享单车、高铁等）
* 🏙️ **Unit 5: Contemporary Life (现代生活)**：137 词
* 🌍 **Unit 6: Global Challenges (全球挑战)**：123 词（如：老龄化、保护环境、可持续发展等）

所有生词均经过高精度拼音音调矫正、文化成语专业双语精译、简繁双字形对照及主题标签分类。

### 2. 全模块单元联动筛选（Unit Thematic Filtering）
* **词库全览 (Glossary)**：支持按指定单元或全库检索，直观显示单元主题彩色徽章；
* **3D 智能闪卡 (Flashcards)**：可单独选择 Unit 1～6 进行单元专项闪卡记忆；
* **随堂练习 (Quiz & Games)**：支持针对所选 AP 单元生成针对性的四选一自测与记忆配对连连看；
* **打印单生成器 (Printable Sheets)**：教师可按指定单元一键生成田字格描红练习纸、随堂测试卷与便携裁切卡。

### 3. 完整继承并升华智能补全引擎（Smart Auto-Completion）
* 内置**智能生词补全引擎**：输入英文（如 `only child`、`high-speed railway`）或汉字时，系统优先匹配 728 词 AP 核心词库，自动填充带调拼音、简体中文、繁體中文、双语释义与单元标签，实现真正的**一键智能建词**。

### 4. 双重编码与多模态发音（Dual Coding & Audio）
* **普通话高保真发音**：集成 Web Speech API 原生语音合成，支持点击即读；
* **慢速跟读模式**：提供 `0.75x 慢速跟读`、`1.0x 标准原速` 与 `1.25x 快速辨音` 调节；
* **真人发音与字源直达**：保留维基词典（Wiktionary）链接，方便学生探究部首与笔顺演化；
* **图像辅助联想**：一键直达 Google 图像库，契合双重编码理论，强化视觉记忆。

### 5. 教师专属：一键生成并打印教学材料 (Printable Worksheets)
点击「打印单生成器」即可即时预览并使用浏览器原生 `Ctrl + P` 打印输出：
* **汉字田字格规范描红练习单**：包含范字、浅灰描红格及独立书写格，支持按单元打印；
* **随堂评估测试卷**：A4 纸面标准排版的中英配对题与拼音汉字填空题；
* **便携裁切生词卡**：双面剪裁线卡片排版，方便打印后作为学生口袋单词卡。

### 6. 数据安全与零依赖（GitHub Pages 开箱即用）
* **纯静态网页架构**：无需配置 Python、Node.js 或数据库，**直接双击 `index.html` 即可在任意电脑、平板或手机浏览器中流畅使用**；
* **完美支持 GitHub Pages**：直接推送至 GitHub 仓库开启 Pages，全班学生与教师均可即时访问；
* **本地数据持久化**：用户掌握进度与新增词汇保存在浏览器 LocalStorage 中，刷新不丢失；
* **多样化导出**：支持一键导出包含单元主题的 Excel 兼容 `.csv` 表格、`.json` 完整备份，以及直接导入 Anki 的 `.txt` 记忆库卡片。

---

## 🚀 快速启动指南

1. 进入当前文件夹：`中文生词学习`；
2. 双击打开 **`index.html`**；
3. 即可立即在浏览器中开始使用！

---

## 📂 文件清单说明

```text
中文生词学习/
├── Chinese Glossary 2026.xlsx                          # 原始核心词汇表
├── AP Chinese Unit 1 Vocabulary Families in Societies.xlsx       # AP Unit 1 原始表
├── AP Chinese Unit 2 Vocabulary Personal and Public Identities.xlsx # AP Unit 2 原始表
├── AP Chinese Unit 3 Vocabulary Beauty and Aesthetics .xlsx       # AP Unit 3 原始表
├── AP Chinese Unit 4 Vocabulary Science and Technology.xlsx      # AP Unit 4 原始表
├── AP Chinese Unit 5 Vocabulary Contemporary Life .xlsx          # AP Unit 5 原始表
├── AP Chinese Unit 6 Vocabulary Global Challenges.xlsx           # AP Unit 6 原始表
├── index.html                                          # 网页应用主页面
├── css/
│   └── style.css                                       # 现代化样式表（单元标签/田字格/打印优化）
├── js/
│   ├── ap_data.js                                      # AP Chinese Unit 1-6 完整词库 (714 词)
│   ├── data.js                                         # 2026 基础核心词库与数据聚合导出接口
│   ├── pinyin_dict.js                                  # 拼音字典与智能联想引擎（优先匹配 AP 词库）
│   └── app.js                                          # 交互逻辑、单元过滤、发音、测验与练习单主逻辑
└── README.md                                           # 综合使用与教学说明文档
```
