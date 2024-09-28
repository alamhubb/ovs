import {describe, test, expect} from 'vitest'

import {ovsTransformToTsCode} from "../ovsTransformer";

describe('ovsTransformCode', () => {
    test('transform export', () => {
        expect(ovsTransformToTsCode('export'))
    })
})
