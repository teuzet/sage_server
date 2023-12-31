module.exports = class Project extends getClass('dweller') {
	init(data) {
		this.cachedDwellers = {};
		let telegramServers = this.config.telegramServers;
		if (!telegramServers) return;
		this.telegramServers = {};
		const TelegramServer = require('./telegram/telegramServer');
		for (let telegramServerConfig of Object.values(telegramServers)) {
			this.telegramServers[telegramServerConfig.id] = new TelegramServer(this, telegramServerConfig);
		}
		// this.reloadContent();
	}

	async reloadContent() {
		let constructedContentStorage = await this.get('content.constructed');
		let contentData = await constructedContentStorage.findOne();
		this.content = assert(contentData.values.content);
	}
}



