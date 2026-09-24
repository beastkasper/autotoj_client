"use client";

import { Camera, X } from 'lucide-react';

interface PhotosStepProps {
  photos: string[];
  onAddPhoto: () => void;
  onRemovePhoto: (index: number) => void;
  onNext: () => void;
}

// Mobile: PHOTO_WIDTH = (SCREEN_WIDTH - 32 - PHOTO_GAP) / 2, height = PHOTO_WIDTH * 0.75
// → на вебе: две колонки по (100% - 8px) / 2 с соотношением 4:3.

export function PhotosStep({ photos, onAddPhoto, onRemovePhoto, onNext }: PhotosStepProps) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-full max-w-[720px] flex-col px-4 pb-[100px]">
          <h2 className="mb-2 mt-4 text-[28px] font-bold text-foreground">Фото</h2>
          <p className="mb-5 text-[14px] font-normal leading-[20px] text-muted-foreground">
            Удостоверьтесь, что госномер хорошо виден на фото. Это поможет нам быстрее проверить объявление, а покупателям мы его не покажем.
          </p>

          {/* Photo placeholders */}
          <div className="mb-4 flex flex-row flex-wrap gap-2">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="flex aspect-[4/3] w-[calc((100%-8px)/2)] items-center justify-center overflow-hidden rounded-[12px] bg-secondary"
              >
                {photos[i] ? (
                  <div className="relative size-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photos[i]} alt="" className="size-full rounded-[12px] object-cover" />
                    <button
                      type="button"
                      onClick={() => onRemovePhoto(i)}
                      className="absolute right-[6px] top-[6px] flex size-[24px] items-center justify-center rounded-[12px] bg-destructive"
                    >
                      <X color="#FFFFFF" size={14} />
                    </button>
                  </div>
                ) : (
                  <Camera className="size-8 text-muted-foreground" strokeWidth={1} />
                )}
              </div>
            ))}
          </div>

          {/* Additional photos */}
          {photos.length > 4 && (
            <div className="mb-4 flex flex-row flex-wrap gap-2">
              {photos.slice(4).map((uri, i) => (
                <div key={i + 4} className="relative h-[60px] w-[80px] overflow-hidden rounded-[8px] bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uri} alt="" className="size-full rounded-[12px] object-cover" />
                  <button
                    type="button"
                    onClick={() => onRemovePhoto(i + 4)}
                    className="absolute right-[6px] top-[6px] flex size-[24px] items-center justify-center rounded-[12px] bg-destructive"
                  >
                    <X color="#FFFFFF" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hint */}
          {photos.length < 8 && (
            <div className="mb-4 rounded-[10px] bg-secondary px-[14px] py-[10px]">
              <span className="text-[14px] font-normal text-muted-foreground">
                Загрузите хотя бы 8 фото
              </span>
            </div>
          )}

          {/* Add photo button */}
          <button
            type="button"
            onClick={onAddPhoto}
            className="flex h-[52px] items-center justify-center rounded-[12px] border-[1.5px] border-foreground"
          >
            <span className="text-[16px] font-semibold text-foreground">
              Добавить фото
            </span>
          </button>
        </div>
      </div>

      {/* Continue button fixed at bottom */}
      <div className="absolute inset-x-0 bottom-0 border-t-[0.5px] border-border bg-background px-4 pb-8 pt-3">
        <div className="mx-auto w-full max-w-[720px]">
          <button
            type="button"
            onClick={onNext}
            className="flex h-[52px] w-full items-center justify-center rounded-[12px] bg-foreground"
          >
            <span className="text-[16px] font-semibold text-background">
              Продолжить
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
