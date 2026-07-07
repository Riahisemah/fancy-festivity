import { type ReactNode } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus } from "lucide-react";

type Props<T> = {
  items: T[];
  onChange: (items: T[]) => void;
  getId: (item: T, index: number) => string;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => ReactNode;
  onAdd: () => void;
  addLabel: string;
  showAddButton?: boolean;
};

export function SortableListEditor<T>({ items, onChange, getId, renderItem, onAdd, addLabel, showAddButton = true }: Props<T>) {
  const ids = items.map((item, i) => getId(item, i));
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(items, oldIndex, newIndex));
  }

  const updateAt = (index: number, patch: Partial<T>) => {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {items.map((item, i) => (
            <SortableRow key={ids[i]} id={ids[i]}>
              {renderItem(item, i, (patch) => updateAt(i, patch))}
            </SortableRow>
          ))}
        </SortableContext>
      </DndContext>
      {showAddButton && (
      <button type="button" onClick={onAdd}
        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] hover:bg-muted transition">
        <Plus className="size-3" /> {addLabel}
      </button>
      )}
    </div>
  );
}

function SortableRow({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined };

  return (
    <div ref={setNodeRef} style={style} className={`flex gap-1.5 items-start ${isDragging ? "opacity-80" : ""}`}>
      <button type="button" {...attributes} {...listeners}
        className="mt-2 shrink-0 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-0.5">
        <GripVertical className="size-3.5" />
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
