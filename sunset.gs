function getColorFromPNG(url, x, y) {
  var response = UrlFetchApp.fetch(url);
  var reader = new pngjs.PNGReader(response.getContent());
  var png = reader.parse(function(err, png){
	if (err) throw err;
    return png;
  });

  var color = png.getPixel(x,y)
  return color
}

function getWarmthScore(color) {
  var r = color[0];
  var g = color[1];
  var b = color[2];
  var warmth = (r + g) / (r + g + b);
  return warmth;
}

function sendEmailWithImage(url,x,y,warmth,recipient) {
  var imageUrl = url;
  var response = UrlFetchApp.fetch(imageUrl);
  var imageBlob = response.getBlob();
  
  var recipient = recipient;
  var subject = 'Nice Sunset in NYC Tonight!';
  var body = "The color warmth at location (" + x + "," + y + ") in the image at " + url + " is " + warmth.toFixed(4) + ".";
  
  var options = {
    htmlBody: body + '<br><img src="cid:imageId">',
    inlineImages: {
      imageId: imageBlob
    }
  };
  
  MailApp.sendEmail(recipient, subject, '', options);
}


function sendEmailIfWarmthIsHigh(url, x, y, recipient) {
  var color = getColorFromPNG(url, x, y);
  var warmth = getWarmthScore(color);

  if (warmth > 0.75) {
    sendEmailWithImage(url,x,y,warmth, recipient)
    console.log('HIT')
    console.log(warmth)
  }else {
    console.log('MISS!')
    console.log(warmth)
  }
}

function checkSunset() {
  sendEmailIfWarmthIsHigh( 'https://sunsetwx.com/sunset/sunset_et.png', 1155,  460, 'EMAIL') // NYC
  // sendEmailIfWarmthIsHigh( 'https://sunsetwx.com/sunset/sunset_et.png', 1175, 500, 'EMAIL') // Test 
}
