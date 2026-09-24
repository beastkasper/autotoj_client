"use client";

import { ChevronRight } from 'lucide-react';
import { AddListingHeader } from '@/components/add-listing/AddListingHeader';

interface TransmissionStepProps {
  onBack: () => void;
  onClose: () => void;
  onSelect: (transmission: string) => void;
}

const TRANSMISSIONS = [
  'Механика',
  'Автомат',
  'Вариатор',
  'Робот',
];

export function TransmissionStep({ onBack, onClose, onSelect }: TransmissionStepProps) {
  return (
    <div className="flex h-dvh flex-col bg-[#FFFFFF]">
      {/* Header */}
      <div className="shrink-0 bg-[#FFFFFF]">
        <AddListingHeader
          onBack={onBack}
          onClose={onClose}
          currentStep={10}
        />

        <div className="mx-auto w-full max-w-[720px] px-5 pb-3 pt-4">
          <h2 className="text-[28px] font-semibold text-[#000000]">КПП</h2>
        </div>
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px] pb-6">
          {TRANSMISSIONS.map((transmission, index) => (
            <div key={transmission}>
              <button
                type="button"
                onClick={() => onSelect(transmission)}
                className="flex h-[52px] w-full flex-row items-center justify-between px-5"
              >
                <span className="text-[16px] font-normal text-[#000000]">{transmission}</span>
                <ChevronRight size={20} color="#C7C7CC" strokeWidth={1.5} />
              </button>
              {index < TRANSMISSIONS.length - 1 && (
                <div className="mx-5 h-px bg-[#EDEDED]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
