var expressoes;
var fs = require('fs');

var folder = process.argv[2];
var extensaoArquivo = folder.split(".")[folder.split(".").length-1];

function arquivoCSV(){
	var extensaoCSV = require('csv-string');

	var resultado;

	fs.readFile(folder, 'utf8', function(err, data) {
		resultado = extensaoCSV.parse(data);
		expressoes = resultado[0];
		Intervalos();
	});
}

function arquivoJSON(){
	fs.readFile(folder, function(err, json) {
		json = JSON.parse(json);
        expressoes = json.expressoes;
		expressoes = expressoes.split(",");
		Intervalos();
    });	
}

function arquivoXML(){
    var xmlParser = require('xml2js').parseString;

    fs.readFile(folder, function(err, data) {
        xmlParser(data, function(err, result) {
			expressoes = result.expressoes.split(",");
			Intervalos();
		});
    });
}

if(extensaoArquivo == "json"){
	arquivoJSON();
}

else if(extensaoArquivo == "xml"){
	arquivoXML();	
}

else if(extensaoArquivo == "csv"){
	arquivoCSV();
}

function interval(init, end){
	if(init!=end){
		return "["+init+"-"+end+"]";
	}
	
	else{
		return "["+end+"]";
	}
}

function Intervalos(){
	var intervalo = 0;
	var resultado = [];
	var numInicial = expressoes[0];
	var numFinal;
	
	for(var i =	0; i < expressoes.length; i++){
		if(i == expressoes.length-1){
			numFinal=expressoes[i];
			resultado[intervalo]= interval(numInicial,numFinal);
			break;
		}
		
		if((parseInt(expressoes[i])+1) != parseInt(expressoes[i + 1])){
			 numFinal = expressoes[i];
			 resultado[intervalo]= interval(numInicial,numFinal);
			 numInicial = expressoes[i+1];
			 intervalo++;
		}
	}
	
	fs.writeFile('resultado.json', JSON.stringify(resultado.join()), function (err) {
			if (err) return console.log(err);
			console.log("salvo");
		})
}