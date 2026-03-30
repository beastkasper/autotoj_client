"use client";

import { useState, useCallback } from "react";
import { PartsFormWrapper } from "@/components/add-listing/PartsFormWrapper";
import { BottomSheetSelect } from "@/components/listing/bottom-sheet-select";
import type { PartsFormData, PartsValidationErrors } from "@/lib/types/parts-listing";
import { INITIAL_PARTS_FORM } from "@/lib/types/parts-listing";
import { WHEEL_VEHICLE_TYPES, WHEEL_CONDITIONS, WHEEL_TYPES, WHEEL_MATERIALS } from "@/lib/data/parts-constants";
import { cn } from "@/lib/utils";

interface WheelsListingFormProps {
  onBack: () => void;
  onClose: () => void;
  onPublish: (data: PartsFormData) => void;
}

export function WheelsListingForm({ onBack, onClose, onPublish }: WheelsListingFormProps) {
  const [formData, setFormData] = useState<PartsFormData>({ ...INITIAL_PARTS_FORM });
  const [errors, setErrors] = useState<PartsValidationErrors>({});

  const updateField = useCallback((key: string, value: string) => {
    setFormData((prev) => ({ ...prev, fields: { ...prev.fields, [key]: value } }));
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, []);
  const updateToggle = useCallback((key: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, toggles: { ...prev.toggles, [key]: value } }));
  }, []);
  const updateForm = useCallback((updates: Partial<PartsFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    Object.keys(updates).forEach((k) => setErrors((prev) => { const n = { ...prev }; delete n[k]; return n; }));
  }, []);
  const handleReset = useCallback(() => { setFormData({ ...INITIAL_PARTS_FORM }); setErrors({}); }, []);

  const handlePublish = useCallback(() => {
    const e: PartsValidationErrors = {};
    if (!formData.fields.condition) e.condition = "Обязательное поле";
    if (!formData.fields.diameter) e.diameter = "Обязательное поле";
    if (!formData.fields.width) e.width = "Обязательное поле";
    if (!formData.fields.pcd) e.pcd = "Обязательное поле";
    if (!formData.price.trim()) e.price = "Укажите цену";
    if (formData.phone && formData.phone.length !== 9) e.phone = "Номер должен содержать 9 цифр";
    setErrors(e);
    if (Object.keys(e).length === 0) onPublish(formData);
  }, [formData, onPublish]);

  const inputCn = (field: string) => cn(
    "w-full h-12 px-4 rounded-[12px] text-[15px] border bg-white outline-none",
    errors[field] ? "border-[#D32F2F] bg-[#FFEBEE]" : "border-[#E5E5EA] focus:border-[#000000]"
  );
  const font = { fontFamily: "Manrope, system-ui, sans-serif" } as const;

  return (
    <PartsFormWrapper
      title="Диски"
      formData={formData} errors={errors}
      onUpdateField={updateField} onUpdateToggle={updateToggle} onUpdateForm={updateForm}
      onBack={onBack} onClose={onClose} onReset={handleReset} onPublish={handlePublish}
    >
      <div className="space-y-4">
        <BottomSheetSelect label="Тип ТС" value={formData.fields.vehicleType || ""} options={[...WHEEL_VEHICLE_TYPES]} onSelect={(v) => updateField("vehicleType", v)} />
        <BottomSheetSelect label="Состояние *" value={formData.fields.condition || ""} options={[...WHEEL_CONDITIONS]} onSelect={(v) => updateField("condition", v)} error={errors.condition} />
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Диаметр (R) *</label>
          <input type="text" inputMode="numeric" value={formData.fields.diameter || ""} onChange={(e) => updateField("diameter", e.target.value.replace(/\D/g, ""))} placeholder="17" className={inputCn("diameter")} style={font} />
          {errors.diameter && <p className="mt-1 text-[12px] text-[#D32F2F]" style={font}>{errors.diameter}</p>}
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Ширина (J) *</label>
          <input type="text" value={formData.fields.width || ""} onChange={(e) => updateField("width", e.target.value)} placeholder="7.5" className={inputCn("width")} style={font} />
          {errors.width && <p className="mt-1 text-[12px] text-[#D32F2F]" style={font}>{errors.width}</p>}
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Разболтовка (PCD) *</label>
          <input type="text" value={formData.fields.pcd || ""} onChange={(e) => updateField("pcd", e.target.value)} placeholder="5×114.3" className={inputCn("pcd")} style={font} />
          {errors.pcd && <p className="mt-1 text-[12px] text-[#D32F2F]" style={font}>{errors.pcd}</p>}
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Вылет (ET)</label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={formData.fields.offset || ""} onChange={(e) => updateField("offset", e.target.value.replace(/[^\d-]/g, ""))} placeholder="45" className={inputCn("offset")} style={font} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8E8E93]" style={font}>мм</span>
          </div>
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>ЦО (DIA)</label>
          <div className="relative">
            <input type="text" value={formData.fields.dia || ""} onChange={(e) => updateField("dia", e.target.value.replace(/[^\d.]/g, ""))} placeholder="67.1" className={inputCn("dia")} style={font} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8E8E93]" style={font}>мм</span>
          </div>
        </div>
        <BottomSheetSelect label="Тип диска" value={formData.fields.wheelType || ""} options={[...WHEEL_TYPES]} onSelect={(v) => updateField("wheelType", v)} />
        <BottomSheetSelect label="Материал" value={formData.fields.material || ""} options={[...WHEEL_MATERIALS]} onSelect={(v) => updateField("material", v)} />
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Бренд</label>
          <input type="text" value={formData.fields.brand || ""} onChange={(e) => updateField("brand", e.target.value)} placeholder="BBS" className={inputCn("brand")} style={font} />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Модель</label>
          <input type="text" value={formData.fields.model || ""} onChange={(e) => updateField("model", e.target.value)} placeholder="SR" className={inputCn("model")} style={font} />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-[#000000] mb-2" style={font}>Количество</label>
          <input type="text" inputMode="numeric" value={formData.fields.quantity || ""} onChange={(e) => updateField("quantity", e.target.value.replace(/\D/g, ""))} placeholder="4" className={inputCn("quantity")} style={font} />
        </div>
      </div>
    </PartsFormWrapper>
  );
}
