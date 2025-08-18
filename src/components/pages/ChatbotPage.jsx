// pages/ChatbotPage.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components.css";

/** Web Speech API 안전 래퍼 */
function makeRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = "ko-KR";
    rec.interimResults = true;
    rec.continuous = false; // 연속 인식은 브라우저별 불안정 → onend에서 자동 재시작으로 보강
    return rec;
}

/** 침묵(말 멈춤) 감지용 타이머 도우미 */
function useSilenceTimer(callback, ms = 1200) {
    const timer = useRef(null);
    const reset = () => {
        clear();
        timer.current = setTimeout(callback, ms);
    };
    const clear = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    };
    return { reset, clear };
}

export default function ChatbotPage() {
    const navigate = useNavigate();

    // 음성 인식기/상태
    const recRef = useRef(null);
    const [supported, setSupported] = useState(true);
    const [listening, setListening] = useState(false);   // 사용자가 '마이크 켬' 상태인가
    const [engineActive, setEngineActive] = useState(false); // 엔진이 실제 동작 중인가
    const [interim, setInterim] = useState("");
    const [finalBuf, setFinalBuf] = useState("");        // 전송 대기 중 문장 버퍼

    const { reset: resetSilence, clear: clearSilence } = useSilenceTimer(() => {
        // 침묵으로 판단 → 누적된 문장이 있으면 자동 전송
        const text = finalBuf.trim();
        if (text) {
            autoSend(text);
            setFinalBuf("");
        }
        // 계속 듣는 중이면 엔진은 onend에서 자동 재시작
    }, 1100);

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "bot",
            text:
                '안녕하세요! 복지 도우미 띵동이에요. 마이크를 켜고 질문하세요.\n예시: "신청 가능한 복지혜택 알려줘"',
        },
    ]);

    /** 인식기 초기화 */
    useEffect(() => {
        const rec = makeRecognition();
        if (!rec) {
            setSupported(false);
            return;
        }

        rec.onstart = () => {
            setEngineActive(true);
            setInterim("");
        };

        rec.onresult = (e) => {
            let interimText = "";
            let finalText = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const seg = e.results[i][0].transcript.trim();
                if (e.results[i].isFinal) {
                    finalText += seg + " ";
                } else {
                    interimText += seg + " ";
                }
            }
            if (interimText) setInterim(interimText);

            // 최종 문장 누적 + 침묵 타이머 리셋(사용자가 멈추면 자동 전송)
            if (finalText) {
                setFinalBuf((prev) => (prev + " " + finalText).trim());
                resetSilence();
            }
        };

        rec.onerror = (e) => {
            // 네트워크/권한/디바이스 오류 등 - 너무 공격적 재시도 방지
            setEngineActive(false);
            setInterim("");
            // listening이 true면 약간의 대기 후 재시작
            if (listening) {
                setTimeout(() => {
                    try { rec.start(); } catch {}
                }, 300);
            }
        };

        rec.onend = () => {
            setEngineActive(false);
            setInterim("");
            // 사용자가 마이크를 끈 게 아니라면 자동 재시작 (브라우저의 자동 종료 보완)
            if (listening) {
                try { rec.start(); } catch {}
            }
        };

        recRef.current = rec;
        return () => {
            try { rec.abort(); } catch {}
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 초기 1회만

    /** 탭 전환/잠금 시 안전 정리 */
    useEffect(() => {
        const handleVis = () => {
            if (document.hidden) {
                stopMic();
            }
        };
        window.addEventListener("visibilitychange", handleVis);
        return () => window.removeEventListener("visibilitychange", handleVis);
    }, []);

    /** 전송 */
    const autoSend = (text) => {
        if (!text.trim()) return;
        setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text }]);

        // 실제 API 붙이는 자리
        // 예시:
        // fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text }) })
        //   .then(res => res.json())
        //   .then(data => setMessages(prev => [...prev, { id: Date.now(), sender:'bot', text: data.answer }]))
        //   .catch(() => setMessages(prev => [...prev, { id: Date.now(), sender:'bot', text:'오류가 발생했어요. 잠시 후 다시 시도해 주세요.' }]));

        // 데모 응답
        const reply =
            '현재 신청 가능한 주요 복지: 문화누리카드(기초생활·차상위), 기초연금, 장애인 활동지원 등입니다.\n"지역/연령/가구상황"을 알려주시면 더 정확히 추천해드릴게요.';
        setTimeout(() => {
            setMessages((prev) => [...prev, { id: Date.now(), sender: "bot", text: reply }]);
        }, 400);
    };

    /** 마이크 켜기(토글 ON) */
    const startMic = () => {
        if (!recRef.current) return;
        setListening(true);
        clearSilence();
        setFinalBuf("");
        setInterim("");
        // iOS/모바일에서 user gesture 직후 1회만 start 허용 → 오류 무시
        try { recRef.current.start(); } catch {}
    };

    /** 마이크 끄기(토글 OFF) */
    const stopMic = () => {
        setListening(false);
        clearSilence();
        // 버퍼에 남아있는 말 있으면 전송
        const leftover = finalBuf.trim();
        if (leftover) {
            autoSend(leftover);
            setFinalBuf("");
        }
        // 엔진 중지
        try { recRef.current && recRef.current.abort(); } catch {}
    };

    return (
        <div className="chatbot-page no-top-tab">
            {/* 상단 헤더: 뒤로가기 + 중앙 타이틀 */}
            <header className="chat-header">
                <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    aria-label="뒤로가기"
                    title="뒤로가기"
                >
                    ←
                </button>
                <div className="chat-title">복지도우미</div>
                <div className="header-spacer" />
            </header>

            {/* 채팅 영역 */}
            <div className="chat-area">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`chat-bubble ${m.sender === "user" ? "user-bubble" : "bot-bubble"}`}
                    >
                        {m.text}
                    </div>
                ))}

                {/* 실시간 자막 */}
                {engineActive && (interim || listening) && (
                    <div className="chat-bubble user-bubble ghost">
                        {interim || "듣는 중... 멈추면 자동 전송"}
                    </div>
                )}
            </div>

            {/* 하단 컨트롤(토글 방식) */}
            <div className="voice-sheet">
                {!supported ? (
                    <p className="warn">이 브라우저는 음성인식을 지원하지 않습니다. (HTTPS/Chrome·Edge·iOS Safari 권장)</p>
                ) : (
                    <>
                        {listening ? (
                            <>
                                <button className="stop-btn" onClick={stopMic}>■ 중지</button>
                                <div className="voice-caption">말씀 중… 멈추면 자동 전송됩니다</div>
                            </>
                        ) : (
                            <>
                                <button
                                    className="voice-btn"
                                    onClick={startMic}
                                    aria-label="음성 인식 시작"
                                    title="음성 인식 시작"
                                >
                                    🎤 시작
                                </button>
                                <div className="voice-caption">탭하여 마이크 켜기</div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
