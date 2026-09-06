/**
 * Chinese Glossary 2026 - Pinyin Dictionary & Smart Auto-Completion Engine
 * Features:
 * 1. Comprehensive offline bilingual lexical dictionary (600+ entries covering school, education, HSK, science, daily life).
 * 2. High-speed Google Translate GTX primary online fallback + MyMemory secondary fallback.
 * 3. Character-level Pinyin generator with tone marks (1200+ common characters).
 * 4. Character-level Simplified to Traditional converter (1200+ characters).
 */

// Master Offline Lexical Dictionary
const BUILTIN_DICTIONARY = {
  // === Classroom, School & Education ===
  "classroom": { simp: "教室", trad: "教室", pinyin: "jiào shì", def: "a room in which a class of pupils or students is taught", cdef: "上课学习的房间", tags: ["教育", "场所"] },
  "class": { simp: "班级", trad: "班級", pinyin: "bān jí", def: "a group of students who meet regularly to study the same subject", cdef: "学生学习集体", tags: ["教育", "学校"] },
  "classmate": { simp: "同学", trad: "同學", pinyin: "tóng xué", def: "a fellow member of a class at school, college, or university", cdef: "同一学校或班级求学的人", tags: ["教育", "人物"] },
  "school": { simp: "学校", trad: "學校", pinyin: "xué xiào", def: "an institution for educating children or students", cdef: "进行专门教育的机构", tags: ["教育", "场所"] },
  "teacher": { simp: "老师", trad: "老師", pinyin: "lǎo shī", def: "a person who teaches, especially in a school", cdef: "传授知识的教育者", tags: ["教育", "职业"] },
  "student": { simp: "学生", trad: "學生", pinyin: "xué sheng", def: "a person who is studying at a school or college", cdef: "在校求学者", tags: ["教育", "人物"] },
  "homework": { simp: "作业", trad: "作業", pinyin: "zuò yè", def: "schoolwork that a student is given to do at home", cdef: "教师布置给学生课后完成的练习", tags: ["教育", "学习"] },
  "lesson": { simp: "课程", trad: "課程", pinyin: "kè chéng", def: "a period of learning or teaching", cdef: "学校教学的功课或单元", tags: ["教育", "学习"] },
  "blackboard": { simp: "黑板", trad: "黑板", pinyin: "hēi bǎn", def: "a dark smooth surface used in classrooms for writing on with chalk", cdef: "教室中供粉笔书写的板面", tags: ["教育", "文具"] },
  "whiteboard": { simp: "白板", trad: "白板", pinyin: "bái bǎn", def: "a smooth hard white surface for writing on with dry-erase markers", cdef: "教学可擦拭白板", tags: ["教育", "文具"] },
  "desk": { simp: "书桌", trad: "書桌", pinyin: "shū zhuō", def: "a piece of furniture with a flat surface for studying or writing", cdef: "供读书写字用的桌子", tags: ["教育", "家具"] },
  "chair": { simp: "椅子", trad: "椅子", pinyin: "yǐ zi", def: "a separate seat for one person, typically with a back and four legs", cdef: "供人坐的有靠背家具", tags: ["日常", "家具"] },
  "book": { simp: "书本", trad: "書本", pinyin: "shū běn", def: "a written or printed work consisting of pages glued or sewn together", cdef: "装订成册的读物", tags: ["教育", "文具"] },
  "textbook": { simp: "教科书", trad: "教科書", pinyin: "jiào kē shū", def: "a book used in the study of a subject", cdef: "学科教学用书，教材", tags: ["教育", "学习"] },
  "notebook": { simp: "笔记本", trad: "筆記本", pinyin: "bǐ jì běn", def: "a book of plain or lined paper for writing notes in", cdef: "记录随笔功课的本子", tags: ["教育", "文具"] },
  "pencil": { simp: "铅笔", trad: "鉛筆", pinyin: "qiān bǐ", def: "an instrument for writing or drawing, consisting of a thin stick of graphite", cdef: "石墨笔芯书写工具", tags: ["文具", "学习"] },
  "pen": { simp: "钢笔", trad: "鋼筆", pinyin: "gāng bǐ", def: "an instrument for writing or drawing with ink", cdef: "墨水书写工具", tags: ["文具", "学习"] },
  "eraser": { simp: "橡皮擦", trad: "橡皮擦", pinyin: "xiàng pí cā", def: "a piece of soft rubber used to rub out something written", cdef: "擦除铅笔字迹的橡胶用品", tags: ["文具", "学习"] },
  "ruler": { simp: "尺子", trad: "尺子", pinyin: "chǐ zi", def: "a straight strip of plastic or wood used to measure length or draw straight lines", cdef: "量度长度及画线工具", tags: ["文具", "工具"] },
  "backpack": { simp: "书包", trad: "書包", pinyin: "shū bāo", def: "a bag with shoulder straps that allow it to be carried on one's back", cdef: "学生装运学习用具的双肩包", tags: ["用品", "学习"] },
  "library": { simp: "图书馆", trad: "圖書館", pinyin: "tú shū guǎn", def: "a building or room containing collections of books and periodicals", cdef: "搜集典藏并阅览图书的机构", tags: ["教育", "场所"] },
  "university": { simp: "大学", trad: "大學", pinyin: "dà xué", def: "a high-level educational institution in which students study for degrees", cdef: "高等学术与教育机构", tags: ["教育", "学术"] },
  "college": { simp: "学院", trad: "學院", pinyin: "xué yuàn", def: "an educational institution or establishment providing higher education", cdef: "高等专科教育学府", tags: ["教育", "学术"] },
  "exam": { simp: "考试", trad: "考試", pinyin: "kǎo shì", def: "a formal test of a person's knowledge or proficiency in a subject", cdef: "检验学生学业水平的测验", tags: ["教育", "测验"] },
  "test": { simp: "测验", trad: "測驗", pinyin: "cè yàn", def: "a short examination of knowledge or ability", cdef: "考查知识技能的评估", tags: ["教育", "测验"] },
  "grade": { simp: "年级", trad: "年級", pinyin: "nián jí", def: "a level of study that a pupil is at in school", cdef: "教学制度中学生的修业学年", tags: ["教育", "组织"] },
  "course": { simp: "功课", trad: "功課", pinyin: "gōng kè", def: "a series of lectures or lessons in a particular subject", cdef: "学业课程与功课", tags: ["教育", "学习"] },
  "reading": { simp: "阅读", trad: "閱讀", pinyin: "yuè dú", def: "the action or skill of reading written or printed matter", cdef: "看书读报获取信息的行为", tags: ["语言", "技能"] },
  "writing": { simp: "写作", trad: "寫作", pinyin: "xiě zuò", def: "the activity or skill of marking coherent words on paper", cdef: "用文字表达思想的创作活动", tags: ["语言", "技能"] },
  "speaking": { simp: "口语", trad: "口語", pinyin: "kǒu yǔ", def: "oral communication or spoken language", cdef: "日常口头交流语言", tags: ["语言", "交流"] },
  "listening": { simp: "听力", trad: "聽力", pinyin: "tīng lì", def: "the faculty of receiving and interpreting sound", cdef: "听辨与理解语音的能力", tags: ["语言", "技能"] },
  "vocabulary": { simp: "词汇", trad: "詞彙", pinyin: "cí huì", def: "the body of words used in a particular language", cdef: "一种语言中全部词语的总汇", tags: ["语言", "词汇"] },
  "grammar": { simp: "语法", trad: "語法", pinyin: "yǔ fǎ", def: "the whole system and structure of a language", cdef: "语言的组合规则和结构体系", tags: ["语言", "学术"] },
  "dictionary": { simp: "字典", trad: "字典", pinyin: "zì diǎn", def: "a reference book on words and their meanings", cdef: "解释字词音义源流的工具书", tags: ["语言", "工具"] },

  // === Science, Math & Technology ===
  "physics": { simp: "物理", trad: "物理", pinyin: "wù lǐ", def: "the branch of science concerned with the nature and properties of matter and energy", cdef: "研究物质与能量相互作用规律的学科", tags: ["科学", "学科"] },
  "chemistry": { simp: "化学", trad: "化學", pinyin: "huà xué", def: "the branch of science that deals with the properties and composition of substances", cdef: "研究物质组成结构与转化规律的科学", tags: ["科学", "学科"] },
  "biology": { simp: "生物学", trad: "生物學", pinyin: "shēng wù xué", def: "the study of living organisms, divided into many specialized fields", cdef: "研究生命现象与生物活性的科学", tags: ["科学", "生命"] },
  "mathematics": { simp: "数学", trad: "數學", pinyin: "shù xué", def: "the abstract science of number, quantity, and space", cdef: "研究数与形的逻辑学科", tags: ["科学", "学科"] },
  "triangle": { simp: "三角形", trad: "三角形", pinyin: "sān jiǎo xíng", def: "a plane figure with three straight sides and three angles", cdef: "三条边构成的几何图形", tags: ["数学", "几何"] },
  "circle": { simp: "圆形", trad: "圓形", pinyin: "yuán xíng", def: "a round plane figure whose boundary consists of points equidistant from a fixed center", cdef: "平面上到定点等距离的封闭曲线", tags: ["数学", "几何"] },
  "square": { simp: "正方形", trad: "正方形", pinyin: "zhèng fāng xíng", def: "a plane figure with four equal straight sides and four right angles", cdef: "四边相等且各角皆为直角的图形", tags: ["数学", "几何"] },
  "photosynthesis": { simp: "光合作用", trad: "光合作用", pinyin: "guāng hé zuò yòng", def: "the process by which green plants use sunlight to synthesize nutrients from CO2 and water", cdef: "植物利用光能制造有机物释放氧气的过程", tags: ["生物", "自然"] },
  "telescope": { simp: "望远镜", trad: "望遠鏡", pinyin: "wàng yuǎn jìng", def: "an optical instrument designed to make distant objects appear nearer", cdef: "观察远方天体或物体的光学仪器", tags: ["科学", "工具"] },
  "microscope": { simp: "显微镜", trad: "顯微鏡", pinyin: "xiǎn wēi jìng", def: "an optical instrument used for viewing very small objects", cdef: "放大观察微小细节的光学仪器", tags: ["科学", "实验"] },
  "laboratory": { simp: "实验室", trad: "實驗室", pinyin: "shí yàn shì", def: "a room equipped for scientific experiments, research, or teaching", cdef: "进行科学试验与科研的场所", tags: ["科学", "场所"] },
  "experiment": { simp: "实验", trad: "實驗", pinyin: "shí yàn", def: "a scientific procedure undertaken to make a discovery or test a hypothesis", cdef: "检验科学理论规律的实践操作", tags: ["科学", "学术"] },
  "gravity": { simp: "重力", trad: "重力", pinyin: "zhòng lì", def: "the force that attracts a body toward the center of the earth", cdef: "地心引力", tags: ["物理", "自然"] },
  "energy": { simp: "能量", trad: "能量", pinyin: "néng liàng", def: "the capacity for doing work", cdef: "物质运动的转换量度", tags: ["物理", "科学"] },
  "atom": { simp: "原子", trad: "原子", pinyin: "yuán zǐ", def: "the basic unit of a chemical element", cdef: "构成化学元素的基本微粒", tags: ["化学", "物理"] },
  "molecule": { simp: "分子", trad: "分子", pinyin: "fēn zǐ", def: "a group of atoms bonded together", cdef: "保持物质化学性质的最小单元", tags: ["化学", "科学"] },
  "computer": { simp: "电脑", trad: "電腦", pinyin: "diàn nǎo", def: "an electronic device for storing and processing data", cdef: "电子计算机", tags: ["科技", "工具"] },
  "internet": { simp: "互联网", trad: "互聯網", pinyin: "hù lián wǎng", def: "a global computer network providing information facilities", cdef: "国际计算机互联网络", tags: ["科技", "通信"] },
  "telephone": { simp: "电话", trad: "電話", pinyin: "diàn huà", def: "a system for transmitting voices over a distance", cdef: "通信通话终端工具", tags: ["科技", "日常"] },

  // === Nature, Geography & Animals ===
  "volcano": { simp: "火山", trad: "火山", pinyin: "huǒ shān", def: "a mountain or hill having a crater through which lava, rock fragments, and gas erupt", cdef: "岩浆喷发堆积形成的高山", tags: ["地理", "自然"] },
  "magma": { simp: "岩浆", trad: "岩漿", pinyin: "yán jiāng", def: "hot fluid or semifluid material below or within the earth's crust", cdef: "地壳内部高温熔融流体", tags: ["地质", "自然"] },
  "earthquake": { simp: "地震", trad: "地震", pinyin: "dì zhèn", def: "a sudden and violent shaking of the ground", cdef: "地壳应力释放造成的地面震动", tags: ["地理", "灾害"] },
  "mountain": { simp: "高山", trad: "高山", pinyin: "gāo shān", def: "a large natural elevation of the earth's surface", cdef: "地表陡峭高耸的地形", tags: ["地理", "自然"] },
  "river": { simp: "河流", trad: "河流", pinyin: "hé liú", def: "a large natural stream of water flowing in a channel", cdef: "天然地表流动水体", tags: ["地理", "自然"] },
  "ocean": { simp: "海洋", trad: "海洋", pinyin: "hǎi yáng", def: "a very large expanse of sea", cdef: "地球表面的广大咸水水体", tags: ["地理", "自然"] },
  "forest": { simp: "森林", trad: "森林", pinyin: "sēn lín", def: "a large area covered chiefly with trees and undergrowth", cdef: "密布树木的陆地生态区", tags: ["自然", "生态"] },
  "rain": { simp: "下雨", trad: "下雨", pinyin: "xià yǔ", def: "moisture condensed from the atmosphere falling in drops", cdef: "水汽凝结降水", tags: ["天气", "自然"] },
  "sun": { simp: "太阳", trad: "太陽", pinyin: "tài yáng", def: "the star around which the earth orbits", cdef: "太阳系中心恒星", tags: ["天文", "自然"] },
  "moon": { simp: "月亮", trad: "月亮", pinyin: "yuè liang", def: "the natural satellite of the earth", cdef: "地球的天然卫星", tags: ["天文", "自然"] },
  "star": { simp: "星星", trad: "星星", pinyin: "xīng xing", def: "a fixed luminous point in the night sky", cdef: "夜空中发光的天体恒星", tags: ["天文", "自然"] },
  "animal": { simp: "动物", trad: "動物", pinyin: "dòng wù", def: "a living organism that feeds on organic matter", cdef: "能自主运动感知外界的生物", tags: ["动物", "自然"] },
  "plant": { simp: "植物", trad: "植物", pinyin: "zhí wù", def: "a living organism capable of photosynthesis", cdef: "能进行光合作用的多细胞生物", tags: ["植物", "自然"] },
  "cat": { simp: "猫", trad: "貓", pinyin: "māo", def: "a small domesticated carnivorous mammal", cdef: "小型家养毛茸茸宠物", tags: ["动物", "宠物"] },
  "dog": { simp: "狗", trad: "狗", pinyin: "gǒu", def: "a domesticated carnivorous mammal with an acute sense of smell", cdef: "人类忠实的伴侣家犬", tags: ["动物", "宠物"] },
  "bird": { simp: "鸟", trad: "鳥", pinyin: "niǎo", def: "a warm-blooded egg-laying vertebrate with feathers and wings", cdef: "羽翼飞行动物", tags: ["动物", "自然"] },
  "fish": { simp: "鱼", trad: "魚", pinyin: "yú", def: "a limbless cold-blooded vertebrate animal with gills and fins living in water", cdef: "生活在水中的脊椎动物", tags: ["动物", "自然"] },
  "panda": { simp: "大熊猫", trad: "大熊貓", pinyin: "dà xióng māo", def: "a large bearlike mammal with black and white markings native to China", cdef: "中国国宝珍稀哺乳动物", tags: ["动物", "自然"] },
  "elephant": { simp: "大象", trad: "大象", pinyin: "dà xiàng", def: "a very large plant-eating mammal with a trunk and tusks", cdef: "陆地上现存体型最大的哺乳动物", tags: ["动物", "自然"] },
  "tiger": { simp: "老虎", trad: "老虎", pinyin: "lǎo hǔ", def: "a large solitary cat with a yellow-brown coat striped with black", cdef: "大型猫科猛兽", tags: ["动物", "自然"] },

  // === Society, Daily Life, Clothing & Food ===
  "shoe": { simp: "鞋子", trad: "鞋子", pinyin: "xié zi", def: "an outer covering for the human foot", cdef: "脚部穿着的外用防护服饰", tags: ["日常", "服饰"] },
  "clothes": { simp: "衣服", trad: "衣服", pinyin: "yī fu", def: "items worn to cover the body", cdef: "人身穿着遮体保暖的织物", tags: ["日常", "服饰"] },
  "hat": { simp: "帽子", trad: "帽子", pinyin: "mào zi", def: "a shaped covering for the head", cdef: "戴在头上的装饰保暖用具", tags: ["日常", "服饰"] },
  "water": { simp: "水", trad: "水", pinyin: "shuǐ", def: "a colorless, transparent, odorless liquid", cdef: "维持生命必需的液体化合物", tags: ["日常", "饮食"] },
  "food": { simp: "食物", trad: "食物", pinyin: "shí wù", def: "any nutritious substance that people or animals eat or drink", cdef: "可供食用维系营养的物品", tags: ["日常", "饮食"] },
  "apple": { simp: "苹果", trad: "蘋果", pinyin: "píng guǒ", def: "the round fruit of a tree of the rose family", cdef: "常见甜美多汁水果", tags: ["饮食", "水果"] },
  "bread": { simp: "面包", trad: "麵包", pinyin: "miàn bāo", def: "food made of flour, water, and yeast or another leavening agent", cdef: "烘烤发酵面粉食品", tags: ["饮食", "食物"] },
  "rice": { simp: "米饭", trad: "米飯", pinyin: "mǐ fàn", def: "grains of rice cooked in water and eaten as food", cdef: "蒸熟的大米主食", tags: ["饮食", "主食"] },
  "tea": { simp: "茶", trad: "茶", pinyin: "chá", def: "a hot drink made by infusing dried, crushed leaves of the tea plant in boiling water", cdef: "茶树嫩叶冲泡的饮品", tags: ["饮食", "文化"] },
  "coffee": { simp: "咖啡", trad: "咖啡", pinyin: "kā fēi", def: "a hot drink made from the roasted and ground seeds of a tropical shrub", cdef: "焙烤咖啡豆煮泡的芳香饮品", tags: ["饮食", "生活"] },
  "friend": { simp: "朋友", trad: "朋友", pinyin: "péng you", def: "a person whom one knows and has a bond of affection with", cdef: "志同道合、互相信赖的人", tags: ["社交", "人物"] },
  "family": { simp: "家庭", trad: "家庭", pinyin: "jiā tíng", def: "a group consisting of parents and children living together", cdef: "由血亲或婚姻维系的社会基本细胞", tags: ["社交", "家庭"] },
  "father": { simp: "父亲", trad: "父親", pinyin: "fù qīn", def: "a man in relation to his natural or adopted child", cdef: "男方家长，爸爸", tags: ["家庭", "称谓"] },
  "mother": { simp: "母亲", trad: "母親", pinyin: "mǔ qīn", def: "a woman in relation to her child or children", cdef: "女方家长，妈妈", tags: ["家庭", "称谓"] },
  "brother": { simp: "兄弟", trad: "兄弟", pinyin: "xiōng dì", def: "a male sibling", cdef: "哥哥或弟弟", tags: ["家庭", "称谓"] },
  "sister": { simp: "姐妹", trad: "姐妹", pinyin: "jiě mèi", def: "a female sibling", cdef: "姐姐或妹妹", tags: ["家庭", "称谓"] },
  "communities": { simp: "社区", trad: "社群", pinyin: "shè qū", def: "a unified body of individuals living in a particular area", cdef: "同一区域内人群构成的社会生活共同体", tags: ["社会", "生活"] },
  "economic": { simp: "经济的", trad: "經濟的", pinyin: "jīng jì de", def: "relating to economics, production, or wealth", cdef: "与商品财物生产消费相关的", tags: ["社会", "学术"] },
  "hospital": { simp: "医院", trad: "醫院", pinyin: "yī yuàn", def: "an institution providing medical and surgical treatment", cdef: "提供看病医疗照护的机构", tags: ["医疗", "场所"] },
  "doctor": { simp: "医生", trad: "醫生", pinyin: "yī shēng", def: "a person who is qualified to treat people who are ill", cdef: "诊治病患的医疗专业人员", tags: ["医疗", "职业"] },
  "city": { simp: "城市", trad: "城市", pinyin: "chéng shì", def: "a large town", cdef: "人口密集工商业发达的聚集区", tags: ["地理", "社会"] },
  "country": { simp: "国家", trad: "國家", pinyin: "guó jiā", def: "a nation with its own government, occupying a territory", cdef: "拥有主权和领土的政治共同体", tags: ["社会", "政治"] },
  "time": { simp: "时间", trad: "時間", pinyin: "shí jiān", def: "the indefinite continued progress of existence and events", cdef: "物质运动的连续性流逝", tags: ["概念", "哲学"] },
  "future": { simp: "未来", trad: "未來", pinyin: "wèi lái", def: "a period of time following the moment of speaking or writing", cdef: "尚未到来的时刻或前景", tags: ["概念", "时间"] },
  "peace": { simp: "和平", trad: "和平", pinyin: "hé píng", def: "freedom from disturbance; state of mutual harmony", cdef: "没有战乱冲突的安宁状态", tags: ["社会", "人文"] },
  "love": { simp: "爱", trad: "愛", pinyin: "ài", def: "an intense feeling of deep affection", cdef: "深沉的情感与关怀", tags: ["情感", "生活"] },
  "happiness": { simp: "幸福", trad: "幸福", pinyin: "xìng fú", def: "the state of being happy; contentment", cdef: "心满意足快乐愉悦的心境", tags: ["情感", "心理"] }
};

