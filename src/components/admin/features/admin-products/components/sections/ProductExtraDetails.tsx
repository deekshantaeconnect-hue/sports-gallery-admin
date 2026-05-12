// src\components\admin\features\admin-products\components\sections\ProductExtraDetails.tsx

import { useFormContext, useFieldArray } from "react-hook-form";
import { ShieldAlert, Plus, Trash2, X } from "lucide-react";
import { ProductFormValues } from "../../schemas/product.schema";

export function ProductExtraDetails() {
  const { register, control } = useFormContext<ProductFormValues>();

  const { fields: attrFields, append: appendAttr, remove: removeAttr } = useFieldArray({ control, name: "attributes" });
  const { fields: careFields, append: appendCare, remove: removeCare } = useFieldArray({ control, name: "careInstructions" });
  const { fields: deliveryFields, append: appendDelivery, remove: removeDelivery } = useFieldArray({ control, name: "deliveryInfo" });

  return (
    <>
      {/* SECTION: COMPLIANCE & EXTRA INFO */}
      <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 space-y-4">
        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert size={18} className="text-[#006044]" /> Extra Details
        </label>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Manufacturer</label>
            <input {...register("extra.manufacturer")} className="w-full p-3 border rounded-xl outline-none text-sm font-bold bg-white focus:ring-2 focus:ring-[#006044]" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Origin</label>
            <input {...register("extra.countryOfOrigin")} className="w-full p-3 border rounded-xl outline-none text-sm font-bold bg-white focus:ring-2 focus:ring-[#006044]" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ingredients List</label>
            <textarea {...register("ingredients")} rows={2} className="w-full p-3 border rounded-xl outline-none text-sm font-medium bg-white focus:ring-2 focus:ring-[#006044]" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Directions to Use</label>
            <textarea {...register("extra.directions")} rows={2} className="w-full p-3 border rounded-xl outline-none text-sm font-medium bg-white focus:ring-2 focus:ring-[#006044]" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Safety Info</label>
            <textarea {...register("extra.safetyInfo")} rows={2} className="w-full p-3 border rounded-xl outline-none text-sm font-medium bg-white focus:ring-2 focus:ring-[#006044]" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Legal Disclaimer</label>
            <textarea {...register("extra.legalDisclaimer")} rows={2} className="w-full p-3 border rounded-xl outline-none text-sm font-medium bg-white focus:ring-2 focus:ring-[#006044]" />
          </div>
        </div>
      </div>

      {/* SECTION: SPECIFICATIONS */}
      <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Tech Specs</label>
          <button type="button" onClick={() => appendAttr({ name: "", value: "" })} className="text-[10px] font-black bg-white border px-3 py-1.5 rounded-full hover:bg-zinc-100 transition-all">+ ADD</button>
        </div>
        <div className="space-y-3">
          {attrFields.map((field, index) => (
            <div key={field.id} className="flex items-center bg-white p-2 rounded-2xl border">
              <input {...register(`attributes.${index}.name`)} placeholder="Key" className="w-1/2 p-2 outline-none text-xs font-black uppercase tracking-tighter" />
              <input {...register(`attributes.${index}.value`)} placeholder="Value" className="w-1/2 p-2 outline-none text-xs font-bold border-l" />
              <button type="button" onClick={() => removeAttr(index)} className="p-2 text-zinc-300 hover:text-rose-500"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* CARE & DELIVERY */}
      <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex justify-between items-center">
            Care Rules <Plus size={14} className="cursor-pointer text-green-600 bg-green-100 rounded-full p-0.5" onClick={() => appendCare({ value: "" })} />
          </label>
          {careFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 bg-white border rounded-xl p-1 pr-2 items-center">
              <input {...register(`careInstructions.${index}.value`)} placeholder="e.g. Keep dry" className="flex-1 p-2 outline-none text-xs font-bold" />
              <button type="button" onClick={() => removeCare(index)} className="text-zinc-300 hover:text-rose-500"><X size={14} /></button>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex justify-between items-center">
            Delivery Rules <Plus size={14} className="cursor-pointer text-blue-600 bg-blue-100 rounded-full p-0.5" onClick={() => appendDelivery({ value: "" })} />
          </label>
          {deliveryFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 bg-white border rounded-xl p-1 pr-2 items-center">
              <input {...register(`deliveryInfo.${index}.value`)} placeholder="e.g. Free shipping" className="flex-1 p-2 outline-none text-xs font-bold" />
              <button type="button" onClick={() => removeDelivery(index)} className="text-zinc-300 hover:text-rose-500"><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}