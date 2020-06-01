module.exports = class Parser {
  bookId = [];
  constructor(xml) {
    this.xml = xml;
  }

  getValWithDefault(fn, def) {
    try {
      return fn();
    } catch (e) {
      return def;
    }
  }

  async parse(path) {
    const data = await this.xml.parseStringPromise(path);

    const body = this.getValWithDefault(
      () => data['rdf:RDF']['pgterms:ebook'][0],
      null
    );

    const id = this.getValWithDefault(
      () => body.$['rdf:about'].split('/')[1],
      Math.random() * 10000
    );

    delete body['dcterms:hasFormat'];

    const title = this.getValWithDefault(
      () => body['dcterms:title'][0],
      'no title'
    );

    const rights = this.getValWithDefault(
      () => body['dcterms:rights'][0],
      'no licenes'
    );

    const language = this.getValWithDefault(
      () => body['dcterms:language'][0]['rdf:Description'][0]['rdf:value'][0]._,
      'no language'
    );

    const issued = this.getValWithDefault(
      () => body['dcterms:issued'][0]._,
      Date().now
    );

    let author = this.getValWithDefault(
      () => body['dcterms:creator'][0]['pgterms:agent'][0]['pgterms:name'][0],
      undefined
    );

    const getAuthors = (m) =>
      this.getValWithDefault(
        () => m['pgterms:agent']['pgterms:name'][0],
        'no author'
      );

    if (author === undefined) {
      const edt = body['marcrel:edt'];
      const ctb = body['marcrel:ctb'];
      const com = body['marcrel:com'];
      const cmp = body['marcrel:cmp'];
      const adp = body['marcrel:adp'];
      const trl = body['marcrel:trl'];
      const lbt = body['marcrel:lbt'];
      if (edt) {
        author = edt.map(getAuthors);
      } else if (ctb) {
        author = ctb.map(getAuthors);
      } else if (com) {
        author = com.map(getAuthors);
      } else if (adp) {
        author = adp.map(getAuthors);
      } else if (trl) {
        author = trl.map(getAuthors);
      } else if (cmp) {
        author = cmp.map(getAuthors);
      } else if (lbt) {
        author = lbt.map(getAuthors);
      } else {
        author = 'no author';
      }
    }

    const subjects =
      this.getValWithDefault(body['dcterms:subject'], [null]).map((subject) =>
        this.getValWithDefault(
          () => subject['rdf:Description'][0]['rdf:value'][0]
        )
      ) || 'no subject';

    return {
      title,
      rights,
      language,
      issued,
      author,
      subjects,
      id,
    };
  }
};
