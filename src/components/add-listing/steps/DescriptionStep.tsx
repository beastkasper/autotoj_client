"use client";

interface DescriptionStepProps {
  description: string;
  onChangeDescription: (value: string) => void;
  onNext: () => void;
}

export function DescriptionStep({
  description,
  onChangeDescription,
  onNext,
}: DescriptionStepProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-full max-w-[720px] flex-col px-4 pb-10">
        <h2 className="mb-2 mt-4 text-[28px] font-bold text-foreground">Описание</h2>
        <p className="mb-5 text-[14px] font-normal leading-[20px] text-muted-foreground">
          Убедитесь, что описание соответствует правилам. Не указывайте ссылки, цену, контакты и не предлагайте услуги — объявление не пройдёт модерацию
        </p>

        <textarea
          className="mb-6 min-h-[140px] resize-none rounded-[12px] bg-secondary p-[14px] align-top text-[16px] font-normal text-foreground outline-none [field-sizing:content] placeholder:text-muted-foreground"
          placeholder="Честно опишите достоинства и недостатки своего автомобиля"
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
        />

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
