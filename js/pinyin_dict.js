/**
 * Chinese Glossary 2026 - Pinyin Dictionary & Smart Auto-Completion Engine
 * Provides offline lexical lookup, Pinyin generation, and online translation fallback.
 */

// Lexical dictionary mapping common English/Chinese vocabulary
const BUILTIN_DICTIONARY = {
  // Academic & Science
  "university": { simp: "大学", trad: "大學", pinyin: "dà xué", def: "an institution of higher education and research", cdef: "高等学府", tags: ["教育", "学术"] },
  "school": { simp: "学校", trad: "學校", pinyin: "xué xiào", def: "an institution for educating children or students", cdef: "教育机构", tags: ["教育", "生活"] },
  "teacher": { simp: "老师", trad: "老師", pinyin: "lǎo shī", def: "a person who teaches, especially in a school", cdef: "传授知识的教育者", tags: ["职业", "教育"] },
  "student": { simp: "学生", trad: "學生", pinyin: "xué sheng", def: "a person who is studying at a school or college", cdef: "在校求学者", tags: ["教育", "人物"] },
  "classroom": { simp: "教室", trad: "教室", pinyin: "jiào shì", def: "a room in which a class of pupils or students is taught", cdef: "上课学习的房间", tags: ["教育", "场所"] },
  "library": { simp: "图书馆", trad: "圖書館", pinyin: "tú shū guǎn", def: "a building or room containing collections of books", cdef: "搜集并借阅图书的机构场所", tags: ["学术", "场所"] },
  "telescope": { simp: "望远镜", trad: "望遠鏡", pinyin: "wàng yuǎn jìng", def: "an optical instrument designed to make distant objects appear nearer", cdef: "观察远方物体的光学仪器", tags: ["科学", "工具"] },
  "microscope": { simp: "显微镜", trad: "顯微鏡", pinyin: "xiǎn wēi jìng", def: "an optical instrument used for viewing very small objects", cdef: "观察微小细节的光学仪器", tags: ["科学", "实验"] },
  "laboratory": { simp: "实验室", trad: "實驗室", pinyin: "shí yàn shì", def: "a room or building equipped for scientific experiments", cdef: "进行科学研究和实验的场所", tags: ["科学", "场所"] },
  "experiment": { simp: "实验", trad: "實驗", pinyin: "shí yàn", def: "a scientific procedure undertaken to make a discovery or test a hypothesis", cdef: "检验科学理论或探索规律的实践活动", tags: ["科学", "学术"] },
  "mathematics": { simp: "数学", trad: "數學", pinyin: "shù xué", def: "the abstract science of number, quantity, and space", cdef: "研究数量、结构、变化及空间等概念的学科", tags: ["科学", "学科"] },
  "geometry": { simp: "几何", trad: "幾何", pinyin: "jǐ hé", def: "the branch of mathematics concerned with the properties of space", cdef: "研究空间结构与图形性质的数学分支", tags: ["数学", "科学"] },
  "gravity": { simp: "重力", trad: "重力", pinyin: "zhòng lì", def: "the force that attracts a body toward the center of the earth", cdef: "物体受地球引力吸引的向心力", tags: ["物理", "科学"] },
  "energy": { simp: "能量", trad: "能量", pinyin: "néng liàng", def: "the property of matter and radiation that is manifest as a capacity for performing work", cdef: "做功的能力，物质运动转换的量度", tags: ["物理", "科学"] },
  "atom": { simp: "原子", trad: "原子", pinyin: "yuán zǐ", def: "the basic unit of a chemical element", cdef: "构成化学元素的基本粒子", tags: ["化学", "物理"] },
  "molecule": { simp: "分子", trad: "分子", pinyin: "fēn zǐ", def: "a group of atoms bonded together", cdef: "由原子组成的保持化学性质的微粒", tags: ["化学", "科学"] },
  "geology": { simp: "地质学", trad: "地質學", pinyin: "dì zhì xué", def: "the science that deals with the earth's physical structure and substance", cdef: "研究地球构造、成分及历史演变的科学", tags: ["科学", "地球"] },
  "geography": { simp: "地理", trad: "地理", pinyin: "dì lǐ", def: "the study of the physical features of the earth and its atmosphere", cdef: "研究地球表面的自然与人文现象分布的学科", tags: ["学科", "人文"] },
  "history": { simp: "历史", trad: "歷史", pinyin: "lì shǐ", def: "the study of past events, particularly in human affairs", cdef: "人类社会过去发生的事件总和及对其的研究", tags: ["人文", "学术"] },
  "literature": { simp: "文学", trad: "文學", pinyin: "wén xué", def: "written works, especially those considered of superior or lasting artistic merit", cdef: "以语言文字为工具形象化反映客观现实的艺术", tags: ["艺术", "人文"] },
  "language": { simp: "语言", trad: "語言", pinyin: "yǔ yán", def: "the principal method of human communication", cdef: "人类交流思想的重要工具", tags: ["人文", "沟通"] },
  "dictionary": { simp: "字典", trad: "字典", pinyin: "zì diǎn", def: "a book or electronic resource that lists the words of a language", cdef: "汇集字词并解释其音义源流的工具书", tags: ["学习", "工具"] },

  // Nature & Environment
  "sun": { simp: "太阳", trad: "太陽", pinyin: "tài yáng", def: "the star around which the earth orbits", cdef: "太阳系的中心恒星", tags: ["天文", "自然"] },
  "moon": { simp: "月亮", trad: "月亮", pinyin: "yuè liang", def: "the natural satellite of the earth", cdef: "地球唯一的天然卫星", tags: ["天文", "自然"] },
  "star": { simp: "星星", trad: "星星", pinyin: "xīng xing", def: "a fixed luminous point in the night sky", cdef: "夜晚天空中发光的恒星天体", tags: ["天文", "自然"] },
  "earth": { simp: "地球", trad: "地球", pinyin: "dì qiú", def: "the planet on which we live", cdef: "人类居住的行星", tags: ["天文", "自然"] },
  "mountain": { simp: "高山", trad: "高山", pinyin: "gāo shān", def: "a large natural elevation of the earth's surface", cdef: "高耸的地形地貌", tags: ["地理", "自然"] },
  "river": { simp: "河流", trad: "河流", pinyin: "hé liú", def: "a large natural stream of water flowing in a channel to the sea or a lake", cdef: "沿地表凹槽流动的水流通道", tags: ["地理", "自然"] },
  "ocean": { simp: "海洋", trad: "海洋", pinyin: "hǎi yáng", def: "a very large expanse of sea", cdef: "地球表面连通的广大咸水水体", tags: ["自然", "地理"] },
  "forest": { simp: "森林", trad: "森林", pinyin: "sēn lín", def: "a large area covered chiefly with trees and undergrowth", cdef: "大面积树木茂密生长的生态系统", tags: ["自然", "生态"] },
  "rain": { simp: "雨", trad: "雨", pinyin: "yǔ", def: "moisture condensed from the atmosphere that falls visibly in separate drops", cdef: "大气中水汽凝结降落的水滴", tags: ["天气", "自然"] },
  "cloud": { simp: "云", trad: "雲", pinyin: "yún", def: "a visible mass of condensed water vapor floating in the atmosphere", cdef: "大气中漂浮的微小水滴或冰晶聚集体", tags: ["天气", "自然"] },
  "wind": { simp: "风", trad: "風", pinyin: "fēng", def: "the perceptible natural movement of the air", cdef: "空气水平流动形成的自然现象", tags: ["天气", "自然"] },
  "climate": { simp: "气候", trad: "氣候", pinyin: "qì hòu", def: "the weather conditions prevailing in an area in general or over a long period", cdef: "某一地区长期天气的综合表现", tags: ["地理", "自然"] },
  "earthquake": { simp: "地震", trad: "地震", pinyin: "dì zhèn", def: "a sudden and violent shaking of the ground, sometimes causing great destruction", cdef: "地壳快速释放能量引起的地面震动", tags: ["自然", "灾害"] },
  "plant": { simp: "植物", trad: "植物", pinyin: "zhí wù", def: "a living organism of the kind exemplified by trees, shrubs, herbs, grasses", cdef: "有细胞壁、能进行光合作用的多细胞生命体", tags: ["生物", "自然"] },
  "flower": { simp: "花朵", trad: "花朵", pinyin: "huā duǒ", def: "the seed-bearing part of a plant, consisting of reproductive organs", cdef: "种子植物的繁殖器官", tags: ["植物", "自然"] },
  "tree": { simp: "树木", trad: "樹木", pinyin: "shù mù", def: "a woody perennial plant, typically having a single stem or trunk growing to a considerable height", cdef: "具有木质主干的多年生植物", tags: ["植物", "自然"] },
  "forest": { simp: "森林", trad: "森林", pinyin: "sēn lín", def: "a large area covered chiefly with trees and undergrowth", cdef: "树木繁茂的林地", tags: ["生态", "自然"] },

  // Animals
  "dog": { simp: "狗", trad: "狗", pinyin: "gǒu", def: "a domesticated carnivorous mammal with a bark", cdef: "人类忠实的伴侣动物", tags: ["动物", "宠物"] },
  "bird": { simp: "鸟", trad: "鳥", pinyin: "niǎo", def: "a warm-blooded egg-laying vertebrate distinguished by the possession of feathers, wings, and a beak", cdef: "有羽毛和翅膀的卵生脊椎动物", tags: ["动物", "自然"] },
  "fish": { simp: "鱼", trad: "魚", pinyin: "yú", def: "a limbless cold-blooded vertebrate animal with gills and fins living wholly in water", cdef: "生活在水中有鳃和鳍的脊椎动物", tags: ["动物", "自然"] },
  "horse": { simp: "马", trad: "馬", pinyin: "mǎ", def: "a large plant-eating domesticated mammal with solid hooves and a flowing mane and tail", cdef: "有蹄类食草家畜，善于奔跑", tags: ["动物", "自然"] },
  "tiger": { simp: "老虎", trad: "老虎", pinyin: "lǎo hǔ", def: "a very large solitary cat with a yellow-brown coat striped with black", cdef: "大型猫科食肉动物，百兽之王", tags: ["动物", "自然"] },
  "panda": { simp: "大熊猫", trad: "大熊貓", pinyin: "dà xióng māo", def: "a large bearlike mammal with characteristic black and white markings, native to bamboo forests in China", cdef: "中国特有国宝级珍稀哺乳动物", tags: ["动物", "自然"] },
  "elephant": { simp: "大象", trad: "大象", pinyin: "dà xiàng", def: "a very large plant-eating mammal with a prehensile trunk, long curved ivory tusks, and large ears", cdef: "陆地上现存最大的长鼻目哺乳动物", tags: ["动物", "自然"] },

  // Daily Life, Society, Technology
  "computer": { simp: "电脑", trad: "電腦", pinyin: "diàn nǎo", def: "an electronic device for storing and processing data", cdef: "用于高速计算和数据处理的电子设备", tags: ["科技", "日常"] },
  "internet": { simp: "互联网", trad: "互聯網", pinyin: "hù lián wǎng", def: "a global computer network providing a variety of information and communication facilities", cdef: "全球互联的计算机网络系统", tags: ["科技", "通信"] },
  "telephone": { simp: "电话", trad: "電話", pinyin: "diàn huà", def: "a system for transmitting voices over a distance using wire or radio", cdef: "远距离传输语音信号的通信工具", tags: ["科技", "日常"] },
  "friend": { simp: "朋友", trad: "朋友", pinyin: "péng you", def: "a person whom one knows and with whom one has a bond of mutual affection", cdef: "志同道合、互相信赖交往的人", tags: ["人物", "社交"] },
  "family": { simp: "家庭", trad: "家庭", pinyin: "jiā tíng", def: "a group consisting of parents and children living together in a household", cdef: "由血缘或婚姻关系构成的社会基本单位", tags: ["社会", "生活"] },
  "society": { simp: "社会", trad: "社會", pinyin: "shè huì", def: "the aggregate of people living together in a more or less ordered community", cdef: "人与人之间按照一定关系结合的共同体", tags: ["社会", "人文"] },
  "culture": { simp: "文化", trad: "文化", pinyin: "wén huà", def: "the arts and other manifestations of human intellectual achievement regarded collectively", cdef: "人类在社会历史实践中所创造的物质与精神财富", tags: ["人文", "社会"] },
  "music": { simp: "音乐", trad: "音樂", pinyin: "yīn yuè", def: "vocal or instrumental sounds combined in such a way as to produce beauty of form, harmony, and expression of emotion", cdef: "通过有组织的声响表达人类情感的艺术", tags: ["艺术", "娱乐"] },
  "food": { simp: "食物", trad: "食物", pinyin: "shí wù", def: "any nutritious substance that people or animals eat or drink", cdef: "供人或生物食用维持生命活动的营养品", tags: ["生活", "健康"] },
  "water": { simp: "水", trad: "水", pinyin: "shuǐ", def: "a colorless, transparent, odorless liquid that forms the seas, lakes, rivers, and rain", cdef: "生命必需的无色无味液体化合物", tags: ["自然", "生活"] },
  "hospital": { simp: "医院", trad: "醫院", pinyin: "yī yuàn", def: "an institution providing medical and surgical treatment and nursing care", cdef: "提供医疗诊治和护理服务的专门机构", tags: ["健康", "生活"] },
  "doctor": { simp: "医生", trad: "醫生", pinyin: "yī shēng", def: "a person who is qualified to treat people who are ill", cdef: "掌握医药卫生知识治病救人的专业人员", tags: ["职业", "健康"] },
  "book": { simp: "书本", trad: "書本", pinyin: "shū běn", def: "a written or printed work consisting of pages glued or sewn together along one side", cdef: "装订成册的文字记载物", tags: ["学习", "生活"] },
  "pencil": { simp: "铅笔", trad: "鉛筆", pinyin: "qiān bǐ", def: "an instrument for writing or drawing, consisting of a thin stick of graphite or a similar substance enclosed in a long thin piece of wood", cdef: "用于书写或绘图的铅芯文具", tags: ["学习", "工具"] },
  "paper": { simp: "纸张", trad: "紙張", pinyin: "zhǐ zhāng", def: "material manufactured in thin sheets from the pulp of wood or other fibrous substances, used for writing, drawing, or printing on, or as wrapping material", cdef: "用于书写、印刷或包装的薄片纤维制品", tags: ["学习", "用品"] },
  "building": { simp: "建筑", trad: "建築", pinyin: "jiàn zhù", def: "a structure with a roof and walls, such as a house, school, store, or factory", cdef: "供人居住、工作或开展活动的构筑物", tags: ["城市", "艺术"] },
  "city": { simp: "城市", trad: "城市", pinyin: "chéng shì", def: "a large town", cdef: "人口密集、工商业发达的区域中心", tags: ["社会", "地理"] },
  "country": { simp: "国家", trad: "國家", pinyin: "guó jiā", def: "a nation with its own government, occupying a particular territory", cdef: "拥有主权和固定领土的政治共同体", tags: ["政治", "社会"] },
  "peace": { simp: "和平", trad: "和平", pinyin: "hé píng", def: "freedom from disturbance; tranquility; state of mutual harmony", cdef: "没有战争和敌对冲突的状态", tags: ["人文", "政治"] },
  "future": { simp: "未来", trad: "未來", pinyin: "wèi lái", def: "at a later time; going or likely to happen or exist", cdef: "尚未到来的时间或前景", tags: ["哲学", "时间"] },
  "time": { simp: "时间", trad: "時間", pinyin: "shí jiān", def: "the indefinite continued progress of existence and events in the past, present, and future", cdef: "物质运动变化的持续性顺序", tags: ["哲学", "物理"] }
};

