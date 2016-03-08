/**
 * Created by mdiviesti on 3/2/16.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set('views', './views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var liftweight = function (reps, weight, val) {
    return {"reps": reps, "orig": (weight * .9) * val, "rounded": Math.round((weight * .9) * val / 5) * 5};
};

var wendler = function (weight) {
    return {
        "1": {
            "week": 1,
            "title": "5/5/5+",
            "description": "2 sets of 5 progressive reps then a 3rd set of 5 to failure",
            "sets": [liftweight(5, weight, .65), liftweight(5, weight, .75), liftweight('5+', weight, .85)]
        },
        "2": {
            "week": 2,
            "title": "3/3/3+",
            "description": "2 sets of 3 progressive reps then a 3rd set of 3 to failure",
            "sets": [liftweight(3, weight, .70), liftweight(3, weight, .80), liftweight('3+', weight, .90)]
        },
        "3": {
            "week": 3,
            "title": "5/3/1+",
            "description": "1 set of 5 reps, 1 set of 3 reps, then at least 1 to failure",
            "sets": [liftweight(5, weight, .75), liftweight(3, weight, .85), liftweight('1+', weight, .95)]
        },
        "4": {
            "week": 4,
            "title": "Deload",
            "description": "3 sets of 5 reps",
            "sets": [liftweight(5, weight, .40), liftweight(5, weight, .50), liftweight(5, weight, .60)]
        }
    };
};

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/weight', function (req, res) {
    var sender = {
        "Squats": wendler(req.body.squats),
        "Bench Press": wendler(req.body.bench),
        "Dead Lift": wendler(req.body.deadlift),
        "Military Press": wendler(req.body.milpress)
    };
    res.render('calculations', {
        cycle: sender
    });

});

app.get('/json/:weight', function (req, res) {
    var sender = wendler(req.params.weight);
    res.send(sender);
});

app.post('/jsonpost', function (request, response) {
    var endresult = {"exercise": request.body.liftname, "cycle": wendler(request.body.maxrep)};
    response.send(endresult);
});

var server = app.listen(3000, function () {
    var host = 'localhost';
    var port = 3000;
    console.log("app listening at http://%s:%s", host, port);
});