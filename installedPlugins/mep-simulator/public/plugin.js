define(function(require) {
	require('plugins/mep-simulator/style.css');
    const App = require('plugins/mep-simulator/js/App.js');
    let telemetry = require('plugins/mep-telemetry-live/js/Telemetry.js').get();

	// Create an Angular module for this plugin
	var module = require('ui/modules').get('mep-simulator');
	module.controller('MepSimulatorController', function($scope, $element) {
        new App(telemetry, $element.find('#mep-simulator').get(0), {
            backgroundImageUrl: '/bundles/installedPlugins/mep-simulator/public/images/terrain.png'
        });
	});

	function PluginProvider(Private) {
		var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));

		// Your configs go here
		return new TemplateVisType({
			name: 'mep-simulator',
			title: 'Simulator',
			icon: 'fa-television',
			description: 'Simulator for Memristor\'s Eurobot Simulator',
			requiresSearch: false,
			template: require('plugins/mep-simulator/plugin.html')
		});
	}
	require('ui/registry/vis_types').register(PluginProvider);
	return PluginProvider;

});