// Common Chinese Characters to Pinyin mapping for on-the-fly pinyin annotation
const CHAR_PINYIN_MAP = {
  "大": "dà", "学": "xué", "校": "xiào", "教": "jiào", "科": "kē", "书": "shū", "物": "wù", "理": "lǐ",
  "鞋": "xié", "化": "huà", "生": "shēng", "三": "sān", "角": "jiǎo", "形": "xíng", "光": "guāng", "合": "hé",
  "作": "zuò", "用": "yòng", "动": "dòng", "经": "jīng", "济": "jì", "的": "de", "社": "shè", "区": "qū",
  "群": "qún", "火": "huǒ", "山": "shān", "岩": "yán", "浆": "jiāng", "猫": "māo", "人": "rén", "中": "zhōng",
  "国": "guó", "文": "wén", "字": "zì", "语": "yǔ", "言": "yán", "天": "tiān", "地": "dì", "日": "rì",
  "月": "yuè", "水": "shuǐ", "风": "fēng", "云": "yún", "雨": "yǔ", "木": "mù", "林": "lín", "森": "sēn",
  "太": "tài", "阳": "yáng", "星": "xīng", "高": "gāo", "海": "hǎi", "洋": "yáng", "河": "hé", "流": "liú",
  "电": "diàn", "脑": "nǎo", "话": "huà", "网": "wǎng", "互": "hù", "联": "lián", "朋": "péng", "友": "yǒu",
  "家": "jiā", "庭": "tíng", "医": "yī", "院": "yuàn", "师": "shī", "老": "lǎo", "孩": "hái", "子": "zǐ",
  "狗": "gǒu", "鸟": "niǎo", "鱼": "yú", "马": "mǎ", "虎": "hǔ", "象": "xiàng", "熊": "xióng", "时": "shí",
  "间": "jiān", "未": "wèi", "来": "lái", "和": "hé", "平": "píng", "城": "chéng", "市": "shì", "建": "jiàn",
  "筑": "zhù", "笔": "bǐ", "铅": "qiān", "张": "zhāng", "纸": "zhǐ", "图": "tú", "馆": "guǎn", "实": "shí",
  "验": "yàn", "室": "shì", "望": "wàng", "远": "yuǎn", "镜": "jìng", "显": "xiǎn", "微": "wēi", "原": "yuán",
  "分": "fēn", "重": "zhòng", "力": "lì", "量": "liàng", "能": "néng", "数": "shù", "几": "jǐ", "何": "hé",
  "史": "shǐ", "历": "lì", "艺": "yì", "术": "shù", "音": "yīn", "乐": "yuè", "食": "shí", "品": "pǐn",
  "好": "hǎo", "看": "kàn", "听": "tīng", "说": "shuō", "写": "xiě", "读": "dú", "走": "zǒu", "跑": "pǎo",
  "飞": "fēi", "爱": "ài", "想": "xiǎng", "知": "zhī", "道": "dào", "心": "xīn", "手": "shǒu", "足": "zú"
};

