define(function(require) {
	// Put you css files here
	require('plugins/mep-telemetry-live/style.css');
    const App = require('plugins/mep-telemetry-live/js/App.js');

	// Create an Angular module for this plugin
	var module = require('ui/modules').get('mep-telemetry-live');
	module.controller('MepTelemetryLiveController', function($scope, $element) {
        new App({
            status: $element.find('#mep-telemetry-status').get(0),
            host: $element.find('#mep-telemetry-host').get(0),
            connect: $element.find('#mep-telemetry-connect').get(0)
        });
	});

	function PluginProvider(Private) {
		var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));

		// Your configs go here
		return new TemplateVisType({
			name: 'mep-telemetry-live',
			title: 'Telemetry Live',
			icon: 'fa-plug',
			description: 'Connection parameters for Memristor\'s Kibana plugins which use custom server',
			requiresSearch: false,
			template: require('plugins/mep-telemetry-live/plugin.html')
		});
	}
	require('ui/registry/vis_types').register(PluginProvider);
	return PluginProvider;

});
