'use strict';

var source = new window.EventSource('http://gilles.local:3001/stream');

source.onmessage = function(e) {
  parseMessage(e);
};

function parseMessage(e) {
  printLn('data: ' + e.data);

  var data = JSON.parse(e.data);

  // check for data type
  switch(data.device) {
    case 'scale':
      parseScaleValues(data);
      break;
    case 'light_sensor':
      parseLightValues(data);
      break;
    case 'temp_sensor':
      parseTemperatureValues(data);
  }

}

function parseScaleValues(data) {

  var weight = data.weight;

  // convert to percentage, change milk values
  var pct = weight / 10;

  updateMilk(pct);
}

function parseLightValues(data) {

  var lum = data.luminosity;

  // fridge is closed
  if (lum > 100)
    $('.fridge')
      .removeClass('closed');
  else
    $('.fridge')
      .addClass('closed');
}

function parseTemperatureValues(data) {
  var temp = data.temperature;

  // fridge is closed
  if (temp > 10)
    $('.fridge')
      .addClass('hot');
  else
    $('.fridge')
      .removeClass('hot');

  $('.temperature')
    .html(temp + '°C');
}

// Print a message to the debug console
function printLn(msg) {
  console.log(msg);

  var dbg = document.getElementById('debug');
  dbg.innerHTML += msg + '<br>';
  dbg.scrollTop = dbg.scrollHeight;
}

function updateMilk(val) {

  var bottle = $('.milk__bottle');
  var milk   = $('.milk__bottle .the-milk');
  var pct    = $('.milk__bottle .percentage');

  var expressions = ['zero', 'twenty', 'forty', 'sixty', 'eighty', 'one-hundred'];
  var expression  = '';

  var visualVal = val;

  // negate values > 85%
  if (val > 85)
    visualVal = 85;

  // calculate the percentage bracket for milk expressions

  if (val > 0) // 0 - 20
    expression = 'twenty';

  if (val > 20) // 20 - 40
    expression = 'forty';

  if (val > 40) // 40 - 60
    expression = 'sixty';

  if (val > 60) // 60 - 80
    expression = 'eighty';

  if (val > 80) // 80 - 100
    expression = 'one-hundred';

  // update the milk
  milk.css('height', visualVal + '%');

  // update percentage value
  pct.html(Math.round(val) + '%');

  // update expression
  bottle.removeClass(expressions.join(' '));
  bottle.addClass(expression);
}