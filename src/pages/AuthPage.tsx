import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useLoginUser, useRegisterUser } from "../hooks/useAuthHooks";
import { FullScreenLoader } from "../components/ui/FullScreenLoader";

type Role = "User" | "Admin";

interface User {
  name: string;
  email: string;
  role: Role;
}

function FloatingField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.02] px-4 pb-2.5 pt-5 transition-colors focus-within:border-white/30">
      <span className="pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-[#0B0F19] px-2 text-[11px] font-medium uppercase tracking-wide text-white/40">
        {label}
      </span>
      {children}
    </div>
  );
}

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("User");

  const isRegister = mode === "register";

  const inputClass = "w-full bg-transparent text-sm text-white placeholder-white/30 outline-none";

  const {mutate: loginUser, isPending: isLoggingIn} = useLoginUser();
  const { mutate: registerUser, isPending: isRegistering } = useRegisterUser(() => setMode("login"));


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(isRegister){
        registerUser({ email: email.trim(), password, name: name.trim(), role });
    }else {
        loginUser({ email: email.trim(), password });
    }
    
    
  }

  return (
    <>
      
      <FullScreenLoader 
        isLoading={isLoggingIn || isRegistering} 
        message={isRegister ? "Creating your account..." : "Authenticating session..."} 
      />

      <div className="flex min-h-screen bg-[#0B0F19] text-white">
        <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-10 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base font-black text-[#0B0F19]">
                T
              </div>
              <span className="text-lg font-semibold tracking-tight">Tasky</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {isRegister ? "Create an Account" : "Welcome Back!"}
            </h1>
            <p className="mt-2 text-sm text-white/40">
              {isRegister
                ? "Set up your workspace and choose your role to get started."
                : "Sign in to continue to your task workspace."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              {isRegister && (
                <FloatingField label="Full Name">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Cooper"
                    className={inputClass}
                    required
                  />
                </FloatingField>
              )}

              <FloatingField label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={inputClass}
                  required
                />
              </FloatingField>

              <FloatingField label="Password">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                  required
                />
              </FloatingField>

              {isRegister && (
                <FloatingField label="Role">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full appearance-none bg-transparent text-sm text-white outline-none [&>option]:bg-[#0B0F19]"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </FloatingField>
              )}

              <button
                type="submit"
                disabled={isLoggingIn || isRegistering}
                className="mt-2 rounded-xl bg-white py-3 text-sm font-semibold text-[#0B0F19] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_30px_-6px_rgba(255,255,255,0.4)] transition-all hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_10px_40px_-4px_rgba(255,255,255,0.55)] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoggingIn || isRegistering ? "Connecting..." : isRegister ? "Create Account" : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/40">
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => setMode(isRegister ? "login" : "register")}
                className="font-semibold text-white underline-offset-4 hover:underline"
              >
                {isRegister ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>

        <div className="relative hidden w-1/2 overflow-hidden border-l border-white/5 bg-[#0F1424] lg:flex lg:flex-col lg:justify-between lg:p-16">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-sky-600/10 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/50">
              <CheckCircle2 className="h-3.5 w-3.5" /> Premium Workspace
            </span>
          </div>

          <div className="relative">
            <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-balance">
              Organize the work. Ship with clarity.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/40">
              Tasky brings your team's tasks, priorities, and progress into a single focused dark workspace built for momentum.
            </p>
          </div>

          <div className="relative flex items-center gap-6 text-sm text-white/40">
            <div>
              <p className="text-2xl font-bold text-white">12k+</p>
              <p>Teams</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p>Uptime</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">4.9★</p>
              <p>Rating</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}