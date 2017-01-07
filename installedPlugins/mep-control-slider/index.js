module.exports = function(kibana) {
	return new kibana.Plugin({
		uiExports: {
			visTypes: [
				'plugins/mep-control-slider/plugin'
			]
		}
	});
};
