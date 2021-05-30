
const { Parser } = require('json2csv');

const downloadResource = (res, fileName, fields, data) => {
  const opts = { fields };
  const parser = new Parser(opts);
  const csv = parser.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment(fileName);
  return res.send(csv);
}

const downloadResourceTxt = (res, fileName, data) => {
  
  res.header('Content-Type', 'text');
  res.attachment(fileName);
  return res.send(data);
}

module.exports = downloadResource, downloadResourceTxt;