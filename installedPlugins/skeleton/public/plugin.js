define(function(require) {
	// Put you css files here
	require('plugins/skeleton/style.css');

	// Create an Angular module for this plugin
	var module = require('ui/modules').get('skeleton');
	module.controller('SkeletonController', function($scope) {
		// $scope.time = Date.now();
	});


	
	function PluginProvider(Private) {
		var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));

		// Your configs go here
		return new TemplateVisType({
			name: 'skeletonId',
			title: 'Skeleton',
			icon: 'fa-code',
			description: 'If you are developing a new plugin please check this source',
			requiresSearch: false,
			template: require('plugins/skeleton/plugin.html'),
			params: {
				editor: require('plugins/skeleton/editor.html'),
				defaults: {
					foo: 'Default value'
				}
			}
		});
	}
	require('ui/registry/vis_types').register(PluginProvider);
	return PluginProvider;

});
