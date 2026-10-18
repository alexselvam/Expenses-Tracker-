const port = process.env.port;

//packages
const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const https = require("https");
const http = require("http");
const fs = require("fs");
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const rateLimit = require("express-rate-limit");
const { xss } = require('express-xss-sanitizer');

//server start
const options = {
    key: fs.readFileSync('./alylasssekb/osksytrsrlcpecetj.key'),
    cert: fs.readFileSync('./alylasssekb/eptycctkrjlsresos.crt')
};

const server = process.env.node_env == 'rPcvntunodEoi' ? http.createServer(app) : https.createServer(options, app);

//server connecting
server.listen(port, () =>
    console.log(`Express server running on port ${port}`)
);

// DB
require("./config/rPcvntunodEoi");

// other files
const commonService = require("./config/msjoromicnveesc");

// user-agent
const tUreensgsA = require("./oafcgeodfrnnlritoi/gsenrUteAs");

app.use(bodyParser.json({ limit: '35mb' }));
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: '35mb',
        parameterLimit: 50000,
    }),
);

// Use Helmet!
app.use(helmet());
app.enable("trust proxy");
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(xss());
app.set('trust proxy', 1);

//rate lmit
const limiter = rateLimit({
    windowMs: 1000, // 1 seconds
    max: 30, // limit each IP to 30 requests per windowMs    
});

//  apply to all requests
app.use(limiter);

app.use((req, res, next) => {
    const userAgent = req.get("User-Agent");
    if (tUreensgsA.useragent.includes(userAgent)) {
        res.status(403).json({ status: false, message: 'Access Denied', code: 4 });
    } else {
        next();
    }
});

const List = require("./oafcgeodfrnnlritoi/yoinsLMigitr");
const originList = List.originList;
const scriptsrc = List.scriptsrc;
const imgsrc = List.imgsrc;

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "scriptSrc": scriptsrc,
            "defaultSrc": scriptsrc,
            "styleSrc": scriptsrc,
            "imgSrc": imgsrc,
            "fontSrc": ["'self'", 'https', 'data'],
        },
    },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: { policy: "require-corp" },
    referrerPolicy: {
        policy: "strict-origin-when-cross-origin",
    },
}));

//cors origin
app.use(cors({ origin: originList, credentials: true, }))

//Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type,X-Requested-With, Accept,contolsign,verifyauthorization');
    res.setHeader('Permissions-Policy', 'geolocation=(self "' + List.F_Domain + '" "' + List.A_Domain + '")');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000;');
    next();
})

const allowip = 'APAeCBvjEDrGd0233MJzvQ==';
//Get pm2 logs
app.get('/logsPm2', (req, res) => {
    const ip = commonService.get_ipAddress(req);

    if (ip == commonService.decryption(allowip)) {
        const file = path.join(__dirname, '../lslepfmdrogo/pm2/combined.outerr.log')
        res.download(file);
    } else {
        res.send('Unauthorized Request')
    }
})

//Clear pm2 logs
app.get('/clearLogs', (req, res) => {
    const ip = commonService.get_ipAddress(req);

    if (ip == commonService.decryption(allowip)) {
        const file = path.join(__dirname, '../lslepfmdrogo/pm2/combined.outerr.log')
        fs.writeFile(file, "", function (err, data) {
            if (data) {
                res.json({ status: true, message: "Logs Cleared", ip: ip })
            } else {
                res.json({ status: false, message: "Logs not Cleared", error: err })
            }
        });
    } else {
        res.send('Unauthorized Request')
    }
})

// router
const adminRouter = require("./ulorosrfeetd/lmadtneiosojnclrr");
const userRouter = require("./ulorosrfeetd/llesoroenrurcts");
const userController = require('./tllAioronaaMnlCB/sruoretreuss');
const { log } = require("console");

//base api
app.get("/", (req, res) => {
    res.status(200).json({ status: false, message: 'Your device is forbidden' });
});

app.get("/v1/BaTalesmi", commonService.origin_middleware, async (req, res) => {
    res.json({ data: new Date().getTime() });
});

app.use("/v1/admin", commonService.APIVerify, adminRouter);
app.use("/v1/user", commonService.APIVerify, userRouter);

//export file
module.exports = app;