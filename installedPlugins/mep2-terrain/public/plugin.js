define(function(require) {
	require('plugins/mep2-terrain/style.css');

    const App = require('plugins/mep2-terrain/js/App.js');
    let telemetry = require('plugins/mep2-telemetry-live/js/Telemetry.js').get();

    // Create an Angular module for this plugin
	var module = require('ui/modules').get('skeleton');
	module.controller('MEP2-TerrainController', function($scope, $element) {
		let canvas = $element.find('#terrain-canvas').get(0);
		new App(telemetry, canvas, {
            backgroundImageUrl: '/bundles/installedPlugins/mep2-simulator/public/images/terrain.png'
        });
	});

	function PluginProvider(Private) {
		var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));

		// Your configs go here
		return new TemplateVisType({
			name: 'mep2-terrain',
			title: 'Terrain',
			icon: 'fa-map',
			description: 'Visualise state on terrain',
			requiresSearch: false,
			template: require('plugins/mep2-terrain/plugin.html')
		});
	}
	require('ui/registry/vis_types').register(PluginProvider);
	return PluginProvider;
});
