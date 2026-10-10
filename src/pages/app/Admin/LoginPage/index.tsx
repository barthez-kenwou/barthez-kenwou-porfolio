import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/providers/AuthProvider';
import { loginSchema, type LoginSchema } from '@/features/admin-auth';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { ADMIN_BASE } from '@/shared/config/admin';
import { FloatingFillField } from '@/entities/contact/ui/FloatingFillField.ui';
import { LanguageToggle } from '@/shared/ui/LanguageToggle';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { Button } from '@/shared/ui/button';
import { LoadingPage } from '@/shared/ui/LoadingPage/LoadingPage';

type LocationState = { from?: string };

export function AdminLoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguageStore();
  const fr = language === 'fr';
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (loading) return <LoadingPage />;
  if (isAuthenticated) return <Navigate to={ADMIN_BASE} replace />;

  const onSubmit = async (values: LoginSchema) => {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success(fr ? 'Bienvenue' : 'Welcome back');
      const from = (location.state as LocationState | null)?.from;
      navigate(
        from && from.startsWith(ADMIN_BASE) && !from.includes('/login') ? from : ADMIN_BASE,
        { replace: true },
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : fr ? 'Accès refusé' : 'Access denied');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground pt-[env(safe-area-inset-top)]">
      {/* Atmosphere: restrained, not purple-glow spam */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 10% -10%, hsl(268 40% 40% / 0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, hsl(270 20% 20% / 0.08), transparent 50%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.25]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Brand column */}
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden flex-col gap-24 border-r border-border/40 px-10 py-12 lg:flex xl:px-14"
        >
          <div>
            <h1 className="mt-25 max-w-sm text-3xl font-semibold tracking-tight text-foreground xl:text-4xl">
              {fr ? (
                <>
                  Le studio derrière
                  <span className="block text-primary">barthez-kenwou.dev</span>
                </>
              ) : (
                <>
                  The studio behind
                  <span className="block text-primary">barthez-kenwou.dev</span>
                </>
              )}
            </h1>
          </div>

          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="h-px w-16 bg-border" />
            <p>Barthez Kenwou · Full Stack & DevOps</p>
            <Link
              to="/"
              className="inline-block underline-offset-4 hover:text-foreground hover:underline"
            >
              {fr ? 'Retour au site' : 'Back to site'}
            </Link>
          </div>
        </motion.aside>

        {/* Form column — centered single-column below lg; left-aligned in the split layout */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center px-5 py-12 sm:px-8 sm:py-16 lg:items-stretch lg:px-12 lg:py-16 xl:px-16"
        >
          <div className="w-full max-w-[22.5rem] sm:max-w-md lg:max-w-md">
            <div className="mb-8 flex items-center gap-3 sm:mb-10 lg:hidden">
              <img
                src="/icons/logo-mark.png"
                alt=""
                className="size-10 rounded-lg object-cover ring-1 ring-border/40"
              />
              <div>
                <p className="text-sm font-semibold">Barthez Kenwou</p>
                <p className="text-[11px] text-muted-foreground">Portfolio Admin</p>
              </div>
            </div>

            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {fr ? 'Connexion' : 'Sign in'}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {fr ? 'Bon retour.' : 'Welcome back.'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {fr
                ? 'Identifie-toi pour ouvrir le panneau. Aucune inscription publique.'
                : 'Authenticate to open the panel. No public registration.'}
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5 sm:mt-10">
              <div>
                <FloatingFillField
                  label={fr ? 'Email' : 'Email'}
                  type="email"
                  name="email"
                  value={form.watch('email')}
                  onChange={(e) => form.setValue('email', e.target.value, { shouldValidate: true })}
                  onBlur={() => form.trigger('email')}
                  invalid={!!form.formState.errors.email}
                />
                {form.formState.errors.email ? (
                  <p className="mt-1.5 text-xs text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                ) : null}
              </div>

              <div>
                <FloatingFillField
                  label={fr ? 'Mot de passe' : 'Password'}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.watch('password')}
                  onChange={(e) =>
                    form.setValue('password', e.target.value, { shouldValidate: true })
                  }
                  onBlur={() => form.trigger('password')}
                  invalid={!!form.formState.errors.password}
                  endAdornment={
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  }
                />
                {form.formState.errors.password ? (
                  <p className="mt-1.5 text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="mt-2 h-12 w-full rounded-sm text-sm font-medium tracking-wide"
              >
                {submitting ? (fr ? 'Ouverture…' : 'Opening…') : fr ? 'Entrer' : 'Enter'}
              </Button>
            </form>

            <p className="mt-8 text-center text-xs text-muted-foreground sm:mt-10 lg:text-left">
              <Link
                to="/"
                className="underline-offset-4 hover:text-foreground hover:underline lg:hidden"
              >
                {fr ? 'Retour au site public' : 'Back to public site'}
              </Link>
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
