import BookDataSource from "./Book.js";
import knexConnection from "../config/postgres.js";
import normalizeBook from "../normalize/normalize-book.js";

export default {
  book: new BookDataSource(knexConnection, normalizeBook),
};
