import {PromptItem as PIType} from "../lib/prompt"

/**
 * NOTE: Drag-n-drop rules!
 * 
 * - Nuggets can be dragged and dropped into...
 *   - another nugget
 *     - when this happens, an Operation is created.
 *   - an operation
 *     - when this happens, the Nugget is added to the operation.
 * - Operations can be dragged, but only to reorder.
 * - Nuggets can also be dragged to be re-ordered.
 */

export interface PromptItemProps {
    onDragStart?: (item : PIType) => void,
    onDragEnd?: (item: PIType) => void,
    onDragOver?: (item: PIType) => void,
    onDrop?: (item : PIType) => void,
    onMouseEnter?: (item : PIType) => void,
    onMouseLeave?: (item : PIType) => void,
}