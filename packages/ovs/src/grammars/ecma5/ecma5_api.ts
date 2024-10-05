import { tokenize } from "./ecma5_lexer.ts";
import { Es5Parser } from "./Es5Parser.ts";

const parserInstance = new Es5Parser();

export function parse(str) {
  const tokens = tokenize(str);
  parserInstance.input = tokens;
  parserInstance.orgText = str;
  parserInstance.Program();

  if (parserInstance.errors.length > 0) {
    throw Error("Sad Sad Panda");
  }
}
