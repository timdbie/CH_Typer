const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require("express-session")
const MariaDBStore = require("express-session-mariadb-store")
const db = require('./database');
const { Console } = require("console");
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
	name: "userToken",
	secret: "123",
	resave: true, 
	saveUninitialized: true,
	store: new MariaDBStore({
		sessionTable: "tb_sessions",
		pool: db
	}),
	cookie: {
		maxAge: 365 * 24 * 60 * 60 * 1000
	},
	rolling : true
}))

app.get('/', function (req, res) {
	function submitHeader() {
		res.sendFile(path.join(__dirname + '/views/index.html'))
	}

	async function genUid() {
		let result

		await db.query("INSERT INTO tb_accounts (username, pb_15, pb_30, pb_60) VALUES ('undefined', 0, 0, 0)")
		await db.query("SELECT id FROM tb_accounts ORDER BY id DESC LIMIT 1")
		.then((rows) => {
			result = rows[0].id
			let username = "user#" + (result).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})
			db.query("UPDATE tb_accounts SET username = '"+username+"' WHERE id = '"+result+"'")
			
		})
		return result
	}

	if (!req.session.uid) {
		genUid().then(res => {
			req.session.uid = res
			submitHeader()
		})
	} else {
		submitHeader()
	}
})

app.post('/', function(req, res) {
	db.query("SELECT * FROM tb_accounts WHERE id = "+req.session.uid+"")
	.then((rows) => {
		if (req.body.selectedtimer == 14) {
			if (req.body.netwpmval > rows[0].pb_15) {
				db.query("UPDATE tb_accounts SET pb_15 = "+req.body.netwpmval+" WHERE id = "+req.session.uid+"")
			}
		}

		if (req.body.selectedtimer == 29) {
			if (req.body.netwpmval > rows[0].pb_30) {
				db.query("UPDATE tb_accounts SET pb_30 = "+req.body.netwpmval+" WHERE id = "+req.session.uid+"")
			}
		}

		if (req.body.selectedtimer == 59) {
			if (req.body.netwpmval > rows[0].pb_60) {
				db.query("UPDATE tb_accounts SET pb_60 = "+req.body.netwpmval+" WHERE id = "+req.session.uid+"")
			}
		}
	});
	
});

app.post('/leaderboard', function (req, res) {
	async function fetchLeaderboard() {
		let top15s = []
		let top30s = []
		let top60s = []

		await db.query("SELECT * FROM tb_accounts ORDER BY pb_15 DESC")
		.then((rows) => {
			top15s = rows
		})

		await db.query("SELECT * FROM tb_accounts ORDER BY pb_30 DESC")
		.then((rows) => {
			top30s = rows
		})

		await db.query("SELECT * FROM tb_accounts ORDER BY pb_60 DESC")
		.then((rows) => {
			top60s = rows
		})	

		return [top15s, top30s, top60s];
	}

	fetchLeaderboard().then(data => {
		res.send(data)
	})
})

app.post('/userdata', function (req, res) {
	db.query("SELECT * FROM tb_accounts WHERE id = "+req.session.uid+"")
	.then((rows) => {
		res.send(rows)
	});

	if(req.body.newusername) {
		db.query("SELECT COUNT(username) AS count FROM tb_accounts WHERE username = '"+req.body.newusername+"'")
		.then((rows) => {
			if (rows[0].count == 0) {
				db.query("UPDATE tb_accounts SET username = '"+req.body.newusername+"' WHERE id = "+req.session.uid+"")
			} else {
				console.log("This username already exists!")
			}
		})
	}
})

app.listen(3000);
console.log('Express server started');