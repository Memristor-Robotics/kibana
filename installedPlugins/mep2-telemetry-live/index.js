module.exports = function(kibana) {
	return new kibana.Plugin({
		uiExports: {
			visTypes: [
				'plugins/mep2-telemetry-live/plugin'
			]
		}
	});
};
