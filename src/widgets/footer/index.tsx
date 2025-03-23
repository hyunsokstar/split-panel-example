'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Resizable } from 're-resizable'

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [minHeight, setMinHeight] = useState(32) // 기본 헤더 높이 (8px)

  // 알림 메시지 샘플 데이터
  const notifications = [
    { id: 1, message: '230308 11시 10분 - SK Telecom 모바일 상품 지원 캠페인이 수정되었습니다.' },
    { id: 2, message: '230308 10시 05분 - LG U+ 고객 불만 접수 캠페인이 활성화되었습니다.' },
    { id: 3, message: '230308 09시 30분 - KT 해지 방어 캠페인 성과 리포트가 업데이트 되었습니다.' }
  ]

  // 리사이징 시작시 확장 상태로 만들기
  const handleResizeStart = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  // 리사이즈 핸들 스타일
  const resizeHandleStyles = {
    top: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '3px',
      cursor: 'row-resize',
      zIndex: 1
    }
  }

  return (
    <Resizable
      defaultSize={{
        width: '100%',
        height: isExpanded ? 'auto' : minHeight,
      }}
      minHeight={minHeight}
      maxHeight={300}
      enable={{
        top: true,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false
      }}
      handleStyles={resizeHandleStyles}
      handleClasses={{
        top: 'hover:bg-blue-300 active:bg-blue-400 transition-colors'
      }}
      onResizeStart={handleResizeStart}
      className="border-t bg-white shadow-md w-full relative"
    >
      {/* 푸터 헤더 영역 */}
      <div className="flex h-8 items-center justify-between px-2 text-xs text-gray-500 bg-gray-50">
        <div className="flex items-center">
          <span>© 2025 NEXDPS</span>
          <span className="mx-2">|</span>
          <span>버전: 1.0.0</span>
        </div>

        <div className="flex items-center">
          {/* 드로워 토글 버튼 */}
          <button
            className="flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </button>
        </div>
      </div>

      {/* 푸터 본문 영역 - 알림 메시지 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-blue-50"
          >
            <div className="space-y-0.5 border-t border-blue-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center py-1.5 px-2 text-xs text-gray-700 "
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                  <span>{notification.message}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Resizable>
  )
}

export default Footer