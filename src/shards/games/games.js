module.exports = class extends getClass('storage/storage') {

	cmd_newGame(data) {
		return this.newGame(data);
	}

	async newGame(data) {
		let modelId = data.modelId;
		let cityName = data.cityName;

		let contentStorage = await this.project.get('content.constructed');
		let contentResponse = await contentStorage.findOne({ id: 'latest' });
		let content = contentResponse.values.content;
		let gameModel = assert(content.models[modelId], `No game model with id '${modelId}'`);

		let year = gameModel.startingYear;
		let season = 0;

		return this.createModel({
			values: {
				cityName,
				year,
				season,
				modelId,
			},
		})
	}

}