define(function(require) {
	// Put you css files here
	require('plugins/mep-control-slider/style.css');
  let telemetry = require('plugins/mep-telemetry-live/js/Telemetry.js').get();


	// Create an Angular module for this plugin
	var module = require('ui/modules').get('mep-control-slider');
	module.controller('MepControlSliderController', function($scope, $element) {
      let tag = $scope.vis.params.tag;
      let action = $scope.vis.params.action;
      let robot = $scope.vis.params.robot;
      let sliderNode = $element.find('#mep-control-slider').get(0);
      let max = $scope.vis.params.max;
      let min = $scope.vis.params.min;
      let stickable = !isNaN($scope.vis.params.stick);
      let stickValue = parseInt($scope.vis.params.stick);

      sliderNode.min = min;
      sliderNode.max = max;
      sliderNode.addEventListener('change', () => {
        $scope.vis.params.value = sliderNode.value;
        telemetry.send(
          'dash:' + robot,
          'core:' + robot,
          tag,
          action,
          { value: parseInt(sliderNode.value) }
        );

        if (stickable === true) {
          sliderNode.value = stickValue;
        }
      });
	});

	function PluginProvider(Private) {
		var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));

		// Your configs go here
		return new TemplateVisType({
			name: 'mep-control-slider',
			title: 'Control Slider',
			icon: 'fa-gamepad',
			description: 'Control a robot as simple as sliding a slider',
			requiresSearch: false,
			template: require('plugins/mep-control-slider/plugin.html'),
			params: {
				editor: require('plugins/mep-control-slider/editor.html'),
				defaults: {
          robot: 'big',
					tag: 'MotionDriverController',
          action: 'moveToPositionX',
          max: 100,
          min: 0,
          stick: 'None'
				}
			}
		});
	}
	require('ui/registry/vis_types').register(PluginProvider);
	return PluginProvider;
});
