import { code1 } from '@/ovs/ovsTest/alltest/getcode'
import { ovsTransformToTsCode } from '@/ovs/parser/ovsTransformer'
import "../../transform/transformOvs/VariableStatementOvsTransformer"
import "../../transform/transformEs6/ObjectLiteralEs6Transformer"

ovsTransformToTsCode(code1)
