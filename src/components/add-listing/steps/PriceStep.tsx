"use client";

import { cn } from '@/lib/utils';
import { CustomCheckbox } from '@/components/add-listing/form/CustomCheckbox';

interface PriceStepProps {
  price: string;
  canExchange: boolean;
  canNegotiate: boolean;
  onChangePrice: (value: string) => void;
  onToggleExchange: () => void;
  onToggleNegotiate: () => void;
  onNext: () => void;
}

export function PriceStep({
  price,
  canExchange,
  canNegotiate,
  onChangePrice,
  onToggleExchange,
  onToggleNegotiate,
  onNext,
}: PriceStepProps) {
  const formatPrice = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const reversed = digits.split('').reverse().join('');
    const withSpaces = reversed.match(/.{1,3}/g)?.join(' ') || '';
    return withSpaces.split('').reverse().join('');
  };

  const isValid = price.trim() !== '';

  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-full max-w-[720px] flex-col px-4 pb-10">
        <h2 className="mb-6 mt-4 text-[28px] font-bold text-foreground">Цена</h2>

        <div className="mb-6 flex flex-row items-baseline border-b border-border pb-3">
          <input
            className="min-w-0 flex-1 bg-transparent p-0 text-[28px] font-semibold text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="0"
            value={formatPrice(price)}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '');
              onChangePrice(digits);
            }}
            inputMode="numeric"
          />
          <span className="ml-2 text-[18px] font-normal text-muted-foreground">сомони</span>
        </div>

        <div className="mb-8 flex flex-col gap-4">
          <CustomCheckbox
            label="Возможен обмен"
            checked={canExchange}
            onChange={onToggleExchange}
          />
          <CustomCheckbox
            label="Возможен торг"
            checked={canNegotiate}
            onChange={onToggleNegotiate}
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
