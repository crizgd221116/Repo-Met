
const {Parser} = require('json2csv');

     const downloadResource = (res, fileName, fields, data) => {
  // const json2csv = new Parser({ fields });
  const opts = {fields};
  const parser = new Parser(opts);
  const csv = parser.parse(data);
  // const csv = json2csv.parse(data,opts);
  res.header('Content-Type', 'text/csv');
  res.attachment(fileName);
  // console.log(csv);
  return res.send(csv);
}

module.exports = downloadResource;