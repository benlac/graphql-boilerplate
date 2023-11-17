// @ts-nocheck
import { SQLDataSource } from "./SqlDataSources.js";

export default class BookDataSource extends SQLDataSource {
  constructor(knexConnection, normalize = (data) => data) {
    super(knexConnection);
    this.normalize = normalize;
  }
  async getBooks() {
    const bookCache = await this.cache.get("getBooks");

    if (bookCache) {
      console.log("use cache");
      return JSON.parse(bookCache).rows.map(this.normalize);
    }
    const results = await this.knexConnection.raw(`
        SELECT * 
        FROM book
    `);

    await this.cache.set("getBooks", JSON.stringify(results), { ttl: 86400 });

    return results.rows.map(this.normalize);
  }
}
