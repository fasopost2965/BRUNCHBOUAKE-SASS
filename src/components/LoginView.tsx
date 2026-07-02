import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  Key, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Building2,
  Coffee,
  Shield,
  Clock,
  ChevronDown,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { UserAccount } from '../types';

interface LoginViewProps {
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onResetPasswordDirect: (username: string, newPassword: string) => void;
}

type AuthScreen = 'login' | 'forgot' | 'first-reset' | 'reset-success';

export default function LoginView({
  users,
  onLoginSuccess,
  onResetPasswordDirect
}: LoginViewProps) {
  const [screen, setScreen] = useState<AuthScreen>('login');
  
  // Credentials input
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Feedback states
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot password flow states
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [mockSentCode, setMockSentCode] = useState('824105');
  const [timerSeconds, setTimerSeconds] = useState(60);

  // First-time reset flow states
  const [userToReset, setUserToReset] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Dropdown helper for demo accounts quick login
  const [showDemoList, setShowDemoList] = useState(false);

  // Countdown timer for resending code
  React.useEffect(() => {
    let interval: any;
    if (forgotSuccess && timerSeconds > 0 && screen === 'forgot') {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [forgotSuccess, timerSeconds, screen]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Veuillez remplir votre identifiant et votre mot de passe.');
      return;
    }

    const normalizedId = identifier.trim().toLowerCase();
    const matchedUser = users.find(
      u => u.username.toLowerCase() === normalizedId || (u.email && u.email.toLowerCase() === normalizedId)
    );

    if (!matchedUser) {
      setErrorMessage("Identifiant incorrect ou compte introuvable. Veuillez réessayer.");
      return;
    }

    if (matchedUser.status === 'inactive') {
      setErrorMessage("Ce compte de collaborateur est actuellement désactivé. Veuillez contacter l'administrateur.");
      return;
    }

    if (matchedUser.status === 'blocked') {
      setErrorMessage("Accès bloqué suite à des infractions de sécurité ou clôture d'équipe. Contactez votre manager.");
      return;
    }

    // Check password
    if (matchedUser.passwordHash !== password) {
      setErrorMessage("Mot de passe incorrect. Veuillez vérifier la saisie ou demander une réinitialisation.");
      return;
    }

    // Check if temporary password needs reset
    if (matchedUser.isTemporaryPassword) {
      setUserToReset(matchedUser);
      setScreen('first-reset');
      return;
    }

    // Success login
    onLoginSuccess(matchedUser);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const searchInput = forgotIdentifier.trim();
    if (!searchInput) {
      setErrorMessage("Veuillez renseigner votre email enregistré.");
      return;
    }

    // Attempting to match by email prioritizing registered email addresses
    const matched = users.find(
      u => (u.email && u.email.toLowerCase() === searchInput.toLowerCase()) || 
           u.username.toLowerCase() === searchInput.toLowerCase()
    );

    if (!matched) {
      setErrorMessage("Aucun collaborateur ne possède cette adresse email ou cet identifiant.");
      return;
    }

    if (!matched.email) {
      setErrorMessage("Ce collaborateur n'a pas d'adresse email enregistrée. Contactez l'administrateur.");
      return;
    }

    setSendingEmail(true);
    
    // Simulating high fidelity network transmit and email sending
    setTimeout(() => {
      setSendingEmail(false);
      setForgotSuccess(true);
      setUserToReset(matched);
      setVerificationCode('');
      setTimerSeconds(60);
      
      // Randomize code
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setMockSentCode(generatedCode);
    }, 1500);
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (verificationCode.trim() !== mockSentCode) {
      setErrorMessage("Le code de vérification à 6 chiffres est incorrect. Vérifiez la boîte de réception démo.");
      return;
    }

    // Code matches, proceed to password reset form
    setScreen('first-reset');
  };

  const handleResendCode = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setSendingEmail(true);
    
    setTimeout(() => {
      setSendingEmail(false);
      setTimerSeconds(60);
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setMockSentCode(generatedCode);
      setSuccessMessage("Nouveau code de sécurité envoyé avec succès !");
      setTimeout(() => setSuccessMessage(''), 4000);
    }, 1200);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (userToReset) {
      onResetPasswordDirect(userToReset.username, newPassword);
      setScreen('reset-success');
    } else {
      setErrorMessage("Une erreur est survenue lors de l'identification de l'utilisateur à réinitialiser.");
    }
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'Vide', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, text: 'Faible', color: 'bg-rose-500' };
    if (pass.length < 10) return { score: 2, text: 'Moyen', color: 'bg-amber-500' };
    return { score: 3, text: 'Excellent', color: 'bg-emerald-500' };
  };

  const handleQuickDemoClick = (demoUser: UserAccount) => {
    setIdentifier(demoUser.username);
    setPassword(demoUser.passwordHash);
    setShowDemoList(false);
    setErrorMessage('');
  };

  const strengthInfo = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Visual background overlays */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl -z-10 animate-pulse" />
      
      {/* Outer ambient decorative design elements mimicking premium hotel lobby art */}
      <div className="absolute top-10 left-10 text-white/5 font-mono text-xs select-none hidden md:block">
        BRUNCH BOUAKÉ SYSTEM v2.5.0 • COSTA D'IVOIRE
      </div>
      <div className="absolute bottom-10 right-10 text-white/5 font-mono text-xs select-none hidden md:block">
        SECURE AUTHENTICATION SYSTEM • GMT LOCAL TIME
      </div>

      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-3xl shadow-lg shadow-orange-500/10 border border-orange-400/20 mb-3 animate-bounce">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Brunch Bouaké</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Système d'Exploitation Hôtelier & Restauration</p>
        </div>

        {/* Core Auth Panel Card */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative">
          
          {/* Header indicator ribbon */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-orange-500 to-amber-500 rounded-b-full" />

          {/* SCREEN 1: MAIN LOGIN SCREEN */}
          {screen === 'login' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-extrabold text-white tracking-tight">Connexion Collaborateur</h2>
                <p className="text-xs text-slate-400 mt-1">Saisissez vos identifiants de service pour démarrer votre shift.</p>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-2.5 text-xs font-bold leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                {/* Username Input */}
                <div className="space-y-1">
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Identifiant de Service ou Email</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: reception@test ou m.diallo"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-orange-500 focus:outline-none text-slate-200 font-medium placeholder-slate-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Mot de Passe</label>
                    <button
                      type="button"
                      onClick={() => setScreen('forgot')}
                      className="text-[10px] font-bold text-orange-400 hover:text-orange-500 transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-orange-500 focus:outline-none text-slate-200 font-medium placeholder-slate-600 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me and Device Lock */}
                <div className="flex items-center justify-between pt-1 select-none">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="text-[11px] text-slate-400 font-medium">Rester connecté sur ce poste</span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all text-xs tracking-wide uppercase cursor-pointer"
                >
                  S'authentifier & Ouvrir Session
                </button>
              </form>

              {/* DEMO ACCORDION BYPASS TRIGGER */}
              <div className="pt-4 border-t border-slate-800 text-center space-y-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDemoList(!showDemoList)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-bold text-orange-400 hover:bg-slate-900 transition-all inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" />
                    Bypass Caisse / Accès Rapide Démo
                    <ChevronDown className={`w-3 h-3 transition-transform ${showDemoList ? 'rotate-180' : ''}`} />
                  </button>

                  {showDemoList && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 bg-slate-950 border border-slate-800 rounded-2xl p-2.5 text-left space-y-1.5 shadow-2xl z-20">
                      <span className="block text-[9px] font-bold text-slate-500 uppercase px-1.5 mb-1">
                        Sélectionnez un rôle de test :
                      </span>
                      {users.length === 0 ? (
                        <div className="text-[10px] text-slate-500 px-1.5 italic">
                          Aucun compte démo. Cliquez sur "Générer Comptes Demo" depuis l'onglet Utilisateurs après connexion.
                        </div>
                      ) : (
                        <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
                          {users.map(u => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => handleQuickDemoClick(u)}
                              className="w-full text-left p-1.5 hover:bg-slate-900 rounded-lg flex items-center justify-between text-[11px] text-slate-300 transition-colors"
                            >
                              <div className="font-bold truncate max-w-[150px]">
                                {u.name.split(' ')[0]} <span className="text-[9px] text-slate-500 font-mono font-normal">({u.username})</span>
                              </div>
                              <span className="px-1.5 py-0.5 bg-slate-800 text-orange-400 rounded text-[9px] font-mono uppercase font-bold text-right">
                                {u.role}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: FORGOT PASSWORD FLOW */}
          {screen === 'forgot' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setScreen('login');
                    setForgotSuccess(false);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-base font-extrabold text-white">Récupération de Mot de Passe</h2>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-2.5 text-xs font-bold leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-start gap-2.5 text-xs font-bold leading-relaxed">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5 animate-pulse" />
                  <span>{successMessage}</span>
                </div>
              )}

              {sendingEmail ? (
                <div className="text-center py-8 space-y-4">
                  <div className="relative inline-flex">
                    <div className="w-12 h-12 rounded-full border-4 border-orange-500/10 border-t-orange-500 animate-spin" />
                    <Mail className="w-5 h-5 text-orange-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white font-bold">Sécurisation du canal d'acheminement...</p>
                    <p className="text-[10px] text-slate-500 font-mono">Génération du jeton crypté en cours...</p>
                  </div>
                </div>
              ) : forgotSuccess ? (
                /* STEP 2: CODE CONFIRMATION VERIFICATION STATE */
                <div className="space-y-5">
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 border border-orange-500/20">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-[11px]">Email envoyé avec succès !</h4>
                        <p className="text-[10px] text-slate-400">Canal de secours validé</p>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Un code temporaire à 6 chiffres a été expédié à l'adresse enregistrée de <strong className="text-white font-bold">{userToReset?.name}</strong> :
                    </p>
                    <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px] text-center select-all truncate">
                      {userToReset?.email}
                    </div>
                  </div>

                  {/* INTERACTIVE CODE SUBMISSION FORM */}
                  <form onSubmit={handleVerifyCodeSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Code de Sécurité (6 chiffres)</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        pattern="\d{6}"
                        placeholder="••••••"
                        value={verificationCode}
                        onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center tracking-widest text-lg font-black bg-slate-950 border border-slate-800 rounded-xl py-2.5 focus:border-orange-500 focus:outline-none text-orange-400 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={verificationCode.length !== 6}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-extrabold rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Valider le code & Réinitialiser
                    </button>
                  </form>

                  {/* RESEND SIMULATION WITH TIMER */}
                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <span className="text-slate-500 font-medium">Pas reçu d'email ?</span>
                    {timerSeconds > 0 ? (
                      <span className="text-slate-400 font-mono">
                        Renvoyer disponible dans <strong className="text-orange-400 font-bold">{timerSeconds}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Renvoyer un nouveau code
                      </button>
                    )}
                  </div>

                  {/* HIGH-FIDELITY SIMULATED MAILBOX DRAWER */}
                  <div className="pt-4 border-t border-slate-800/80 bg-orange-950/5 p-3.5 rounded-2xl border border-orange-500/10">
                    <div className="flex items-center gap-1.5 text-orange-400 font-bold uppercase tracking-wider text-[9px] mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Simulateur Réseau & Caisse Locale
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                      Pour les besoins de la démonstration, le code de sécurité fictif reçu sur le boîtier de sécurité de la caisse ou l'email est :
                    </p>
                    <div className="flex items-center justify-between gap-2.5 bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider pl-1">CODE REÇU :</span>
                      <span className="text-emerald-400 text-sm font-extrabold tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">{mockSentCode}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationCode(mockSentCode);
                          setErrorMessage('');
                        }}
                        className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white text-[9px] font-black uppercase rounded-lg transition-colors cursor-pointer"
                      >
                        Saisie Rapide
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* STEP 1: INPUT REGISTERED EMAIL ADDRESS SCREEN */
                <form onSubmit={handleForgotSubmit} className="space-y-5 text-xs">
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Saisissez l'adresse email enregistrée sur votre fiche collaborateur ou votre identifiant de connexion. Un code secret temporaire vous sera expédié.
                  </p>

                  <div className="space-y-1">
                    <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Votre adresse email enregistrée</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: m.diallo@brunchbouake.com"
                        value={forgotIdentifier}
                        onChange={e => setForgotIdentifier(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-orange-500 focus:outline-none text-slate-200 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-xl shadow-lg transition-all text-xs tracking-wide uppercase cursor-pointer"
                  >
                    Demander le code de réinitialisation
                  </button>

                  {/* QUICK DEMO ASSIST: LIST REGISTERED EMAILS TO EXPEDITE TESTING */}
                  <div className="pt-4 border-t border-slate-800/80">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                      Emails enregistrés pour la démo :
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
                      {users.filter(u => u.email).map(u => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setForgotIdentifier(u.email || '');
                            setErrorMessage('');
                          }}
                          className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-800/60 hover:border-orange-500/50 rounded-xl text-left text-[10px] text-slate-300 transition-all flex flex-col cursor-pointer"
                        >
                          <span className="font-bold text-slate-400 truncate text-[9px] uppercase tracking-wide">
                            {u.name.split(' ')[0]} ({u.role === 'admin' ? 'Admin' : u.role === 'manager' ? 'Manager' : u.role === 'receptionist' ? 'Réceptionniste' : u.role === 'waiter' ? 'Serveur' : u.role === 'accountant' ? 'Comptable' : 'Gouvernante'})
                          </span>
                          <span className="text-[10px] text-orange-400 truncate mt-0.5 select-all">
                            {u.email}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SCREEN 3: FIRST-TIME PASSWORD RESET / FORCE SET */}
          {screen === 'first-reset' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex p-2 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 mb-2">
                  <Key className="w-5 h-5" />
                </div>
                <h2 className="text-base font-extrabold text-white tracking-tight">Configuration de Sécurité Obligatoire</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Compte de {userToReset?.name}. C'est votre première connexion avec un mot de passe temporaire ou vous avez initié un oubli. Veuillez en définir un nouveau.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold">
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
                {/* New Password */}
                <div className="space-y-1">
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Nouveau Mot de Passe (min. 6 car.)</label>
                  <input
                    type="password"
                    required
                    placeholder="Saisissez votre mot de passe robuste"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-orange-500 focus:outline-none text-slate-200 font-mono"
                  />
                  {newPassword && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-400 font-medium">Robustesse :</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${strengthInfo.color}`} 
                          style={{ width: `${(strengthInfo.score / 3) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-300 font-bold font-mono">{strengthInfo.text}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Confirmez le Mot de Passe</label>
                  <input
                    type="password"
                    required
                    placeholder="Saisissez à nouveau"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-orange-500 focus:outline-none text-slate-200 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl transition-all uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  Enregistrer et Ouvrir Session
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 4: SUCCESS PASSWORD RESET */}
          {screen === 'reset-success' && (
            <div className="space-y-6 text-center py-4 text-xs">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-extrabold text-white">Changement effectué avec succès !</h2>
              <p className="text-slate-400 leading-relaxed px-3 text-[11px]">
                Votre mot de passe a été correctement enregistré. Vous pouvez à présent vous connecter en utilisant ce nouveau sésame de sécurité.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setScreen('login');
                    setPassword('');
                    setConfirmPassword('');
                    setNewPassword('');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-md uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  Retourner à l'Écran de Connexion
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Technical help details footer */}
        <div className="text-center mt-6 text-[11px] text-slate-500">
          En cas de blocage, veuillez contacter le responsable d'astreinte au <strong className="text-slate-400">+225 07 48 29 10 11</strong>.
        </div>
      </div>
    </div>
  );
}
