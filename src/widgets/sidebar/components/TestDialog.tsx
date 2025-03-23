// File: /components/dialog/TestDialog.tsx
"use client";

import React from "react";
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
}

const TestDialog: React.FC<TestDialogProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>테스트 다이어로그</DialogTitle>
                    <DialogDescription>
                        이 다이어로그는 테스트 용도로 출력되었습니다.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onClose}>닫기</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TestDialog;
