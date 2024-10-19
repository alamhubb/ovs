import Es6TokenConsumer, {Es6TokenName, es6TokensObj} from "subhuti/syntax/es6/Es6Tokens.js";
import {createKeywordToken} from "subhuti/struct/SubhutiCreateToken.js";

export const ovsTokenName = {
    ...Es6TokenName,
    OvsToken: "OvsToken"
}
const ovsTokensObj = {
    OvsToken: createKeywordToken(ovsTokenName.OvsToken, "Ovs")
}
const ovs6Tokens = Object.values(ovsTokensObj)

export default class OvsTokenConsumer extends Es6TokenConsumer {
    OvsToken() {
        return this.consume(ovsTokensObj.OvsToken);
    }
}