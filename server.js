const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')
require('dotenv').config();

app.set('view engine', 'ejs'); // set view engine to EJS
app.use(express.static('public')); // expose static files in public/
app.use(bodyParser.urlencoded({ extended: true })); // enable body-parser to pass client input server-side

app.get('/', function (req, res) {
    res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.API_KEY}`

    request(url, function (error, response, body) {
        console.log("API request made")        
        if (error) {
            res.render('index', {weather: null, error: "Error, please try again"});
        } else {
            let weather = JSON.parse(body)
            if (weather.main == undefined) {
                res.render('index', {weather: null, error: "Error, please try again"});
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                res.render('index', {weather: weatherText, error: null});
            }
        }
    });
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000')
})
