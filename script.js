let score = 0; // 正解数をカウント
let currentIndex = 0;
let selectedOption = null;
let state = 'question';

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
    },
    {
        id: 24,
        kanji: "お土産",
        furigana: "おみやげ",
        options: ["礼物、特产", "名片", "点心", "行李"],
        correctAnswer: "礼物、特产"
    },
    {
        id: 25,
        kanji: "手帳",
        furigana: "てちょう",
        options: ["记事本", "书", "杂志", "报纸"],
        correctAnswer: "记事本"
    },
    {
        id: 26,
        kanji: "食堂",
        furigana: "しょくどう",
        options: ["餐厅、食堂", "教室", "会议室", "办公室"],
        correctAnswer: "餐厅、食堂"
    },
    {
        id: 27,
        kanji: "郵便局",
        furigana: "ゆうびんきょく",
        options: ["邮局", "银行", "图书馆", "百货店"],
        correctAnswer: "邮局"
    },
    {
        id: 28,
        kanji: "お国",
        furigana: "おくに",
        options: ["（您的）国家", "我的国家", "家郷", "外国"],
        correctAnswer: "（您的）国家"
    },
    {
        id: 29,
        kanji: "去年",
        furigana: "きょねん",
        options: ["去年", "今年", "明年", "前年"],
        correctAnswer: "去年"
    },
    {
        id: 30, // 以前のリクエストから追加
        kanji: "何番",
        furigana: "なんばん",
        options: ["几番（几号）", "什么", "多少钱", "谁"],
        correctAnswer: "几番（几号）"
    },
    {
        id: 31,
        kanji: "映画",
        furigana: "えいが",
        options: ["电影", "电视", "电话", "漫画"],
        correctAnswer: "电影"
    },
    {
        id: 32,
        kanji: "学校",
        furigana: "がっこう",
        options: ["学校", "会社", "銀行", "図書館"],
        correctAnswer: "学校"
    },
    {
        id: 33,
        kanji: "行きます",
        furigana: "いきます",
        options: ["去", "来", "回", "出"],
        correctAnswer: "去"
    },
    {
        id: 34,
        kanji: "来ます",
        furigana: "きます",
        options: ["来", "去", "回", "休息"],
        correctAnswer: "来"
    },
    {
        id: 35,
        kanji: "帰ります",
        furigana: "かえります",
        options: ["回（家、国）", "去", "来", "下班"],
        correctAnswer: "回（家、国）"
    },
    {
        id: 36,
        kanji: "仕事",
        furigana: "しごと",
        options: ["工作", "休息", "学習", "会議"],
        correctAnswer: "工作"
    }
];
// quizDataの定義が終わった直後に配置
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


function speakText(text, lang = 'zh-CN') {
    if (!text) return;
    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // 日本語の場合は少しゆっくりにして、聞き取りやすくする
    if (lang.includes('ja')) {
        utterance.rate = 0.85; // 標準は1.0
        utterance.pitch = 1.0;
    }

    const voices = window.speechSynthesis.getVoices();
    // 1. 指定された言語に完全一致し、かつ高品質(Googleなど)な声を探す
    let targetVoice = voices.find(v => v.lang === lang && (v.name.includes('Google') || v.name.includes('Premium')));
    
    // 2. 見つからなければ、言語が含まれるものを探す
    if (!targetVoice) {
        targetVoice = voices.find(v => v.lang.includes(lang));
    }

    if (targetVoice) utterance.voice = targetVoice;

    window.speechSynthesis.speak(utterance);
}

// --- メインロジック ---


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
            if (state !== 'answering') return;
            initAudio();

            // --- ここで選択時の処理を直接行う ---
            // 全ボタンの選択状態を解除
            Array.from(elements.optionsGrid.children).forEach(b => b.classList.remove('selected'));
            // クリックしたボタンを選択状態にする
            btn.classList.add('selected');
            // 値を保存
            selectedOption = opt;
            // 判定ボタンを有効にする
            elements.actionBtn.disabled = false;

            speakText(opt, 'zh-CN'); 
        });
        elements.optionsGrid.appendChild(btn);
    });

    resetFooter();
    elements.actionBtn.disabled = true; // 最初は判定ボタンを無効に
    state = 'answering';
    elements.quizArea.classList.remove('slide-out');
    elements.quizArea.classList.add('slide-in');
}

