let score = 0; 
let currentIndex = 0;
let selectedOption = null;
let state = 'question';

const quizData = [
    { id: 1, kanji: "会社員", furigana: "かいしゃいん", options: ["银行员", "医生", "公司职员", "研究人员"], correctAnswer: "公司职员" },
    { id: 2, kanji: "銀行員", furigana: "ぎんこういん", options: ["银行行员", "教师", "医生", "学生"], correctAnswer: "银行行员" },
    { id: 3, kanji: "医者", furigana: "いしゃ", options: ["老师", "医生", "职员", "研究者"], correctAnswer: "医生" },
    { id: 4, kanji: "研究者", furigana: "けんきゅうしゃ", options: ["学生", "大学", "研究人员", "教师"], correctAnswer: "研究人员" },
    { id: 5, kanji: "辞書", furigana: "じしょ", options: ["书", "报纸", "字典", "雑誌"], correctAnswer: "字典" },
    { id: 6, kanji: "名刺", furigana: "めいし", options: ["名片", "笔记", "卡片", "钥匙"], correctAnswer: "名片" },
    { id: 7, kanji: "時計", furigana: "とけい", options: ["伞", "钟表", "包", "汽车"], correctAnswer: "钟表" },
    { id: 8, kanji: "机", furigana: "つくえ", options: ["椅子", "桌子", "电脑", "电视"], correctAnswer: "桌子" },
    { id: 11, kanji: "14日", furigana: "じゅうよっか", options: ["14号、十四天", "10号、十天", "4号、四天", "24号、二十四天"], correctAnswer: "14号、十四天" },
    { id: 12, kanji: "20日", furigana: "はつか", options: ["20号、二十天", "2号、二天", "12号、十二天", "24号、二十四天"], correctAnswer: "20号、二十天" },
    { id: 13, kanji: "24日", furigana: "にじゅうよっか", options: ["24号、二十四天", "14号、十四天", "4号、四天", "20号、二十天"], correctAnswer: "24号、二十四天" },
    { id: 14, kanji: "事務所", furigana: "じむしょ", options: ["办公室", "教室", "食堂", "会議室"], correctAnswer: "办公室" },
    { id: 15, kanji: "受付", furigana: "うけつけ", options: ["接待处", "洗手间", "电梯", "办公室"], correctAnswer: "接待处" },
    { id: 16, kanji: "昼休み", furigana: "ひるやすみ", options: ["午休", "朝会", "残業", "出張"], correctAnswer: "午休" },
    { id: 17, kanji: "昨日", furigana: "きのう", options: ["昨天", "今天", "明天", "前天"], correctAnswer: "昨天" },
    { id: 18, kanji: "歩いて", furigana: "あるいて", options: ["步行", "乘车", "坐地铁", "骑自行车"], correctAnswer: "步行" },
    { id: 24, kanji: "お土産", furigana: "おみやげ", options: ["礼物、特产", "名片", "点心", "行李"], correctAnswer: "礼物、特产" },
    { id: 25, kanji: "手帳", furigana: "てちょう", options: ["记事本", "书", "雑誌", "报纸"], correctAnswer: "记事本" },
    { id: 26, kanji: "食堂", furigana: "しょくどう", options: ["餐厅、食堂", "教室", "会议室", "办公室"], correctAnswer: "餐厅、食堂" },
    { id: 27, kanji: "郵便局", furigana: "ゆうびんきょく", options: ["邮局", "銀行", "図書館", "百貨店"], correctAnswer: "邮局" },
    { id: 28, kanji: "お国", furigana: "おくに", options: ["（您的）国家", "我的国家", "家郷", "外国"], correctAnswer: "（您的）国家" },
    { id: 29, kanji: "去年", furigana: "きょねん", options: ["去年", "今年", "明年", "前年"], correctAnswer: "去年" },
    { id: 30, kanji: "何番", furigana: "なんばん", options: ["几番（几号）", "什么", "多少钱", "谁"], correctAnswer: "几番（几号）" },
    { id: 31, kanji: "映画", furigana: "えいが", options: ["电影", "电视", "电话", "漫画"], correctAnswer: "电影" },
    { id: 32, kanji: "学校", furigana: "がっこう", options: ["学校", "会社", "銀行", "図書館"], correctAnswer: "学校" },
    { id: 33, kanji: "行きます", furigana: "いきます", options: ["去", "来", "回", "出"], correctAnswer: "去" },
    { id: 34, kanji: "来ます", furigana: "きます", options: ["来", "去", "回", "休息"], correctAnswer: "来" },
    { id: 35, kanji: "帰ります", furigana: "かえります", options: ["回（家、国）", "去", "来", "下班"], correctAnswer: "回（家、国）" },
    { id: 36, kanji: "仕事", furigana: "しごと", options: ["工作", "休息", "学習", "会議"], correctAnswer: "工作" }
];

const BREAK_POINT = Math.floor(quizData.length / 2);