// Simplified to Traditional converter table for common characters
const SIMP_TO_TRAD = {
  "大学": "大學", "教科书": "教科書", "物理": "物理", "鞋": "鞋", "化学": "化學",
  "生物学": "生物學", "三角形": "三角形", "光合作用": "光合作用", "动物": "動物",
  "经济的": "經濟的", "社区": "社群", "火山": "火山", "岩浆": "岩漿", "猫": "貓",
  "学校": "學校", "老师": "老師", "学生": "學生", "图书馆": "圖書館", "望远镜": "望遠鏡",
  "显微镜": "顯微鏡", "实验室": "實驗室", "实验": "實驗", "数学": "數學", "几何": "幾何",
  "文学": "文學", "语言": "語言", "历史": "歷史", "太阳": "太陽", "月亮": "月亮",
  "星星": "星星", "海洋": "海洋", "云": "雲", "风": "風", "气候": "氣候", "地震": "地震",
  "鸟": "鳥", "鱼": "魚", "马": "馬", "大熊猫": "大熊貓", "电脑": "電腦", "互联网": "互聯網",
  "电话": "電話", "社会": "社會", "音乐": "音樂", "医院": "醫院", "医生": "醫生",
  "铅笔": "鉛筆", "纸张": "紙張", "建筑": "建築", "国家": "國家", "时间": "時間", "未来": "未來",
  "学": "學", "书": "書", "化": "化", "动": "動", "经": "經", "济": "濟", "区": "區",
  "群": "群", "浆": "漿", "猫": "貓", "国": "國", "语": "語", "门": "門", "飞": "飛",
  "爱": "愛", "写": "寫", "听": "聽", "实": "實", "验": "驗", "图": "圖", "馆": "館",
  "气": "氣", "电": "電", "车": "車", "马": "馬", "鸟": "鳥", "鱼": "魚", "风": "風"
};

