import { nSQL } from "@nano-sql/core";
import { Op } from "./operator";
import { RocksDB } from "@nano-sql/adapter-rocksdb";
import tables from "./schema.json";
import { uuid } from "@nano-sql/core/lib/utilities";

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

export type PromptArea = Array<PromptItem>;

export async function getDb() {
    return new Promise((resolve, reject) => {
        // typical setup
        nSQL().createDatabase({
            id: "my_db", // can be anything that's a string
            mode: new RocksDB(),
            tables: [
                {
                    "name": "library_item",
                    "model": {
                        "id:uuid": { "pk": true },
                        "name:string": {},
                        "prompt:string": { notNull: true },
                        "category:string": { notNull: true, }
                    }
                },
                {
                    "name": "nugget",
                    "model": {
                        "id:uuid": { "pk": true },
                        "library_item:uuid": {},
                        "score:number": {}
                    }
                },
                {
                    "name": "operation",
                    "model": {
                        "id:uuid": { pk: true },
                        "op:string": {},
                        "items:array": {}
                    }
                },
                {
                    "name": "library",
                    "model": {
                        "item:uuid": {},
                    }
                },
                {
                    "name": "prompt_area",
                    "model": {
                        "type:string": {notNull: true},
                        "item:obj": {notNull: true},
                    }
                }
            ],
            version: 1, // current schema/database version
            onVersionUpdate: (prevVersion) => { // migrate versions
                return new Promise((res, rej) => {
                    switch (prevVersion) {
                        case 1:
                            // migrate v1 to v2
                            res(2);
                            break;
                        case 2:
                            // migrate v2 to v3
                            res(3);
                            break;
                    }

                });

            }
        }).then((db) => {
            resolve(db)
        }).catch((err) => {
            reject(err);
        })
    });

}