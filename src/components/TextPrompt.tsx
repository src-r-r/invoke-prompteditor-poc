import { TextareaAutosize } from "@material-ui/core";
import { $textComposition } from "../lib/prompt";
import "./TextPrompt.css";
import { useStore } from "@nanostores/react";

export function TextPrompt() {
    const text = useStore($textComposition);
    return (
        <>
            <TextareaAutosize
                className="text-prompt"
                defaultValue={text}
            />
        </>
    )
}