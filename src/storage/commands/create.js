module.exports = class extends getClass('api/command') {
	run({ model }) {
		let storage = this.parent;
		return storage.insert(model);
	}
}
