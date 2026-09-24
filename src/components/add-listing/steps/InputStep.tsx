"use client";

import { cn } from '@/lib/utils';

interface InputStepProps {
  title: string;
  value: string;
  onChangeText: (value: string) => void;
  onNext: () => void;
  placeholder?: string;
  subtitle?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  suffix?: string;
  required?: boolean;
}

const INPUT_MODE: Record<NonNullable<InputStepProps['keyboardType']>, React.HTMLAttributes<HTMLInputElement>['inputMode']> = {
  default: 'text',
  // numeric: на Android RN-клавиатура содержит точку (объём двигателя «2.0»)
  numeric: 'decimal',
  'phone-pad': 'tel',
};

export function InputStep({
  title,
  value,
  onChangeText,
  onNext,
  placeholder = '',
  subtitle,
  keyboardType = 'default',
  suffix,
  required = true,
}: InputStepProps) {
  const isValid = !required || value.trim() !== '';

  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-full max-w-[720px] flex-col px-4 pb-10">
        <h2 className="mb-2 mt-4 text-[28px] font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="mb-4 text-[14px] font-normal leading-[20px] text-muted-foreground">{subtitle}</p>
        )}

        <div className="mb-8 flex flex-row items-baseline border-b border-border pb-3">
          <input
            className="min-w-0 flex-1 bg-transparent p-0 text-[24px] font-normal text-foreground outline-none placeholder:text-muted-foreground"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChangeText(e.target.value)}
            inputMode={INPUT_MODE[keyboardType]}
            type={keyboardType === 'phone-pad' ? 'tel' : 'text'}
            autoFocus
          />
          {suffix && (
            <span className="ml-2 text-[18px] font-normal text-muted-foreground">{suffix}</span>
          )}
        </div>

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
