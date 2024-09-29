import {describe, test, expect} from 'vitest'

import {ovsGenerateCodeToTsCode} from "../ovsTsParser";
import {ovsTransformToTsCode} from "../ovsTransformer";


describe('test export default', () => {
    const code = 'const a = 10; export default a'

    test('ovs test', () => {
        expect(ovsTransformToTsCode(code))
    })

    test('ts test', () => {
        expect(ovsGenerateCodeToTsCode(code))
    })
})

describe('test export const a = 10', () => {
    const code = 'export var a = 10'

    test('ovs test', () => {
        expect(ovsTransformToTsCode(code))
    })

    test('ts test', () => {
        expect(ovsGenerateCodeToTsCode(code))
    })
})

describe('test const a = 10', () => {
    const code = 'const a = 10'

    test('ovs test', () => {
        expect(ovsTransformToTsCode(code))
    })

    test('ts test', () => {
        expect(ovsGenerateCodeToTsCode(code))
    })
})

describe('test var a = 10', () => {
    const code = 'var a = 10'

    test('ovs test', () => {
        expect(ovsTransformToTsCode(code))
    })

    test('ts test', () => {
        expect(ovsGenerateCodeToTsCode(code))
    })
})
