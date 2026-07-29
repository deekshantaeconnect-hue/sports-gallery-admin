import { useFormContext, useFieldArray } from "react-hook-form";
import { Layers, Trash2, GripVertical } from "lucide-react";
import { ProductFormValues } from "../../schemas/product.schema";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Variant Item Component
function SortableVariantItem({
  field,
  index,
  variantFieldsLength,
  removeVariant,
  register,
}: {
  field: any;
  index: number;
  variantFieldsLength: number;
  removeVariant: (index: number) => void;
  register: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-3 relative shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-600 transition-colors"
      >
        <GripVertical size={18} />
        
      </div>

      {/* Remove Button */}
      {variantFieldsLength > 1 && (
        <button
          type="button"
          onClick={() => removeVariant(index)}
          className="absolute top-3 right-3 text-zinc-300 hover:text-rose-500 bg-zinc-50 rounded-full p-1 transition-colors hover:bg-rose-50"
        >
          <Trash2 size={16} />
        </button>
      )}

      <div className="grid grid-cols-2 gap-3 pl-6 pr-6">
        <div className="col-span-2">
          <label className="text-[9px] font-bold text-zinc-400 uppercase ml-1">
            Variant Name #{index + 1}
          </label>
          <input
            {...register(`variants.${index}.name`)}
            placeholder="e.g. 500ml Pack"
            className="w-full p-2 outline-none text-xs font-bold border-b border-zinc-100 focus:border-[#006044] transition-colors"
          />
        </div>
        <div>
          <label className="text-[9px] font-bold text-zinc-400 uppercase ml-1">
            SKU
          </label>
          <input
            {...register(`variants.${index}.sku`)}
            placeholder="SKU"
            className="w-full p-2 outline-none text-xs border-b border-zinc-100 focus:border-[#006044] transition-colors"
          />
        </div>
        <div>
          <label className="text-[9px] font-bold text-zinc-400 uppercase ml-1">
            Stock
          </label>
          <input
            {...register(`variants.${index}.stock`)}
            type="number"
            placeholder="Qty"
            className="w-full p-2 outline-none text-xs border-b border-zinc-100 focus:border-[#006044] transition-colors"
          />
        </div>
        <div>
          <label className="text-[9px] font-bold text-zinc-400 uppercase ml-1">
            Option Type
          </label>
          <input
            {...register(`variants.${index}.optionType`)}
            placeholder="e.g. Size"
            className="w-full p-2 outline-none text-xs border-b border-zinc-100 focus:border-[#006044] transition-colors"
          />
        </div>
        <div>
          <label className="text-[9px] font-bold text-zinc-400 uppercase ml-1">
            Value
          </label>
          <input
            {...register(`variants.${index}.optionValue`)}
            placeholder="e.g. 500ml"
            className="w-full p-2 outline-none text-xs border-b border-zinc-100 focus:border-[#006044] transition-colors"
          />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold text-zinc-400 uppercase ml-1">
              Variant Price (₹)
            </label>
            <input
              {...register(`variants.${index}.price`)}
              type="number"
              step="0.01"
              placeholder="Absolute Price"
              className="w-full p-2 outline-none text-xs border-b border-zinc-100 font-bold text-[#006044] focus:border-[#006044] transition-colors"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-zinc-400 uppercase ml-1">
              Variant MRP (₹)
            </label>
            <input
              {...register(`variants.${index}.oldPrice`)}
              type="number"
              step="0.01"
              placeholder="Old Price"
              className="w-full p-2 outline-none text-xs border-b border-zinc-100 text-zinc-400 font-bold focus:border-[#006044] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 p-3 rounded-xl grid grid-cols-4 gap-2 border border-zinc-100">
        <div className="text-center">
          <label className="text-[8px] font-black text-zinc-400 uppercase">WT(kg)</label>
          <input
            {...register(`variants.${index}.shippingWeightKg`)}
            type="number"
            step="0.001"
            placeholder="0"
            className="w-full bg-white border border-zinc-200 rounded p-1.5 mt-1 text-center text-xs font-bold outline-none focus:border-[#006044]"
          />
        </div>
        <div className="text-center">
          <label className="text-[8px] font-black text-zinc-400 uppercase">L(cm)</label>
          <input
            {...register(`variants.${index}.lengthCm`)}
            type="number"
            placeholder="0"
            className="w-full bg-white border border-zinc-200 rounded p-1.5 mt-1 text-center text-xs font-bold outline-none focus:border-[#006044]"
          />
        </div>
        <div className="text-center">
          <label className="text-[8px] font-black text-zinc-400 uppercase">W(cm)</label>
          <input
            {...register(`variants.${index}.widthCm`)}
            type="number"
            placeholder="0"
            className="w-full bg-white border border-zinc-200 rounded p-1.5 mt-1 text-center text-xs font-bold outline-none focus:border-[#006044]"
          />
        </div>
        <div className="text-center">
          <label className="text-[8px] font-black text-zinc-400 uppercase">H(cm)</label>
          <input
            {...register(`variants.${index}.heightCm`)}
            type="number"
            placeholder="0"
            className="w-full bg-white border border-zinc-200 rounded p-1.5 mt-1 text-center text-xs font-bold outline-none focus:border-[#006044]"
          />
        </div>
      </div>
    </div>
  );
}

export function ProductVariants() {
  const { register, control } = useFormContext<ProductFormValues>();
  const { fields: variantFields, append: appendVariant, remove: removeVariant, move } = useFieldArray({
    control,
    name: "variants",
  });

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = variantFields.findIndex((field) => field.id === active.id);
      const newIndex = variantFields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Reorder the array
        move(oldIndex, newIndex);
      }
    }
  };

  const defaultVariant = {
    name: "",
    sku: "",
    optionType: "Size",
    optionValue: "",
    price: 0,
    oldPrice: null,
    stock: 10,
    shippingWeightKg: 0,
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
  };

  return (
    <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Layers size={18} className="text-[#006044]" /> Variants
          {variantFields.length > 0 && (
            <span className="ml-2 text-[10px] bg-white px-2 py-0.5 rounded-full text-zinc-500">
              {variantFields.length}
            </span>
          )}
        </label>
        <div className="flex items-center gap-2">
          {variantFields.length > 1 && (
            <span className="text-[10px] text-zinc-400 italic">
              Drag ↕ to reorder
            </span>
          )}
          <button
            type="button"
            onClick={() => appendVariant(defaultVariant)}
            className="text-[10px] font-black bg-white border px-3 py-1.5 rounded-full hover:bg-zinc-100 transition-all"
          >
            + ADD VARIANT
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={variantFields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            {variantFields.map((field, index) => (
              <SortableVariantItem
                key={field.id}
                field={field}
                index={index}
                variantFieldsLength={variantFields.length}
                removeVariant={removeVariant}
                register={register}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Visual indicator for empty state */}
      {variantFields.length === 0 && (
        <div className="text-center py-8 text-zinc-400">
          <p className="text-sm font-medium">No variants yet</p>
          <p className="text-xs">Click "Add Variant" to get started</p>
        </div>
      )}
    </div>
  );
}