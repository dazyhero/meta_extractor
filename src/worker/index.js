const {
  promises: { readFile },
  existsSync,
} = require('fs');

const XML2JS = require('../parser/xmljs');
const Parser = require('../parser');
const xmljs = new XML2JS();

const { book, language, subject, author } = require('../models');

const LanguageController = require('../controllers/language');
const SubjectController = require('../controllers/subject');
const AuthorController = require('../controllers/author');
const BookController = require('../controllers/book');

const languageController = new LanguageController(language);
const subjectController = new SubjectController(subject);
const authorController = new AuthorController(author);
const bookController = new BookController(
  book,
  authorController,
  subjectController,
  languageController
);

const { workerData, parentPort } = require('worker_threads');

const filePaths = workerData;
const asyncIterable = {
  [Symbol.asyncIterator]: async function* asyncGenerator() {
    const fileNames = splitArrayByChunkSize(1000);

    while (fileNames.length) {
      const files = fileNames.pop();
      const readPromises = files
        .filter((file) => existsSync(file))
        .map((file) => readFile(file));
      yield await Promise.all(readPromises);
    }
  },
};

const splitArrayByChunkSize = (CHUNK_SIZE = 10) => {
  const filesToRead = [];

  const segments = Math.ceil(filePaths.length / CHUNK_SIZE);

  for (let chunkIndex = 0; chunkIndex < segments; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;

    const chunk = filePaths.slice(start, end);
    filesToRead.push(chunk);
  }

  return filesToRead;
};

const run = async () => {
  for await (const items of asyncIterable) {
    try {
      const xmlPromise = items.map((item) => {
        const xml = new Parser(xmljs);
        return xml.parse(item);
      });
      const parsedData = await Promise.all(xmlPromise);
      const dbPromise = parsedData.map((data) =>
        bookController.createBook(data)
      );
      await Promise.all(dbPromise);
    } catch (e) {
      console.log(e);
    }
  }
  parentPort.postMessage(`Done with files`);
};

run().catch(console.log);
