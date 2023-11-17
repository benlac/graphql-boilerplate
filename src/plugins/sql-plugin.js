import SQLCollector from "./sql-collector.js";

export default {
  requestDidStart() {
    return {
      willSendResponse(requestContext) {
        const sqlExtension = {
          executionTime: SQLCollector.executionTime,
          numbersOfQueries: SQLCollector.queries.length,
          queries: SQLCollector.queries,
        };

        // eslint-disable-next-line no-param-reassign
        // eslint-disable-next-line no-param-reassign
        requestContext.response.body.singleResult.extensions = {
          ...requestContext.response.body.singleResult.extensions,
          sqlExtension,
        };

        SQLCollector.reset();
      },
    };
  },
};