/**
 * Converts a Chinese string to pinyin using character mapping
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
 * Smart Lookup for word auto-completion (mirrors original Excel Google Sheets logic)
 * Takes an English word or Chinese character and returns complete structured metadata.
 */
async function smartAutoFill(inputWord) {
  if (!inputWord || !inputWord.trim()) return null;
  const cleanInput = inputWord.trim().toLowerCase();

  // 1. Check in default glossary
  const existingInGlossary = DEFAULT_GLOSSARY_DATA.find(
    item => item.word.toLowerCase() === cleanInput ||
            item.simp === inputWord.trim() ||
            item.trad === inputWord.trim()
  );
  if (existingInGlossary) {
    return {
      word: existingInGlossary.word,
      simp: existingInGlossary.simp,
      trad: existingInGlossary.trad,
      pinyin: existingInGlossary.pinyin,
      definition: existingInGlossary.definition,
      chineseDef: existingInGlossary.chineseDef,
      tags: existingInGlossary.tags
    };
  }

  // 2. Check in builtin dictionary
  if (BUILTIN_DICTIONARY[cleanInput]) {
    const dictItem = BUILTIN_DICTIONARY[cleanInput];
    return {
      word: cleanInput,
      simp: dictItem.simp,
      trad: dictItem.trad || convertToTraditional(dictItem.simp),
      pinyin: dictItem.pinyin,
      definition: dictItem.def,
      chineseDef: dictItem.cdef,
      tags: dictItem.tags
    };
  }

  // 3. Check if input is Chinese
  for (const [eng, val] of Object.entries(BUILTIN_DICTIONARY)) {
    if (val.simp === inputWord.trim() || val.trad === inputWord.trim()) {
      return {
        word: eng,
        simp: val.simp,
        trad: val.trad || convertToTraditional(val.simp),
        pinyin: val.pinyin,
        definition: val.def,
        chineseDef: val.cdef,
        tags: val.tags
      };
    }
  }

  // 4. Online Translation API fallback (MyMemory API, free & CORS enabled)
  try {
    const isChinese = /[\u4e00-\u9fa5]/.test(cleanInput);
    const langPair = isChinese ? "zh-CN|en" : "en|zh-CN";
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanInput)}&langpair=${langPair}`;
    
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.responseData && data.responseData.translatedText) {
        const translated = data.responseData.translatedText.trim();
        if (isChinese) {
          return {
            word: translated.toLowerCase(),
            simp: inputWord.trim(),
            trad: convertToTraditional(inputWord.trim()),
            pinyin: convertToPinyin(inputWord.trim()),
            definition: `English translation: ${translated}`,
            chineseDef: `中文词汇：${inputWord.trim()}`,
            tags: ["新词", "自定"]
          };
        } else {
          return {
            word: cleanInput,
            simp: translated,
            trad: convertToTraditional(translated),
            pinyin: convertToPinyin(translated),
            definition: `Definition of ${cleanInput}`,
            chineseDef: `中文翻译：${translated}`,
            tags: ["新词", "自定"]
          };
        }
      }
    }
  } catch (err) {
    console.warn("Online translation fallback timed out or unavailable, using heuristic fallback.", err);
  }

  // 5. Heuristic fallback
  const isChinese = /[\u4e00-\u9fa5]/.test(cleanInput);
  if (isChinese) {
    return {
      word: "",
      simp: inputWord.trim(),
      trad: convertToTraditional(inputWord.trim()),
      pinyin: convertToPinyin(inputWord.trim()),
      definition: "",
      chineseDef: "",
      tags: ["自定"]
    };
  } else {
    return {
      word: cleanInput,
      simp: "",
      trad: "",
      pinyin: "",
      definition: "",
      chineseDef: "",
      tags: ["自定"]
    };
  }
}
