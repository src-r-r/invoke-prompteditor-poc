import { Atom, atom, computed } from "nanostores"
import { $composition, Category, Nugget, Operation, PromptItem, addToOperation, itemIsNugget, itemIsOperation, lassoNuggets } from "../lib/prompt";
import { Op } from "../lib/operator";

export type DropCandidate = string | string []

export type DragDropState = {
    currentSourceId?: string | null,
    currentDropCandidateId?: string | null,
}

export const $dragDropState = atom<DragDropState>({});

$dragDropState.subscribe((value) => {
    console.log("drag-n-drop: %x", value);
})

export const $sourceItem = computed($dragDropState, (dnd) => {
    const comp = $composition.get()
    return comp.find(i => i.id === dnd.currentSourceId);
});

export const $dropCandidate = computed($dragDropState, (dnd) => {
    const comp = $composition.get()
    return comp.find(i => i.id === dnd.currentDropCandidateId);
});

export function startDrag(item: PromptItem) {
    $dragDropState.set({ ...$dragDropState.get(), currentSourceId: item.id });
}

export function startHoverOver(item: PromptItem) {
    $dragDropState.set({ ...$dragDropState.get(), currentDropCandidateId: item.id });
}

export function endHoverOver() {
    $dragDropState.set({ ...$dragDropState.get(), currentDropCandidateId: null })
}

export const $isDragInProgress = computed($dragDropState, (dragDropState) => true);

export function isPromptItemDragSource($dds: Atom<DragDropState>, promptItem: PromptItem) {
    return $dds.get().currentSourceId === promptItem.id;
}

export function isPromptItemDropTarget($dds: Atom<DragDropState>, promptItem: PromptItem) {
    return $dds.get().currentSourceId && $dds.get().currentSourceId !== promptItem.id;
}

export function isPromptItemDropCandidate($dds: Atom<DragDropState>, promptItem: PromptItem) {
    return $dds.get().currentDropCandidateId === promptItem.id;
}

export function cancelDrop() {
    $dragDropState.set({});
};

export class CategoryMismatchError extends Error {
    constructor(public c1 : Category, public c2 : Category) {
        super(`Cannot merge '${c1}' into '${c2}'`);
    }
}

export function completeDrop() {
    const source = $sourceItem.get();
    const target = $dropCandidate.get();
    if (!(source && target)) return;
    if (itemIsOperation(target)) {
        const nSource = source as Nugget;
        const nTarget = target as Operation;
        const c1 = nSource.item.category;
        const c2 = nTarget.items[0].item.category;
        if (c1 != c2) {
            throw new CategoryMismatchError(c1, c2);
        } else {
            addToOperation(source.id, target.id);
        }
    }
    else if (itemIsNugget(target) && itemIsNugget(source)) {
        const nTarget = target as Nugget;
        const nSource = source as Nugget;
        const c1 = nSource.item.category;
        const c2 = nTarget.item.category;
        if (c1 != c2) {
            throw new CategoryMismatchError(c1, c2);
        } else {
            lassoNuggets(source.id, target.id, Op.AND)
        }
    }
    $dragDropState.set({});
}
