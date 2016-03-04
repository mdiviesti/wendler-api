/**
 * Created by mdiviesti on 3/2/16.
 */

var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

var liftweight = function (reps, weight, val) {
    return {"reps": reps, "orig": (weight *.9) * val, "rounded": Math.round((weight *.9) * val / 5) * 5};
};

var wendler = function (weight) {
    return {
        "1": {
            "week": 1,
            "title": "5-5-5+",
            "description": "2 sets of 5 progressive reps then a 3rd set of 5 to failure",
            "set1": liftweight(5, weight, .65),
            "set2": liftweight(5, weight, .75),
            "set3": liftweight('5+', weight, .85)
        },
        "2": {
            "week": 2,
            "title": "3-3-3+",
            "description": "2 sets of 3 progressive reps then a 3rd set of 3 to failure",
            "set1": liftweight(3, weight, .70),
            "set2": liftweight(3, weight, .80),
            "set3": liftweight('3+', weight, .90)
        },
        "3": {
            "week": 3,
            "title": "5-3-1+",
            "description": "1 set of 5 reps, 1 set of 3 reps, then at least 1 to failure",
            "set1": liftweight(5, weight, .75),
            "set2": liftweight(3, weight, .85),
            "set3": liftweight('1+', weight, .95)
        },
        "4": {
            "week": 4,
            "title": "Deload",
            "description": "3 sets of 5 reps",
            "set1": liftweight(5, weight, .40),
            "set2": liftweight(5, weight, .50),
            "set3": liftweight(5, weight, .60)
        }
    };
};

app.get('/', function (req, res) {
    res.send('input your 1RM');
});

app.get('/weight/:weight', function (req, res) {
    var sender = wendler(req.params.weight);
    res.render('calculations', {
        cycle: sender,
    });
    /**
     * above we are using jade. You can easily just send json instead by using the folling.
     * res.send(sender);
     */

});

var server = app.listen(3000, function () {
    var host = 'localhost';
    var port = 3000;
    console.log("app listening at http://%s:%s", host, port);
});