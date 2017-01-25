/************************ REDIRECT CODE ***********************/
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    return detectRedirect(details);
}, {
    urls : ["<all_urls>"],
    types: ["main_frame","sub_frame"]
}, ["blocking"]);


function detectRedirect(details) {
    var url = details.url;

    if (url == null) {
        return;
    }

    var https = "https://";
    var amazonurl = "www.amazon.de";
    // ignore links with these strings in them
    var filter = "(sa-no-redirect=)"
               + "|(redirect=true)"
               + "|(redirect.html)"
               + "|(r.html)"
               + "|(f.html)"
               + "|(/gp/dmusic/cloudplayer)"
               + "|(/gp/photos)"
               + "|(/gp/wishlist)"
               + "|(/ap/)"
               + "|(aws.amazon.com)"
               + "|(read.amazon.com)"
               + "|(login.amazon.com)"
               + "|(payments.amazon.com)"
               + "|(amazon.com/clouddrive)"
               + "|(http://)"; //all Amazon pages now redirect to HTTPS, also fixes conflict with HTTPS Everywhere extension

    // Don't try and redirect pages that are in our filter
    if (url.match(filter) != null) {
        return;
    }

    return redirectToSmile(https, amazonurl, url);
}

function redirectToSmile(scheme, amazonurl, url) {
    var smileurl = "smile.amazon.de";
    return {
        // redirect to amazon smile append the rest of the url
        redirectUrl : scheme + smileurl + getRelativeRedirectUrl(amazonurl, url)
    };
}

function getRelativeRedirectUrl(amazonurl, url) {
    var relativeUrl = url.split(amazonurl)[1];
    var noRedirectIndicator = "sa-no-redirect=1";
    var paramStart = "?";
    var paramStartRegex = "\\" + paramStart;
    var newurl = null;

    // check to see if there are already GET variables in the url
    if (relativeUrl.match(paramStartRegex) != null) {
        newurl = relativeUrl + "&" + noRedirectIndicator;
    } else {
        newurl = relativeUrl + paramStart + noRedirectIndicator;
    }
    return newurl;
}
