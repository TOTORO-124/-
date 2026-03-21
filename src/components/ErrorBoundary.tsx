import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = '알 수 없는 오류가 발생했습니다.';
      
      // 파이어베이스 권한 오류인 경우 상세 메시지 파싱 시도
      try {
        if (this.state.error?.message) {
          const parsedError = JSON.parse(this.state.error.message);
          if (parsedError.error?.includes('permission-denied')) {
            errorMessage = '데이터 접근 권한이 없습니다. 관리자 로그인을 확인해 주세요.';
          }
        }
      } catch (e) {
        // JSON 파싱 실패 시 기본 메시지 유지
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">
          <div className="max-w-md w-full space-y-4 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold tracking-tight">문제가 발생했습니다</h1>
            <p className="text-zinc-400 leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
