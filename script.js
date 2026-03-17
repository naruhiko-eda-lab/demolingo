const quizData = [
    // 第1課
    {
        id: 1,
        kanji: "会社員",
        furigana: "かいしゃいん",
        options: ["银行员", "医生", "公司职员", "研究人员"],
        correctAnswer: "公司职员"
    },
    {
        id: 2,
        kanji: "銀行員",
        furigana: "ぎんこういん",
        options: ["银行行员", "教师", "医生", "学生"],
        correctAnswer: "银行行员"
    },
    {
        id: 3,
        kanji: "医者",
        furigana: "いしゃ",
        options: ["老师", "医生", "职员", "研究者"],
        correctAnswer: "医生"
    },
    {
        id: 4,
        kanji: "研究者",
        furigana: "けんきゅうしゃ",
        options: ["学生", "大学", "研究人员", "教师"],
        correctAnswer: "研究人员"
    },
    // 第2課
    {
        id: 5,
        kanji: "辞書",
        furigana: "じしょ",
        options: ["书", "报纸", "字典", "杂志"],
        correctAnswer: "字典"
    },
    {
        id: 6,
        kanji: "名刺",
        furigana: "めいし",
        options: ["名片", "笔记", "卡片", "钥匙"],
        correctAnswer: "名片"
    },
    {
        id: 7,
        kanji: "時計",
        furigana: "とけい",
        options: ["伞", "钟表", "包", "汽车"],
        correctAnswer: "钟表"
    },
    {
        id: 8,
        kanji: "机",
        furigana: "つくえ",
        options: ["椅子", "桌子", "电脑", "电视"],
        correctAnswer: "桌子"
    },// 前の単語の「},」のすぐ後ろに貼り付けます
    {
        id: 11, 
        kanji: "14日",
        furigana: "じゅうよっか",
        options: ["14号、十四天", "10号、十天", "4号、四天", "24号、二十四天"],
        correctAnswer: "14号、十四天"
    },
    {
        id: 12,
        kanji: "20日",
        furigana: "はつか",
        options: ["20号、二十天", "2号、二天", "12号、十二天", "24号、二十四天"],
        correctAnswer: "20号、二十天"
    },
    {
        id: 13,
        kanji: "24日",
        furigana: "にじゅうよっか",
        options: ["24号、二十四天", "14号、十四天", "4号、四天", "20号、二十天"],
        correctAnswer: "24号、二十四天"
    },
    // 続きの単語として貼り付けてください
    {
        id: 14,
        kanji: "事務所",
        furigana: "じむしょ",
        options: ["办公室", "教室", "食堂", "会議室"],
        correctAnswer: "办公室"
    },
    {
        id: 15,
        kanji: "受付",
        furigana: "うけつけ",
        options: ["接待处", "洗手间", "电梯", "办公室"],
        correctAnswer: "接待处"
    },
    {
        id: 16,
        kanji: "昼休み",
        furigana: "ひるやすみ",
        options: ["午休", "朝会", "残業", "出張"],
        correctAnswer: "午休"
    },
    {
        id: 17,
        kanji: "昨日",
        furigana: "きのう",
        options: ["昨天", "今天", "明天", "前天"],
        correctAnswer: "昨天"
    },
    {
        id: 18,
        kanji: "歩いて",
        furigana: "あるいて",
        options: ["步行", "乘车", "坐地铁", "骑自行车"],
        correctAnswer: "步行"
    }
];

let currentIndex = 0;
let selectedOption = null;
let state = 'answering';

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

// --- 音声エンジンの初期化 ---
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 効果音の再生
function playTone(freq, type, duration) {
    initAudio();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    oscillator.stop(audioCtx.currentTime + duration);
}

function playCorrectSound() {
    playTone(600, 'sine', 0.1);
    setTimeout(() => playTone(800, 'sine', 0.15), 100);
}

function playIncorrectSound() {
    playTone(300, 'sawtooth', 0.2);
    setTimeout(() => playTone(250, 'sawtooth', 0.2), 150);
}

// テキスト読み上げ（中国語と日本語を切り替え可能に）
function speakText(text, lang = 'zh-CN') {
    if (!text) return;
    window.speechSynthesis.cancel(); // 前の音声を止める
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.includes(lang));
    if (targetVoice) utterance.voice = targetVoice;

    window.speechSynthesis.speak(utterance);
}

