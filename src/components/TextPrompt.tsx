import { Container, TextareaAutosize } from "@material-ui/core";
import { $textComposition } from "../lib/prompt";
import "./TextPrompt.css";
import { useStore } from "@nanostores/react";

export function TextPrompt() {
    const text = useStore($textComposition);
    return (
        <Container aria-label="text-area">
            <TextareaAutosize
                className="text-prompt"
                defaultValue={text}
            />
        </Container>
    )
}