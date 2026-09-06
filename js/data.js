/**
 * Chinese Glossary 2026 - Default Vocabulary Data
 * Extracted directly from Chinese Glossary 2026.xlsx
 */
const DEFAULT_GLOSSARY_DATA = [
  {
    id: "word_1",
    word: "college",
    simp: "大学",
    trad: "大學",
    pinyin: "dà xué",
    definition: "an independent institution of higher learning offering a course of general studies leading to a bachelor's degree",
    chineseDef: "提供通识课程并授予学士学位的高等教育学府",
    tags: ["教育", "学术", "生活"],
    mastered: false
  },
  {
    id: "word_2",
    word: "textbook",
    simp: "教科书",
    trad: "教科書",
    pinyin: "jiào kē shū",
    definition: "a book used in the study of a subject",
    chineseDef: "在学科学习中使用的教学用书，教材",
    tags: ["教育", "学术", "学习用品"],
    mastered: false
  },
  {
    id: "word_3",
    word: "Physics",
    simp: "物理",
    trad: "物理",
    pinyin: "wù lǐ",
    definition: "a science that deals with matter and energy and their interactions",
    chineseDef: "研究物质、能量及其相互作用规律的自然科学",
    tags: ["科学", "学术", "学科"],
    mastered: false
  },
  {
    id: "word_4",
    word: "shoe",
    simp: "鞋",
    trad: "鞋",
    pinyin: "xié",
    definition: "an outer covering for the human foot typically having a thick or stiff sole with an attached heel and an upper part of lighter material (such as leather)",
    chineseDef: "人类脚部穿着的外用防护服饰，通常有鞋底和鞋面",
    tags: ["日常", "服饰"],
    mastered: false
  },
  {
    id: "word_5",
    word: "Chemistry",
    simp: "化学",
    trad: "化學",
    pinyin: "huà xué",
    definition: "a science that deals with the composition, structure, and properties of substances and with the transformations that they undergo",
    chineseDef: "研究物质的组成、结构、性质以及变化规律的自然科学",
    tags: ["科学", "学术", "学科"],
    mastered: false
  },
  {
    id: "word_6",
    word: "biology",
    simp: "生物学",
    trad: "生物學",
    pinyin: "shēng wù xué",
    definition: "a branch of knowledge that deals with living organisms and vital processes",
    chineseDef: "研究生命现象、生物机体及其生命活动过程的科学",
    tags: ["科学", "学术", "生命"],
    mastered: false
  },
  {
    id: "word_7",
    word: "triangle",
    simp: "三角形",
    trad: "三角形",
    pinyin: "sān jiǎo xíng",
    definition: "a polygon having three sides compare spherical triangle",
    chineseDef: "由三条首尾相接的线段组成的封闭几何图形",
    tags: ["数学", "几何", "形状"],
    mastered: false
  },
  {
    id: "word_8",
    word: "photosynthesis",
    simp: "光合作用",
    trad: "光合作用",
    pinyin: "guāng hé zuò yòng",
    definition: "synthesis of chemical compounds with the aid of radiant energy and especially light",
    chineseDef: "植物、藻类利用光能将水和二氧化碳转化为有机物并释放氧气的过程",
    tags: ["生物", "科学", "自然"],
    mastered: false
  },
  {
    id: "word_9",
    word: "animal",
    simp: "动物",
    trad: "動物",
    pinyin: "dòng wù",
    definition: "any of a kingdom (Animalia) of living things including many-celled organisms, lacking chlorophyll, requiring food materials, and possessing spontaneous movement",
    chineseDef: "生物界的一大类，能感觉、有运动能力、以有机物为食的生命体",
    tags: ["自然", "生物", "生活"],
    mastered: false
  },
  {
    id: "word_10",
    word: "economic",
    simp: "经济的",
    trad: "經濟的",
    pinyin: "jīng jì de",
    definition: "of, relating to, or based on the production, distribution, and consumption of goods and services",
    chineseDef: "与商品和劳务的生产、分配、消费相关的，经济上的",
    tags: ["社会", "学术", "商务"],
    mastered: false
  },
  {
    id: "word_11",
    word: "communities",
    simp: "社区",
    trad: "社群",
    pinyin: "shè qū",
    tradPinyin: "shè qún",
    definition: "a unified body of individuals living in a particular area or having common characteristics",
    chineseDef: "生活在同一地区或具有共同利益、背景的人群社会共同体",
    tags: ["社会", "生活", "人文"],
    mastered: false
  },
  {
    id: "word_12",
    word: "volcano",
    simp: "火山",
    trad: "火山",
    pinyin: "huǒ shān",
    definition: "a vent in the crust of the earth or another planet or a moon from which usually molten or hot rock and steam issue",
    chineseDef: "地壳内部岩浆喷出地表堆积形成的高地或喷出口",
    tags: ["地理", "自然", "地球科学"],
    mastered: false
  },
  {
    id: "word_13",
    word: "magma",
    simp: "岩浆",
    trad: "岩漿",
    pinyin: "yán jiāng",
    definition: "molten or semi-molten natural material from which all igneous rocks are formed, located beneath the Earth's surface",
    chineseDef: "地表以下深处高温熔融的硅酸盐流体",
    tags: ["地理", "科学", "地质"],
    mastered: false
  },
  {
    id: "word_14",
    word: "cat",
    simp: "猫",
    trad: "貓",
    pinyin: "māo",
    definition: "a carnivorous mammal (Felis catus) long domesticated as a pet and for catching rats and mice",
    chineseDef: "体型小、毛茸茸的食肉哺乳动物，常作为家养宠物",
    tags: ["动物", "生活", "宠物"],
    mastered: false
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_GLOSSARY_DATA };
}
