// C:\Users\terec\boiler-plate\boiler-for-rdd\src\shared\theme-toggle\index.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // 클라이언트 측 렌더링 시 hydration 불일치 방지
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="outline" size="icon" className="h-5 w-5">
                <Sun size={12} />
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            size="icon"
            className="h-5 w-5 border border-white/30 bg-transparent text-white hover:bg-white/10"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
        </Button>
    );
}