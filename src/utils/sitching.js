import { schemaFromExecutor } from "@graphql-tools/wrap";
import { print } from "graphql";

const executor = async ({ document, variables, operationName, extensions }) => {
  const query = print(document);

  // console.log(query);
  const fetchResult = await fetch(process.env["API_ASSETS_URL"], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables, operationName, extensions }),
  });
  return fetchResult.json();
};

export const assetSubschema = {
  schema: await schemaFromExecutor(executor),
  executor,
};
