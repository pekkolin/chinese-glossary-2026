/**
 * Chinese Glossary 2026 - Master Application Logic
 * Integrates Vocabulary Management, Dual-Coding Flashcards, Adaptive Quizzes,
 * Web Speech TTS, Smart Auto-Completion, and Pedagogical Printable Worksheets.
 */

(function () {
  'use strict';

  // --- State ---
  const STORAGE_KEY = 'chinese_glossary_2026_data';
  const SETTINGS_KEY = 'chinese_glossary_2026_settings';

  let glossaryData = [];
  let settings = {
    charMode: 'simp',      // 'simp' | 'trad'
    showPinyin: true,      // boolean
    speechRate: 1.0,       // 0.75 | 1.0 | 1.25
    activeTab: 'pane-glossary'
  };

  // Flashcard State
  let flashcardDeck = [];
  let currentCardIndex = 0;
  let isCardFlipped = false;
  let flashcardMode = 'EN_TO_ZH'; // 'EN_TO_ZH' | 'ZH_TO_EN' | 'AUDIO_TO_ZH'

  // Quiz State
  let currentQuizType = 'mc'; // 'mc' | 'match'
  let quizQuestions = [];
  let currentQuestionIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;

  // Match Game State
  let matchCards = [];
  let firstSelectedMatch = null;
  let secondSelectedMatch = null;
  let matchMoves = 0;
  let matchPairsFound = 0;
  let matchTimer = null;
  let matchSeconds = 0;

  // Worksheet State
  let worksheetType = 'tianzige'; // 'tianzige' | 'quiz' | 'cutout'

  // --- Initialization ---
  function initApp() {
    loadSettings();
    loadGlossaryData();
    setupEventListeners();
    updateUIFromSettings();
    populateWordSuggestions();
    renderGlossaryTable();
    updateBadgeCounts();
    initVoices();
  }

  function populateWordSuggestions() {
    const datalist = document.getElementById('word-suggestions');
    if (!datalist) return;
    datalist.innerHTML = '';
    const frag = document.createDocumentFragment();
    const seen = new Set();
    glossaryData.forEach(item => {
      if (item.word && !seen.has(item.word.toLowerCase())) {
        seen.add(item.word.toLowerCase());
        const opt = document.createElement('option');
        opt.value = item.word;
        opt.label = `${item.simp} (${item.pinyin || ''})`;
        frag.appendChild(opt);
      }
    });
    datalist.appendChild(frag);
  }

  // --- Local Storage Management ---
  function loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        settings = Object.assign(settings, JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading settings', e);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  }

  function loadGlossaryData() {
    const masterList = (typeof getMasterVocabulary === 'function')
      ? getMasterVocabulary()
      : (typeof DEFAULT_GLOSSARY_DATA !== 'undefined' ? DEFAULT_GLOSSARY_DATA : []);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedList = JSON.parse(saved);
        // Build map of saved mastery status & keep any custom words
        const savedMap = new Map();
        const customWords = [];
        for (const item of savedList) {
          if (item.id && (item.id.startsWith('word_') || item.id.startsWith('ap_') || item.id.startsWith('u0_') || item.id.startsWith('intro_'))) {
            savedMap.set(item.id, item.mastered);
          } else {
            customWords.push(item);
          }
        }
        // Clone masterList and apply saved mastery status
        glossaryData = masterList.map(item => ({
          ...item,
          mastered: savedMap.has(item.id) ? !!savedMap.get(item.id) : (item.mastered || false)
        }));
        // Append user-created custom words
        glossaryData.push(...customWords);
      } else {
        glossaryData = JSON.parse(JSON.stringify(masterList));
        saveGlossaryData();
      }
    } catch (e) {
      console.error('Error loading glossary data', e);
      glossaryData = JSON.parse(JSON.stringify(masterList));
    }
  }

  function saveGlossaryData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(glossaryData));
      updateBadgeCounts();
    } catch (e) {
      console.error('Error saving glossary data', e);
    }
  }

  function resetGlossaryData() {
    if (confirm('确定要恢复为《Chinese Glossary 2026》及 AP Chinese Unit 1-6 完整词库（共 728 词）吗？您自建的新增词汇将被重置。')) {
      const masterList = (typeof getMasterVocabulary === 'function')
        ? getMasterVocabulary()
        : DEFAULT_GLOSSARY_DATA;
      glossaryData = JSON.parse(JSON.stringify(masterList));
      saveGlossaryData();
      populateWordSuggestions();
      renderGlossaryTable();
      showToast('已成功恢复出厂 728 词完整词库！');
    }
  }

  // --- Speech Synthesis (Web Speech API) ---
  let synth = window.speechSynthesis;
  let availableVoices = [];

  function initVoices() {
    if (!synth) return;
    function populate() {
      availableVoices = synth.getVoices();
    }
    populate();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populate;
    }
  }

  function speakText(text, lang = 'zh-CN', onEndCallback = null) {
    if (!synth) {
      alert('您的浏览器暂不支持语音合成朗读功能。');
      return;
    }
    synth.cancel(); // Stop current speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speechRate || 1.0;
    utterance.lang = lang;

    // Find best matching voice
    if (availableVoices.length > 0) {
      const preferred = availableVoices.find(v => v.lang === lang || v.lang.replace('_', '-').startsWith(lang.slice(0, 2)));
      if (preferred) utterance.voice = preferred;
    }

    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }

    synth.speak(utterance);
  }

  // --- DOM & Navigation Events ---
  function setupEventListeners() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = btn.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });

    // Global Settings Controls
    const charModeSelect = document.getElementById('select-char-mode');
    if (charModeSelect) {
      charModeSelect.value = settings.charMode;
      charModeSelect.addEventListener('change', (e) => {
        settings.charMode = e.target.value;
        saveSettings();
        updateUnitSelectLabels(settings.charMode);
        renderGlossaryTable();
        if (settings.activeTab === 'pane-flashcards') renderFlashcard();
        if (settings.activeTab === 'pane-worksheet') renderWorksheet();
      });
    }

    const pinyinToggle = document.getElementById('checkbox-show-pinyin');
    if (pinyinToggle) {
      pinyinToggle.checked = settings.showPinyin;
      pinyinToggle.addEventListener('change', (e) => {
        settings.showPinyin = e.target.checked;
        saveSettings();
        renderGlossaryTable();
        if (settings.activeTab === 'pane-flashcards') renderFlashcard();
        if (settings.activeTab === 'pane-worksheet') renderWorksheet();
      });
    }

    const speechRateSelect = document.getElementById('select-speech-rate');
    if (speechRateSelect) {
      speechRateSelect.value = settings.speechRate.toString();
      speechRateSelect.addEventListener('change', (e) => {
        settings.speechRate = parseFloat(e.target.value);
        saveSettings();
      });
    }

    // Search & Filter
    const searchInput = document.getElementById('table-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderGlossaryTable();
      });
    }

    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) {
      filterStatus.addEventListener('change', () => {
        renderGlossaryTable();
      });
    }

    const filterUnit = document.getElementById('filter-unit');
    if (filterUnit) {
      filterUnit.addEventListener('change', () => {
        renderGlossaryTable();
      });
    }

    // Smart Add Modal
    const btnOpenAddModal = document.getElementById('btn-open-add-modal');
    if (btnOpenAddModal) {
      btnOpenAddModal.addEventListener('click', openAddModal);
    }

    const btnCloseAddModal = document.getElementById('btn-close-add-modal');
    if (btnCloseAddModal) {
      btnCloseAddModal.addEventListener('click', closeAddModal);
    }

    const btnCancelAddModal = document.getElementById('btn-cancel-add-modal');
    if (btnCancelAddModal) {
      btnCancelAddModal.addEventListener('click', closeAddModal);
    }

    const formAddWord = document.getElementById('form-add-word');
    if (formAddWord) {
      formAddWord.addEventListener('submit', handleAddWordSubmit);
    }

    // Smart Auto Complete Trigger in Modal
    const btnTriggerAutoFill = document.getElementById('btn-trigger-autofill');
    if (btnTriggerAutoFill) {
      btnTriggerAutoFill.addEventListener('click', () => {
        const val = document.getElementById('modal-input-word')?.value;
        handleSmartAutoFill(val, true);
      });
    }

    const inputWord = document.getElementById('modal-input-word');
    if (inputWord) {
      let debounceTimer = null;
      inputWord.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          handleSmartAutoFill(inputWord.value, true);
        }, 350);
      });
      inputWord.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          clearTimeout(debounceTimer);
          handleSmartAutoFill(inputWord.value, true);
        }
      });
      inputWord.addEventListener('change', () => {
        handleSmartAutoFill(inputWord.value, true);
      });
    }

    // Reset Data Button
    const btnResetData = document.getElementById('btn-reset-data');
    if (btnResetData) {
      btnResetData.addEventListener('click', resetGlossaryData);
    }

    // Export Dropdown Trigger
    const btnExportData = document.getElementById('btn-export-data');
    if (btnExportData) {
      btnExportData.addEventListener('click', showExportOptions);
    }

    // Flashcard Controls
    const cardScene = document.getElementById('flashcard-scene');
    if (cardScene) {
      cardScene.addEventListener('click', toggleCardFlip);
    }

    const btnPrevCard = document.getElementById('btn-prev-card');
    if (btnPrevCard) {
      btnPrevCard.addEventListener('click', prevFlashcard);
    }

    const btnNextCard = document.getElementById('btn-next-card');
    if (btnNextCard) {
      btnNextCard.addEventListener('click', nextFlashcard);
    }

    const btnMarkMastered = document.getElementById('btn-mark-mastered');
    if (btnMarkMastered) {
      btnMarkMastered.addEventListener('click', () => markCurrentCard(true));
    }

    const btnMarkReview = document.getElementById('btn-mark-review');
    if (btnMarkReview) {
      btnMarkReview.addEventListener('click', () => markCurrentCard(false));
    }

    const selectCardMode = document.getElementById('select-card-mode');
    if (selectCardMode) {
      selectCardMode.addEventListener('change', (e) => {
        flashcardMode = e.target.value;
        isCardFlipped = false;
        renderFlashcard();
      });
    }

    const selectCardDeckFilter = document.getElementById('select-card-deck-filter');
    if (selectCardDeckFilter) {
      selectCardDeckFilter.addEventListener('change', () => {
        buildFlashcardDeck();
        currentCardIndex = 0;
        isCardFlipped = false;
        renderFlashcard();
      });
    }

    const selectCardUnit = document.getElementById('select-card-unit');
    if (selectCardUnit) {
      selectCardUnit.addEventListener('change', () => {
        buildFlashcardDeck();
        currentCardIndex = 0;
        isCardFlipped = false;
        renderFlashcard();
      });
    }

    // Keyboard Shortcuts for Flashcards
    window.addEventListener('keydown', (e) => {
      if (settings.activeTab !== 'pane-flashcards') return;
      if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleCardFlip();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevFlashcard();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextFlashcard();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        playCurrentCardAudio();
      }
    });

    // Quiz Sub-tabs
    document.querySelectorAll('.quiz-subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.quiz-subtab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentQuizType = btn.getAttribute('data-quiz');
        if (currentQuizType === 'mc') {
          document.getElementById('quiz-mc-view').style.display = 'block';
          document.getElementById('quiz-match-view').style.display = 'none';
          initMultipleChoiceQuiz();
        } else {
          document.getElementById('quiz-mc-view').style.display = 'none';
          document.getElementById('quiz-match-view').style.display = 'block';
          initMatchGame();
        }
      });
    });

    const selectQuizUnit = document.getElementById('select-quiz-unit');
    if (selectQuizUnit) {
      selectQuizUnit.addEventListener('change', () => {
        if (currentQuizType === 'mc') {
          initMultipleChoiceQuiz();
        } else {
          initMatchGame();
        }
      });
    }

    // Quiz Restart Button
    const btnRestartQuiz = document.getElementById('btn-restart-quiz');
    if (btnRestartQuiz) {
      btnRestartQuiz.addEventListener('click', initMultipleChoiceQuiz);
    }

    // Match Restart Button
    const btnRestartMatch = document.getElementById('btn-restart-match');
    if (btnRestartMatch) {
      btnRestartMatch.addEventListener('click', initMatchGame);
    }

    // Worksheet Generator Controls
    const selectWorksheetType = document.getElementById('select-worksheet-type');
    if (selectWorksheetType) {
      selectWorksheetType.addEventListener('change', (e) => {
        worksheetType = e.target.value;
        renderWorksheet();
      });
    }

    const selectWorksheetUnit = document.getElementById('select-worksheet-unit');
    if (selectWorksheetUnit) {
      selectWorksheetUnit.addEventListener('change', renderWorksheet);
    }

    const selectWorksheetFilter = document.getElementById('select-worksheet-filter');
    if (selectWorksheetFilter) {
      selectWorksheetFilter.addEventListener('change', renderWorksheet);
    }

    const btnPrintWorksheet = document.getElementById('btn-print-worksheet');
    if (btnPrintWorksheet) {
      btnPrintWorksheet.addEventListener('click', () => {
        window.print();
      });
    }
  }

  function updateUIFromSettings() {
    const charModeSelect = document.getElementById('select-char-mode');
    if (charModeSelect) charModeSelect.value = settings.charMode;

    const pinyinToggle = document.getElementById('checkbox-show-pinyin');
    if (pinyinToggle) pinyinToggle.checked = settings.showPinyin;

    const speechRateSelect = document.getElementById('select-speech-rate');
    if (speechRateSelect) speechRateSelect.value = settings.speechRate.toString();

    updateUnitSelectLabels(settings.charMode);
  }

  function getFormattedUnitTitle(unitId, fallback = '', charMode = 'simp') {
    const isTrad = charMode === 'trad';
    const map = {
      u0: isTrad ? "Unit 0: 基礎導論預備 (Introduction)" : "Unit 0: 基础导论预备 (Introduction)",
      core: isTrad ? "Unit 0: 基礎導論預備 (Introduction)" : "Unit 0: 基础导论预备 (Introduction)",
      u1: isTrad ? "Unit 1: 家庭與社區 (Families & Communities)" : "Unit 1: 家庭与社区 (Families and Communities)",
      u2: isTrad ? "Unit 2: 語言與文化 (Language & Culture)" : "Unit 2: 语言与文化 (Language and Culture)",
      u3: isTrad ? "Unit 3: 藝術與創意 (Art & Creativity)" : "Unit 3: 艺术与创意 (Art and Creativity)",
      u4: isTrad ? "Unit 4: 科學與科技 (Science & Technology)" : "Unit 4: 科学与科技 (Science and Technology)",
      u5: isTrad ? "Unit 5: 當代生活 (Contemporary Life)" : "Unit 5: 当代生活 (Contemporary Life)",
      u6: isTrad ? "Unit 6: 全球脈絡 (Global Contexts)" : "Unit 6: 全球脉络 (Global Contexts)"
    };
    if (unitId && map[unitId]) {
      return map[unitId];
    }
    return fallback || '';
  }

  function updateUnitSelectLabels(charMode = 'simp') {
    const isTrad = charMode === 'trad';
    const unitLabels = {
      all: isTrad ? "📚 全套詞彙庫 (All Units · 837 詞)" : "📚 全套词汇库 (All Units · 837 词)",
      u0: isTrad ? "📖 Unit 0: 基礎導論預備 (Introduction · 123 詞)" : "📖 Unit 0: 基础导论预备 (Introduction · 123 词)",
      u1: isTrad ? "👨‍👩‍👧 Unit 1: 家庭與社區 (153 詞)" : "👨‍👩‍👧 Unit 1: 家庭与社区 (153 词)",
      u2: isTrad ? "🗣️ Unit 2: 語言與文化 (136 詞)" : "🗣️ Unit 2: 语言与文化 (136 词)",
      u3: isTrad ? "🎨 Unit 3: 藝術與創意 (112 詞)" : "🎨 Unit 3: 艺术与创意 (112 词)",
      u4: isTrad ? "🔬 Unit 4: 科學與科技 (53 詞)" : "🔬 Unit 4: 科学与科技 (53 词)",
      u5: isTrad ? "🏙️ Unit 5: 當代生活 (137 詞)" : "🏙️ Unit 5: 当代生活 (137 词)",
      u6: isTrad ? "🌍 Unit 6: 全球脈絡 (123 詞)" : "🌍 Unit 6: 全球脉络 (123 词)"
    };

    const selectIds = ['filter-unit', 'select-card-unit', 'select-quiz-unit', 'select-worksheet-unit'];
    selectIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      Array.from(el.options).forEach(opt => {
        if (unitLabels[opt.value]) {
          opt.textContent = unitLabels[opt.value];
        }
      });
    });
  }

  function switchTab(tabId) {
    settings.activeTab = tabId;
    saveSettings();

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });

    if (tabId === 'pane-glossary') {
      renderGlossaryTable();
    } else if (tabId === 'pane-flashcards') {
      buildFlashcardDeck();
      renderFlashcard();
    } else if (tabId === 'pane-quiz') {
      if (currentQuizType === 'mc') {
        initMultipleChoiceQuiz();
      } else {
        initMatchGame();
      }
    } else if (tabId === 'pane-worksheet') {
      renderWorksheet();
    }
  }

  function updateBadgeCounts() {
    const totalCount = glossaryData.length;
    const masteredCount = glossaryData.filter(i => i.mastered).length;
    const reviewCount = totalCount - masteredCount;

    const badgeTotal = document.getElementById('badge-glossary-count');
    if (badgeTotal) badgeTotal.textContent = totalCount;

    const badgeCards = document.getElementById('badge-flashcard-count');
    if (badgeCards) badgeCards.textContent = totalCount;
  }

  // --- Helper Toast Notification ---
  function showToast(message, duration = 2500) {
    let toast = document.getElementById('toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, duration);
  }

  // ==========================================================================
  // TAB 1: Glossary Table View
  // ==========================================================================
  function renderGlossaryTable() {
    const tbody = document.getElementById('glossary-table-body');
    if (!tbody) return;

    const query = (document.getElementById('table-search-input')?.value || '').trim().toLowerCase();
    const filter = document.getElementById('filter-status')?.value || 'all';
    const unitFilter = document.getElementById('filter-unit')?.value || 'all';

    const filtered = glossaryData.filter(item => {
      // Filter unit
      if (unitFilter !== 'all') {
        const itemUnit = item.unitId || 'u0';
        if (itemUnit !== unitFilter && !(unitFilter === 'u0' && itemUnit === 'core')) return false;
      }

      // Filter status
      if (filter === 'mastered' && !item.mastered) return false;
      if (filter === 'review' && item.mastered) return false;

      // Query search
      if (!query) return true;
      const matchWord = item.word && item.word.toLowerCase().includes(query);
      const matchSimp = item.simp && item.simp.includes(query);
      const matchTrad = item.trad && item.trad.includes(query);
      const matchPinyin = item.pinyin && item.pinyin.toLowerCase().includes(query);
      const matchDef = item.definition && item.definition.toLowerCase().includes(query);
      const matchCDef = item.chineseDef && item.chineseDef.includes(query);
      const matchUnit = (item.unitZh && item.unitZh.toLowerCase().includes(query)) ||
                        (item.unit && item.unit.toLowerCase().includes(query)) ||
                        getFormattedUnitTitle(item.unitId, '', 'simp').toLowerCase().includes(query) ||
                        getFormattedUnitTitle(item.unitId, '', 'trad').toLowerCase().includes(query);
      return matchWord || matchSimp || matchTrad || matchPinyin || matchDef || matchCDef || matchUnit;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--text-slate-400);">
            未找到符合条件的生词。可尝试更改搜索词或点击右上角「+ 智能添加生词」。
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((item, index) => {
      const tr = document.createElement('tr');

      const primaryHanzi = settings.charMode === 'simp' ? item.simp : (item.trad || item.simp);
      const secondaryHanzi = settings.charMode === 'simp' ? (item.trad || item.simp) : item.simp;

      // Unit badge
      const unitClass = `badge-unit badge-unit-${item.unitId || 'u0'}`;
      const unitDisplayTitle = getFormattedUnitTitle(item.unitId, item.unitZh, settings.charMode);
      const unitTagHtml = unitDisplayTitle
        ? `<div style="margin-top: 5px;"><span class="${unitClass}">${unitDisplayTitle}</span></div>`
        : '';

      // Pronunciation link to Wiktionary (as in original sheet)
      const wiktionaryLink = `https://zh.wiktionary.org/zh-hans/${encodeURIComponent(item.trad || item.simp)}`;
      // Image search link to Google Images (as in original sheet)
      const googleImageLink = `https://www.google.com/search?q=${encodeURIComponent(item.word)}+image&tbm=isch`;

      const pinyinClass = settings.showPinyin ? 'pinyin-text' : 'pinyin-text pinyin-hidden';

      tr.innerHTML = `
        <td style="width: 45px; text-align: center; color: var(--text-slate-400); font-size: 0.85rem;">
          ${index + 1}
        </td>
        <td>
          <div class="chinese-cell">
            <span style="font-size: 1.15rem; font-weight: 700;">${primaryHanzi}</span>
            <span class="chinese-secondary" title="对应繁/简">${secondaryHanzi}</span>
            <button class="btn-audio" data-id="${item.id}" title="朗读普通话发音" aria-label="朗读中文">
              🔊
            </button>
          </div>
          ${unitTagHtml}
        </td>
        <td>
          <span class="${pinyinClass}" title="${settings.showPinyin ? '' : '点击悬浮临时查看'}">
            ${item.pinyin || ''}
          </span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="word-cell">${item.word}</span>
            <button class="btn-audio" style="width:24px; height:24px; font-size: 0.75rem;" data-id="${item.id}" data-lang="en-US" title="朗读英语读音">
              🔈
            </button>
          </div>
          ${item.tags ? `<div>${item.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}</div>` : ''}
        </td>
        <td class="def-cell">
          <div>${item.definition || ''}</div>
          ${item.chineseDef ? `<div style="color: var(--text-slate-500); font-size: 0.75rem; margin-top: 2px;">${item.chineseDef}</div>` : ''}
        </td>
        <td style="white-space: nowrap;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <a href="${wiktionaryLink}" target="_blank" rel="noopener noreferrer" class="ext-link" title="在维基词典查看部首、字形与字源">
              📖 维基词典
            </a>
            <a href="${googleImageLink}" target="_blank" rel="noopener noreferrer" class="ext-link" title="在 Google 图片搜索联想图">
              🖼️ 联想图片
            </a>
          </div>
        </td>
        <td style="white-space: nowrap; text-align: right;">
          <button class="btn btn-sm ${item.mastered ? 'btn-success' : 'btn-secondary'}" data-action="toggle-mastery" data-id="${item.id}" title="${item.mastered ? '已掌握，点击标记为需复习' : '点击标记为已掌握'}">
            ${item.mastered ? '★ 已掌握' : '☆ 需复习'}
          </button>
          <button class="btn btn-sm btn-secondary" data-action="delete" data-id="${item.id}" title="删除此词" style="color: var(--danger-rose);">
            🗑️
          </button>
        </td>
      `;

      // Event Listeners on row elements
      tr.querySelectorAll('.btn-audio').forEach(audioBtn => {
        audioBtn.addEventListener('click', () => {
          const lang = audioBtn.getAttribute('data-lang') || 'zh-CN';
          const textToSpeak = lang === 'en-US' ? item.word : (settings.charMode === 'simp' ? item.simp : item.trad);
          audioBtn.classList.add('speaking');
          speakText(textToSpeak, lang, () => {
            audioBtn.classList.remove('speaking');
          });
        });
      });

      tr.querySelector('[data-action="toggle-mastery"]')?.addEventListener('click', () => {
        item.mastered = !item.mastered;
        saveGlossaryData();
        renderGlossaryTable();
      });

      tr.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
        if (confirm(`确定要删除生词「${item.simp} / ${item.word}」吗？`)) {
          glossaryData = glossaryData.filter(w => w.id !== item.id);
          saveGlossaryData();
          renderGlossaryTable();
          showToast('生词已删除');
        }
      });

      tbody.appendChild(tr);
    });
  }

  // --- Smart Add Modal & Auto-Fill Engine ---
  let currentAutoFillToken = 0;

  function openAddModal() {
    const modal = document.getElementById('modal-add-word');
    if (!modal) return;
    document.getElementById('form-add-word').reset();
    const indicator = document.getElementById('modal-autofill-indicator');
    if (indicator) indicator.style.display = 'none';

    // Populate suggestions datalist
    const datalist = document.getElementById('word-suggestions');
    if (datalist && datalist.children.length === 0) {
      const wordMap = new Map();
      if (typeof DEFAULT_GLOSSARY_DATA !== 'undefined') {
        DEFAULT_GLOSSARY_DATA.forEach(item => wordMap.set(item.word.toLowerCase(), `${item.simp} (${item.pinyin})`));
      }
      if (typeof BUILTIN_DICTIONARY !== 'undefined') {
        Object.keys(BUILTIN_DICTIONARY).forEach(w => {
          if (!wordMap.has(w)) {
            const entry = BUILTIN_DICTIONARY[w];
            wordMap.set(w, `${entry.simp} (${entry.pinyin})`);
          }
        });
      }
      Array.from(wordMap.keys()).sort().forEach(word => {
        const opt = document.createElement('option');
        opt.value = word;
        opt.label = wordMap.get(word);
        datalist.appendChild(opt);
      });
    }

    modal.classList.add('active');
    setTimeout(() => {
      document.getElementById('modal-input-word')?.focus();
    }, 100);
  }

  function closeAddModal() {
    const modal = document.getElementById('modal-add-word');
    if (modal) modal.classList.remove('active');
  }

  async function handleSmartAutoFill(inputStr, forceOverwrite = true) {
    if (!inputStr || inputStr.trim().length < 2) {
      const indicator = document.getElementById('modal-autofill-indicator');
      if (indicator) indicator.style.display = 'none';
      return;
    }

    const thisToken = ++currentAutoFillToken;
    const queryWord = inputStr.trim();
    const indicator = document.getElementById('modal-autofill-indicator');
    if (indicator) {
      indicator.textContent = `⚡ 正在匹配「${queryWord}」...`;
      indicator.style.display = 'inline-block';
      indicator.style.color = 'var(--primary-teal)';
    }

    try {
      const match = await smartAutoFill(queryWord);
      // Discard stale responses if user typed something newer
      if (thisToken !== currentAutoFillToken) return;

      if (match && (match.simp || match.definition)) {
        const simpInput = document.getElementById('modal-input-simp');
        const tradInput = document.getElementById('modal-input-trad');
        const pinyinInput = document.getElementById('modal-input-pinyin');
        const defInput = document.getElementById('modal-input-def');
        const cdefInput = document.getElementById('modal-input-cdef');
        const tagsInput = document.getElementById('modal-input-tags');

        if (simpInput && (forceOverwrite || !simpInput.value)) {
          simpInput.value = match.simp || '';
        }
        if (tradInput && (forceOverwrite || !tradInput.value)) {
          tradInput.value = match.trad || '';
        }
        if (pinyinInput && (forceOverwrite || !pinyinInput.value)) {
          pinyinInput.value = match.pinyin || '';
        }
        if (defInput && (forceOverwrite || !defInput.value)) {
          defInput.value = match.definition || '';
        }
        if (cdefInput && (forceOverwrite || !cdefInput.value)) {
          cdefInput.value = match.chineseDef || '';
        }
        if (tagsInput && (forceOverwrite || !tagsInput.value)) {
          tagsInput.value = (match.tags || []).join(', ');
        }

        if (indicator) {
          const sourceText = match.source === 'builtin' ? '词典精准匹配' : (match.source === 'glossary' ? '预设词库' : '智能翻译');
          indicator.textContent = `✓ 已匹配（${sourceText}）：${match.simp || ''} [${match.pinyin || ''}]`;
          indicator.style.color = 'var(--success-emerald)';
        }
      } else {
        if (indicator) {
          indicator.textContent = `ℹ️ 词库未收录「${queryWord}」，可手动填写释义`;
          indicator.style.color = 'var(--text-slate-500)';
        }
      }
    } catch (e) {
      console.error(e);
      if (thisToken === currentAutoFillToken && indicator) {
        indicator.textContent = 'ℹ️ 查询超时，可手动输入';
        indicator.style.color = 'var(--text-slate-400)';
      }
    }
  }

  function handleAddWordSubmit(e) {
    e.preventDefault();
    const word = document.getElementById('modal-input-word').value.trim();
    const simp = document.getElementById('modal-input-simp').value.trim();
    const trad = document.getElementById('modal-input-trad').value.trim() || simp;
    const pinyin = document.getElementById('modal-input-pinyin').value.trim();
    const definition = document.getElementById('modal-input-def').value.trim();
    const chineseDef = document.getElementById('modal-input-cdef').value.trim();
    const tagsStr = document.getElementById('modal-input-tags').value.trim();
    const tags = tagsStr ? tagsStr.split(/[,，\s]+/).filter(Boolean) : ['新词'];

    if (!word || !simp) {
      alert('请至少填写英文单词和简体中文！');
      return;
    }

    const newWord = {
      id: 'word_' + Date.now(),
      word,
      simp,
      trad,
      pinyin: pinyin || convertToPinyin(simp),
      definition,
      chineseDef,
      tags,
      mastered: false
    };

    glossaryData.unshift(newWord);
    saveGlossaryData();
    renderGlossaryTable();
    closeAddModal();
    showToast(`生词「${simp}」添加成功！`);
  }

  // --- Export Data ---
  function showExportOptions() {
    const choice = prompt(
      "请选择导出格式：\n1. 导出为 CSV / Excel 兼容表格 (.csv)\n2. 导出为 Anki 记忆卡片格式 (.txt)\n3. 导出完整词库备份 (.json)\n请输入数字 1, 2, 或 3：",
      "1"
    );

    if (choice === '1') {
      exportToCSV();
    } else if (choice === '2') {
      exportToAnki();
    } else if (choice === '3') {
      exportToJSON();
    }
  }

  function exportToCSV() {
    let csvContent = "\uFEFFUnit,Chinese (Simplified),Chinese (Traditional),Word,Pinyin,Definition,Chinese Definition,Tags,Mastered\n";
    glossaryData.forEach(item => {
      const escape = (str) => `"${(str || '').replace(/"/g, '""')}"`;
      csvContent += `${escape(item.unitZh || item.unit || 'Core 2026')},${escape(item.simp)},${escape(item.trad)},${escape(item.word)},${escape(item.pinyin)},${escape(item.definition)},${escape(item.chineseDef)},${escape((item.tags || []).join('; '))},${item.mastered ? 'Yes' : 'No'}\n`;
    });

    downloadBlob(csvContent, 'Chinese_Glossary_2026_Full.csv', 'text/csv;charset=utf-8;');
    showToast('完整词库 CSV 文件已导出！');
  }

  function exportToAnki() {
    let ankiContent = "#separator:tab\n#html:true\n#tags column:5\n";
    glossaryData.forEach(item => {
      const front = `<div style="font-size:28px; font-weight:bold;">${item.simp}</div><div style="color:#0f766e; font-size:18px;">${item.pinyin}</div>`;
      const back = `<div style="font-size:22px; color:#4f46e5; font-weight:bold;">${item.word}</div><div style="font-size:14px; margin-top:8px;">${item.definition}</div>${item.chineseDef ? `<div style="color:#64748b; font-size:12px;">${item.chineseDef}</div>` : ''}`;
      const trad = item.trad || item.simp;
      const tags = (item.tags || []).join(' ');
      ankiContent += `${front}\t${back}\t${trad}\t${item.word}\t${tags}\n`;
    });

    downloadBlob(ankiContent, 'Chinese_Glossary_Anki_Deck.txt', 'text/plain;charset=utf-8;');
    showToast('Anki 牌组已导出！');
  }

  function exportToJSON() {
    const jsonStr = JSON.stringify(glossaryData, null, 2);
    downloadBlob(jsonStr, 'Chinese_Glossary_2026_Backup.json', 'application/json');
    showToast('词库 JSON 备份已导出！');
  }

  function downloadBlob(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ==========================================================================
  // TAB 2: Interactive Flashcard Mode
  // ==========================================================================
  function buildFlashcardDeck() {
    const unitFilter = document.getElementById('select-card-unit')?.value || 'all';
    const filter = document.getElementById('select-card-deck-filter')?.value || 'all';

    let pool = [...glossaryData];
    if (unitFilter !== 'all') {
      pool = pool.filter(i => (i.unitId || 'u0') === unitFilter || (unitFilter === 'u0' && i.unitId === 'core'));
    }
    if (filter === 'review') {
      flashcardDeck = pool.filter(i => !i.mastered);
    } else if (filter === 'mastered') {
      flashcardDeck = pool.filter(i => i.mastered);
    } else {
      flashcardDeck = pool;
    }

    if (currentCardIndex >= flashcardDeck.length) {
      currentCardIndex = Math.max(0, flashcardDeck.length - 1);
    }
  }

  function renderFlashcard() {
    const inner = document.getElementById('flashcard-inner');
    const front = document.getElementById('card-face-front');
    const back = document.getElementById('card-face-back');
    const counter = document.getElementById('card-progress-text');
    const progressBar = document.getElementById('flashcard-progress-fill');

    if (!inner || !front || !back) return;

    // Reset flip state
    inner.classList.toggle('is-flipped', isCardFlipped);

    if (flashcardDeck.length === 0) {
      front.innerHTML = `<div style="color: var(--text-slate-400); font-size: 1.25rem;">此分类或单元下暂无生词</div>`;
      back.innerHTML = ``;
      if (counter) counter.textContent = '0 / 0';
      if (progressBar) progressBar.style.width = '0%';
      return;
    }

    const item = flashcardDeck[currentCardIndex];
    const total = flashcardDeck.length;
    if (counter) counter.textContent = `${currentCardIndex + 1} / ${total}`;
    if (progressBar) progressBar.style.width = `${((currentCardIndex + 1) / total) * 100}%`;

    const primaryHanzi = settings.charMode === 'simp' ? item.simp : (item.trad || item.simp);
    const pinyinHtml = settings.showPinyin
      ? `<div class="card-pinyin">${item.pinyin || ''}</div>`
      : `<div class="card-pinyin pinyin-hidden" title="点击悬浮查看">${item.pinyin || ''}</div>`;

    const unitBadgeHtml = item.unitZh
      ? `<span class="badge-unit badge-unit-${item.unitId || 'u0'}">${getFormattedUnitTitle(item.unitId, item.unitZh, settings.charMode)}</span>`
      : '';

    const cardHeader = (modeText) => `
      <div style="position: absolute; top: 1.25rem; left: 1.5rem; right: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          ${unitBadgeHtml}
          <span class="card-badge-mode" style="position: static;">${modeText}</span>
        </div>
        <span class="card-badge-mastered" style="position: static; ${item.mastered ? 'display: inline-block;' : ''}">★ 已掌握</span>
      </div>
    `;

    front.classList.toggle('is-mastered', !!item.mastered);
    back.classList.toggle('is-mastered', !!item.mastered);

    if (flashcardMode === 'EN_TO_ZH') {
      // Front: English Word & Definition -> Back: Chinese Character & Pinyin
      front.innerHTML = `
        ${cardHeader('英译汉模式 · 正面')}
        <div class="card-main-word" style="color: var(--accent-indigo); font-size: 2.8rem;">${item.word}</div>
        <div class="card-definition">${item.definition || ''}</div>
        <div class="card-flip-prompt"><span>🔄 点击卡片翻转查看中文</span></div>
      `;

      back.innerHTML = `
        ${cardHeader('英译汉模式 · 背面')}
        <div class="card-main-word">${primaryHanzi}</div>
        ${pinyinHtml}
        ${item.chineseDef ? `<div class="card-definition" style="color: var(--text-slate-500);">${item.chineseDef}</div>` : ''}
        <div style="margin-top: 1rem;">
          <button class="btn btn-sm btn-primary" id="btn-card-speak-back">🔊 听中文发音</button>
        </div>
        <div class="card-flip-prompt"><span>🔄 点击翻回正面</span></div>
      `;
    } else if (flashcardMode === 'ZH_TO_EN') {
      // Front: Chinese Character & Pinyin -> Back: English Word & Definition
      front.innerHTML = `
        ${cardHeader('汉译英模式 · 正面')}
        <div class="card-main-word">${primaryHanzi}</div>
        ${pinyinHtml}
        <div style="margin-top: 0.5rem;">
          <button class="btn btn-sm btn-secondary" id="btn-card-speak-front">🔊 听读音</button>
        </div>
        <div class="card-flip-prompt"><span>🔄 点击卡片翻转查看英文字义</span></div>
      `;

      back.innerHTML = `
        ${cardHeader('汉译英模式 · 背面')}
        <div class="card-main-word" style="color: var(--accent-indigo); font-size: 2.5rem;">${item.word}</div>
        <div class="card-definition">${item.definition || ''}</div>
        ${item.chineseDef ? `<div class="card-definition" style="color: var(--text-slate-500); font-size: 0.9rem; margin-top: 6px;">${item.chineseDef}</div>` : ''}
        <div class="card-flip-prompt"><span>🔄 点击翻回正面</span></div>
      `;
    } else {
      // AUDIO_TO_ZH (Listening Mode)
      front.innerHTML = `
        ${cardHeader('听力辨识模式 · 正面')}
        <div style="font-size: 4rem; margin-bottom: 1rem;">🎧</div>
        <button class="btn btn-primary" id="btn-card-speak-listen" style="padding: 0.8rem 1.5rem; font-size: 1.1rem;">
          🔊 播放读音
        </button>
        <div class="card-flip-prompt" style="margin-top: 1.5rem;"><span>🔄 点击卡片揭晓汉字与字义</span></div>
      `;

      back.innerHTML = `
        ${cardHeader('听力辨识模式 · 背面')}
        <div class="card-main-word">${primaryHanzi}</div>
        ${pinyinHtml}
        <div class="card-definition" style="color: var(--accent-indigo); font-weight: 700; font-size: 1.3rem;">${item.word}</div>
        <div class="card-definition" style="font-size: 0.9rem; margin-top: 4px;">${item.definition}</div>
        <div class="card-flip-prompt"><span>🔄 点击翻回正面</span></div>
      `;
    }

    // Attach speech events
    document.getElementById('btn-card-speak-front')?.addEventListener('click', (e) => {
      e.stopPropagation();
      speakText(primaryHanzi, 'zh-CN');
    });

    document.getElementById('btn-card-speak-back')?.addEventListener('click', (e) => {
      e.stopPropagation();
      speakText(primaryHanzi, 'zh-CN');
    });

    document.getElementById('btn-card-speak-listen')?.addEventListener('click', (e) => {
      e.stopPropagation();
      speakText(primaryHanzi, 'zh-CN');
    });
  }

  function toggleCardFlip() {
    isCardFlipped = !isCardFlipped;
    const inner = document.getElementById('flashcard-inner');
    if (inner) inner.classList.toggle('is-flipped', isCardFlipped);
  }

  function prevFlashcard() {
    if (flashcardDeck.length <= 1) return;
    currentCardIndex = (currentCardIndex - 1 + flashcardDeck.length) % flashcardDeck.length;
    isCardFlipped = false;
    renderFlashcard();
  }

  function nextFlashcard() {
    if (flashcardDeck.length <= 1) return;
    currentCardIndex = (currentCardIndex + 1) % flashcardDeck.length;
    isCardFlipped = false;
    renderFlashcard();
  }

  function playCurrentCardAudio() {
    if (flashcardDeck.length === 0) return;
    const item = flashcardDeck[currentCardIndex];
    const hanzi = settings.charMode === 'simp' ? item.simp : item.trad;
    speakText(hanzi, 'zh-CN');
  }

  function markCurrentCard(mastered) {
    if (flashcardDeck.length === 0) return;
    const currentItem = flashcardDeck[currentCardIndex];
    currentItem.mastered = mastered;

    // Sync with original dataset
    const originalItem = glossaryData.find(w => w.id === currentItem.id);
    if (originalItem) originalItem.mastered = mastered;

    saveGlossaryData();
    showToast(mastered ? '已标记为掌握！' : '已移入重点复习词库！');
    nextFlashcard();
  }

  // ==========================================================================
  // TAB 3: Quiz & Practice Hub
  // ==========================================================================
  function initMultipleChoiceQuiz() {
    const unitFilter = document.getElementById('select-quiz-unit')?.value || 'all';
    let pool = [...glossaryData];
    if (unitFilter !== 'all') {
      pool = pool.filter(w => (w.unitId || 'u0') === unitFilter || (unitFilter === 'u0' && w.unitId === 'core'));
    }

    if (pool.length < 4) {
      alert('该单元生词数量少于 4 个，无法生成测验。请选择全部单元或切换其他单元！');
      return;
    }

    quizScore = 0;
    currentQuestionIndex = 0;
    quizAnswered = false;

    // Shuffle and pick 10 questions (or all if < 10)
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const count = Math.min(10, shuffled.length);
    quizQuestions = [];

    for (let i = 0; i < count; i++) {
      const correctWord = shuffled[i];
      // Pick 3 distractors from pool (or glossaryData if pool has few)
      const distractorPool = pool.length >= 4 ? pool : glossaryData;
      const distractors = distractorPool
        .filter(w => w.id !== correctWord.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [correctWord, ...distractors].sort(() => Math.random() - 0.5);

      // Quiz mode variety: 0 = Hanzi -> English, 1 = English -> Hanzi, 2 = Audio -> Hanzi
      const qType = i % 3;

      quizQuestions.push({
        correctWord,
        options,
        qType
      });
    }

    document.getElementById('quiz-question-box').style.display = 'block';
    document.getElementById('quiz-result-box').style.display = 'none';
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
      showQuizResult();
      return;
    }

    quizAnswered = false;
    const q = quizQuestions[currentQuestionIndex];
    const total = quizQuestions.length;

    document.getElementById('quiz-progress-badge').textContent = `题目 ${currentQuestionIndex + 1} / ${total}`;
    document.getElementById('quiz-score-badge').textContent = `得分: ${quizScore}`;

    const promptTypeEl = document.getElementById('quiz-prompt-type');
    const promptTextEl = document.getElementById('quiz-prompt-text');
    const promptPinyinEl = document.getElementById('quiz-prompt-pinyin');
    const audioBtn = document.getElementById('quiz-audio-btn');
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const nextBtn = document.getElementById('btn-quiz-next');

    feedbackBox.style.display = 'none';
    feedbackBox.className = 'quiz-feedback-box';
    nextBtn.style.display = 'none';

    const primaryHanzi = settings.charMode === 'simp' ? q.correctWord.simp : (q.correctWord.trad || q.correctWord.simp);

    if (q.qType === 0) {
      // 看中文选英文
      promptTypeEl.textContent = '看中文选择正确的英文释义';
      promptTextEl.textContent = primaryHanzi;
      promptPinyinEl.textContent = settings.showPinyin ? q.correctWord.pinyin : '';
      audioBtn.style.display = 'inline-flex';
      audioBtn.onclick = () => speakText(primaryHanzi, 'zh-CN');
    } else if (q.qType === 1) {
      // 看英文选汉字
      promptTypeEl.textContent = '看英文单词选择对应的中文生词';
      promptTextEl.textContent = q.correctWord.word;
      promptPinyinEl.textContent = q.correctWord.definition ? `“${q.correctWord.definition.slice(0, 70)}...”` : '';
      audioBtn.style.display = 'none';
    } else {
      // 听音选汉字
      promptTypeEl.textContent = '听中文读音，选出正确的汉字';
      promptTextEl.textContent = '🎧 点击喇叭听音';
      promptPinyinEl.textContent = '';
      audioBtn.style.display = 'inline-flex';
      audioBtn.onclick = () => speakText(primaryHanzi, 'zh-CN');
      // Auto speak once
      setTimeout(() => speakText(primaryHanzi, 'zh-CN'), 300);
    }

    // Render 4 Options
    const optionsGrid = document.getElementById('quiz-options-grid');
    optionsGrid.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';

      let optionText = '';
      if (q.qType === 0) {
        // Options are English
        optionText = `<strong>${opt.word}</strong> <span style="font-size:0.85rem; color: var(--text-slate-500); font-weight: normal;">${opt.chineseDef || ''}</span>`;
      } else {
        // Options are Chinese
        const optHanzi = settings.charMode === 'simp' ? opt.simp : (opt.trad || opt.simp);
        optionText = `<strong>${optHanzi}</strong> <span style="font-size:0.85rem; color: var(--primary-teal);">${opt.pinyin}</span>`;
      }

      btn.innerHTML = `
        <span class="quiz-opt-letter">${letters[idx]}</span>
        <span>${optionText}</span>
      `;

      btn.addEventListener('click', () => {
        if (quizAnswered) return;
        checkQuizAnswer(btn, opt, q);
      });

      optionsGrid.appendChild(btn);
    });
  }

  function checkQuizAnswer(selectedBtn, selectedOption, q) {
    quizAnswered = true;
    const isCorrect = selectedOption.id === q.correctWord.id;
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const nextBtn = document.getElementById('btn-quiz-next');
    const allOptBtns = document.querySelectorAll('.quiz-opt-btn');

    allOptBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      selectedBtn.classList.add('correct');
      quizScore += 10;
      feedbackBox.className = 'quiz-feedback-box correct';
      feedbackBox.innerHTML = `🎉 恭喜回答正确！+10 分<br><small><strong>${q.correctWord.simp} (${q.correctWord.pinyin})</strong>: ${q.correctWord.word} — ${q.correctWord.definition}</small>`;
      feedbackBox.style.display = 'block';
    } else {
      selectedBtn.classList.add('wrong');
      // Highlight the correct one
      allOptBtns.forEach((b, i) => {
        if (q.options[i].id === q.correctWord.id) {
          b.classList.add('correct');
        }
      });
      feedbackBox.className = 'quiz-feedback-box wrong';
      feedbackBox.innerHTML = `❌ 遗憾答错了！正确答案是：<strong>${q.correctWord.simp} (${q.correctWord.pinyin})</strong><br><small>${q.correctWord.word}: ${q.correctWord.definition}</small>`;
      feedbackBox.style.display = 'block';
    }

    document.getElementById('quiz-score-badge').textContent = `得分: ${quizScore}`;
    nextBtn.style.display = 'inline-flex';
    nextBtn.onclick = () => {
      currentQuestionIndex++;
      renderQuizQuestion();
    };
  }

  function showQuizResult() {
    document.getElementById('quiz-question-box').style.display = 'none';
    const resultBox = document.getElementById('quiz-result-box');
    resultBox.style.display = 'block';

    const maxScore = quizQuestions.length * 10;
    const percentage = Math.round((quizScore / maxScore) * 100);

    let evaluation = '继续加油！熟能生巧！';
    if (percentage >= 90) evaluation = '🌟 卓越非凡！您对本课生词已完全掌握！';
    else if (percentage >= 70) evaluation = '👍 表现优良！再练习几次即可全部通关！';

    document.getElementById('quiz-final-score').textContent = `${quizScore} / ${maxScore} (${percentage}%)`;
    document.getElementById('quiz-final-eval').textContent = evaluation;
  }

  // --- Match Memory Game (连连看) ---
  function initMatchGame() {
    const unitFilter = document.getElementById('select-quiz-unit')?.value || 'all';
    let pool = [...glossaryData];
    if (unitFilter !== 'all') {
      pool = pool.filter(w => (w.unitId || 'u0') === unitFilter || (unitFilter === 'u0' && w.unitId === 'core'));
    }

    if (pool.length < 6) {
      alert('该单元生词数量少于 6 个，无法进行配对游戏！请选择全部单元或切换其他单元。');
      return;
    }

    clearInterval(matchTimer);
    matchSeconds = 0;
    matchMoves = 0;
    matchPairsFound = 0;
    firstSelectedMatch = null;
    secondSelectedMatch = null;

    document.getElementById('match-moves-count').textContent = '0';
    document.getElementById('match-timer-text').textContent = '0 秒';
    document.getElementById('match-success-banner').style.display = 'none';

    matchTimer = setInterval(() => {
      matchSeconds++;
      document.getElementById('match-timer-text').textContent = `${matchSeconds} 秒`;
    }, 1000);

    // Pick 6 random words -> 12 tiles (6 Chinese, 6 English)
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    let cards = [];
    selected.forEach(item => {
      const hanzi = settings.charMode === 'simp' ? item.simp : (item.trad || item.simp);
      cards.push({ id: item.id, type: 'zh', text: hanzi, pinyin: item.pinyin, pairedId: item.id });
      cards.push({ id: item.id, type: 'en', text: item.word, pairedId: item.id });
    });

    cards.sort(() => Math.random() - 0.5);
    matchCards = cards;

    const grid = document.getElementById('match-grid');
    grid.innerHTML = '';

    cards.forEach((card, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'match-card';
      cardEl.setAttribute('data-idx', idx);

      if (card.type === 'zh') {
        cardEl.innerHTML = `
          <div class="card-text-hanzi">${card.text}</div>
          <div style="font-size:0.75rem; color: var(--primary-teal);">${card.pinyin || ''}</div>
        `;
      } else {
        cardEl.innerHTML = `
          <div class="card-text-word">${card.text}</div>
        `;
      }

      cardEl.addEventListener('click', () => handleMatchCardClick(cardEl, card));
      grid.appendChild(cardEl);
    });
  }

  function handleMatchCardClick(cardEl, card) {
    if (cardEl.classList.contains('matched') || cardEl.classList.contains('selected')) return;
    if (firstSelectedMatch && secondSelectedMatch) return; // Busy checking

    cardEl.classList.add('selected');

    if (!firstSelectedMatch) {
      firstSelectedMatch = { el: cardEl, card };
    } else {
      secondSelectedMatch = { el: cardEl, card };
      matchMoves++;
      document.getElementById('match-moves-count').textContent = matchMoves;

      // Check match
      if (firstSelectedMatch.card.id === secondSelectedMatch.card.id && firstSelectedMatch.card.type !== secondSelectedMatch.card.type) {
        // Paired!
        setTimeout(() => {
          firstSelectedMatch.el.classList.remove('selected');
          secondSelectedMatch.el.classList.remove('selected');
          firstSelectedMatch.el.classList.add('matched');
          secondSelectedMatch.el.classList.add('matched');

          // Speak the word
          const matchedItem = glossaryData.find(w => w.id === card.id);
          if (matchedItem) speakText(matchedItem.simp, 'zh-CN');

          firstSelectedMatch = null;
          secondSelectedMatch = null;
          matchPairsFound++;

          if (matchPairsFound === 6) {
            clearInterval(matchTimer);
            document.getElementById('match-success-banner').style.display = 'block';
            document.getElementById('match-success-banner').innerHTML = `
              🎉 太棒了！全部配对成功！用时 <strong>${matchSeconds} 秒</strong>，共操作 <strong>${matchMoves} 步</strong>！
            `;
          }
        }, 300);
      } else {
        // Mismatch
        setTimeout(() => {
          firstSelectedMatch.el.classList.remove('selected');
          secondSelectedMatch.el.classList.remove('selected');
          firstSelectedMatch = null;
          secondSelectedMatch = null;
        }, 700);
      }
    }
  }

  // ==========================================================================
  // TAB 4: Printable Worksheet Generator (Teacher's Tool)
  // ==========================================================================
  function renderWorksheet() {
    const sheetContainer = document.getElementById('printable-sheet-content');
    if (!sheetContainer) return;

    const unitFilter = document.getElementById('select-worksheet-unit')?.value || 'all';
    const filter = document.getElementById('select-worksheet-filter')?.value || 'all';

    let words = [...glossaryData];
    if (unitFilter !== 'all') {
      words = words.filter(w => (w.unitId || 'u0') === unitFilter || (unitFilter === 'u0' && w.unitId === 'core'));
    }
    if (filter === 'review') words = words.filter(w => !w.mastered);
    else if (filter === 'mastered') words = words.filter(w => w.mastered);

    const isTrad = settings.charMode === 'trad';
    const unitNames = {
      "all": isTrad ? "全套詞彙庫 (All 837 Words)" : "全套词库 (All 837 Words)",
      "u0": isTrad ? "Unit 0: 基礎導論預備 (Introduction)" : "Unit 0: 基础导论预备 (Introduction)",
      "core": isTrad ? "Unit 0: 基礎導論預備 (Introduction)" : "Unit 0: 基础导论预备 (Introduction)",
      "u1": isTrad ? "Unit 1: 家庭與社區 (Families and Communities)" : "Unit 1: 家庭与社区 (Families and Communities)",
      "u2": isTrad ? "Unit 2: 語言與文化 (Language and Culture)" : "Unit 2: 语言与文化 (Language and Culture)",
      "u3": isTrad ? "Unit 3: 藝術與創意 (Art and Creativity)" : "Unit 3: 艺术与创意 (Art and Creativity)",
      "u4": isTrad ? "Unit 4: 科學與科技 (Science and Technology)" : "Unit 4: 科学与科技 (Science and Technology)",
      "u5": isTrad ? "Unit 5: 當代生活 (Contemporary Life)" : "Unit 5: 当代生活 (Contemporary Life)",
      "u6": isTrad ? "Unit 6: 全球脈絡 (Global Contexts)" : "Unit 6: 全球脉络 (Global Contexts)"
    };
    const unitTitle = unitNames[unitFilter] || unitFilter;

    if (worksheetType === 'tianzige') {
      renderTianzigeWritingSheet(sheetContainer, words, unitTitle);
    } else if (worksheetType === 'quiz') {
      renderClassroomQuizSheet(sheetContainer, words, unitTitle);
    } else {
      renderCutoutCardsSheet(sheetContainer, words, unitTitle);
    }
  }

  function renderTianzigeWritingSheet(container, words, unitTitle = '2026 Edition') {
    if (words.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding: 4rem 1rem; color: var(--text-slate-400);">此单元或筛选条件下暂无可打印生词</div>`;
      return;
    }
    let rowsHtml = '';
    words.forEach(item => {
      const primaryHanzi = settings.charMode === 'simp' ? item.simp : (item.trad || item.simp);
      const chars = Array.from(primaryHanzi);

      let boxesForWord = '';
      chars.forEach(char => {
        // 1 sample char + 2 trace chars + 3 blank boxes
        boxesForWord += `
          <div style="display: flex; flex-direction: column; align-items: center; margin-right: 8px;">
            <div class="tianzige-boxes-group">
              <div class="tianzige-box sample-char">${char}</div>
              <div class="tianzige-box trace-char">${char}</div>
              <div class="tianzige-box trace-char">${char}</div>
              <div class="tianzige-box"></div>
              <div class="tianzige-box"></div>
            </div>
          </div>
        `;
      });

      rowsHtml += `
        <div class="tianzige-row">
          <div class="tianzige-word-info">
            <div class="pinyin">${item.pinyin || ''}</div>
            <div class="eng-word">${item.word}</div>
            <div class="short-def" title="${item.definition}">${item.definition}</div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${boxesForWord}
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="sheet-header">
        <div class="sheet-header-title">
          <h2>中文生词规范田字格书写练习单</h2>
          <p>Chinese Vocabulary Handwriting Worksheet · ${unitTitle}</p>
        </div>
        <div class="sheet-header-meta">
          <div>姓名：<span class="meta-item"></span></div>
          <div>日期：<span class="meta-item"></span></div>
          <div>得分：<span class="meta-item"></span></div>
        </div>
      </div>
      <div class="tianzige-list">
        ${rowsHtml}
      </div>
    `;
  }

  function renderClassroomQuizSheet(container, words, unitTitle = '2026 Edition') {
    if (words.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding: 4rem 1rem; color: var(--text-slate-400);">此单元或筛选条件下暂无可打印生词</div>`;
      return;
    }
    const quizWords = words.slice(0, 10);
    // Shuffle English for matching
    const shuffledEnglish = [...quizWords].sort(() => Math.random() - 0.5);

    let matchingRowsHtml = '';
    quizWords.forEach((item, idx) => {
      const engItem = shuffledEnglish[idx];
      const letter = String.fromCharCode(65 + idx);
      const primaryHanzi = settings.charMode === 'simp' ? item.simp : (item.trad || item.simp);

      matchingRowsHtml += `
        <div class="quiz-matching-row">
          <div style="width: 45%;">
            <strong>${idx + 1}.</strong> ${primaryHanzi} (${settings.showPinyin ? item.pinyin : '______'})
          </div>
          <div style="width: 10%; text-align: center;">[ &nbsp;&nbsp;&nbsp;&nbsp; ]</div>
          <div style="width: 45%; text-align: right;">
            <strong>${letter}.</strong> ${engItem.word} — <small>${(engItem.definition || '').slice(0, 45)}...</small>
          </div>
        </div>
      `;
    });

    let fillRowsHtml = '';
    quizWords.slice(0, 6).forEach((item, idx) => {
      fillRowsHtml += `
        <div class="quiz-fill-row">
          <div style="width: 30px;"><strong>${idx + 1}.</strong></div>
          <div style="flex: 1;">
            <strong>${item.word}</strong> (${(item.definition || '').slice(0, 60)}...)
          </div>
          <div style="display: flex; gap: 1.5rem; align-items: center;">
            <div>拼音: <span class="fill-blank-line"></span></div>
            <div>汉字: <span class="fill-blank-line"></span></div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="sheet-header">
        <div class="sheet-header-title">
          <h2>中文生词随堂评估测试卷</h2>
          <p>Classroom Vocabulary Assessment Quiz · ${unitTitle}</p>
        </div>
        <div class="sheet-header-meta">
          <div>姓名：<span class="meta-item"></span></div>
          <div>班级：<span class="meta-item"></span></div>
          <div>成绩：<span class="meta-item"></span></div>
        </div>
      </div>

      <div class="quiz-sheet-section">
        <div class="quiz-sheet-section-title">一、 中英文配对连线题（将右侧对应英文字母填入括号中）</div>
        ${matchingRowsHtml}
      </div>

      <div class="quiz-sheet-section" style="margin-top: 2rem;">
        <div class="quiz-sheet-section-title">二、 看英文写汉字与拼音填空题</div>
        ${fillRowsHtml}
      </div>
    `;
  }

  function renderCutoutCardsSheet(container, words, unitTitle = '2026 Edition') {
    if (words.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding: 4rem 1rem; color: var(--text-slate-400);">此单元或筛选条件下暂无可打印生词</div>`;
      return;
    }
    let cardsHtml = '';
    words.forEach(item => {
      const primaryHanzi = settings.charMode === 'simp' ? item.simp : (item.trad || item.simp);
      cardsHtml += `
        <div class="cutout-card-item">
          <div class="cutout-card-front">
            <span class="cutout-card-hanzi">${primaryHanzi}</span>
            <span class="cutout-card-pinyin">${item.pinyin || ''}</span>
          </div>
          <div class="cutout-card-back">
            <div class="cutout-card-word">${item.word}</div>
            <div class="cutout-card-def">${item.definition || ''}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="sheet-header">
        <div class="sheet-header-title">
          <h2>中文双语便携复习卡（沿虚线剪裁）</h2>
          <p>Printable Chinese-English Pocket Flashcards · ${unitTitle}</p>
        </div>
        <div class="sheet-header-meta">
          <div>班级：<span class="meta-item"></span></div>
          <div>学生：<span class="meta-item"></span></div>
        </div>
      </div>
      <div class="cutout-cards-grid">
        ${cardsHtml}
      </div>
    `;
  }

  // Expose init to window
  window.addEventListener('DOMContentLoaded', initApp);
})();
