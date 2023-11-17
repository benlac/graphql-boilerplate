export default (book) => {
  return {
    title: book.title,
    author: book?.author ?? "",
  };
};
