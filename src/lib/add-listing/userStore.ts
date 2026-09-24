/**
 * Веб-аналог autoToj-app/src/lib/userStore.ts — контакты продавца для
 * предзаполнения форм подачи.
 *
 * Источник — профиль из GET /profile (страница /post-ad передаёт его через
 * setRemoteProfile). Правки из EditContactsModal сохраняются в localStorage
 * поверх профиля, как в мобилке (AsyncStorage).
 */

export interface UserProfile {
  name: string;
  phone: string;
  city: string;
}

const USER_STORAGE_KEY = "auto_toj_user_profile";

const empty: UserProfile = { name: "", phone: "", city: "" };

let remote: UserProfile | null = null;
let waiters: Array<(p: UserProfile | null) => void> = [];

/** Телефон в формах хранится 9 цифрами без +992 (как в мобилке). */
function localPhone(phone: string | null | undefined): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("992")) return digits.slice(3);
  return digits;
}

function readOverrides(): Partial<UserProfile> {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Partial<UserProfile>;
  } catch {
    // нет доступа к localStorage — работаем без переопределений
  }
  return {};
}

function writeOverrides(patch: Partial<UserProfile>) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ ...readOverrides(), ...patch }));
  } catch {
    // Silently fail — mirrors mobile behavior
  }
}

function merge(base: UserProfile | null): UserProfile {
  const o = readOverrides();
  const b = base ?? empty;
  return {
    name: o.name || b.name,
    phone: o.phone || b.phone,
    city: o.city || b.city,
  };
}

export function setRemoteProfile(
  profile: { name?: string | null; phone?: string | null; city?: string | null } | null | undefined,
) {
  if (!profile) return;
  remote = {
    name: profile.name ?? "",
    phone: localPhone(profile.phone),
    city: profile.city ?? "",
  };
  const pending = waiters;
  waiters = [];
  pending.forEach((w) => w(remote));
}

function waitForRemote(timeoutMs: number): Promise<UserProfile | null> {
  if (remote) return Promise.resolve(remote);
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      waiters = waiters.filter((w) => w !== done);
      resolve(null);
    }, timeoutMs);
    const done = (p: UserProfile | null) => {
      clearTimeout(timer);
      resolve(p);
    };
    waiters.push(done);
  });
}

export const userStore = {
  async getProfile(): Promise<UserProfile> {
    return merge(await waitForRemote(3000));
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    writeOverrides(profile);
  },

  async updatePhone(phone: string): Promise<void> {
    writeOverrides({ phone });
  },

  async updateCity(city: string): Promise<void> {
    writeOverrides({ city });
  },

  async updateName(name: string): Promise<void> {
    writeOverrides({ name });
  },
};
