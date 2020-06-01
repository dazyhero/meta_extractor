const { Parser } = require('xml2js');

module.exports = class XML2JS {
  xml = new Parser();

  parseStringPromise(string) {
    return this.xml.parseStringPromise(string);
  }
};
