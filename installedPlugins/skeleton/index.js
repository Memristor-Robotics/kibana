module.exports = function(kibana) {
	return new kibana.Plugin({
		uiExports: {
			visTypes: [
				'plugins/skeleton/plugin'
			]
		}
	});
};
