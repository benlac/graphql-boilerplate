export default (_, __, { dataSources }) => {
  return dataSources.book.getBooks();
};
