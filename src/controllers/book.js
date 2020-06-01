module.exports = class BookController {
  authorCache = new Set();
  subjectCache = new Set();
  languageCache = new Set();

  constructor(
    bookModel,
    authorController,
    subjectController,
    languageController
  ) {
    this.bookModel = bookModel;
    this.authorController = authorController;
    this.subjectController = subjectController;
    this.languageController = languageController;
  }

  async createBook(bookDTO) {
    try {
      let languagePromise;
      if (!this.languageCache.has({ name: bookDTO.language })) {
        this.languageCache.add({ name: bookDTO.language });
        languagePromise = this.languageController.findOrCreate(
          bookDTO.language
        );
      } else {
        languagePromise = [{ name: bookDTO.language }];
      }

      let subjectsPromise = null;

      const subjects = [];

      if (bookDTO.subjects) {
        if (Array.isArray(bookDTO.subjects)) {
          const subjectToFind = bookDTO.subjects
            .filter((name) => {
              if (name && !this.subjectCache.has({ name })) {
                return true;
              } else {
                subjects.push({ name });
                return false;
              }
            })
            .map((name) => {
              subjects.push({ name });
              this.subjectCache.add({ name });
              return name;
            });
          if (subjectToFind.length) {
            subjectsPromise = this.subjectController.bulkCreate(subjectToFind);
          }
        } else {
          if (
            !this.subjectCache.has({
              name: bookDTO.subjects,
            })
          ) {
            subjectsPromise = this.subjectController.findOrCreate(
              bookDTO.subjects
            );
            this.subjectCache.add({
              name: bookDTO.subjects,
            });
          } else {
            subjects.push({ name: bookDTO.subjects });
          }
        }
      }

      const authors = [];
      let authorPromise = null;
      if (bookDTO.author) {
        if (Array.isArray(bookDTO.author)) {
          const authorToFind = bookDTO.author
            .filter((name) => {
              if (name && !this.subjectCache.has({ name })) {
                return true;
              } else {
                authors.push({ name });
                return false;
              }
            })
            .map((name) => {
              this.authorCache.add({ name });
              return name;
            });
          if (authorToFind.length) {
            authorPromise = this.authorController.bulkCreate(authorToFind);
          }
        } else {
          if (
            bookDTO.author &&
            !this.authorCache.has({ name: bookDTO.author })
          ) {
            authorPromise = this.authorController.findOrCreate(bookDTO.author);
            this.authorCache.add({ name: bookDTO.author });
          } else {
            authors.push({ name: bookDTO.author });
          }
        }
      }

      const nullToArray = (n) => n || [];

      const [language, subjectsDB, authorsDB] = await Promise.all([
        languagePromise,
        subjectsPromise,
        authorPromise,
      ]);

      const authorNames = [...authors, ...nullToArray(authorsDB)]
        .filter(({ name }) => name)
        .map(({ name }) => name);

      const subjectNames = [...subjects, ...nullToArray(subjectsDB)]
        .filter(({ name }) => name)
        .map(({ name }) => name);

      const book = await this.bookModel.create({
        id: bookDTO.id,
        language,
        publicationDate: bookDTO.issued,
        publisher: 'Gutenberg',
        title: bookDTO.title,
        license: bookDTO.rights,
        lang: language[0].name,
      });

      const bookAuthorPromise = book.addAuthor(authorNames);
      const bookSubjectPromise = book.addSubject(subjectNames);

      await Promise.all([bookAuthorPromise, bookSubjectPromise]);
    } catch (e) {
      console.log(e);
    }
  }
};
