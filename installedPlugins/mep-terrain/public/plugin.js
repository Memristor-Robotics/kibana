define(function(require) {
	require('plugins/mep-terrain/style.css');

    const App = require('plugins/mep-terrain/js/App.js');
    let telemetry = require('plugins/mep-telemetry-live/js/Telemetry.js').get();

    // Create an Angular module for this plugin
	var module = require('ui/modules').get('skeleton');
	module.controller('MepTerrainController', function($scope, $element) {
		let canvas = $element.find('#mep-terrain-canvas').get(0);
		new App(telemetry, canvas, {
            backgroundImageUrl: '/bundles/installedPlugins/mep2-simulator/public/images/terrain.png'
        })
	});

	function PluginProvider(Private) {
		var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));

		// Your configs go here
		return new TemplateVisType({
			name: 'mep-terrain',
			title: 'Terrain',
			icon: 'fa-map',
			description: 'Visualise state on terrain',
			requiresSearch: false,
			template: require('plugins/mep-terrain/plugin.html')
		});
	}
	require('ui/registry/vis_types').register(PluginProvider);
	return PluginProvider;
});
