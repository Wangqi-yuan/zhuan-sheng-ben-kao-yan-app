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
    currentQuiz: null,       // 当前测验状态
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
    const stageMap = getStageMap();
    const stageInfo = stageMap[STATE.stage];
    const quizzes = getQuizzes();
    const mockId = stageInfo.mockId;
    const questions = quizzes[mockId] || [];

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

  // ==================== 测验系统 ====================
  function startStageQuiz() {
    const quizzes = getQuizzes();
    let questions = [];
    if (STATE.stage === 1) questions = quizzes.foundation || [];
    else if (STATE.stage === 2) questions = quizzes.specialized || [];
    else questions = quizzes.advanced || [];
    startQuizSession(questions, false);
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
    render();
  }

  // ==================== 导航 ====================
  function switchSubject(subject) {
    STATE.subject = subject;
    STATE.searchQuery = '';
    STATE.currentQuiz = null;
    render();
  }

  function switchStage(stage) {
    STATE.stage = parseInt(stage);
    STATE.currentQuiz = null;
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
    init,
    switchSubject,
    switchStage,
    selectAnswer,
    submitFillAnswer,
    prevQuestion,
    nextQuestion,
    retryQuiz,
    reviewAnswers,
    goToStage,
    startChapterQuiz: (chapter) => {
      const kps = getKPs().filter(kp => kp.chapter === chapter);
      const quizzes = getQuizzes();
      let questions = [];
      // 收集该章节相关题目
      [quizzes.foundation, quizzes.specialized, quizzes.advanced].forEach(pool => {
        if (!pool) return;
        pool.forEach(q => {
          if (q.chapter && chapter.includes(q.chapter.replace('第','').replace('章','').trim())) {
            questions.push(q);
          }
        });
      });
      if (questions.length === 0) {
        // 没有对应题目，拉取全部基础题
        questions = quizzes.foundation || [];
      }
      startQuizSession(questions.slice(0, 10), false); // 最多10题
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
