import React from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeleteDialogProps {
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({ onClose, onConfirm }: DeleteDialogProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#10162A] p-6 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 ring-1 ring-rose-400/20">
          <Trash2 className="h-5 w-5 text-rose-300" />
        </div>
        <h3 className="text-base font-semibold text-white">{t("delete_dialog.title")}</h3>
        <p className="mt-1.5 text-sm text-white/40">
          {t("delete_dialog.description")}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-500/90 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-500"
          >
            {t("delete_dialog.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}