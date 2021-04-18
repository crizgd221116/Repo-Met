const moment = require('moment-timezone');
let date = "02/01/2004  10:00:00"//d/m/a
/*let dateleft = date.substr(0,10);
let datex = dateleft.split("/");

let dateright = date.substr(10,date.length-1).replace(/\s/g,"");*/
let finaldate = new Date(date).toLocaleString(); 
//console.log(dateright);
console.log(finaldate);

