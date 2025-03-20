// src/app/welcome/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Toaster } from "@/shared/ui/sonner";
import { toast } from "sonner";

export default function WelcomePage() {
  const router = useRouter();

  // ✅ 로그인된 사용자는 홈으로 리디렉트
  useEffect(() => {
    const authToken = localStorage.getItem("auth_token");
    if (authToken) {
      router.push("/");
    }
  }, [router]);

  const handleStartClick = () => {
    toast("환영합니다! 시작하기 버튼을 클릭하셨습니다.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-gray-800">
            🚀 Welcome to Our Platform!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            이 플랫폼에 오신 것을 환영합니다. 지금 바로 시작해보세요!
          </p>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleStartClick}>
            시작하기
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">자세히 보기</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>우리 플랫폼 소개</DialogTitle>
              <p>
                이 플랫폼은 사용자가 빠르게 서비스를 경험할 수 있도록 설계되었습니다.
                지금 바로 시작해보세요! 🚀
              </p>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
