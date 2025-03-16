// src/app/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Toaster } from "@/shared/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";

type LoginFormInputs = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const router = useRouter();

    const onSubmit = (data: LoginFormInputs) => {
        console.log("로그인 데이터:", data);

        // ✅ 쿠키에 토큰 저장 (미들웨어 연동)
        document.cookie = `auth_token=dummy_token; path=/; max-age=86400; SameSite=Lax`;

        // ✅ 성공 알림
        toast.success("로그인 성공! 대시보드로 이동합니다.");

        // ✅ 즉시 `/app`으로 이동
        router.push("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-[400px] shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold text-gray-800">
                        🔐 로그인
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">이메일</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="이메일을 입력하세요"
                                {...register("email", { required: "이메일을 입력해주세요." })}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">비밀번호</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                {...register("password", { required: "비밀번호를 입력해주세요." })}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            로그인
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
};

export default LoginPage;