const elements = {
    progressBar: document.getElementById('progress-bar'),
    quizArea: document.getElementById('quiz-area'),
    resultsArea: document.getElementById('results-area'),
    kanji: document.getElementById('kanji'),
    furigana: document.getElementById('furigana'),
    optionsGrid: document.getElementById('options-grid'),
    actionBtn: document.getElementById('action-btn'),
    footer: document.getElementById('footer'),
    feedbackContainer: document.getElementById('feedback-container'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackCorrectAnswer: document.getElementById('feedback-correct-answer'),
    audioBtn: document.getElementById('audio-btn')
};

let audioCtx = null;
function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function speakText(text, lang = 'zh-CN') {
    if (!text) return;
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    if (lang.includes('ja')) utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    let targetVoice = voices.find(v => v.lang === lang && (v.name.includes('Google') || v.name.includes('Premium')));
    if (!targetVoice) targetVoice = voices.find(v => v.lang.includes(lang));
    if (targetVoice) utterance.voice = targetVoice;
    window.speechSynthesis.speak(utterance);
}

function renderQuestion() {
    const question = quizData[currentIndex];
    const progress = (currentIndex / quizData.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.kanji.textContent = question.kanji;
    elements.furigana.textContent = question.furigana;
    elements.optionsGrid.innerHTML = '';
    selectedOption = null;
    resetFooter();

    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
    shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            if (state !== 'answering') return;
            initAudio();
            Array.from(elements.optionsGrid.children).forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedOption = opt;
            elements.actionBtn.disabled = false;
            speakText(opt, 'zh-CN'); 
        });
        elements.optionsGrid.appendChild(btn);
    });
    state = 'answering';
}

function handleBtnClick() {
    initAudio();
    if (state === 'answering') {
        checkAnswer();
    } else {
        handleAction();
    }
}

function checkAnswer() {
    const question = quizData[currentIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    const feedbackImg = document.getElementById('feedback-img'); 

    state = 'feedback';
    elements.feedbackContainer.classList.remove('hidden');
    elements.actionBtn.textContent = '继续'; 

    Array.from(elements.optionsGrid.children).forEach(btn => btn.classList.add('disabled'));

    if (isCorrect) {
        score++;
        elements.footer.classList.add('correct');
        elements.feedbackTitle.textContent = '太棒了！';
        elements.feedbackCorrectAnswer.classList.add('hidden');
        if (feedbackImg) feedbackImg.src = 'images/correct.png';
        playCorrectSound();
    } else {
        elements.footer.classList.add('incorrect');
        elements.feedbackTitle.textContent = '不正确。';
        elements.feedbackCorrectAnswer.querySelector('span').textContent = question.correctAnswer;
        elements.feedbackCorrectAnswer.classList.remove('hidden');
        if (feedbackImg) feedbackImg.src = 'images/incorrect.png';
        playIncorrectSound();
    }
}

function handleAction() {
    if (state === 'feedback') {
        currentIndex++;
        if (currentIndex === BREAK_POINT) {
            showBreakScreen();
        } else if (currentIndex < quizData.length) {
            renderQuestion();
        } else {
            showFinalResult();
        }
    } else if (state === 'break') {
        renderQuestion();
    }
}

function showBreakScreen() {
    state = 'break';
    elements.optionsGrid.innerHTML = ''; 
    elements.kanji.textContent = "休息時間";
    elements.furigana.textContent = "がんばっているね！";
    const feedbackImg = document.getElementById('feedback-img');
    if (feedbackImg) feedbackImg.src = 'images/break.png';
    elements.feedbackTitle.textContent = "おつかれさま！ちょっとひと休み。";
    elements.actionBtn.textContent = '再開する';
}

function showFinalResult() {
    state = 'finished';
    elements.optionsGrid.innerHTML = '';
    elements.kanji.textContent = "🎉 お疲れ様でした！";
    elements.furigana.textContent = `正解数: ${score} / ${quizData.length}`;
    const percent = Math.round((score / quizData.length) * 100);
    elements.feedbackTitle.textContent = `あなたのスコアは ${percent}点 です！`;
    elements.actionBtn.textContent = '最初から挑戦する';
    elements.actionBtn.onclick = () => location.reload();
}

function playCorrectSound() { new Audio('sounds/correct.mp3').play().catch(() => {}); }
function playIncorrectSound() { new Audio('sounds/incorrect.mp3').play().catch(() => {}); }

function resetFooter() {
    elements.footer.classList.remove('correct', 'incorrect');
    elements.feedbackContainer.classList.add('hidden');
    elements.actionBtn.textContent = '检查';
    elements.actionBtn.disabled = true;
}

function init() {
    // 1. 出題順をランダムにする
    quizData.sort(() => Math.random() - 0.5); 

    currentIndex = 0;
    score = 0;
    state = 'question';
    renderQuestion();

    // 2. 判定・次へボタンの設定
    elements.actionBtn.addEventListener('click', handleBtnClick);

    // 3. ×ボタン（最初に戻る）の設定
    const closeBtn = document.querySelector('.close-btn') || document.getElementById('close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (confirm('最初に戻りますか？')) {
                location.reload(); 
            }
        });
    }

    // 4. スピーカーボタンの設定（ここを確実に修正！）
    elements.audioBtn.addEventListener('click', () => {
        initAudio();
        
        // 休憩中の場合
        if (state === 'break') {
            speakText("がんばっているね！ちょっとひと休み。", 'ja-JP');
        } 
        // それ以外（クイズ中、判定表示中、終了後など）の場合
        else {
            const currentQuestion = quizData[currentIndex];
            if (currentQuestion) {
                speakText(currentQuestion.furigana, 'ja-JP');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', init);