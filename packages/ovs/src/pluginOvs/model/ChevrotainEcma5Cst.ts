export default class ChevrotainEcma5Cst {
    name: string
    children: { [key: string]: ChevrotainEcma5Cst[] }
    tokenTypeIdx: number
    image: string | number
    startOffset: number
    endOffset: number
}