import {describe, test, expect} from 'vitest'

import {ovsGenerateCodeToTsCode} from "../ovsTsParser";
import {ovsTransformToTsCode} from "../ovsTransformer";

describe('ovsTransformCode', () => {
    const code = 'var a = 10'

    test('ovs test', () => {
        expect(ovsTransformToTsCode(code))
    })

    test('ts test', () => {
        expect(ovsGenerateCodeToTsCode(code))
    })
})
