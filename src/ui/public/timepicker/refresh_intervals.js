define(function (require) {
  let module = require('ui/modules').get('kibana');

  module.constant('refreshIntervals', [
    { value : 0, display: 'Off', section: 0},

	{ value : 1000, display: '1 second', section: 1},
    { value : 5000, display: '5 seconds', section: 1},
    { value : 10000, display: '10 seconds', section: 1},
    { value : 30000, display: '30 seconds', section: 1},
    { value : 45000, display: '45 seconds', section: 1}
  ]);

});
