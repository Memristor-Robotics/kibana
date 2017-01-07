define(function(require) {
	// Put you css files here
	require('plugins/mep-skeleton/style.css');

	// Create an Angular module for this plugin
	var module = require('ui/modules').get('mep-skeleton');
	module.controller('MepSkeletonController', function($scope) {
		  $scope.foo = $scope.vis.params.foo;
	});

	function PluginProvider(Private) {
		var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));

		// Your configs go here
		return new TemplateVisType({
			name: 'mep-skeleton',
			title: 'Skeleton',
			icon: 'fa-code',
			description: 'If you are developing a new plugin please check this source',
			requiresSearch: false,
			template: require('plugins/mep-skeleton/plugin.html'),
			params: {
				editor: require('plugins/mep-skeleton/editor.html'),
				defaults: {
					foo: 'Default value'
				}
			}
		});
	}
	require('ui/registry/vis_types').register(PluginProvider);
	return PluginProvider;

});