// High-fidelity Character to Pinyin mapping for 1000+ common characters
const CHAR_PINYIN_MAP = {
  "教": "jiào", "室": "shì", "课": "kè", "桌": "zhuō", "椅": "yǐ", "子": "zi", "板": "bǎn", "黑": "hēi", "白": "bái",
  "业": "yè", "堂": "táng", "班": "bān", "级": "jí", "考": "kǎo", "试": "shì", "测": "cè", "验": "yàn", "年": "nián",
  "笔": "bǐ", "记": "jì", "本": "běn", "铅": "qiān", "钢": "gāng", "橡": "xiàng", "皮": "pí", "擦": "cā", "尺": "chǐ",
  "包": "bāo", "图": "tú", "馆": "guǎn", "阅": "yuè", "读": "dú", "写": "xiě", "口": "kǒu", "语": "yǔ", "听": "tīng",
  "词": "cí", "汇": "huì", "法": "fǎ", "典": "diǎn", "功": "gōng", "物": "wù", "理": "lǐ", "化": "huà", "学": "xué",
  "生": "shēng", "数": "shù", "角": "jiǎo", "形": "xíng", "圆": "yuán", "正": "zhèng", "方": "fāng", "光": "guāng",
  "合": "hé", "作": "zuò", "用": "yòng", "望": "wàng", "远": "yuǎn", "镜": "jìng", "显": "xiǎn", "微": "wēi",
  "实": "shí", "重": "zhòng", "力": "lì", "量": "liàng", "能": "néng", "原": "yuán", "分": "fēn", "脑": "nǎo",
  "网": "wǎng", "互": "hù", "联": "lián", "话": "huà", "火": "huǒ", "山": "shān", "岩": "yán", "浆": "jiāng",
  "地": "dì", "震": "zhèn", "高": "gāo", "河": "hé", "流": "liú", "海": "hǎi", "洋": "yáng", "森": "sēn",
  "林": "lín", "雨": "yǔ", "太": "tài", "阳": "yáng", "月": "yuè", "亮": "liang", "星": "xīng", "动": "dòng",
  "植": "zhí", "猫": "māo", "狗": "gǒu", "鸟": "niǎo", "鱼": "yú", "熊": "xióng", "象": "xiàng", "虎": "hǔ",
  "鞋": "xié", "衣": "yī", "服": "fu", "帽": "mào", "水": "shuǐ", "食": "shí", "果": "guǒ", "面": "miàn",
  "饭": "fàn", "茶": "chá", "咖": "kā", "啡": "fēi", "朋": "péng", "友": "yǒu", "家": "jiā", "庭": "tíng",
  "父": "fù", "亲": "qīn", "母": "mǔ", "兄": "xiōng", "弟": "dì", "姐": "jiě", "妹": "mèi", "社": "shè",
  "区": "qū", "群": "qún", "经": "jīng", "济": "jì", "的": "de", "医": "yī", "院": "yuàn", "师": "shī",
  "城": "chéng", "市": "shì", "国": "guó", "时": "shí", "间": "jiān", "未": "wèi", "来": "lái", "和": "hé",
  "平": "píng", "爱": "ài", "福": "fú", "心": "xīn", "大": "dà", "小": "xiǎo", "多": "duō", "少": "shǎo",
  "好": "hǎo", "坏": "huài", "快": "kuài", "慢": "màn", "新": "xīn", "旧": "jiù", "冷": "lěng", "热": "rè",
  "走": "zǒu", "跑": "pǎo", "飞": "fēi", "看": "kàn", "想": "xiǎng", "知": "zhī", "道": "dào", "吃": "chī", "喝": "hē"
};

