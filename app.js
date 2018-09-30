const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));

var results = [];
var hideOrbs = false;

app.use("/style", express.static(__dirname + "/style"));

app.post("/search", function(req, res){
    var search = req.body.search;
    results = [];
    var wikiApi = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=" + search;
        request(wikiApi, function(error, response, body){
            if(error) {
                console.log("SOMETHING WENT WRONG!");
                console.log(error);
            } else {
                if(response.statusCode == 200) {
                    console.log("General Kenobi");
                }
            }
            
            var wiki = JSON.parse(body);
            for(var i = 0; i < wiki[1].length; i++) {
                results.push({name: wiki[1][i], blurb: wiki[2][i], link: wiki[3][i]});
            }
            if(results.length > 0) {
                hideOrbs = true;
            } else {
                hideOrbs = true;
                results.push({errorMsg: "No results found."});
            }
            
            res.redirect("/");
            
        });
});

app.get("/", function(req, res){
                res.render("index.ejs", {results, hideOrbs});
});

app.listen(port, function(){
    console.log("server is listening on port ${port}");
});