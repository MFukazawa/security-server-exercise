const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const winston = require('winston')
// const morgan = require('morgan')

const bodyParser = require('body-parser');
const app = express()
app.use(cors(corsOptions))
app.use(helmet())
app.use(bodyParser.json())

var whitelist = ['http://127.0.0.1:5500/index.html', 'http://example2.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// app.use(morgan('tiny'))
// POST /secret 200 9 - 2.548 ms

// app.use(morgan('combined'))
// ::1 - - [09/Jun/2021:03:41:18 +0000] "POST /secret HTTP/1.1" 200 9
// "http://127.0.0.1:5500/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
// AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36"

const files = new winston.transports.File({ filename: 'combined.log' });
winston.add(files);

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   defaultMeta: { service: 'user-service' },
//   transports: [
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'combined.log '})
//   ]
// })

// logger.add(new winston.transports.Console({
//   format: winston.format.simple()
// }))



app.get('/', (req, res) => {
  res.cookie('session', '1', { httpOnly: true })
  res.cookie('session', '1', { secure: true })
  res.set({
    'Content-Security-Policy': "script-src 'self' 'https://apis.google.com'"
  })
  res.send('Hello World!')
})

app.post('/secret', (req, res) => {
  const { userInput } = req.body;
  console.log(userInput);
  if (userInput) {
    winston.log('info', 'user input: ' + userInput);
    res.status(200).json('success');
  } else {
    winston.error('This guy is messing with us:' + userInput);
    res.status(400).json('incorrect submission')
  }
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))