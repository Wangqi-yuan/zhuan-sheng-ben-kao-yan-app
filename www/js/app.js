/**
 * 专升本工程力学与工程测量 - APP主逻辑
 * 5阶段学习体系 + 双科切换 + 密钥保护
 */
(function() {
  'use strict';

  // ==================== 全局状态 ====================
  const STATE = {
    subject: 'mechanics',    // 'mechanics' | 'surveying'
    stage: 1,                // 1-5
    currentQuiz: null,       // 当前单题测验状态
    quizMode: null,          // 'scroll' | 'single' | null
    currentFullMock: null,   // 当前整套模拟卷
    scrollQuizAnswered: {},  // 滚动模式: {qIndex: userAnswer} (choice→optIndex, fill→string)
    scrollQuizCorrect: {},   // 滚动模式: {qIndex: bool}
    scrollQuizQuestions: [], // 滚动模式: question array
    scoreHistory: {},        // 成绩记录
    searchQuery: '',
    licenseChecked: false
  };

  // ==================== 工具函数 ====================
  const $ = (sel, parent) => (parent || document).querySelector(sel);
  const $$ = (sel, parent) => (parent || document).querySelectorAll(sel);
  const toast = (msg) => {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  };

  // ==================== 数据访问 ====================
  function getData() {
    return STATE.subject === 'mechanics' ? MechanicsData : SurveyingData;
  }
  function getStageMap() { return getData().stageMap; }
  function getKPs() { return getData().knowledgePoints; }
  function getQuizzes() { return getData().quizzes; }

  // ==================== 渲染引擎 ====================
  function render() {
    const stageMap = getStageMap();
    const stage = stageMap[STATE.stage];
    const headerTitle = STATE.subject === 'mechanics' ? '工程力学' : '工程测量';

    // Header
    $('#header-title').textContent = headerTitle;
    $('#btn-mechanics').classList.toggle('active', STATE.subject === 'mechanics');
    $('#btn-surveying').classList.toggle('active', STATE.subject === 'surveying');

    // Bottom Nav
    $$('.nav-item').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.stage) === STATE.stage);
    });

    // Content
    var main = $('#main-content');
    main.innerHTML = '';
    main.appendChild(buildStagePage(stage));
    finalizeStagePage(stage);
    main.scrollTop = 0;
  }

  function buildStagePage(stage) {
    var frag = document.createDocumentFragment();

    // 阶段标题卡
    var headerCard = document.createElement('div');
    headerCard.className = 'card ' + stage.color;
    headerCard.innerHTML = '<div class="flex-row"><span class="stage-dot stage-dot-' + STATE.stage + '"></span><span style="font-size:40px">' + stage.icon + '</span><div style="flex:1"><div class="fw-600" style="font-size:18px">' + stage.name + '</div><div class="text-sm color-secondary mt-8">' + stage.desc + '</div></div></div>';
    frag.appendChild(headerCard);

    // 阶段内容容器（提前创建，搜索栏之后用）
    var contentDiv = document.createElement('div');
    contentDiv.id = 'stage-content';
    frag.appendChild(contentDiv);

    return frag;
  }

  function finalizeStagePage(stage) {
    var main = $('#main-content');
    // 搜索栏（仅知识学习阶段）
    if (STATE.stage <= 3) {
      var searchDiv = document.createElement('div');
      searchDiv.className = 'search-bar';
      searchDiv.innerHTML = '<input type="text" placeholder="🔍 搜索知识点..." id="search-input" value="' + STATE.searchQuery + '">';
      // Insert after header card, before stage-content
      var stageContent = $('#stage-content', main);
      if (stageContent && stageContent.parentNode === main) {
        main.insertBefore(searchDiv, stageContent);
      }
      setTimeout(function() {
        var si = $('#search-input');
        if (si) si.addEventListener('input', function(e) {
          STATE.searchQuery = e.target.value;
          renderStageContent(main);
        });
      }, 0);
    }
    // 渲染内容
    setTimeout(function() { renderStageContent(main); }, 0);
  }

  function renderStageContent(parentEl) {
    var container = $('#stage-content', parentEl) || parentEl;
    container.innerHTML = '';

    if (STATE.stage <= 3) {
      renderKnowledgeStage(container);
    } else {
      renderMockStage(container);
    }
  }

  function renderKnowledgeStage(container) {
    const kps = getKPs();
    const stageMap = getStageMap();
    const stageInfo = stageMap[STATE.stage];
    const query = STATE.searchQuery.toLowerCase();

    // 筛选属于当前阶段的知识点
    let filtered = kps.filter(kp => stageInfo.kpIds.includes(kp.id));
    if (query) {
      filtered = kps.filter(kp => {
        return kp.title.toLowerCase().includes(query) ||
               kp.keywords.some(k => k.toLowerCase().includes(query)) ||
               kp.chapter.includes(query) ||
               (kp.content && kp.content.toLowerCase().includes(query));
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="icon">📭</div><div>暂无匹配的知识点</div></div>';
      return;
    }

    // 按章节分组
    const groups = {};
    filtered.forEach(kp => {
      if (!groups[kp.chapter]) groups[kp.chapter] = [];
      groups[kp.chapter].push(kp);
    });

    Object.keys(groups).forEach(chapter => {
      const chTitle = document.createElement('div');
      chTitle.className = 'fw-600 mt-12 mb-8';
      chTitle.style.cssText = 'font-size:14px;color:var(--primary);';
      chTitle.textContent = '📖 ' + chapter;
      container.appendChild(chTitle);

      groups[chapter].forEach(kp => {
        const card = document.createElement('div');
        card.className = 'card kp-card';
        const diffLabel = kp.difficulty === 1 ? '基础' : kp.difficulty === 2 ? '中等' : '困难';
        const diffClass = kp.difficulty === 1 ? 'badge-easy' : kp.difficulty === 2 ? 'badge-mid' : 'badge-hard';
        const weightStars = '🔥'.repeat(kp.examWeight || 1);

        card.innerHTML = `
          <div class="flex-between" data-action="toggle-kp" style="cursor:pointer">
            <div style="flex:1;min-width:0">
              <div class="kp-title">${kp.title}</div>
              <div class="text-xs color-secondary">${weightStars} 考频权重</div>
            </div>
            <span class="card-badge ${diffClass}">${diffLabel}</span>
          </div>
          <div class="kp-detail">
            <div style="margin-bottom:8px">${kp.content}</div>
            ${kp.formula ? '<div class="kp-formula">📝 $' + kp.formula + '$</div>' : ''}
            <div class="mt-8">
              ${kp.keywords.map(function(k) { return '<span class="chapter-tag">' + k + '</span>'; }).join('')}
            </div>
            <button class="quiz-btn secondary mt-12" data-action="chapter-quiz" data-chapter="${kp.chapter.replace(/"/g, '&quot;')}">
              📝 练习本章题目
            </button>
          </div>
        `;
        container.appendChild(card);
      });
    });

    // 添加章节练习入口
    if (STATE.stage >= 1 && !query) {
      const divider = document.createElement('div');
      divider.className = 'divider';
      container.appendChild(divider);

      const quizEntry = document.createElement('div');
      quizEntry.className = 'card';
      quizEntry.style.cssText = 'background: linear-gradient(135deg, #e3f2fd, #fff); cursor:pointer;';
      quizEntry.innerHTML = `
        <div class="flex-row">
          <span style="font-size:32px">📝</span>
          <div style="flex:1">
            <div class="fw-600">阶段测验 · ${getStageMap()[STATE.stage].name}</div>
            <div class="text-sm color-secondary">涵盖本阶段全部知识点</div>
          </div>
          <span style="font-size:20px">→</span>
        </div>
      `;
      quizEntry.addEventListener('click', () => startStageQuiz());
      container.appendChild(quizEntry);
    }
  }

  function renderMockStage(container) {
    var stageMap = getStageMap();
    var stageInfo = stageMap[STATE.stage];
    var quizzes = getQuizzes();
    var mockId = stageInfo.mockId;
    var questions = quizzes[mockId] || [];

    // 整套模拟卷section（阶段4/5顶部）
    var data = getData();
    if (data.fullMockSets && data.fullMockSets.length > 0) {
      var mockSetSection = document.createElement('div');
      mockSetSection.className = 'mock-set-section';
      mockSetSection.innerHTML = '<div class="section-title">📋 整套模拟卷（完整保留，含答案）</div>';

      data.fullMockSets.forEach(function(fms) {
        var card = document.createElement('div');
        card.className = 'mock-set-card';
        card.innerHTML = '<div class="flex-row">' +
          '<span class="ms-icon">📄</span>' +
          '<div style="flex:1;min-width:0">' +
            '<div class="ms-title">' + escapeHtml(fms.title) + '</div>' +
            '<div class="ms-meta">共 ' + countFullMockQuestions(fms) + ' 题 · 满分' + (fms.totalScore || 100) + '分 · ' + (fms.timeLimit || 120) + '分钟</div>' +
          '</div>' +
          '<span style="font-size:18px;color:var(--accent)">→</span>' +
        '</div>';
        card.addEventListener('click', function() { showMockModeDialog(fms); });
        mockSetSection.appendChild(card);
      });

      container.appendChild(mockSetSection);
    }

    if (questions.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="icon">🔧</div><div>模拟卷加载中...</div></div>';
      return;
    }

    // 统计题型分布
    const typeCount = {};
    questions.forEach(q => {
      const t = q.type === 'fill' ? '填空题' : q.type === 'choice' ? '选择题' : '计算题';
      typeCount[t] = (typeCount[t] || 0) + 1;
    });

    const info = document.createElement('div');
    info.className = 'card';
    info.innerHTML = `
      <div class="fw-600" style="font-size:16px;margin-bottom:8px">📋 ${STATE.subject === 'mechanics' ? '工程力学' : '工程测量'} ${stageInfo.name}卷</div>
      <div class="text-sm color-secondary">共 ${questions.length} 题 · ${Object.entries(typeCount).map(([k,v])=>k+v+'题').join(' · ')} · 满分150分</div>
      <div class="progress-bar mt-8"><div class="progress-fill" style="width:0%" id="mock-progress"></div></div>
      <div class="flex-between mt-8">
        <span class="text-xs color-secondary">限时 120 分钟</span>
        <span class="text-xs color-secondary" id="mock-score-display"></span>
      </div>
      <button class="quiz-btn mt-12" id="btn-start-mock">🚀 开始模考</button>
      <button class="quiz-btn secondary mt-8" id="btn-review-mock">📖 浏览模式（直接看答案）</button>
    `;
    container.appendChild(info);

    // 绑定按钮
    setTimeout(function() {
      var bsm = $('#btn-start-mock');
      var brm = $('#btn-review-mock');
      if (bsm) bsm.addEventListener('click', function() { startMockExam(questions, true); });
      if (brm) brm.addEventListener('click', function() { startMockExam(questions, false); });
    }, 0);
  }

  // ==================== 滚动刷题模式 ====================
  function countFullMockQuestions(fms) {
    var total = 0;
    if (!fms.sections) return 0;
    fms.sections.forEach(function(sec) {
      if (sec.questions) total += sec.questions.length;
    });
    return total;
  }

  function showMockModeDialog(fullMockSet) {
    // 收集所有题目到一个数组
    var allQuestions = [];
    fullMockSet.sections.forEach(function(sec) {
      if (sec.questions) allQuestions = allQuestions.concat(sec.questions);
    });
    if (allQuestions.length === 0) { toast('该试卷暂无题目'); return; }

    var overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.id = 'mock-mode-dialog';
    overlay.innerHTML = '<div class="dialog-box">' +
      '<button class="dialog-close" id="dlg-close-mockmode">&times;</button>' +
      '<div class="dialog-title">📋 ' + escapeHtml(fullMockSet.title) + '</div>' +
      '<div class="text-sm color-secondary mb-8">共 ' + allQuestions.length + ' 题 · 满分' + (fullMockSet.totalScore || 100) + '分 · ' + (fullMockSet.timeLimit || 120) + '分钟</div>' +
      '<div class="mode-select">' +
        '<div class="mode-option" data-mode="timed">' +
          '<span class="mo-icon">⏱️</span>' +
          '<div class="mo-info"><div class="mo-title">计时模考</div><div class="mo-desc">限时作答，模拟真实考试</div></div>' +
        '</div>' +
        '<div class="mode-option" data-mode="browse">' +
          '<span class="mo-icon">📖</span>' +
          '<div class="mo-info"><div class="mo-title">浏览模式</div><div class="mo-desc">直接看答案，用于复习</div></div>' +
        '</div>' +
      '</div>' +
    '</div>';
    document.body.appendChild(overlay);

    $('#dlg-close-mockmode', overlay).addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });

    var modeOpts = $$('.mode-option', overlay);
    modeOpts.forEach(function(opt) {
      opt.addEventListener('click', function() {
        var mode = opt.getAttribute('data-mode');
        overlay.remove();
        if (mode === 'timed') {
          startQuizSession(allQuestions, true);
        } else {
          startScrollingQuiz(allQuestions);
        }
      });
    });
  }

  function startScrollingQuiz(questions) {
    if (!questions || questions.length === 0) { toast('暂无题目'); return; }

    STATE.quizMode = 'scroll';
    STATE.currentQuiz = null;
    STATE.scrollQuizAnswered = {};
    STATE.scrollQuizCorrect = {};
    STATE.scrollQuizQuestions = questions;

    renderScrollingQuiz(questions);

    // 滚动到顶部
    var main = $('#main-content');
    if (main) main.scrollTop = 0;
  }

  function renderScrollingQuiz(questions) {
    var main = $('#main-content');
    var frag = document.createDocumentFragment();

    // 标题栏
    var titleBar = document.createElement('div');
    titleBar.className = 'card text-center';
    titleBar.style.cssText = 'background:linear-gradient(135deg,#e3f2fd,#fff);margin-bottom:12px';
    var stageName = getStageMap()[STATE.stage] ? getStageMap()[STATE.stage].name : '练习';
    titleBar.innerHTML = '<div style="font-size:18px;font-weight:600">📝 ' + stageName + ' · 滚动练习</div>' +
      '<div class="text-sm color-secondary mt-8">共 ' + questions.length + ' 题 · 点击选项作答 · 滚动浏览</div>' +
      '<button class="quiz-btn secondary mt-8" style="width:auto;padding:6px 16px" data-action="go-to-stage">↩ 返回</button>';
    frag.appendChild(titleBar);

    // 按章节分组
    var chapters = [];
    var chapterMap = {};
    questions.forEach(function(q, i) {
      var ch = q.chapter || '其他';
      if (!chapterMap[ch]) { chapterMap[ch] = []; chapters.push(ch); }
      chapterMap[ch].push({q: q, index: i});
    });

    var scrollContainer = document.createElement('div');
    scrollContainer.className = 'quiz-scroll-container';
    scrollContainer.id = 'scroll-quiz-container';

    chapters.forEach(function(ch) {
      // 章节分区标题
      var chQs = chapterMap[ch];
      var partition = document.createElement('div');
      partition.className = 'chapter-partition';
      partition.innerHTML = '<span class="ch-num">' + chQs.length + '</span>' +
        '<span class="ch-title">' + escapeHtml(ch) + '</span>' +
        '<span class="ch-count">' + chQs.length + '题</span>';
      scrollContainer.appendChild(partition);

      // 各题卡片
      chQs.forEach(function(item) {
        scrollContainer.appendChild(buildScrollQuizCard(item.q, item.index));
      });
    });

    frag.appendChild(scrollContainer);
    main.innerHTML = '';
    main.appendChild(frag);

    // 构建浮动提交栏
    buildFloatingBar(main);

    // 事件委托：滚动模式
    setupScrollQuizListeners(scrollContainer);

    main.scrollTop = 0;
  }

  function buildScrollQuizCard(q, index) {
    var card = document.createElement('div');
    card.className = 'quiz-scroll-card';
    card.setAttribute('data-qindex', index);

    // 题号 + 类型标签
    var typeLabel = q.type === 'choice' ? '选择题' : q.type === 'fill' ? '填空题' : '计算题';
    var typeClass = q.type === 'choice' ? 'q-type-choice' : q.type === 'fill' ? 'q-type-fill' : 'q-type-calc';

    var headerHtml = '<span class="q-number">' + (index + 1) + '</span>' +
      '<span class="q-type-tag ' + typeClass + '">' + typeLabel + '</span>';
    if (q.difficulty >= 4) headerHtml += '<span class="card-badge badge-hard" style="margin-left:4px">压轴</span>';
    else if (q.difficulty === 3) headerHtml += '<span class="card-badge badge-mid" style="margin-left:4px">进阶</span>';

    // 题干
    var stemHtml = '<div class="q-stem">' + (q.q || '') + '</div>';

    // SVG配图
    var diagramHtml = '';
    if (q.svg && window.SvgDiagrams && typeof window.SvgDiagrams.get === 'function') {
      try {
        var svgStr = window.SvgDiagrams.get(q.svg);
        if (svgStr) {
          diagramHtml = '<div class="q-diagram">' + svgStr + '</div>';
        }
      } catch(e) { /* silent */ }
    }

    // 选项区域
    var optionsHtml = '';
    var answered = STATE.scrollQuizAnswered.hasOwnProperty(index);
    if (q.type === 'choice') {
      optionsHtml = '<div class="q-options">';
      for (var i = 0; i < q.opts.length; i++) {
        var label = String.fromCharCode(65 + i);
        var stateClass = '';
        if (answered) {
          var userAns = STATE.scrollQuizAnswered[index];
          if (i === q.ans) stateClass = ' correct';
          else if (i === userAns) stateClass = ' wrong';
        }
        optionsHtml += '<button class="q-option-btn' + stateClass + '" data-action="select-scroll-option" data-qindex="' + index + '" data-optindex="' + i + '"' + (answered ? ' disabled' : '') + '>' + label + '. ' + escapeHtml(q.opts[i]) + '</button>';
      }
      optionsHtml += '</div>';
    } else {
      // 填空/计算题：输入框
      var fillVal = answered ? STATE.scrollQuizAnswered[index] : '';
      var fillStateClass = '';
      if (answered) {
        fillStateClass = STATE.scrollQuizCorrect[index] ? ' correct' : ' wrong';
      }
      optionsHtml = '<input type="text" class="q-fill-input' + fillStateClass + '" data-action="scroll-fill-input" data-qindex="' + index + '" placeholder="输入答案..." value="' + escapeHtml(fillVal) + '"' + (answered ? ' disabled' : '') + '>';
      optionsHtml += '<button class="q-action-btn primary" data-action="scroll-fill-submit" data-qindex="' + index + '" style="width:100%;margin-top:4px"' + (answered ? ' disabled' : '') + '>✓ 提交答案</button>';
    }

    // 答案展示区
    var answerHtml = '<div class="q-answer-reveal" id="scroll-answer-' + index + '">' +
      '<div class="reveal-ans">✅ 正确答案：' + escapeHtml(q.ans || '') + '</div>' +
      (q.explain ? '<div class="reveal-explain">📖 ' + escapeHtml(q.explain) + '</div>' : '') +
      '</div>';

    // 操作按钮行
    var actionsHtml = '<div class="q-actions">' +
      '<button class="q-action-btn" data-action="toggle-scroll-answer" data-qindex="' + index + '">💡 显示答案</button>' +
      '<button class="q-action-btn" data-action="reset-scroll-question" data-qindex="' + index + '"' + (!answered ? ' style="display:none"' : '') + '>🔄 重做</button>' +
      '</div>';

    card.innerHTML = headerHtml + stemHtml + diagramHtml + optionsHtml + answerHtml + actionsHtml;
    return card;
  }

  function buildFloatingBar(parentEl) {
    // 移除旧浮动栏
    var oldBar = document.getElementById('quiz-floating-bar');
    if (oldBar) oldBar.remove();

    var bar = document.createElement('div');
    bar.className = 'quiz-floating-bar';
    bar.id = 'quiz-floating-bar';
    bar.style.display = 'none';
    bar.innerHTML = '<div class="fb-stats">已答 <span id="fb-answered">0</span>/' + STATE.scrollQuizQuestions.length + ' 题 · 正确 <span id="fb-correct">0</span></div>' +
      '<button class="fb-submit" data-action="submit-scroll-quiz">📊 提交批改</button>';
    parentEl.appendChild(bar);
    updateFloatingBar();
  }

  function setupScrollQuizListeners(container) {
    container.addEventListener('click', function(e) {
      var el = e.target;
      // 向上查找带data-action的元素
      while (el && el !== container) {
        var action = el.getAttribute('data-action');
        if (action) break;
        el = el.parentElement;
      }
      if (!el || el === container) return;
      var action = el.getAttribute('data-action');

      // 仅处理滚动模式专属action，阻止冒泡防止主事件委托重复处理
      var scrollActions = ['select-scroll-option','toggle-scroll-answer','reset-scroll-question','scroll-fill-submit','submit-scroll-quiz'];
      if (scrollActions.indexOf(action) === -1) return;

      e.stopPropagation();
      var qindex = parseInt(el.getAttribute('data-qindex'));
      switch (action) {
        case 'select-scroll-option':
          selectScrollOption(qindex, parseInt(el.getAttribute('data-optindex')));
          break;
        case 'scroll-fill-submit':
          var inputEl = container.querySelector('input[data-qindex="' + qindex + '"]');
          if (inputEl) scrollFillSubmit(qindex, inputEl.value.trim());
          break;
        case 'toggle-scroll-answer':
          toggleScrollAnswer(qindex);
          break;
        case 'reset-scroll-question':
          resetScrollQuestion(qindex);
          break;
        case 'submit-scroll-quiz':
          submitScrollQuiz();
          break;
        case 'go-to-stage':
          if (typeof goToStage === 'function') goToStage();
          break;
      }
    });

    // 填空输入框change事件
    container.addEventListener('change', function(e) {
      if (e.target.getAttribute('data-action') === 'scroll-fill-input') {
        // 不自动提交，等用户点提交按钮
      }
    });
  }

  function toggleScrollAnswer(index) {
    var answerEl = document.getElementById('scroll-answer-' + index);
    if (!answerEl) return;
    var isShowing = answerEl.classList.contains('show');
    if (isShowing) {
      answerEl.classList.remove('show');
      // 更新按钮文字
      var btn = document.querySelector('[data-action="toggle-scroll-answer"][data-qindex="' + index + '"]');
      if (btn) btn.textContent = '💡 显示答案';
    } else {
      answerEl.classList.add('show');
      var btn = document.querySelector('[data-action="toggle-scroll-answer"][data-qindex="' + index + '"]');
      if (btn) btn.textContent = '🙈 隐藏答案';
    }
  }

  function selectScrollOption(qindex, optIndex) {
    if (STATE.scrollQuizAnswered.hasOwnProperty(qindex)) return; // 已答不可改
    var q = STATE.scrollQuizQuestions[qindex];
    if (!q) return;

    STATE.scrollQuizAnswered[qindex] = optIndex;
    var correct = (optIndex === q.ans);
    STATE.scrollQuizCorrect[qindex] = correct;

    // 更新UI — 刷新该题卡片
    refreshScrollCard(qindex);
    updateFloatingBar();
  }

  function scrollFillSubmit(qindex, value) {
    if (!value) { toast('请输入答案'); return; }
    if (STATE.scrollQuizAnswered.hasOwnProperty(qindex)) return;

    var q = STATE.scrollQuizQuestions[qindex];
    if (!q) return;

    STATE.scrollQuizAnswered[qindex] = value;
    // 判断填空是否正确
    var isCorrect = scrollCheckFillAnswer(q, value);
    STATE.scrollQuizCorrect[qindex] = isCorrect;

    refreshScrollCard(qindex);
    updateFloatingBar();
  }

  function scrollCheckFillAnswer(q, userAns) {
    if (!userAns) return false;
    var ua = String(userAns).trim().toLowerCase().replace(/\s+/g, '');
    var ca = String(q.ans).trim().toLowerCase().replace(/\s+/g, '')
      .replace(/[；;]/g, ';').replace(/[，,]/g, ',');
    if (ca.includes(';')) {
      var parts = ca.split(';');
      return parts.every(function(p) { return ua.indexOf(p.trim()) !== -1; });
    }
    return ua === ca || ua.indexOf(ca) !== -1 || ca.indexOf(ua) !== -1;
  }

  function refreshScrollCard(index) {
    var oldCard = document.querySelector('.quiz-scroll-card[data-qindex="' + index + '"]');
    if (!oldCard) return;
    var q = STATE.scrollQuizQuestions[index];
    if (!q) return;
    var newCard = buildScrollQuizCard(q, index);
    oldCard.parentNode.replaceChild(newCard, oldCard);
  }

  function resetScrollQuestion(index) {
    delete STATE.scrollQuizAnswered[index];
    delete STATE.scrollQuizCorrect[index];
    refreshScrollCard(index);
    updateFloatingBar();
  }

  function submitScrollQuiz() {
    var total = STATE.scrollQuizQuestions.length;
    var answered = Object.keys(STATE.scrollQuizAnswered).length;
    if (answered === 0) { toast('请至少完成一道题再提交'); return; }

    // 展开所有未作答题的答案
    for (var i = 0; i < total; i++) {
      var answerEl = document.getElementById('scroll-answer-' + i);
      if (answerEl) answerEl.classList.add('show');
      var btn = document.querySelector('[data-action="toggle-scroll-answer"][data-qindex="' + i + '"]');
      if (btn) btn.textContent = '🙈 隐藏答案';
    }

    // 统计分数
    var correct = 0;
    Object.keys(STATE.scrollQuizCorrect).forEach(function(k) {
      if (STATE.scrollQuizCorrect[k]) correct++;
    });
    var score = answered > 0 ? Math.round(correct / total * 100) : 0;
    var stars = score >= 90 ? '⭐⭐⭐' : score >= 70 ? '⭐⭐' : score >= 60 ? '⭐' : '💪';

    // 保存成绩
    var key = STATE.subject + '_stage' + STATE.stage;
    var history = JSON.parse(localStorage.getItem('_score_history') || '{}');
    if (!history[key] || score > history[key]) history[key] = score;
    localStorage.setItem('_score_history', JSON.stringify(history));

    // 滚动到顶部显示分数
    var scrollContainer = document.getElementById('scroll-quiz-container');
    if (scrollContainer) {
      var scoreCard = document.createElement('div');
      scoreCard.className = 'card text-center';
      scoreCard.id = 'scroll-score-card';
      scoreCard.innerHTML = '<div style="font-size:48px;margin-bottom:4px">' + stars + '</div>' +
        '<div style="font-size:32px;font-weight:700;color:' + (score >= 60 ? 'var(--success)' : 'var(--danger)') + '">' + score + '分</div>' +
        '<div class="text-sm color-secondary mt-8">正确 ' + correct + '/' + total + ' 题 · 已答 ' + answered + ' 题</div>' +
        '<div class="score-grid mt-12">' +
          '<div class="score-item"><div class="val" style="color:var(--success)">' + correct + '</div><div class="lbl">✅ 正确</div></div>' +
          '<div class="score-item"><div class="val" style="color:var(--danger)">' + (total - correct) + '</div><div class="lbl">❌ 错误/未答</div></div>' +
        '</div>' +
        (score < 60 ? '<div class="text-sm color-secondary mt-8">💡 建议：回顾对应知识点后再练习</div>' : '') +
        '<button class="quiz-btn mt-12" data-action="go-to-stage">↩ 返回阶段页</button>';
      scrollContainer.insertBefore(scoreCard, scrollContainer.firstChild);
    }

    // 隐藏浮动栏
    var bar = document.getElementById('quiz-floating-bar');
    if (bar) bar.style.display = 'none';

    // 滚动到顶部
    var main = $('#main-content');
    if (main) main.scrollTop = 0;

    STATE.quizMode = null;
  }

  function updateFloatingBar() {
    var bar = document.getElementById('quiz-floating-bar');
    if (!bar) return;
    var answered = Object.keys(STATE.scrollQuizAnswered).length;
    var correct = 0;
    Object.keys(STATE.scrollQuizCorrect).forEach(function(k) {
      if (STATE.scrollQuizCorrect[k]) correct++;
    });

    var fbAnswered = document.getElementById('fb-answered');
    var fbCorrect = document.getElementById('fb-correct');
    if (fbAnswered) fbAnswered.textContent = answered;
    if (fbCorrect) fbCorrect.textContent = correct;

    bar.style.display = answered > 0 ? 'flex' : 'none';
  }

  // ==================== 测验系统 ====================
  function startStageQuiz() {
    var quizzes = getQuizzes();
    var questions = [];
    if (STATE.stage === 1) questions = quizzes.foundation || [];
    else if (STATE.stage === 2) questions = quizzes.specialized || [];
    else questions = quizzes.advanced || [];
    // 阶段1-3 使用滚动模式
    startScrollingQuiz(questions);
  }

  function startMockExam(questions, timed) {
    startQuizSession(questions, timed);
  }

  function startQuizSession(questions, timed) {
    if (!questions || questions.length === 0) {
      toast('暂无题目');
      return;
    }

    STATE.currentQuiz = {
      questions: questions,
      currentIndex: 0,
      answers: new Array(questions.length).fill(null),
      correctCount: 0,
      timed: timed,
      startTime: Date.now(),
      totalQuestions: questions.length
    };

    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const quiz = STATE.currentQuiz;
    if (!quiz) return;

    const q = quiz.questions[quiz.currentIndex];
    const main = $('#main-content');
    const progress = ((quiz.currentIndex) / quiz.totalQuestions * 100).toFixed(0);

    let html = `
      <div class="card">
        <div class="flex-between mb-8">
          <span class="text-sm color-secondary">第 ${quiz.currentIndex + 1}/${quiz.totalQuestions} 题</span>
          <span class="text-xs" style="color:var(--primary)">进度 ${progress}%</span>
        </div>
        <div class="progress-bar mb-8">
          <div class="progress-fill" style="width:${progress}%"></div>
        </div>
        <div style="font-size:14px;color:var(--text-secondary);margin-bottom:4px">
          ${q.chapter ? '[' + q.chapter + '] ' : ''}${q.type === 'fill' ? '填空题' : q.type === 'choice' ? '选择题' : '计算题'}
        </div>
        <div class="quiz-question">${q.q}</div>
        ${q.svg && window.SvgDiagrams && window.SvgDiagrams.get ? '<div class="q-diagram">' + window.SvgDiagrams.get(q.svg) + '</div>' : ''}
    `;

    if (q.type === 'choice') {
      html += '<div class="quiz-options">';
      q.opts.forEach(function(opt, i) {
        var stateClass = getOptionClass(quiz, q, i);
        html += '<div class="quiz-option ' + stateClass + '" data-action="select-answer" data-index="' + i + '">' + String.fromCharCode(65+i) + '. ' + opt + '</div>';
      });
      html += '</div>';
    } else {
      var userAns = quiz.answers[quiz.currentIndex] || '';
      var showResult = quiz.answers[quiz.currentIndex] !== null;
      html += '<input type="text" class="quiz-option" style="width:100%;text-align:left;font-family:monospace" id="fill-answer-input" placeholder="输入答案..." value="' + escapeHtml(userAns) + '" data-action="fill-input" ' + (showResult ? 'disabled' : '') + '>';
      if (showResult) {
        html += '<div class="quiz-result ' + (isAnswerCorrect(quiz, q) ? 'correct' : 'wrong') + ' show">' + (isAnswerCorrect(quiz, q) ? '✅ 正确' : '❌ 错误') + ' — 答案: ' + q.ans + '</div>';
      }
    }

    html += '<div class="flex-between mt-12">';
    html += '<button class="quiz-btn secondary" style="width:auto;padding:8px 20px" data-action="prev-question"' + (quiz.currentIndex === 0 ? ' disabled' : '') + '>← 上一题</button>';
    html += '<button class="quiz-btn" style="width:auto;padding:8px 20px" data-action="next-question">' + (quiz.currentIndex === quiz.totalQuestions - 1 ? '完成交卷' : '下一题 →') + '</button>';
    html += '</div>';
    html += '</div>';

    main.innerHTML = html;
    main.scrollTop = 0;
  }

  function getOptionClass(quiz, q, index) {
    const userAns = quiz.answers[quiz.currentIndex];
    if (userAns === null) return '';

    if (index === q.ans) return 'reveal-correct';
    if (index === userAns && userAns !== q.ans) return 'wrong';
    return '';
  }

  function isAnswerCorrect(quiz, q) {
    const userAns = quiz.answers[quiz.currentIndex];
    if (q.type === 'choice') return userAns === q.ans;
    // fill: simple string comparison (case insensitive, trim)
    if (userAns === null) return false;
    const ua = String(userAns).trim().toLowerCase().replace(/\s+/g, '');
    const ca = String(q.ans).trim().toLowerCase().replace(/\s+/g, '')
      .replace(/[；;]/g, ';').replace(/[，,]/g, ','); // normalize
    // Check if user answer contains key parts
    if (ca.includes(';')) {
      const parts = ca.split(';');
      return parts.every(p => ua.includes(p.trim()));
    }
    return ua === ca || ua.includes(ca) || ca.includes(ua);
  }

  function selectAnswer(index) {
    const quiz = STATE.currentQuiz;
    if (!quiz || quiz.answers[quiz.currentIndex] !== null) return;
    quiz.answers[quiz.currentIndex] = index;
    const q = quiz.questions[quiz.currentIndex];
    if (index === q.ans) quiz.correctCount++;
    renderQuizQuestion();
  }

  function submitFillAnswer(value) {
    const quiz = STATE.currentQuiz;
    if (!quiz || quiz.answers[quiz.currentIndex] !== null) return;
    quiz.answers[quiz.currentIndex] = value;
    const q = quiz.questions[quiz.currentIndex];
    if (isAnswerCorrect(quiz, q)) quiz.correctCount++;
    renderQuizQuestion();
  }

  function prevQuestion() {
    if (!STATE.currentQuiz) return;
    STATE.currentQuiz.currentIndex = Math.max(0, STATE.currentQuiz.currentIndex - 1);
    renderQuizQuestion();
  }

  function nextQuestion() {
    const quiz = STATE.currentQuiz;
    if (!quiz) return;

    if (quiz.currentIndex >= quiz.totalQuestions - 1) {
      finishQuiz();
      return;
    }
    quiz.currentIndex++;
    renderQuizQuestion();
  }

  function finishQuiz() {
    const quiz = STATE.currentQuiz;
    if (!quiz) return;

    const total = quiz.totalQuestions;
    const correct = quiz.correctCount;
    const score = Math.round(correct / total * 100);
    const elapsed = Math.round((Date.now() - quiz.startTime) / 60000);
    const stars = score >= 90 ? '⭐⭐⭐' : score >= 70 ? '⭐⭐' : score >= 60 ? '⭐' : '💪';

    // 保存成绩
    const key = `${STATE.subject}_stage${STATE.stage}`;
    const history = JSON.parse(localStorage.getItem('_score_history') || '{}');
    if (!history[key] || score > history[key]) history[key] = score;
    localStorage.setItem('_score_history', JSON.stringify(history));

    const main = $('#main-content');
    main.innerHTML = `
      <div class="card text-center">
        <div style="font-size:60px;margin-bottom:8px">${stars}</div>
        <div style="font-size:36px;font-weight:700;color:${score >= 60 ? 'var(--success)' : 'var(--danger)'}">${score}分</div>
        <div class="text-sm color-secondary mt-8">正确 ${correct}/${total} 题 · 用时 ${elapsed} 分钟</div>
        <div class="score-grid mt-12">
          <div class="score-item">
            <div class="val" style="color:var(--success)">${correct}</div>
            <div class="lbl">✅ 正确</div>
          </div>
          <div class="score-item">
            <div class="val" style="color:var(--danger)">${total - correct}</div>
            <div class="lbl">❌ 错误</div>
          </div>
        </div>
        ${score < 60 ? '<div class="text-sm color-secondary mt-8">💡 建议：回顾对应知识点后再练习</div>' : ''}
        <button class="quiz-btn mt-12" data-action="retry-quiz">🔄 重新作答</button>
        <button class="quiz-btn secondary mt-8" data-action="review-answers">📖 查看解析</button>
        <button class="quiz-btn secondary mt-8" data-action="go-to-stage">↩ 返回</button>
      </div>
    `;
    main.scrollTop = 0;
    STATE.currentQuiz = null;
  }

  function retryQuiz() {
    STATE.currentQuiz = null;
    if (STATE.stage >= 4) {
      const quizzes = getQuizzes();
      const mockId = getStageMap()[STATE.stage].mockId;
      startQuizSession(quizzes[mockId] || [], STATE.stage >= 4);
    } else {
      startStageQuiz();
    }
  }

  function reviewAnswers() {
    // Simple review: go back to first question in review mode
    if (!STATE.currentQuiz) {
      // Load the last completed quiz for review
      toast('请先完成一次测验');
      return;
    }
    // Re-render with all answers visible
    STATE.currentQuiz.currentIndex = 0;
    STATE.currentQuiz.answers.fill(0); // Mark all as answered to show results
    renderQuizQuestion();
  }

  function goToStage() {
    STATE.currentQuiz = null;
    STATE.quizMode = null;
    STATE.scrollQuizAnswered = {};
    STATE.scrollQuizCorrect = {};
    STATE.scrollQuizQuestions = [];
    render();
  }

  // ==================== 导航 ====================
  function switchSubject(subject) {
    STATE.subject = subject;
    STATE.searchQuery = '';
    STATE.currentQuiz = null;
    STATE.quizMode = null;
    STATE.scrollQuizAnswered = {};
    STATE.scrollQuizCorrect = {};
    STATE.scrollQuizQuestions = [];
    render();
  }

  function switchStage(stage) {
    STATE.stage = parseInt(stage);
    STATE.currentQuiz = null;
    STATE.quizMode = null;
    STATE.scrollQuizAnswered = {};
    STATE.scrollQuizCorrect = {};
    STATE.scrollQuizQuestions = [];
    STATE.searchQuery = '';
    render();
  }

  // ==================== 激活系统 ====================
  function checkLicense() {
    const license = LicenseSystem.getSavedLicense();
    if (license.activated) {
      // 验证是否仍有效
      const result = LicenseSystem.validateLicense(license.machineCode, license.key);
      if (result.valid) {
        STATE.licenseChecked = true;
        return true;
      }
      // 过期或无效，清除
      LicenseSystem.clearLicense();
    }
    return false;
  }

  function showLicenseDialog() {
    const mc = LicenseSystem.getMachineCode();
    const trialInfo = LicenseSystem.getTrialInfo();

    const overlay = document.createElement('div');
    overlay.className = 'license-overlay';
    overlay.id = 'license-overlay';
    overlay.innerHTML = `
      <div class="license-box">
        <h2>🔐 软件激活</h2>
        <div class="subtitle">专升本工程力学与工程测量备考系统</div>
        ${trialInfo.inTrial ? `
          <div style="background:#fff3e0;padding:10px;border-radius:8px;margin:12px 0">
            <div class="fw-600" style="color:#e65100">⏰ 试用期剩余 ${trialInfo.daysLeft} 天</div>
            <div class="text-xs color-secondary">试用期间功能完整，到期后需激活</div>
          </div>
        ` : `
          <div style="background:#fce4ec;padding:10px;border-radius:8px;margin:12px 0">
            <div class="fw-600" style="color:#c62828">试用期已结束</div>
            <div class="text-xs color-secondary">请输入激活码继续使用</div>
          </div>
        `}
        <div class="text-xs color-secondary mt-8">您的机器码（点击复制发送给卖家）</div>
        <div class="machine-code" onclick="if(navigator.clipboard){navigator.clipboard.writeText(this.textContent).then(function(){App._toast('机器码已复制')}).catch(function(){})}">${mc}</div>
        <input type="text" id="license-input" placeholder="请输入激活码" maxlength="80" autocomplete="off">
        <div id="license-msg"></div>
        <button class="quiz-btn mt-12" id="btn-activate">🔓 激活</button>
        ${trialInfo.inTrial ? `<button class="quiz-btn secondary mt-8" id="btn-trial">⏰ 试用 ${trialInfo.daysLeft} 天（免费）</button>` : ''}
        <div class="hint mt-8">💡 获取激活码请联系卖家，提供您的机器码</div>
      </div>
    `;
    document.body.appendChild(overlay);

    $('#btn-activate', overlay).addEventListener('click', () => {
      const key = $('#license-input', overlay).value.trim();
      if (!key) { $('#license-msg', overlay).innerHTML = '<div class="error">请输入激活码</div>'; return; }
      const result = LicenseSystem.validateLicense(mc, key);
      if (result.valid) {
        LicenseSystem.saveLicense(mc, key, result);
        $('#license-msg', overlay).innerHTML = `<div class="success">${result.msg}</div>`;
        setTimeout(() => { overlay.remove(); STATE.licenseChecked = true; render(); }, 1000);
      } else {
        $('#license-msg', overlay).innerHTML = `<div class="error">${result.msg}</div>`;
      }
    });

    const btnTrial = $('#btn-trial', overlay);
    if (btnTrial) {
      btnTrial.addEventListener('click', () => {
        overlay.remove();
        STATE.licenseChecked = true;
        render();
      });
    }
  }

  // ==================== 事件委托 ====================
  function setupEventDelegation() {
    var main = $('#main-content');
    main.addEventListener('click', function(e) {
      var el = e.target;
      // Walk up to find a data-action element
      while (el && el !== main) {
        var action = el.getAttribute('data-action');
        if (action) break;
        el = el.parentElement;
      }
      if (!el || el === main) return;
      var action = el.getAttribute('data-action');

      switch (action) {
        case 'toggle-kp':
          var card = el.closest('.kp-card');
          if (card) { var detail = card.querySelector('.kp-detail'); if (detail) detail.classList.toggle('show'); }
          break;
        case 'chapter-quiz':
          App.startChapterQuiz(el.getAttribute('data-chapter'));
          break;
        case 'select-answer':
          App.selectAnswer(parseInt(el.getAttribute('data-index')));
          break;
        case 'submit-fill':
          App.submitFillAnswer($('#fill-answer-input', main).value);
          break;
        case 'prev-question':
          App.prevQuestion();
          break;
        case 'next-question':
          App.nextQuestion();
          break;
        case 'retry-quiz':
          App.retryQuiz();
          break;
        case 'review-answers':
          App.reviewAnswers();
          break;
        case 'go-to-stage':
          App.goToStage();
          break;
        case 'select-scroll-option':
          App._selectScrollOption(
            parseInt(el.getAttribute('data-qindex')),
            parseInt(el.getAttribute('data-optindex'))
          );
          break;
        case 'toggle-scroll-answer':
          App._toggleScrollAnswer(parseInt(el.getAttribute('data-qindex')));
          break;
        case 'reset-scroll-question':
          App._resetScrollQuestion(parseInt(el.getAttribute('data-qindex')));
          break;
        case 'scroll-fill-submit':
          App._scrollFillSubmit(parseInt(el.getAttribute('data-qindex')));
          break;
        case 'submit-scroll-quiz':
          App._submitScrollQuiz();
          break;
      }
    });

    // Input change handler for fill answer (delegated)
    main.addEventListener('change', function(e) {
      if (e.target.getAttribute('data-action') === 'fill-input') {
        App.submitFillAnswer(e.target.value);
      }
    });
  }

  // ==================== 初始化 ====================
  function init() {
    try {
      // 检查激活状态
      var licensed = checkLicense();
      if (!licensed) {
        var trialInfo = LicenseSystem.getTrialInfo();
        if (!trialInfo.inTrial) {
          showLicenseDialog();
          return;
        }
        // 有试用期，先展示激活弹窗（可跳过）
        setTimeout(function() { showLicenseDialog(); }, 500);
      }
      STATE.licenseChecked = true;

      // 绑定事件
      var btnM = $('#btn-mechanics');
      var btnS = $('#btn-surveying');
      if (btnM) btnM.addEventListener('click', function() { switchSubject('mechanics'); });
      if (btnS) btnS.addEventListener('click', function() { switchSubject('surveying'); });
      $$('.nav-item').forEach(function(el) {
        el.addEventListener('click', function() { switchStage(el.dataset.stage); });
      });

      // 设置事件委托
      setupEventDelegation();

      // 初始渲染
      render();
    } catch (e) {
      // 致命错误时至少显示错误信息
      var main = $('#main-content');
      if (main) {
        main.innerHTML = '<div class="empty-state"><div class="icon" style="font-size:48px">⚠️</div><div style="color:#d50000;font-weight:600">应用初始化失败</div><div class="text-sm color-secondary mt-8">错误: ' + e.message + '</div><div class="text-xs color-secondary mt-8">请尝试重新安装或联系技术支持</div></div>';
      }
    }
  }

  // ==================== 对外暴露API ====================
  window.App = {
    init: init,
    switchSubject: switchSubject,
    switchStage: switchStage,
    selectAnswer: selectAnswer,
    submitFillAnswer: submitFillAnswer,
    prevQuestion: prevQuestion,
    nextQuestion: nextQuestion,
    retryQuiz: retryQuiz,
    reviewAnswers: reviewAnswers,
    goToStage: goToStage,
    _selectScrollOption: selectScrollOption,
    _toggleScrollAnswer: toggleScrollAnswer,
    _resetScrollQuestion: resetScrollQuestion,
    _scrollFillSubmit: function(index) {
      var inputEl = document.querySelector('input[data-qindex="' + index + '"]');
      if (inputEl) scrollFillSubmit(index, inputEl.value.trim());
    },
    _submitScrollQuiz: submitScrollQuiz,
    startChapterQuiz: function(chapter) {
      var kps = getKPs().filter(function(kp) { return kp.chapter === chapter; });
      var quizzes = getQuizzes();
      var questions = [];
      // 收集该章节相关题目
      [quizzes.foundation, quizzes.specialized, quizzes.advanced].forEach(function(pool) {
        if (!pool) return;
        pool.forEach(function(q) {
          if (q.chapter && chapter.indexOf(q.chapter.replace('第','').replace('章','').trim()) !== -1) {
            questions.push(q);
          }
        });
      });
      if (questions.length === 0) {
        questions = quizzes.foundation || [];
      }
      startScrollingQuiz(questions.slice(0, 15));
    },
    _toast: toast,
    getState: () => STATE
  };

  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// 工具函数
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
