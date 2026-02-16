import { LoginForm } from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-57px)] pt-12 pb-8 px-4">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="text-[28px] font-extrabold tracking-tight leading-none">
          <span className="text-red-600">auto</span>
          <span className="text-[#1a1a1a]">TOJ</span>
        </div>
        <p className="mt-1.5 text-[13px] text-gray-400">
          Покупка, продажа и сервисы
        </p>
      </div>

      {/* Form */}
      <LoginForm />
    </div>
  );
}
