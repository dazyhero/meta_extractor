const { DOMParser } = require('xmldom');

module.exports = class XMLDOM {
  xml = new DOMParser();

  parseStringPromise(string) {
    return Promise.resolve(this.xml.parseFromString(string, 'text/html'));
  }
};
