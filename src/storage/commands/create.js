module.exports = class extends getClass('api/command') {
	run(params) {
		return `storage.create run: ${params}`;
	}
}
