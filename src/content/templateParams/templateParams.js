module.exports = class extends getClass('storage/storage') {

	createModel(model) {
		model.values.templateId = this.parent.id;
		return super.createModel(model);
	}

	providerCall(method, query = {}, ...params) {
		query['values.templateId'] = this.parent.id;
		return super.providerCall(method, query, ...params);
	}

}
