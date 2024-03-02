export function title(text: string) {
    return (!text.length) ? "" : ((text.length === 1) ? text.toUpperCase() : text[0].toUpperCase() + text.substring(1).toLowerCase());
}

/**
 * 
 * @param arr Array to filter
 * @param item item in the array to toggle.
 */
export function arrayToggle(arr : Array<any>, item : any) {

}