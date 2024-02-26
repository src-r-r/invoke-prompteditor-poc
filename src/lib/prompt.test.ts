import { randomUUID } from "crypto";
import { Op } from "./operator";
import {
    Library as LibraryType,
    Composition as CompositionType,
    $library,
    addItemToLibrary,
    removeItemFromLibrary,
    $composition,
    insertIntoComposition,
    Category,
    removeFromComposition,
    increaseNuggetScore,
    decreaseNuggetScore,
    changeOperationOp,
    nuggetToText,
    operationToText,
    $textComposition,
    $slottedComposition,
    Operation,
    Nugget,
} from "./prompt";

const mockLibrary: LibraryType = [
    { id: randomUUID(), name: "Name1", prompt: "Prompt1", category: Category.subject },
    { id: randomUUID(), name: "Name2", prompt: "Prompt2", category: Category.style },
    { id: randomUUID(), name: "Name3", prompt: "Prompt3", category: Category.vibes },
    { id: randomUUID(), name: "Name4", prompt: "Prompt4", category: Category.medium },
];

const mockComposition: CompositionType = [
    { id: randomUUID(), item: mockLibrary[0], score: 0 },
    { id: randomUUID(), item: mockLibrary[1], score: 0 },
    { id: randomUUID(), item: mockLibrary[2], score: 0 },
    { id: randomUUID(), item: mockLibrary[3], score: 0 },
    {
        id: randomUUID(), op: Op.AND, items: [
            { id: randomUUID(), item: mockLibrary[0], score: 0 },
            { id: randomUUID(), item: mockLibrary[1], score: 0 },
        ]
    },
];

beforeEach(() => {
  // clear out the library and composition
  $library.set([]);
  $composition.set([]);
  // insert the items
  mockLibrary.forEach(item => {
        addItemToLibrary(item);
        insertIntoComposition(item);
    });
});

test("addItemToLibrary", () => {
    addItemToLibrary({ id: randomUUID(), name: "Name5", prompt: "Prompt5", category: Category.subject });
    expect($library.get().length).toBe(5);
});

test("removeItemFromLibrary", () => {
    removeItemFromLibrary(mockLibrary[0]);
    expect($library.get().length).toBe(3);
});

test("insertIntoComposition", () => {
    insertIntoComposition(mockLibrary[3]);
    expect($composition.get().length).toBe(5);
});

test("removeFromComposition", () => {
    removeFromComposition(mockComposition[0]);
    expect($composition.get().length).toBe(4);
});

test("increaseNuggetScore", () => {
    const comp = $composition.get();
    increaseNuggetScore(comp[0].id, 2);
    const comp2 = $composition.get();
    expect((comp2[0] as Nugget).score).toBe(2);
});

test("decreaseNuggetScore", () => {
    const comp = $composition.get();
    decreaseNuggetScore(comp[1].id, -2);
    const comp2 = $composition.get();
    expect((comp2[1] as Nugget).score).toBe(-2);
});

test("changeOperationOp", () => {
    changeOperationOp(mockComposition[4].id, Op.AND);
    expect((mockComposition[4] as Operation).op).toBe(Op.AND);
});

test("nuggetToText", () => {
    expect(nuggetToText({ id: randomUUID(), item: mockLibrary[0], score: 0 })).toBe("Prompt1");
});

test("operationToText", () => {
    expect(operationToText({
        id: randomUUID(), op: Op.AND, items: [
            { id: randomUUID(), item: mockLibrary[0], score: 0 },
            { id: randomUUID(), item: mockLibrary[1], score: 2 },
        ]
    })).toBe("(Prompt1, Prompt2++).and()");
});

test("textComposition", () => {
    $composition.set(mockComposition);
    expect($textComposition.get()).toBe("Prompt1, Prompt2, Prompt3, Prompt4, (Prompt1, Prompt2).and()");
});

test("$slottedComposition", () => {
    $composition.set(mockComposition);
    const comp = $composition.get();
    const slotted = $slottedComposition.get();
    expect(slotted).toEqual([
        [comp[0], comp[4]],
        [comp[1]],
        [comp[2]],
        [comp[3]],
    ]);
});
