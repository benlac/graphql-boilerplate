import * as path from "path";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const typesArray = loadFilesSync(path.join(__dirname, "./"), {
  recursive: true,
  extensions: ["graphql"],
});
export const typesMerged = mergeTypeDefs(typesArray, {
  commentDescriptions: true,
});
