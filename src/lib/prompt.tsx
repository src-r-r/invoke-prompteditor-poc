import { randomUUID } from "crypto";
import { Op } from "./operator";
import { atom, computed } from "nanostores";

type Id = string;

type IdAble = {
    id: Id,
}

export enum Category {
    subject = "subject",
    style = "style",
    vibes = "vibes",
    medium = "medium",
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