var fs = require('fs'); 
 var data = fs.readFileSync('uploads/inhami.txt','utf8');
 console.log(data);
 console.log(typeof (data));