function handleAction() {
    if (state === 'feedback') {
        currentIndex++;
        
        // 中間地点（18問目など）なら休憩画面へ
        if (currentIndex === BREAK_POINT) {
            showBreakScreen();
            return;
        }

        if (currentIndex < quizData.length) {
            renderQuestion();
            state = 'question';
        } else {
            showFinalResult();
        }
    } else if (state === 'break') {
        // 休憩画面から次の問題へ
        renderQuestion();
        state = 'question';
    }
}

function showBreakScreen() {
    state = 'break';
    elements.optionsGrid.innerHTML = ''; 
    elements.questionKanji.textContent = "休息時間";
    elements.questionFurigana.textContent = "がんばっているね！";
    
    const feedbackImg = document.getElementById('feedback-img');
    if (feedbackImg) {
        feedbackImg.src = 'images/break.png'; // 息抜き用画像
    }
    
    elements.feedbackTitle.textContent = "おつかれさま！ちょっとひと休み。";
    elements.feedbackContainer.classList.remove('hidden');
    elements.actionBtn.textContent = '再開する';
}

function showFinalResult() {
    state = 'finished';
    elements.optionsGrid.innerHTML = '';
    elements.questionKanji.textContent = "🎉 お疲れ様でした！";
    elements.questionFurigana.textContent = `正解数: ${score} / ${quizData.length}`;
    
    const percent = Math.round((score / quizData.length) * 100);
    elements.feedbackTitle.textContent = `あなたのスコアは ${percent}点 です！`;
    
    elements.feedbackContainer.classList.remove('hidden');
    elements.actionBtn.textContent = '最初から挑戦する';
    elements.actionBtn.onclick = () => location.reload();
}

function checkAnswer() {
    const question = quizData[currentIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    const feedbackImg = document.getElementById('feedback-img'); 

    state = 'feedback';

    // フィードバックエリアを表示
    elements.feedbackContainer.classList.remove('hidden');
    elements.actionBtn.textContent = '继续'; // 次へ（継続）

    // 全ての選択肢ボタンを無効化
    Array.from(elements.optionsGrid.children).forEach(btn => {
        btn.classList.add('disabled');
    });

    if (isCorrect) {
        elements.footer.classList.add('correct');
        elements.feedbackTitle.textContent = '太棒了！'; // 正解！
        elements.feedbackCorrectAnswer.classList.add('hidden');

        // 正解の時の画像
        if (feedbackImg) feedbackImg.src = 'images/correct.png';

        // ★ここで正解の音を鳴らす
        playCorrectSound();
    } else {
        elements.footer.classList.add('incorrect');
        elements.feedbackTitle.textContent = '不正确。'; // 不正解
        elements.feedbackCorrectAnswer.querySelector('span').textContent = question.correctAnswer;
        elements.feedbackCorrectAnswer.classList.remove('hidden');

        // 不正解の時の画像
        if (feedbackImg) feedbackImg.src = 'images/incorrect.png';

        // ★ここで不正解の音を鳴らす
        playIncorrectSound();
    }
}
// 正解音を鳴らす関数
function playCorrectSound() {
    const audio = new Audio('sounds/correct.mp3');
    audio.play().catch(e => console.error("正解音の再生に失敗しました。ファイル名や場所を確認してください:", e));
}

// 不正解音を鳴らす関数
function playIncorrectSound() {
    const audio = new Audio('sounds/incorrect.mp3');
    audio.play().catch(e => console.error("不正解音の再生に失敗しました。:", e));
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
    score = 0;
    state = 'question';
    renderQuestion();

    // 一旦、古いイベントをリセットするために「新しいボタン」として作り直す手法
    const newActionBtn = elements.actionBtn.cloneNode(true);
    elements.actionBtn.parentNode.replaceChild(newActionBtn, elements.actionBtn);
    elements.actionBtn = newActionBtn;

    // 改めて、新しいボタンに進行管理(handleAction)を登録
    elements.actionBtn.addEventListener('click', () => {
        initAudio();
        handleAction();
    });

    // スピーカーボタンも同様にリセットして登録
    const newAudioBtn = elements.audioBtn.cloneNode(true);
    elements.audioBtn.parentNode.replaceChild(newAudioBtn, elements.audioBtn);
    elements.audioBtn = newAudioBtn;

    elements.audioBtn.addEventListener('click', () => {
        initAudio();
        const question = quizData[currentIndex];
        speakText(question.furigana, 'ja-JP');
    });
}