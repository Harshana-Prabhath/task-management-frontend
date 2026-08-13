import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUpdatePassword } from "../hooks/useUserHooks";
import { FullScreenLoader } from "../components/ui/FullScreenLoader";
import { FloatingField } from "../components/ui/FloatingField";
import { LanguageToggle } from "../components/ui/LaungageToggle";
import { useAuthStore } from "../store/useAuthStore";
import {
  changePasswordSchema,
  passwordSchema,
  getFieldErrors,
} from "../../src/validations/schemas";

interface PasswordFieldConfig {
  key: "currentPassword" | "newPassword" | "confirmPassword";
  labelKey:
    | "profile.current_password"
    | "profile.new_password"
    | "profile.confirm_password";
  placeholderKey:
    | "profile.enter_current_pw"
    | "profile.enter_new_pw"
    | "profile.reenter_new_pw";
}
const passwordFields: PasswordFieldConfig[] = [
  {
    key: "currentPassword",
    labelKey: "profile.current_password",
    placeholderKey: "profile.enter_current_pw",
  },
  {
    key: "newPassword",
    labelKey: "profile.new_password",
    placeholderKey: "profile.enter_new_pw",
  },
  {
    key: "confirmPassword",
    labelKey: "profile.confirm_password",
    placeholderKey: "profile.reenter_new_pw",
  },
];

export default function EditProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const { mutate: changePassword, isPending: isSubmitting } =
    useUpdatePassword();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [visible, setVisible] = useState<
    Record<PasswordFieldConfig["key"], boolean>
  >({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  if (!user) return null;

  const update =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    };

  const toggleVisible = (key: PasswordFieldConfig["key"]) =>
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  const validateField = (field: keyof typeof form) => {
    if (!isEditing) return;

    if (field === "currentPassword") {
      if (!form.currentPassword.trim()) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is required",
        }));
      } else {
        setErrors((prev) => ({ ...prev, currentPassword: "" }));
      }
    }

    if (field === "newPassword") {
      const result = passwordSchema.safeParse(form.newPassword);
      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          newPassword: result.error.issues[0]?.message || "Invalid password",
        }));
      } else {
        setErrors((prev) => ({ ...prev, newPassword: "" }));
      }

      if (form.confirmPassword && form.newPassword !== form.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "New passwords do not match.",
        }));
      } else if (form.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }

    if (field === "confirmPassword") {
      if (!form.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Please confirm your new password",
        }));
      } else if (form.newPassword !== form.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "New passwords do not match.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEditing) return;

    const result = changePasswordSchema.safeParse(form);
    if (!result.success) {
      setErrors(getFieldErrors(result.error));
      return;
    }

    setErrors({});
    changePassword(
      {
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setErrors({});
          setTimeout(() => {
            navigate("/task-dashboard");
          }, 500);
        },
      }
    );
  }

  const handleCancel = () => {
    setIsEditing(false);
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
  };

  return (
    <>
      <FullScreenLoader
        isLoading={isSubmitting}
        message={t("profile.securing_account")}
      />
      <div className="min-h-screen bg-[#0B0F19] px-4 py-8 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigate("/task-dashboard")}
                className="inline-flex w-fit items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("profile.back_to_dashboard")}
              </button>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("profile.title")}
              </h1>
            </div>
            <LanguageToggle />
          </header>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="h-fit rounded-2xl border border-white/10 bg-[#10162A] p-6 shadow-lg shadow-black/20">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <User className="h-10 w-10 text-white/50" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{user.name}</h2>
                <p className="mt-1 text-sm text-white/40">{user.email}</p>

                <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {user.role === "Admin" ? t("common.admin") : t("common.user")}
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-wide text-white/30">
                  {t("profile.workspace_auth")}
                </p>
              </div>
            </aside>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-white/10 bg-[#10162A] p-6 shadow-lg shadow-black/20 sm:p-8"
            >
              <section>
                <h3 className="text-sm font-semibold text-white/70">
                  {t("profile.personal_metrics")}
                </h3>
                <p className="mt-1 text-xs text-white/40">
                  {t("profile.identity_sub")}
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <FloatingField label={t("auth.full_name")}>
                    <input
                      type="text"
                      value={user.name}
                      disabled
                      className="w-full bg-transparent text-sm text-white/50 outline-none cursor-not-allowed"
                    />
                  </FloatingField>
                  <FloatingField label={t("auth.email")}>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full bg-transparent text-sm text-white/50 outline-none cursor-not-allowed"
                    />
                  </FloatingField>
                </div>
              </section>

              <div className="my-7 h-px bg-white/10" />

              <section>
                <h3 className="text-sm font-semibold text-white/70">
                  {t("profile.security_guard")}
                </h3>
                <p className="mt-1 text-xs text-white/40">
                  {t("profile.security_sub")}
                </p>

                <div className="mt-4 grid gap-4">
                  {passwordFields.map((field) => (
                    <FloatingField
                      key={field.key}
                      label={t(field.labelKey)}
                      error={errors[field.key]}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type={visible[field.key] ? "text" : "password"}
                          value={form[field.key]}
                          onChange={update(field.key)}
                          onBlur={() => validateField(field.key)}
                          placeholder={
                            isEditing ? t(field.placeholderKey) : "••••••••••••"
                          }
                          disabled={!isEditing || isSubmitting}
                          className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none disabled:text-white/30 disabled:cursor-not-allowed"
                        />
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => toggleVisible(field.key)}
                            className="shrink-0 text-white/40 transition-colors hover:text-white/70"
                          >
                            {visible[field.key] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </FloatingField>
                  ))}
                </div>
              </section>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleCancel}
                      className="rounded-xl border border-white/10 bg-transparent px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.04] disabled:opacity-50"
                    >
                      {t("common.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0B0F19] transition-transform active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting
                        ? t("profile.saving")
                        : t("profile.save_config")}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0B0F19] transition-transform active:scale-95"
                  >
                    <Lock className="h-4 w-4" /> {t("profile.edit_security")}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}