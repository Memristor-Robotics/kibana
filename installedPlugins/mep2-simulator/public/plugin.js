define(function(require) {
	require('plugins/mep2-simulator/style.css');
    const App = require('plugins/mep2-simulator/js/App.js');
    let telemetry = require('plugins/mep2-telemetry-live/js/Telemetry.js').get();

	// Create an Angular module for this plugin
	var module = require('ui/modules').get('mep2-simulator');
	module.controller('MEP2-SimulatorController', function($scope, $element) {
        new App(telemetry, $element.find('#simulator').get(0), {
            backgroundImageUrl: '/bundles/installedPlugins/mep2-simulator/public/images/terrain.png'
        });
	});

	function PluginProvider(Private) {
		var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));

		// Your configs go here
		return new TemplateVisType({
			name: 'mep2-simulator',
			title: 'Simulator',
			icon: 'fa-television',
			description: 'Simulator for Memristor\'s Eurobot Simulator',
			requiresSearch: false,
			template: require('plugins/mep2-simulator/plugin.html')
		}); 
	}
	require('ui/registry/vis_types').register(PluginProvider);
	return PluginProvider;

});
