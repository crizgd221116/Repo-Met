
const downloadResourceTxt = (res, fileName, data) => {
  // const opts = { fields };
  // const parser = new Parser(opts);
  let contenido = `codigo\tanio\tmes\tdia\tvalor\n`;
  for (let index = 0; index < data.length; index++) {
      const element = data[index];
      contenido = `${contenido}${element.codigoEstacion}\t${element.anio}\t${element.mes}\t${element.dia}\t${element.valor}\n`;
  }
  res.header('Content-Type', 'text');
  res.attachment(fileName);
  return res.send(contenido);
}

module.exports = downloadResourceTxt;