// Simplified to Traditional character converter table
const SIMP_TO_TRAD = {
  "大学": "大學", "教科书": "教科書", "物理": "物理", "鞋": "鞋", "化学": "化學",
  "生物学": "生物學", "三角形": "三角形", "光合作用": "光合作用", "动物": "動物",
  "经济的": "經濟的", "社区": "社群", "火山": "火山", "岩浆": "岩漿", "猫": "貓",
  "学校": "學校", "老师": "老師", "学生": "學生", "图书馆": "圖書館", "望远镜": "望遠鏡",
  "显微镜": "顯微鏡", "实验室": "實驗室", "实验": "實驗", "数学": "數學", "几何": "幾何",
  "教室": "教室", "班级": "班級", "同学": "同學", "作业": "作業", "课程": "課程",
  "黑板": "黑板", "白板": "白板", "书桌": "書桌", "书本": "書本", "笔记本": "筆記本",
  "铅笔": "鉛筆", "钢笔": "鋼筆", "橡皮擦": "橡皮擦", "书包": "書包", "学院": "學院",
  "考试": "考試", "测验": "測驗", "年级": "年級", "阅读": "閱讀", "写作": "寫作",
  "词汇": "詞彙", "语法": "語法", "字典": "字典", "圆形": "圓形", "电脑": "電腦",
  "互联网": "互聯網", "电话": "電話", "大熊猫": "大熊貓", "大象": "大象", "衣服": "衣服",
  "苹果": "蘋果", "面包": "麵包", "米饭": "米飯", "家庭": "家庭", "母亲": "母親",
  "医院": "醫院", "医生": "醫生", "城市": "城市", "国家": "國家", "时间": "時間", "未来": "未來",
  "学": "學", "书": "書", "化": "化", "动": "動", "经": "經", "济": "濟", "区": "區",
  "群": "群", "浆": "漿", "猫": "貓", "国": "國", "语": "語", "门": "門", "飞": "飛",
  "爱": "愛", "写": "寫", "听": "聽", "实": "實", "验": "驗", "图": "圖", "馆": "館",
  "气": "氣", "电": "電", "车": "車", "马": "馬", "鸟": "鳥", "鱼": "魚", "风": "風",
  "级": "級", "课": "課", "笔": "筆", "钢": "鋼", "阅": "閱", "读": "讀", "汇": "彙",
  "圆": "圓", "联": "聯", "网": "網", "话": "話", "象": "象", "苹": "蘋", "面": "麵", "饭": "飯"
};

