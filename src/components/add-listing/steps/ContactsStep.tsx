"use client";

import { cn } from '@/lib/utils';
import { CustomCheckbox } from '@/components/add-listing/form/CustomCheckbox';

interface ContactsStepProps {
  name: string;
  phone: string;
  city: string;
  readyForOnlineViewing: boolean;
  onChangeName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeCity: (value: string) => void;
  onToggleOnlineViewing: () => void;
  onNext: () => void;
}

const INPUT_CLASS =
  'mb-5 w-full border-b border-border bg-transparent pb-3 text-[16px] font-normal text-foreground outline-none placeholder:text-muted-foreground';

export function ContactsStep({
  name,
  phone,
  city,
  readyForOnlineViewing,
  onChangeName,
  onChangePhone,
  onChangeCity,
  onToggleOnlineViewing,
  onNext,
}: ContactsStepProps) {
  const isValid = name.trim() !== '' && phone.trim() !== '';

  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-full max-w-[720px] flex-col px-4 pb-10">
        <h2 className="mb-6 mt-4 text-[28px] font-bold text-foreground">Контакты</h2>

        <span className="mb-[6px] text-[14px] font-normal text-muted-foreground">Имя</span>
        <input
          className={INPUT_CLASS}
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
        />

        <span className="mb-[6px] text-[14px] font-normal text-muted-foreground">Телефон</span>
        <input
          className={INPUT_CLASS}
          placeholder="+992"
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
          type="tel"
          inputMode="tel"
        />

        <span className="mb-[6px] text-[14px] font-normal text-muted-foreground">Город</span>
        <input
          className={INPUT_CLASS}
          placeholder="Город"
          value={city}
          onChange={(e) => onChangeCity(e.target.value)}
        />

        <div className="mb-8">
          <CustomCheckbox
            label="Готов к онлайн-показу"
            checked={readyForOnlineViewing}
            onChange={onToggleOnlineViewing}
          />
        </div>

        {/* Continue */}
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={cn(
            'flex h-[52px] items-center justify-center rounded-[12px]',
            isValid ? 'bg-foreground' : 'bg-border',
          )}
        >
          <span
            className={cn(
              'text-[16px] font-semibold',
              isValid ? 'text-background' : 'text-muted-foreground',
            )}
          >
            Продолжить
          </span>
        </button>
      </div>
    </div>
  );
}
