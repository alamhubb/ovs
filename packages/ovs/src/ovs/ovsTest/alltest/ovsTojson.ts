import { code1 } from '@/ovs/ovsTest/alltest/getcode'
import "../../transform/transformOvs/VariableStatementOvsTransformer"
import "../../transform/transformEs6/ObjectLiteralEs6Transformer"
import OvsChevrotainCstTransformer from "@/ovs/transform/transformChevrotain/OvsChevrotainCstTransformer";

OvsChevrotainCstTransformer.transformCodeToAst(code1)
