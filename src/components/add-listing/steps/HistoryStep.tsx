"use client";

import { cn } from '@/lib/utils';
import { useDicts } from '@/lib/add-listing/dicts';

// Owners is a small fixed enum with no API equivalent.
const OWNERS_OPTIONS = ['1', '2', '3', '4+'];

interface HistoryStepProps {
  mileage: string;
  pts: string;
  owners: string;
  isDamaged: boolean;
  onChangeMileage: (value: string) => void;
  onChangePts: (value: string) => void;
  onChangeOwners: (value: string) => void;
  onToggleDamaged: () => void;
  onNext: () => void;
}

export function HistoryStep({
  mileage,
  pts,
  owners,
  isDamaged,
  onChangeMileage,
  onChangePts,
  onChangeOwners,
  onToggleDamaged,
  onNext,
}: HistoryStepProps) {
  const { dicts } = useDicts();
  const ptsOptions = dicts?.pts_options ?? [];

  const formatMileage = (value: string) => {
    if (!value) return '';
    const reversed = value.split('').reverse().join('');
    const withSpaces = reversed.match(/.{1,3}/g)?.join(' ') || '';
    return withSpaces.split('').reverse().join('');
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-full max-w-[720px] flex-col px-4 pb-10">
        <h2 className="mb-6 mt-4 text-[28px] font-bold text-foreground">
          История автомобиля
        </h2>

        {/* Mileage */}
        <div className="mb-6 flex flex-row items-baseline border-b border-border pb-3">
          <input
            className="min-w-0 flex-1 bg-transparent p-0 text-[24px] font-normal text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Пробег"
            value={formatMileage(mileage)}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '');
              onChangeMileage(digits);
            }}
            inputMode="numeric"
          />
          {mileage !== '' && (
            <span className="ml-2 text-[18px] font-normal text-muted-foreground">км</span>
          )}
        </div>

        {/* PTS */}
        <span className="mb-[10px] text-[14px] font-normal text-muted-foreground">ПТС</span>
        <div className="mb-6 flex flex-row flex-wrap gap-2">
          {ptsOptions.map(option => (
            <button
              type="button"
              key={option.id}
              onClick={() => onChangePts(option.id)}
              className={cn(
                'rounded-[20px] border px-4 py-[10px]',
                pts === option.id ? 'border-foreground bg-foreground' : 'border-border bg-transparent',
              )}
            >
              <span
                className={cn(
                  'text-[14px] font-medium',
                  pts === option.id ? 'text-background' : 'text-foreground',
                )}
              >
                {option.name}
              </span>
            </button>
          ))}
        </div>

        {/* Owners */}
        <span className="mb-[10px] text-[14px] font-normal text-muted-foreground">
          Владельцев в ПТС
        </span>
        <div className="mb-6 flex flex-row flex-wrap gap-2">
          {OWNERS_OPTIONS.map(option => (
            <button
              type="button"
              key={option}
              onClick={() => onChangeOwners(option)}
              className={cn(
                'flex size-[44px] items-center justify-center rounded-[10px] border',
                owners === option ? 'border-foreground bg-foreground' : 'border-border bg-transparent',
              )}
            >
              <span
                className={cn(
                  'text-[16px] font-medium',
                  owners === option ? 'text-background' : 'text-foreground',
                )}
              >
                {option}
              </span>
            </button>
          ))}
        </div>

        {/* Damaged toggle */}
        <div className="mb-8 flex flex-row items-center justify-between">
          <span className="text-[16px] font-normal text-foreground">
            Битый или не на ходу
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isDamaged}
            onClick={onToggleDamaged}
            className={cn(
              'flex h-[24px] w-[44px] shrink-0 items-center rounded-[12px]',
              isDamaged ? 'bg-primary' : 'bg-border',
            )}
          >
            <div
              className={cn(
                'size-[20px] rounded-[10px] bg-[#FFFFFF]',
                isDamaged ? 'translate-x-[20px]' : 'translate-x-[2px]',
              )}
            />
          </button>
        </div>

        {/* Continue */}
        <button
          type="button"
          onClick={onNext}
          className="flex h-[52px] items-center justify-center rounded-[12px] bg-foreground"
        >
          <span className="text-[16px] font-semibold text-background">
            Продолжить
          </span>
        </button>
      </div>
    </div>
  );
}
