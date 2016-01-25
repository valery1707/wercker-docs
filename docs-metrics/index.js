
// init keen
window.client = new window.Keen({
  projectId: '54d09b5359949a5f26b75fa4',
  writeKey: '25ca6a1eefdd4b3541ab7a6600153dc901a1eb0b6f2eba36a15a69acb2e12fad948e78312de7555a7f6a9ff718a0d129d2c3dd5223d09710f4fde015951a5e58e4f9c55e4d49d1bedfc973d4a2f4c82682a9c0ecf884bb841e400c47f58bb0f0677293f38d1192ff1852b37db9f1e052',
  readKey: 'anything' // not used; not needed for data collection
});

/**
 * Setup buttons  */

var signupNavSub = document.querySelector('#signup-nav-sub');
var signupFooter = document.querySelector('#signup-footer');
var signupFooterGh = document.querySelector('#signup-footer-gh');

signupNavSub.onclick = trackSignupClick;
signupFooter.onclick = trackSignupClick;
signupFooterGh.onclick = trackSignupClick;

/**
 * Newsletter
 */

var newsletterJoin = document.querySelector('#newsletter-join');
newsletterJoin.onclick = trackCorporateClick;

/**
 * Start homepage
 */

var startLearn = document.querySelector('#start-learn');
var startQuickstarts = document.querySelector('#start-quickstarts');
var startDocs = document.querySelector('#start-docs');
var startCli = document.querySelector('#start-cli');

startLearn.onclick = trackCorporateClick;
startQuickstarts.onclick = trackCorporateClick;
startDocs.onclick = trackCorporateClick;
startCli.onclick = trackCorporateClick;

/**
 * Quickstarts language links
 */

var quickstartLinkGolang = document.querySelector('#quickstart-link-golang');
var quickstartLinkJavascript = document.querySelector('#quickstart-link-javascript');
var quickstartLinkRuby = document.querySelector('#quickstart-link-ruby');
var quickstartLinkPython = document.querySelector('#quickstart-link-python');

quickstartLinkGolang.onclick = trackCorporateClick;
quickstartLinkJavascript.onclick = trackCorporateClick;
quickstartLinkRuby.onclick = trackCorporateClick;
quickstartLinkPython.onclick = trackCorporateClick;


/**
 * Sign up clicks on sub pages
 */
function trackSignupClick (e) {
  var buttonId = e.currentTarget.getAttribute('id');
  var pageId = document.querySelector('body').getAttribute('id');
  return window.client.trackExternalLink(e, 'signup_click', {id: buttonId, page: pageId});
}

/**
 * External link clicks
 */
function trackCorporateClick (e) {
  var buttonId = e.currentTarget.getAttribute('id');
  var pageId = document.querySelector('body').getAttribute('id');
  console.log(buttonId, pageId);
  return window.client.trackExternalLink(e, 'corporate_click', {id: buttonId, page: pageId});
}
