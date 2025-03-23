// File: /shared/ContextMenu/index.tsx
"use client";

import React from "react";
import { Menu, Item, Separator } from "react-contexify";
import { Settings, Edit, Trash2, Copy, Info } from "lucide-react";
import "react-contexify/dist/ReactContexify.css";
import "./context-menu-speedup.css"; // 속도 조정을 위한 CSS 추가

interface TenantContextMenuProps {
    openTestDialog: () => void;
}

const TenantContextMenu: React.FC<TenantContextMenuProps> = ({ openTestDialog }) => {
    const handleTestDialog = () => {
        openTestDialog();
    };

    const handleEdit = () => {
        console.log("Edit 메뉴 클릭됨");
        // 편집 로직 구현
    };

    const handleDelete = () => {
        console.log("Delete 메뉴 클릭됨");
        // 삭제 로직 구현
    };

    const handleCopy = () => {
        console.log("Copy 메뉴 클릭됨");
        // 복사 로직 구현
    };

    const handleInfo = () => {
        console.log("Info 메뉴 클릭됨");
        // 정보 표시 로직 구현
    };

    return (
        <Menu id="tenant_context_menu" animation="fade" theme="light">
            <Item onClick={handleEdit}>
                <div className="flex items-center">
                    <Edit size={14} className="mr-2 text-gray-500" />
                    <span>테넌트 편집</span>
                </div>
            </Item>
            <Item onClick={handleCopy}>
                <div className="flex items-center">
                    <Copy size={14} className="mr-2 text-gray-500" />
                    <span>테넌트 복제</span>
                </div>
            </Item>
            <Separator />
            <Item onClick={handleDelete}>
                <div className="flex items-center">
                    <Trash2 size={14} className="mr-2 text-red-500" />
                    <span>테넌트 삭제</span>
                </div>
            </Item>
            <Separator />
            <Item onClick={handleInfo}>
                <div className="flex items-center">
                    <Info size={14} className="mr-2 text-gray-500" />
                    <span>테넌트 정보</span>
                </div>
            </Item>
            <Item onClick={handleTestDialog}>
                <div className="flex items-center">
                    <Settings size={14} className="mr-2 text-gray-500" />
                    <span>테스트 다이어로그</span>
                </div>
            </Item>
        </Menu>
    );
};

export default TenantContextMenu;