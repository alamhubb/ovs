function parseExpression(chars) {
    return parseAdditive(chars);
}

function parseAdditive(chars) {
    let left = parseMultiplicative(chars); // 先解析乘法

    while (chars.length > 0 && chars[0] === '+') {
        chars.shift(); // 消耗 '+'
        let right = parseMultiplicative(chars); // 再解析乘法
        left = {
            type: 'Add', // 构建加法表达式
            left: left,
            right: right
        };
    }

    return left; // 返回最终的加法表达式
}

function parseMultiplicative(chars) {
    let left = parseNumber(chars); // 首先解析一个数字

    while (chars.length > 0 && chars[0] === '*') {
        chars.shift(); // 消耗 '*'
        let right = parseNumber(chars); // 解析下一个数字
        left = {
            type: 'Mul', // 构建乘法表达式
            left: left,
            right: right
        };
    }

    return left; // 返回最终的乘法表达式
}

function parseNumber(chars) {
    let numStr = '';
    while (chars.length > 0 && isDigit(chars[0])) {
        numStr += chars.shift(); // 消耗数字字符
    }
    return {
        type: 'Num',
        value: parseInt(numStr, 10) // 将字符串转换为整数
    };
}

function isDigit(char) {
    return /\d/.test(char); // 检查是否为数字字符
}

// 测试
let input = '2+3*4+5'.split(''); // 输入的字符数组
let expr = parseExpression(input);

console.log(JSON.stringify(expr, null, 2));
