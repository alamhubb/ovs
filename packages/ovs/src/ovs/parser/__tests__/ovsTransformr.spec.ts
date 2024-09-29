import {describe, test, expect} from 'vitest'

import {ovsGenerateCodeToTsCode} from "../ovsTsGenerator";

describe('ovsTransformCode', () => {
    const code = 'const a = 10'

    /*test('transform export', () => {
        expect(ovsTransformToTsCode(code))
    })*/

    test('get ts ast', () => {
        expect(ovsGenerateCodeToTsCode(code))
    })
})
