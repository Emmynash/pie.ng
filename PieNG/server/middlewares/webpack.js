import Helmet from 'react-helmet'
import config from '../config/config.server'
const helmet = Helmet.rewind()

export default (req, res) => {
	let appContext = req.path.split('/')[1],
			apps = ['payment', 'dashboard']
	appContext = (apps.indexOf(appContext) > -1) ? appContext : 'landing'
	if(config.env === 'development') {
		res.send(
`<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
	<head>
		<meta charset="utf-8" />
  	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui" />
		${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
	</head>
	<body class="fixed-left" style="overflow: visible;">
		<noscript>
      <div class="no-js-view">
        <div class="position">
          <div class="icon"></div>
          <div class="well">
            <h1>No love for Javascript?</h1>
            <p>${config.appName} requires your browser to have Javascript enabled. <a href="http://enable-javascript.com" target="_blank" class="arrow">Learn more</a></p>
          </div>
          <div class="footer">
            <p>&copy; ${config.appName}</p>
          </div>
        </div>
      </div>
    </noscript>
		<div id='wrapper'></div>
		<script type="text/javascript" src="http://flw-pms-dev.eu-west-1.elasticbeanstalk.com/flwv3-pug/getpaidx/api/flwpbf-inline.js"></script>
		<script src='/${appContext}.bundle.js'></script>
	</body>
</html>`)
	} else if(config.env === 'production') {
		res.send(
`<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui" />
		${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
		<link rel='stylesheet' href='/${appContext}.bundle.css'>
	</head>
	<body class="fixed-left" style="overflow: visible;">
		<noscript>
	    <div class="no-js-view">
	      <div class="position">
	        <div class="icon"></div>
	        <div class="well">
	          <h1>No love for Javascript?</h1>
	          <p>${config.appName} requires your browser to have Javascript enabled. <a href="http://enable-javascript.com" target="_blank" class="arrow">Learn more</a></p>
	        </div>
	        <div class="footer">
	          <p>&copy; ${config.appName}</p>
	        </div>
	      </div>
	    </div>
	  </noscript>
		<div id='wrapper'></div>
		<script type="text/javascript" src="https://api.ravepay.co/flwv3-pug/getpaidx/api/flwpbf-inline.js"></script>
		<script src="/${appContext}.bundle.js"></script>
	</body>
</html>`)
	}
}
