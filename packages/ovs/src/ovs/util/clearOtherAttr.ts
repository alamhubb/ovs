export function cleanObject(obj) {
    // 遍历对象的每一个属性
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // 如果属性是对象，递归调用
            if (['parseDiagnostics'].includes(key)) {
                delete obj[key];
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                cleanObject(obj[key]);
            }
            // 如果属性不是kind并且不是对象，则删除它
            else if (!['kind', 'escapedText', 'text'].includes(key)) {
                delete obj[key];
            }
        }
    }
}