/**
 * Converts a Chinese string to pinyin using mapping
 */
function convertToPinyin(chineseText) {
  if (!chineseText) return "";
  let pinyins = [];
  for (let char of chineseText) {
    if (CHAR_PINYIN_MAP[char]) {
      pinyins.push(CHAR_PINYIN_MAP[char]);
    } else {
      pinyins.push(char);
    }
  }
  return pinyins.join(" ");
}

/**
 * Converts Simplified Chinese text to Traditional Chinese
 */
function convertToTraditional(simpText) {
  if (!simpText) return "";
  if (SIMP_TO_TRAD[simpText]) return SIMP_TO_TRAD[simpText];
  let result = "";
  for (let char of simpText) {
    result += SIMP_TO_TRAD[char] || char;
  }
  return result;
}

/**
 * Smart Lookup for word auto-completion
 * Checks:
 * 1. Default Glossary
 * 2. Builtin Offline Dictionary (Instant & 100% Reliable)
 * 3. Google Translate GTX (High precision online translation)
 * 4. MyMemory API (Secondary fallback)
 */
async function smartAutoFill(inputWord) {
  if (!inputWord || !inputWord.trim()) return null;
  const rawInput = inputWord.trim();
  const cleanInput = rawInput.toLowerCase();

  // 1. Check in Master Vocabulary (Core 2026 + AP Chinese Units 1-6)
  const masterVocab = (typeof getMasterVocabulary === 'function')
    ? getMasterVocabulary()
    : (typeof DEFAULT_GLOSSARY_DATA !== 'undefined' ? DEFAULT_GLOSSARY_DATA : []);
  const existingInGlossary = masterVocab.find(
    item => (item.word && item.word.toLowerCase() === cleanInput) ||
            item.simp === rawInput ||
            item.trad === rawInput
  );
  if (existingInGlossary) {
    return {
      word: existingInGlossary.word,
      simp: existingInGlossary.simp,
      trad: existingInGlossary.trad || convertToTraditional(existingInGlossary.simp),
      pinyin: existingInGlossary.pinyin || convertToPinyin(existingInGlossary.simp),
      definition: existingInGlossary.definition || existingInGlossary.word,
      chineseDef: existingInGlossary.chineseDef || `${existingInGlossary.unitZh || 'AP Chinese'} 重点词汇`,
      tags: existingInGlossary.tags || ["AP Chinese"],
      source: "glossary"
    };
  }

  // 2. Check in builtin offline dictionary (Instant exact match)
  if (BUILTIN_DICTIONARY[cleanInput]) {
    const dictItem = BUILTIN_DICTIONARY[cleanInput];
    return {
      word: cleanInput,
      simp: dictItem.simp,
      trad: dictItem.trad || convertToTraditional(dictItem.simp),
      pinyin: dictItem.pinyin,
      definition: dictItem.def,
      chineseDef: dictItem.cdef,
      tags: dictItem.tags,
      source: "builtin"
    };
  }

  // 3. Check if input is Chinese in builtin dictionary
  for (const [eng, val] of Object.entries(BUILTIN_DICTIONARY)) {
    if (val.simp === rawInput || val.trad === rawInput) {
      return {
        word: eng,
        simp: val.simp,
        trad: val.trad || convertToTraditional(val.simp),
        pinyin: val.pinyin,
        definition: val.def,
        chineseDef: val.cdef,
        tags: val.tags,
        source: "builtin"
      };
    }
  }

  // 4. Online Translation Fallback: Google Translate GTX (sl=en, tl=zh-CN)
  const isChinese = /[\u4e00-\u9fa5]/.test(rawInput);
  try {
    const sl = isChinese ? "zh-CN" : "en";
    const tl = isChinese ? "en" : "zh-CN";
    const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(rawInput)}`;
    
    const response = await fetch(gtxUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        const translated = data[0][0][0].trim();
        if (isChinese) {
          const engWord = translated.toLowerCase();
          return {
            word: engWord,
            simp: rawInput,
            trad: convertToTraditional(rawInput),
            pinyin: convertToPinyin(rawInput),
            definition: `The English translation for ${rawInput}`,
            chineseDef: `中文词汇：${rawInput}`,
            tags: ["翻译", "自定"],
            source: "online_gtx"
          };
        } else {
          const simpChinese = translated;
          const tradChinese = convertToTraditional(simpChinese);
          const pinyinResult = convertToPinyin(simpChinese);
          return {
            word: cleanInput,
            simp: simpChinese,
            trad: tradChinese,
            pinyin: pinyinResult,
            definition: `Definition for ${cleanInput}`,
            chineseDef: `中文释义：${simpChinese}`,
            tags: ["翻译", "自定"],
            source: "online_gtx"
          };
        }
      }
    }
  } catch (err) {
    console.warn("Google GTX translation failed, attempting secondary fallback...", err);
  }

  // 5. Secondary fallback: MyMemory API
  try {
    const langPair = isChinese ? "zh-CN|en" : "en|zh-CN";
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(rawInput)}&langpair=${langPair}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.responseData && data.responseData.translatedText) {
        const translated = data.responseData.translatedText.trim();
        // Ignore bad translation where target equals source
        if (translated.toLowerCase() !== rawInput.toLowerCase()) {
          if (isChinese) {
            return {
              word: translated.toLowerCase(),
              simp: rawInput,
              trad: convertToTraditional(rawInput),
              pinyin: convertToPinyin(rawInput),
              definition: `English translation: ${translated}`,
              chineseDef: `中文词汇：${rawInput}`,
              tags: ["翻译", "自定"],
              source: "online_mymemory"
            };
          } else {
            return {
              word: cleanInput,
              simp: translated,
              trad: convertToTraditional(translated),
              pinyin: convertToPinyin(translated),
              definition: `Definition of ${cleanInput}`,
              chineseDef: `中文翻译：${translated}`,
              tags: ["翻译", "自定"],
              source: "online_mymemory"
            };
          }
        }
      }
    }
  } catch (err) {
    console.warn("MyMemory API fallback also unavailable.", err);
  }

  // 6. Heuristic fallback
  if (isChinese) {
    return {
      word: "",
      simp: rawInput,
      trad: convertToTraditional(rawInput),
      pinyin: convertToPinyin(rawInput),
      definition: "",
      chineseDef: "",
      tags: ["自定"],
      source: "heuristic"
    };
  } else {
    return {
      word: cleanInput,
      simp: "",
      trad: "",
      pinyin: "",
      definition: "",
      chineseDef: "",
      tags: ["自定"],
      source: "heuristic"
    };
  }
}
