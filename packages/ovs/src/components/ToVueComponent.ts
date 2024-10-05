import {getAllProperties} from "@/doko/doko";

export default function toVueComponent(target) {
    const props = getAllProperties(target)
    const newObj = {}
    for (const prop of props) {
        newObj[prop] = target[prop]
    }
    console.log(newObj)
    return newObj
}