module.exports = function(kibana) {
	return new kibana.Plugin({
		uiExports: {
			visTypes: [
				'plugins/mep-telemetry-live/plugin'
			]
		}
	});
};
