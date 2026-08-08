import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { translations } from '../data/translations';
import { Language } from '../types';

function getSafeLang(): Language {
  try {
    const saved = localStorage.getItem('snpaiuz_lang') as Language | null;
    if (saved && translations[saved]) return saved;
  } catch (e) {
    // localStorage unavailable — fall back to default
  }
  return 'uz';
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error in AniSenpaiUz:', error, errorInfo);
  }

  private handleReset = (): void => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      const lang = getSafeLang();
      const t = (key: string) => translations[lang]?.[key] ?? translations.uz[key] ?? key;
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-purple-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/40 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white">{t('error.boundary_title')}</h1>
              <p className="text-xs text-slate-400">
                {t('error.boundary_desc')}
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('error.boundary_reset_btn')}</span>
            </button>
          </div>
        </div>
      );
    }

    return (this as unknown as { props: Props }).props.children;
  }
}
