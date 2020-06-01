const { cpus } = require('os');
const { resolve } = require('path');
const {
  promises: { readdir, readFile },
} = require('fs');
const { Worker } = require('worker_threads');
const dbConfig = require('./config/db');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig['development']);

const CPU_COUNT = cpus().length;
const WORKER_PATH = resolve(__dirname, './worker/index.js');
const DIR_PATH = resolve(__dirname, '../raw_data');

const main = async () => {
  const contents = await readdir(DIR_PATH, { withFileTypes: true });
  const dirs = contents
    .filter((dir) => dir.isDirectory())
    .map(({ name }) => `${DIR_PATH}/${name}/pg${name}.rdf`);

  const CHUNK_SIZE = Math.ceil(dirs.length / CPU_COUNT);

  const chunks = [];
  for (let chunkIndex = 0; chunkIndex < CPU_COUNT; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;

    const chunk = dirs.slice(start, end);
    console.log(chunk.length);
    chunks.push(chunk);
  }

  console.time(`Read ${dirs.length} files`);

  const promises = chunks.map(
    (chunk) =>
      new Promise((res, rej) => {
        const worker = new Worker(WORKER_PATH, {
          workerData: chunk,
        });
        worker.on('message', res);
        worker.on('error', rej);
        worker.on(
          'exit',
          (code) =>
            code !== 0 &&
            rej(new Error(`Worker stoped working with code: ${code}`))
        );
      })
  );

  await Promise.all(promises);

  console.timeEnd(`Read ${dirs.length} files`);
};

sequelize.sync().then(() => main().catch(console.log));
