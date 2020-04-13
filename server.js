var http = require('http')
var fs = require('fs')
const { parse } = require('querystring')
var formidable = require('formidable')
var util = require('util')
var destination = "./receivedFiles";
var server = http.createServer(function (req, res) {
	if (req.url == '/') { 
        fs.readFile('index.html', function(err, data) {
    		res.writeHead(200, {'Content-Type': 'text/html'})
    		res.write(data)
    		res.end()
  		})
    }

    if (req.url == '/upload/files' && req.method === 'POST') {
    	const form = formidable({ 
    	    multiples: true,
    	    uploadDir: destination
    	 });

    	form.parse(req, function(err, fields, files) {
      		if (err) {
        		console.error(err.message);
        		return;
      		}

      		const filesList = files.files 

      		if(filesList){
      			if(Array.isArray(filesList)) {
      				filesList.forEach(rename)
      			} else {
      				rename(filesList)
      			}
      		}
      		res.writeHead(200, { 'content-type': 'application/json' });
      		res.end(JSON.stringify({ fields, files }, null, 2));
    });
    return;
    }
});

function rename(file) {
	console.log(file)
	fs.rename(file.path, destination+'/'+file.name, (err) => { 
  		if(err) {
  			console.log(err)
  		}
	}); 
}

server.listen(8080)

console.log('Node.js web server at port 8080 is running..')