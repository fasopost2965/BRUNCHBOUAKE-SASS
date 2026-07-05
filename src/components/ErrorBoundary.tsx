import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleClearAndReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700/60 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center border border-rose-500/20">
              <AlertOctagon className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Une erreur inattendue est survenue</h1>
              <p className="text-sm text-slate-400">
                L'application a rencontré un problème technique. Vos données de session locales peuvent être corrompues.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950 p-4 rounded-xl text-left border border-slate-800/80">
                <p className="text-xs font-mono text-rose-400 break-words leading-relaxed">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Actualiser la page
              </button>
              
              <button
                onClick={this.handleClearAndReload}
                className="w-full py-2.5 px-4 bg-slate-700/50 hover:bg-slate-700 hover:text-white text-slate-300 rounded-xl text-xs font-medium transition-all cursor-pointer border border-slate-700"
              >
                Réinitialiser les données locales et recharger
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
