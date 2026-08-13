import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLoginUser, useRegisterUser } from "../hooks/useAuthHooks";
import { FullScreenLoader } from "../components/ui/FullScreenLoader";
import { FloatingField } from "../components/ui/FloatingField";
import { LanguageToggle } from "../components/ui/LaungageToggle";
import {
  loginSchema,
  registerSchema,
  getFieldErrors,
} from "../validations/schemas";

type Role = "User" | "Admin";

export function AuthPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("User");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isRegister = mode === "register";
  const inputClass =
    "w-full bg-transparent text-sm text-white placeholder-white/30 outline-none";

  const { mutate: loginUser, isPending: isLoggingIn } = useLoginUser();
  const { mutate: registerUser, isPending: isRegistering } = useRegisterUser(
    () => setMode("login")
  );

  const handleModeSwitch = (newMode: "login" | "register") => {
    setMode(newMode);
    setErrors({});
  };

  const validateField = (
    field: "name" | "email" | "password" | "role",
    value: string
  ) => {
    const activeSchema = isRegister ? registerSchema : loginSchema;
    const fieldSchema = (activeSchema.shape as Record<string, any>)[field];

    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(value);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.issues[0]?.message || "Invalid input",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isRegister) {
      const result = registerSchema.safeParse({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (!result.success) {
        setErrors(getFieldErrors(result.error));
        return;
      }

      setErrors({});
      registerUser(result.data);
    } else {
      const result = loginSchema.safeParse({
        email: email.trim(),
        password,
      });

      if (!result.success) {
        setErrors(getFieldErrors(result.error));
        return;
      }

      setErrors({});
      loginUser(result.data);
    }
  }

  return (
    <>
      <FullScreenLoader
        isLoading={isLoggingIn || isRegistering}
        message={
          isRegister ? t("auth.connecting") : t("auth.connecting")
        }
      />

      <div className="flex min-h-screen bg-[#0B0F19] text-white">
        <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base font-black text-[#0B0F19]">
                  T
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  Tasky
                </span>
              </div>
              <LanguageToggle />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {isRegister ? t("auth.create_account") : t("auth.welcome_back")}
            </h1>
            <p className="mt-2 text-sm text-white/40">
              {isRegister ? t("auth.register_sub") : t("auth.login_sub")}
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 flex flex-col gap-4"
            >
              {isRegister && (
                <FloatingField label={t("auth.full_name")} error={errors.name}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    onBlur={() => validateField("name", name.trim())}
                    placeholder="Jane Cooper"
                    className={inputClass}
                  />
                </FloatingField>
              )}

              <FloatingField label={t("auth.email")} error={errors.email}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  onBlur={() => validateField("email", email.trim())}
                  placeholder="you@company.com"
                  className={inputClass}
                />
              </FloatingField>

              <FloatingField label={t("auth.password")} error={errors.password}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  onBlur={() => validateField("password", password)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </FloatingField>

              {isRegister && (
                <FloatingField label={t("auth.role")} error={errors.role}>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value as Role);
                      if (errors.role)
                        setErrors((prev) => ({ ...prev, role: "" }));
                    }}
                    onBlur={() => validateField("role", role)}
                    className="w-full appearance-none bg-transparent text-sm text-white outline-none [&>option]:bg-[#0B0F19]"
                  >
                    <option value="User">{t("common.user")}</option>
                    <option value="Admin">{t("common.admin")}</option>
                  </select>
                </FloatingField>
              )}

              <button
                type="submit"
                disabled={isLoggingIn || isRegistering}
                className="mt-2 rounded-xl bg-white py-3 text-sm font-semibold text-[#0B0F19] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_30px_-6px_rgba(255,255,255,0.4)] transition-all hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_10px_40px_-4px_rgba(255,255,255,0.55)] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoggingIn || isRegistering
                  ? t("auth.connecting")
                  : isRegister
                  ? t("auth.create_account_btn")
                  : t("auth.sign_in")}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/40">
              {isRegister
                ? t("auth.already_have_account")
                : t("auth.dont_have_account")}
              <button
                type="button"
                onClick={() =>
                  handleModeSwitch(isRegister ? "login" : "register")
                }
                className="font-semibold text-white underline-offset-4 hover:underline"
              >
                {isRegister ? t("auth.sign_in") : t("auth.sign_up")}
              </button>
            </p>
          </div>
        </div>

        <div className="relative hidden w-1/2 overflow-hidden border-l border-white/5 bg-[#0F1424] lg:flex lg:flex-col lg:justify-between lg:p-16">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-sky-600/10 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/50">
              <CheckCircle2 className="h-3.5 w-3.5" /> {t("auth.premium_workspace")}
            </span>
          </div>

          <div className="relative">
            <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-balance">
              {t("auth.hero_title")}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/40">
              {t("auth.hero_desc")}
            </p>
          </div>

          <div className="relative flex items-center gap-6 text-sm text-white/40">
            <div>
              <p className="text-2xl font-bold text-white">12k+</p>
              <p>{t("auth.teams")}</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p>{t("auth.uptime")}</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">4.9★</p>
              <p>{t("auth.rating")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}