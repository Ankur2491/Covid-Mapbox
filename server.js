const express = require('express');
const path = require('path');
const app = express();


app.use(express.static(__dirname+'/dist/mapboxAngular'));

app.get('/*',function(req,res){
    res.sendFile(path.join(__dirname+'/dist/mapboxAngular/index.html'));
});

app.listen(process.env.PORT || 8080);