// --- メインロジック ---
function init() {
    currentIndex = 0;
    renderQuestion();

    elements.actionBtn.addEventListener('click', () => {
        initAudio(); // ボタンクリック時に音声機能を起こす
        handleAction();
    });

    elements.audioBtn.addEventListener('click', () => {
        initAudio();
        // 漢字は日本語、選択肢（正解）は中国語で読み上げ
        speakText(quizData[currentIndex].kanji, 'ja-JP');
    });
}

function renderQuestion() {
    const question = quizData[currentIndex];
    const progress = (currentIndex / quizData.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.kanji.textContent = question.kanji;
    elements.furigana.textContent = question.furigana;
    elements.optionsGrid.innerHTML = '';
    selectedOption = null;

    // 1. 選択肢をコピーしてシャッフルする
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

    // 2. シャッフルした選択肢でボタンを作る
    shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        
        btn.addEventListener('click', () => {
            initAudio();
            // ここでクリックしたボタンと選択肢の値を渡す
            selectOption(btn, opt);
            speakText(opt, 'zh-CN');
        });
        
        elements.optionsGrid.appendChild(btn);
    });

    resetFooter();
    // 判定に必要な actionBtn を最初は無効にしておく
    elements.actionBtn.disabled = true; 
    state = 'answering';
    elements.quizArea.classList.remove('slide-out');
    elements.quizArea.classList.add('slide-in');
}

function handleAction() {
    if (state === 'answering') {
        checkAnswer();
    } else if (state === 'feedback') {
        nextQuestion();
    } else if (state === 'finished') {
        location.reload(); // 再スタート
    }
}

// script.js 内の checkAnswer 関数を以下のように上書きします
function checkAnswer() {
    const question = quizData[currentIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    const feedbackImg = document.getElementById('feedback-img'); // 画像要素を取得

    state = 'feedback';

    // フィードバックエリアを表示
    elements.feedbackContainer.classList.remove('hidden');
    elements.actionBtn.textContent = '继续';

    // 全ての選択肢ボタンを無効化
    Array.from(elements.optionsGrid.children).forEach(btn => {
        btn.classList.add('disabled');
    });

    if (isCorrect) {
        elements.footer.classList.add('correct');
        elements.feedbackTitle.textContent = '太棒了！';
        elements.feedbackCorrectAnswer.classList.add('hidden');

        // 正解の時の画像（ファイル名はご自身で設定したものに変えてください）
        feedbackImg.src = 'images/correct.png';

        playCorrectSound();
    } else {
        elements.footer.classList.add('incorrect');
        elements.feedbackTitle.textContent = '不正确。';
        elements.feedbackCorrectAnswer.querySelector('span').textContent = question.correctAnswer;
        elements.feedbackCorrectAnswer.classList.remove('hidden');

        // 不正解の時の画像
        feedbackImg.src = 'images/incorrect.png';

        playIncorrectSound();
    }
}

function nextQuestion() {
    elements.quizArea.classList.add('slide-out');
    setTimeout(() => {
        currentIndex++;
        if (currentIndex < quizData.length) {
            renderQuestion();
        } else {
            showResults();
        }
    }, 400);
}

function resetFooter() {
    elements.footer.classList.remove('correct', 'incorrect');
    elements.feedbackContainer.classList.add('hidden');
    elements.actionBtn.textContent = '检查';
    elements.actionBtn.disabled = true;
}

function showResults() {
    state = 'finished';
    elements.progressBar.style.width = '100%';
    
    elements.quizArea.classList.add('hidden');
    elements.resultsArea.classList.remove('hidden');
    
    // 画像が確実に表示されるようにセット
    const resultImg = document.getElementById('result-main-img');
    if (resultImg) {
        resultImg.src = 'images/finish.png';
    }

    resetFooter();
}

document.addEventListener('DOMContentLoaded', init);
// script.js の init 関数の中
function init() {
    currentIndex = 0;
    renderQuestion();
    
    // 既存のチェックボタン
    elements.actionBtn.addEventListener('click', () => {
        initAudio();
        handleAction();
    });

    // 【追加】「もう一度」ボタンをクリックした時の動作
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            location.reload(); // ページをリロードして最初からやり直す（一番確実です！）
        });
    }

    elements.audioBtn.addEventListener('click', () => {
        initAudio();
        speakText(quizData[currentIndex].kanji, 'ja-JP');
    });
}