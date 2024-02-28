import { v4 as randomUUID } from "uuid";
import { Op } from "./operator";
import { createSlice } from '@reduxjs/toolkit'

export interface IAstNode {
    id: string;
    toPrompt(): string;
}

export interface IToPrompt {
}

export class Nugget implements IAstNode, IToPrompt {
    public score: number = 0;
    public id: string;
    public constructor(public text: string) {
        this.id = randomUUID();
    }

    get sign() {
        return this.score > 0 ? "+" : (this.score < 0 ? "-" : "");
    }

    get repeatSign() {
        return Array(this.score).map(() => this.sign).join("")
    }

    public toPrompt() {
        return `(${this.text})${this.repeatSign}`
    }
}

export class Operation extends Array<Nugget> implements IAstNode, IToPrompt {
    public id: string;
    public constructor(public op: Op, ...items: Nugget[]) {
        super(...items);
        this.id = randomUUID();
    }

    get nuggetStr() {
        return this.map(i => i.toPrompt()).join(", ")
    }

    toPrompt(): string {
        return `(${this.nuggetStr}).${this.op}()`;
    }
}

export class Ast extends Array<IAstNode> implements IToPrompt {
    public toPrompt(): string {
        return this.map(i => i.toPrompt()).join(",");
    }
    public changeOp(id : string, op : Op) : Ast {
        return this.map(n => {
            if (n.id != id) return n;
            if (n instanceof Operation) {
                n.op = op;
            }
            return n;
        }) as Ast;
    }
    public removeNode(id : string) : Ast{
        return this.filter(n => n.id != id) as Ast;
    }
}

export const astSlice = createSlice({
    name: "ast",
    initialState: new Ast(),
    reducers: {
        addNugget (state, action) {
            state.push(
                new Nugget(action.payload)
            );
        },
        // addOperation (state, action) {
        //     state.push(
        //         new Operation(...action.payload)
        //     )
        // }
    }
});

export const { addNugget } = astSlice.actions

export default astSlice.reducer;