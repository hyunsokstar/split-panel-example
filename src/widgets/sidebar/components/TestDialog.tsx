"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

interface TestDialogProps {
    isOpen: boolean;
    onClose: () => void;
    // 추가 속성으로 읽을 텍스트 받기
    speechText?: string;
}

const TestDialog: React.FC<TestDialogProps> = ({
    isOpen,
    onClose,
    // 기본값 설정
    speechText = "Show me the money"
}) => {
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // 음성 합성 함수 - 지정된 텍스트 또는 설명 읽기
    const speakText = (customText?: string) => {
        // 우선 순위: 1) 함수에 전달된 텍스트, 2) props로 받은 텍스트, 3) 다이얼로그 설명
        const textToSpeak = customText || speechText || (descriptionRef.current?.textContent || "");

        // 브라우저 음성 합성 API 사용
        if ('speechSynthesis' in window) {
            // 이전에 말하고 있던 것이 있다면 중지
            window.speechSynthesis.cancel();

            const speech = new SpeechSynthesisUtterance();
            speech.text = textToSpeak;
            speech.lang = "ko-KR"; // 한국어로 설정
            speech.rate = 1.0; // 속도 설정
            speech.pitch = 1.0; // 음높이 설정
            speech.volume = 1.0; // 볼륨 설정

            // 음성 종료 이벤트 처리
            speech.onend = () => {
                setIsSpeaking(false);
            };

            // 음성 에러 이벤트 처리
            speech.onerror = (event) => {
                console.error("Speech synthesis error:", event);
                setIsSpeaking(false);
            };

            // 음성 합성 실행
            window.speechSynthesis.speak(speech);
            setIsSpeaking(true);
        } else {
            console.error("Speech Synthesis not supported in this browser");
        }
    };

    // 다이얼로그가 열릴 때 음성 합성 시도
    useEffect(() => {
        if (isOpen) {
            // 약간의 지연을 줘서 DOM이 완전히 렌더링된 후 실행
            const timer = setTimeout(() => {
                speakText(); // speechText 또는 다이얼로그 설명 읽기
            }, 300);

            return () => clearTimeout(timer);
        } else {
            // 다이얼로그가 닫힐 때 음성 합성 중지
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            }
        }
    }, [isOpen, speechText]);

    // 컴포넌트 언마운트 시 음성 합성 중지
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>테스트 다이어로그</DialogTitle>
                    <DialogDescription ref={descriptionRef} aria-live="assertive">
                        이 다이어로그는 테스트 용도로 출력되었습니다.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <Button
                        onClick={() => speakText()}
                        disabled={isSpeaking}
                        className="w-full"
                    >
                        {isSpeaking ? "읽는 중..." : "텍스트 읽기"}
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => speakText("Show me the money!")}
                            disabled={isSpeaking}
                            variant="outline"
                            className="flex-1"
                        >
                            "Show me the money!"
                        </Button>
                        <Button
                            onClick={() => speakText("안녕하세요, 반갑습니다!")}
                            disabled={isSpeaking}
                            variant="outline"
                            className="flex-1"
                        >
                            "안녕하세요!"
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>닫기</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TestDialog;