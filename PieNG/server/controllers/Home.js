const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('home/index', {
    pageName: 'home',
    title: 'The Nigerian Way to Pay - Home',
    headerClass: 'header header-inverse',
    headerStyle: 'background-color: #243949;',
    navClass: 'topbar-inverse'
  })
})

router.get('/pricing', (req, res, next) => {
  return res.render('pricing', {
    pageName: 'pricing',
    title: 'Pricing',
    headerClass: 'header header-inverse',
    headerStyle: 'background-color: #c2b2cd;',
    navClass: ' topbar-inverse'
  })
})

router.get('/docs', (req, res, next) => {
  let htmlCode = `<script type="text/javascript" src="https://pie.ng/js"></script>
<form method="post" action="/your-server-side-code" id="targetForm">
  <input type="hidden" id="amount" value="500" />
  <input type="hidden" id="publicKey" value="pklv_GDX0J8puxiQk7kxH" />
  <input type="hidden" id="customer" value="demo@pie.ng" />
  <input type="hidden" id="publicKey" value="pklv_GDX0J8puxiQk7kxH" />
  <input type="hidden" id="narration" value="Payment Example" />
  <input type="hidden" id="reference" value="001" />
  <button className="pie-payment-btn" type="submit">PAY</button>
</form>`
  let cssCode = `.pie-payment-btn {
  background: #0facf3;
  border-color: #0facf3;
  color: #fff;
  ont-weight: 600;
  font-size: 11px;
  padding: 7px 26px;
  line-height: inherit;
  letter-spacing: 1.7px;
  text-transform: uppercase;
  border-radius: 2px;
  outline: none;
  -webkit-transition: 0.15s linear;
  transition: 0.15s linear;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  white-space: nowrap;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  text-decoration: none;
}`
  let jsCode = `var $form = document.querySelector("#targetForm");
var callPieNG = function(e) {
  e.preventDefault()
  Pie.setup({
		amount: document.querySelector('#amount').value,//in kobo
		customer: document.querySelector('#customer').value,
		publicKey: document.querySelector('#publicKey').value,
		commission: document.querySelector('#commission').value,
		narration: document.querySelector('#narration').value,
		reference: document.querySelector('#reference').value,
		inclusive: false,
		commissionWallet: document.querySelector('#commissionWallet').value,
		loader: function() {
			console.log("display progress for your user here");
    },
    unloader: function(){
      console.log("hide progress for your user");
    },
    callback: function(response) {
      // Function to be called when payment is completed or fails
    },
    form: $form,
  }).openIframe();
}

if($form.addEventListener) {
  $form.addEventListener('submit', callPieNG, false) // Modern browsers
} else if($form.attachEvent) {
  $form.attachEvent('onsubmit', callPieNG) // Old IE
}`
  return res.render('docs', {
    pageName: 'docs',
    title: 'Documentation',
    headerClass: 'header header-inverse',
    headerStyle: 'background-color: #c2b2cd;',
    navClass: ' topbar-inverse',
    htmlCode,
    cssCode,
    jsCode
  })
})

module.exports = router
