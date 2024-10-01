import * as es6AllTokens from "../../grammars/es6/ECMAScript6Token";
import type {IToken} from "@chevrotain/types";

const data={}

const tokenIndexMap: Map<number, string> = Object.values(es6AllTokens).reduce((map, item: IToken) => {
    // 将对象的 typeIndex 作为 key，值为对象本身
    map.set(item.tokenTypeIdx, item.name);
    data[String(item.tokenTypeIdx)] = item.name
    return map;
}, new Map());


export default class Es6TokenMap {
    static get(key: number) {
        return tokenIndexMap.get(key)
    }
}
