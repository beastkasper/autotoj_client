"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, User, LogOut, Trash2, CheckCircle, ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import { ConfirmModal } from "@/components/layout/confirm-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/hooks/hooks";
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton";
import { resetAuth } from "@/lib/features/auth/authSlice";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUploadBannerMutation,
  useDeleteAccountMutation,
} from "@/lib/features/profile/profileApi";

const F = "font-[family-name:var(--font-manrope)]";
const BIO_MAX = 150;
const INPUT_BASE =
  "bg-surface-alt border border-black/[0.04] px-5 py-4 text-[15px] w-full outline-none text-foreground";
const LABEL = `block text-[13px] uppercase tracking-wider text-[#8E8E93] mb-2 ${F}`;

export default function ProfileEditPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, showAuthModal, closeAuthModal } = useAuth();
  const { data: profile, isLoading } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const [updateProfile] = useUpdateProfileMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const [uploadBanner] = useUploadBannerMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ name: "", email: "", bio: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({ name: profile.name ?? "", email: profile.email ?? "", bio: profile.bio ?? "" });
    }
  }, [profile]);

  const set = (key: keyof typeof formData, val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const hasChanges =
    !!profile &&
    (formData.name !== (profile.name ?? "") ||
      formData.email !== (profile.email ?? "") ||
      formData.bio !== (profile.bio ?? ""));

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;
    setIsSaving(true);
    try {
      await updateProfile({ name: formData.name, email: formData.email, bio: formData.bio }).unwrap();
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadError(null);
      uploadAvatar(file).unwrap().catch(() => {
        setUploadError("Не удалось загрузить аватар. Попробуйте ещё раз.");
      });
    }
  };

  const handleBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadError(null);
      uploadBanner(file).unwrap().catch(() => {
        setUploadError("Не удалось загрузить баннер. Попробуйте ещё раз.");
      });
    }
  };

  const handleLogout = () => { dispatch(resetAuth()); router.push("/"); };

  const handleDeleteAccount = async () => {
    await deleteAccount({ confirm: true }).unwrap();
    dispatch(resetAuth());
    router.push("/");
  };

  if (!isAuthenticated) {
    return <AuthRequiredModal open={showAuthModal} onClose={closeAuthModal} />;
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const camBtn = (onClick: () => void, lg: boolean) => (
    <button
      onClick={onClick}
      className={`absolute grid place-items-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-colors hover:bg-black/80 ${
        lg ? "bottom-3 right-3 size-10" : "bottom-1 right-1 size-7"
      }`}
    >
      <Camera className={lg ? "size-5" : "size-4"} strokeWidth={1.5} />
    </button>
  );

  const banner = (h: number) => (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-[20px] bg-surface-alt shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      style={{ height: h }}
    >
      {profile?.banner_url ? (
        <Image src={profile.banner_url} alt="Banner" fill className="object-cover" />
      ) : (
        <span className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
          <Camera className="size-4" strokeWidth={1.5} />
          Добавить обложку
        </span>
      )}
      {camBtn(() => bannerRef.current?.click(), h > 150)}
    </div>
  );

  const avatar = (dim: number, mt: string) => (
    <div className={`relative mx-auto ${mt}`} style={{ width: dim, height: dim }}>
      <div className="flex items-center justify-center overflow-hidden rounded-full border-4 border-card bg-secondary shadow-[0_4px_12px_rgba(0,0,0,0.08)]" style={{ width: dim, height: dim }}>
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt="Avatar" width={dim} height={dim} className="object-cover w-full h-full" />
        ) : (
          <User className="h-1/2 w-1/2 text-muted-foreground" strokeWidth={1.5} />
        )}
      </div>
      {camBtn(() => avatarRef.current?.click(), dim > 100)}
    </div>
  );

  const success = successMessage && (
    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-2xl text-[15px] animate-in slide-in-from-top duration-300">
      <CheckCircle className="w-5 h-5" />
      <span className={F}>Профиль обновлён</span>
    </div>
  );

  const uploadErrorBanner = uploadError && (
    <div className="flex items-center gap-2 bg-red-50 text-[#D32F2F] px-4 py-3 rounded-2xl text-[15px] animate-in slide-in-from-top duration-300">
      <span className={F}>{uploadError}</span>
    </div>
  );

  const bioField = (rounded: string) => (
    <div className="relative">
      <Textarea
        value={formData.bio}
        onChange={(e) => set("bio", e.target.value.slice(0, BIO_MAX))}
        placeholder="О себе"
        rows={3}
        maxLength={BIO_MAX}
        className={`${INPUT_BASE} ${rounded} resize-none ${F}`}
      />
      <span className="absolute bottom-3 right-4 text-[11px] text-[#C7C7CC]">{formData.bio.length}/{BIO_MAX}</span>
    </div>
  );

  const logoutBtn = (cls: string) => (
    <Button variant="outline" onClick={handleLogout} className={`border-[#E53935] text-[#E53935] text-[15px] ${cls} ${F}`}>
      <LogOut className="w-4 h-4 mr-2" />
      Выйти из профиля
    </Button>
  );

  const deleteBtn = (cls: string) => (
    <Button onClick={() => setShowDeleteModal(true)} className={`bg-[#E53935] hover:bg-[#C62828] text-white text-[15px] ${cls} ${F}`}>
      <Trash2 className="w-4 h-4 mr-2" />
      Удалить аккаунт
    </Button>
  );

  return (
    <>
      <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
      <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerFile} />

      {/* ── Мобилка (§10.14) ── */}
      <div className="screen min-h-screen bg-card lg:hidden">
        <PageHeader
          title="Профиль"
          rightAction={
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`text-[15px] font-semibold ${
                hasChanges && !isSaving ? "text-foreground" : "text-[#C7C7CC]"
              }`}
            >
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          }
        />
        <div className="px-4">
          <div className="mt-4">{banner(140)}</div>
          {avatar(88, "-mt-[44px] mb-4")}
          {uploadErrorBanner}
          {success}
          {/* Поля: r9999, padding 16×20, bg #F7F7F9 (§10.14) */}
          <div className="mt-6 flex flex-col gap-3">
            <Input
              value={formData.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Имя"
              className={`${INPUT_BASE} h-auto rounded-full`}
            />
            <Input
              value={profile?.phone ?? ""}
              disabled
              placeholder="Телефон"
              className={`${INPUT_BASE} h-auto rounded-full opacity-50`}
            />
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="Email"
              className={`${INPUT_BASE} h-auto rounded-full`}
            />
            {bioField("rounded-[20px]")}
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn--danger-ghost w-full"
            >
              <LogOut className="size-4" strokeWidth={1.5} />
              Выйти из аккаунта
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="btn btn--danger w-full"
            >
              <Trash2 className="size-4" strokeWidth={1.5} />
              Удалить аккаунт
            </button>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block max-w-[800px] mx-auto py-10 px-4">
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-1 text-[15px] text-[#8E8E93] hover:text-[#111111] transition-colors mb-6 ${F}`}
        >
          <ChevronLeft className="w-5 h-5" />
          Назад
        </button>
        {uploadErrorBanner}
        {success}
        {banner(200)}
        {avatar(120, "-mt-[60px] mb-6")}
        <div className="flex flex-col gap-5 mt-6">
          <div>
            <label className={LABEL}>Имя</label>
            <Input value={formData.name} onChange={(e) => set("name", e.target.value)} className={`${INPUT_BASE} rounded-[16px] h-auto ${F}`} />
          </div>
          <div>
            <label className={LABEL}>Телефон</label>
            <Input value={profile?.phone ?? ""} disabled className={`${INPUT_BASE} rounded-[16px] h-auto opacity-50 ${F}`} />
          </div>
          <div>
            <label className={LABEL}>Email</label>
            <Input type="email" value={formData.email} onChange={(e) => set("email", e.target.value)} className={`${INPUT_BASE} rounded-[16px] h-auto ${F}`} />
          </div>
          <div>
            <label className={LABEL}>О себе</label>
            {bioField("rounded-[16px]")}
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <Button onClick={handleSave} disabled={!hasChanges || isSaving} className={`rounded-[16px] h-12 px-8 text-[15px] ${F}`}>
            {isSaving ? "Сохранение..." : "Сохранить"}
          </Button>
          {logoutBtn("rounded-[16px] h-12 px-8")}
          {deleteBtn("rounded-[16px] h-12 px-8")}
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title="Удалить аккаунт?"
          description="Все ваши данные будут безвозвратно удалены. Это действие нельзя отменить."
          confirmLabel="Удалить"
          destructive
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
