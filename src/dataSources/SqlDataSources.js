// @ts-nocheck
import { DataSource } from "apollo-datasource";

export class SQLDataSource extends DataSource {
  constructor(knexConnection) {
    super();
    this.knexConnection = knexConnection;
  }

  initialize(config) {
    this.context = config?.context;
    this.cache = config?.cache;
  }
}
