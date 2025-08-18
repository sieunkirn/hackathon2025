import { useState, useCallback } from 'react';

export const useSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(
        'speechSynthesis' in window
    );

    const speak = useCallback((text, options = {}) => {
        if (!isSupported) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // 기존 음성 중지
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // 한국어 설정
        utterance.lang = options.lang || 'ko-KR';
        utterance.rate = options.rate || 1.0; // 속도
        utterance.pitch = options.pitch || 1.0; // 음높이
        utterance.volume = options.volume || 1.0; // 볼륨

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [isSupported]);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    const getVoices = useCallback(() => {
        return window.speechSynthesis.getVoices();
    }, []);

    return {
        speak,
        stop,
        isSpeaking,
        isSupported,
        getVoices
    };
};
// import { useState, useCallback } from 'react';
//
// export const useSpeech = () => {
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [isSupported, setIsSupported] = useState(
//         'speechSynthesis' in window
//     );
//
//     const speak = useCallback((text, options = {}) => {
//         if (!isSupported) {
//             console.warn('Speech synthesis not supported');
//             return;
//         }
//
//         // 기존 음성 중지
//         window.speechSynthesis.cancel();
//
//         const utterance = new SpeechSynthesisUtterance(text);
//
//         // 한국어 설정
//         utterance.lang = options.lang || 'ko-KR';
//         utterance.rate = options.rate || 1.0; // 속도
//         utterance.pitch = options.pitch || 1.0; // 음높이
//         utterance.volume = options.volume || 1.0; // 볼륨
//
//         utterance.onstart = () => setIsSpeaking(true);
//         utterance.onend = () => setIsSpeaking(false);
//         utterance.onerror = () => setIsSpeaking(false);
//
//         window.speechSynthesis.speak(utterance);
//     }, [isSupported]);
//
//     const stop = useCallback(() => {
//         window.speechSynthesis.cancel();
//         setIsSpeaking(false);
//     }, []);
//
//     const getVoices = useCallback(() => {
//         return window.speechSynthesis.getVoices();
//     }, []);
//
//     return {
//         speak,
//         stop,
//         isSpeaking,
//         isSupported,
//         getVoices
//     };
// };

// import { useState, useCallback } from 'react';
//
// export const useSpeech = () => {
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [isSupported, setIsSupported] = useState(
//         'speechSynthesis' in window
//     );
//
//     const speak = useCallback((text, options = {}) => {
//         if (!isSupported) {
//             console.warn('Speech synthesis not supported');
//             return;
//         }
//
//         // 기존 음성 중지
//         window.speechSynthesis.cancel();
//
//         const utterance = new SpeechSynthesisUtterance(text);
//
//         // 한국어 설정
//         utterance.lang = options.lang || 'ko-KR';
//         utterance.rate = options.rate || 1.0; // 속도
//         utterance.pitch = options.pitch || 1.0; // 음높이
//         utterance.volume = options.volume || 1.0; // 볼륨
//
//         utterance.onstart = () => setIsSpeaking(true);
//         utterance.onend = () => setIsSpeaking(false);
//         utterance.onerror = () => setIsSpeaking(false);
//
//         window.speechSynthesis.speak(utterance);
//     }, [isSupported]);
//
//     const stop = useCallback(() => {
//         window.speechSynthesis.cancel();
//         setIsSpeaking(false);
//     }, []);
//
//     const getVoices = useCallback(() => {
//         return window.speechSynthesis.getVoices();
//     }, []);
//
//     return {
//         speak,
//         stop,
//         isSpeaking,
//         isSupported,
//         getVoices
//     };
// };
// // import { useState, useCallback } from 'react';
// //
// // export const useSpeech = () => {
// //     const [isSpeaking, setIsSpeaking] = useState(false);
// //     const [isSupported, setIsSupported] = useState(
// //         'speechSynthesis' in window
// //     );
// //
// //     const speak = useCallback((text, options = {}) => {
// //         if (!isSupported) {
// //             console.warn('Speech synthesis not supported');
// //             return;
// //         }
// //
// //         // 기존 음성 중지
// //         window.speechSynthesis.cancel();
// //
// //         const utterance = new SpeechSynthesisUtterance(text);
// //
// //         // 한국어 설정
// //         utterance.lang = options.lang || 'ko-KR';
// //         utterance.rate = options.rate || 1.0; // 속도
// //         utterance.pitch = options.pitch || 1.0; // 음높이
// //         utterance.volume = options.volume || 1.0; // 볼륨
// //
// //         utterance.onstart = () => setIsSpeaking(true);
// //         utterance.onend = () => setIsSpeaking(false);
// //         utterance.onerror = () => setIsSpeaking(false);
// //
// //         window.speechSynthesis.speak(utterance);
// //     }, [isSupported]);
// //
// //     const stop = useCallback(() => {
// //         window.speechSynthesis.cancel();
// //         setIsSpeaking(false);
// //     }, []);
// //
// //     const getVoices = useCallback(() => {
// //         return window.speechSynthesis.getVoices();
// //     }, []);
// //
// //     return {
// //         speak,
// //         stop,
// //         isSpeaking,
// //         isSupported,
// //         getVoices
// //     };
// // };
