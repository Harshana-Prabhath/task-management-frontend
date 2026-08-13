import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { useUpdatePassword } from "../hooks/useUserHooks";
import { FullScreenLoader } from "../components/ui/FullScreenLoader";

interface PasswordFieldConfig {
  key: "currentPassword" | "newPassword" | "confirmPassword";
  label: string;
  placeholder: string;
}

const passwordFields: PasswordFieldConfig[] = [
  { key: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
  { key: "newPassword", label: "New Password", placeholder: "Enter new password" },
  { key: "confirmPassword", label: "Confirm New Password", placeholder: "Re-enter new password" },
];

function FloatingField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.02] px-4 pb-2.5 pt-5 transition-colors focus-within:border-white/25">
      <span className="pointer-events-none absolute left-4 top-2 text-[11px] uppercase tracking-wide text-white/40">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
 
  const [isEditing, setIsEditing] = useState(false);
  

  const { mutate: changePassword, isPending: isSubmitting } = useUpdatePassword();


  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visible, setVisible] = useState<Record<PasswordFieldConfig["key"], boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  if (!user) return null;

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const toggleVisible = (key: PasswordFieldConfig["key"]) =>
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEditing) return;

   
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    changePassword(
      {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setTimeout(() => {
            navigate("/task-dashboard");
          },500);
        },
      }
    );
   
  }

  return (
    <>
        <FullScreenLoader 
            isLoading={isSubmitting} 
            message="Securing your account and re-hashing credentials..." 
        />
        <div className="min-h-screen bg-[#0B0F19] px-4 py-8 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">
            
            
            <header className="mb-8 flex flex-col gap-4">
            <button
                type="button"
                onClick={() => navigate("/task-dashboard")}
                className="inline-flex w-fit items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </button>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Profile Settings</h1>
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
                    {user.role}
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-wide text-white/30">Workspace Authorization</p>
                </div>
            </aside>

            
            <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#10162A] p-6 shadow-lg shadow-black/20 sm:p-8">
                
                
                <section>
                <h3 className="text-sm font-semibold text-white/70">Personal Metrics</h3>
                <p className="mt-1 text-xs text-white/40">Account identity parameters mapped to your active session.</p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <FloatingField label="Full Name">
                    <input type="text" value={user.name} disabled className="w-full bg-transparent text-sm text-white/50 outline-none cursor-not-allowed" />
                    </FloatingField>
                    <FloatingField label="Email Address">
                    <input type="email" value={user.email} disabled className="w-full bg-transparent text-sm text-white/50 outline-none cursor-not-allowed" />
                    </FloatingField>
                </div>
                </section>

                <div className="my-7 h-px bg-white/10" />

            
                <section>
                <h3 className="text-sm font-semibold text-white/70">Security Guard</h3>
                <p className="mt-1 text-xs text-white/40">Manage account access controls. Click Edit Profile below to make changes.</p>

                <div className="mt-4 grid gap-4">
                    {passwordFields.map((field) => (
                    <FloatingField key={field.key} label={field.label}>
                        <div className="flex items-center gap-2">
                        <input
                            type={visible[field.key] ? "text" : "password"}
                            value={form[field.key]}
                            onChange={update(field.key)}
                            placeholder={isEditing ? field.placeholder : "••••••••••••"}
                            disabled={!isEditing || isSubmitting}
                            required={isEditing}
                            className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none disabled:text-white/30 disabled:cursor-not-allowed"
                        />
                        {isEditing && (
                            <button
                            type="button"
                            onClick={() => toggleVisible(field.key)}
                            className="shrink-0 text-white/40 transition-colors hover:text-white/70"
                            >
                            {visible[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                        onClick={() => {
                        setIsEditing(false);
                        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        }}
                        className="rounded-xl border border-white/10 bg-transparent px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.04] disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0B0F19] transition-transform active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving Changes..." : "Save Configurations"}
                    </button>
                    </>
                ) : (
                    <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0B0F19] transition-transform active:scale-95"
                    >
                    <Lock className="h-4 w-4" /> Edit Profile Security
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