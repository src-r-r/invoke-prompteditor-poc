import { v4 as randomUUID, v4 as uuidv4 } from "uuid";
import { Op } from "./operator";
import { atom, computed } from "nanostores";

type Id = string;

type IdAble = {
    id: Id,
}

// only vibes and styles will have a name.
export enum Category {
    subject = "subject",
    style = "style",
    vibes = "vibes",
    medium = "medium",
}

export function categoryHasName(cat : Category) {
    return (cat === Category.style || cat === Category.vibes)
}

const N_CATEGORIES = Object.keys(Category).length;

export function catI(c: Category | string): number {
    return Object.keys(Category).indexOf(c);
}

export type LibraryItem = {
    id: Id,
    name?: string,
    prompt: string,
    category: Category,
}

export type Library = Array<LibraryItem>;

export type Nugget = IdAble & {
    item: LibraryItem,
    score: number,
}

export type Operation = IdAble & {
    op: Op,
    items: Array<Nugget>
}

export type PromptItem = Operation | Nugget

export function itemIsOperation(item: PromptItem): boolean {
    return "op" in item;
}

export function itemIsNugget(item: PromptItem): boolean {
    return !itemIsOperation(item);
}

export type Composition = Array<PromptItem>;

export const $library = atom<Library>([])

export function addItemToLibrary(item: LibraryItem) {
    $library.set([
        ...$library.get(), item,
    ]);
}

export function removeItemFromLibrary(item: LibraryItem) {
    $library.set($library.get().filter(i => (i.id !== item.id)));
}

export const $composition = atom<Composition>([])

export function insertIntoComposition(item: LibraryItem) {
    $composition.set([
        ...$composition.get(),
        { id: randomUUID(), item, score: 0 } as Nugget,
    ]);
}

export function removeFromComposition(item: PromptItem) {
    $composition.set([
        ...$composition.get().filter(i => (i.id !== item.id))
    ]);
}

function nuggetDelta(nuggetId : Id, delta : number) {
    $composition.set($composition.get().map(item => {
        if ((item.id === nuggetId) && ("score" in item)) {
            const o = {...item, score: item.score + delta};
            return o;
        }
        return item;
    }
    ));
}

export function increaseNuggetScore(nuggetId: Id, amount: number = 1) {
    return nuggetDelta(nuggetId, amount)
}
export function decreaseNuggetScore(nuggetId: Id, amount: number = -1) {
    return nuggetDelta(nuggetId, amount);
}

export function changeOperationOp(operationId: Id, op: Op) {
    $composition.set([
        ...$composition.get().map(item => {
            return (item.id == operationId) ? { ...item, op: op } : item;
        }
        ),
    ]);
}

/**
 * utility method to remove & return a prompt item by ID
 * @param id PromptItem ID
 */
export function popPromptItem (id : Id) {
    const found = $composition.get().find(item => item.id === id);
    $composition.set($composition.get().filter(item => item.id !== id));
    return found;
}


export function lassoNuggets (n1id : Id, n2id : Id, op : Op) {
    const n1 = popPromptItem(n1id);
    const n2 = popPromptItem(n2id);
    $composition.set([...$composition.get(), {
        id: uuidv4(),
        op,
        items: [n1, n2],
    } as Operation])
}

export function addToOperation(nId : Id, opId : Id) {
    const comp = $composition.get();
    const nugget = comp.find(i => i.id === nId);
    $composition.set($composition.get().map(i => {
        if (![nId, opId].includes(i.id)) {
            return i;
        }
        // if this is the nugget...
        if (i.id === nId) {
            return null;
        }
        // if this is the operation...
        if (i.id == opId && "op" in i) {
            return {
                ...i,
                items: [
                    ...i.items, nugget
                ]
            }
        }
        return i;
    }).filter(i => i != null) as Composition);
}

export function nuggetToText(nugget: Nugget) {
    const absScore = Math.abs(nugget.score);
    const neg = nugget.score < 0;
    const pos = nugget.score > 0;
    const sign = pos ? "+" : (neg ? "-" : "");
    const prompt = nugget.item.prompt;

    const signs = new Array(absScore).fill(sign).join("")

    if (prompt.includes(" ")) {
        return "(" + nugget.item.prompt + ")" + signs;
    }
    return nugget.item.prompt + signs;

}

export function operationToText(operation: Operation): string {
    return "(" + operation.items.map(nuggetToText).join(", ") + ")." + operation.op + "()";
}

export const $textComposition = computed($composition, (composition) => {
    const JOINER = ", ";
    return composition.map(item => {
        return "op" in item ? operationToText(item) : nuggetToText(item);
    }).join(JOINER);
});

export type SlottedComposition = PromptItem[][];

/**
 * This is necessary since a "composition" needs to have prompt items in
 * different columns.
 * 
 * There are n columns (or slots) where n is the number of categories.
 */
export const $slottedComposition = computed($composition, (composition) => {
    const slotted = new Array(N_CATEGORIES) as SlottedComposition;
    composition.forEach(nugget => {
        if ("op" in nugget) {
            if (!nugget.items.length)
                return null;
            const cat = nugget.items[0].item.category;
            if (!slotted[catI(cat)]) {
                slotted[catI(cat)] = [];
            }
            slotted[catI(cat)].push(nugget);
        } else {
            const cat = nugget.item.category;
            if (!slotted[catI(cat)]) {
                slotted[catI(cat)] = [];
            }
            slotted[catI(cat)].push(nugget);
        }
    })
    return slotted;
});