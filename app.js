const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require("express-session")
const MariaDBStore = require("express-session-mariadb-store")
const db = require('./database')
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

app.use(session({
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
	if (!req.session.uid) {
		function genUid() {
			return new Promise((resolve, reject) => {
				db.query("INSERT INTO tb_accounts (username) VALUES ('undefined')")
					.then(() => {
						db.query("SELECT id FROM tb_accounts ORDER BY id DESC LIMIT 1")
							.then((rows) => {
								var result = rows[0].id
								var username = "user#" + (result).toLocaleString('en-US', {minimumIntegerDigits: 5, useGrouping:false})
								db.query("UPDATE tb_accounts SET username = '"+username+"' WHERE id = '"+result+"'")

								resolve(result);
							})
					});
			});
		}

		genUid().then(result => {
			req.session.uid = result
			res.sendFile(path.join(__dirname + '/views/index.html'))
			console.log("Account " + result + " was succesfully generated!")
		})

	} else {
		res.sendFile(path.join(__dirname + '/views/index.html'))
		console.log("UID is already active")
	}
});

app.listen(3000);
console.log('Express server started');