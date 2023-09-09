process.chdir('./src/');
const YAML = require('yaml');
const fs = require('fs');

require('./core/util/util');
require('./core/env');

global._classes = {};
global.getClass = function(path) {
	return require(`./${path}`);
}

getClass('dweller')

function parseConfig(configPath) {
	const configYaml = fs.readFileSync(configPath, 'utf8');
	const config = YAML.parse(configYaml);
	return config;
}

function getModuleConfig(modulePath) {
	env.log(modulePath);
	let config = parseConfig(`./${modulePath}/_config.yaml`);
	config.moduleName = modulePath;
	assert(config, `No config found for module at ${modulePath}`);
	return config;
}

function loadModule(moduleConfig, modulePath) { // TODO: only path
	if (modulePath) { // Если не рутовый модуль. Поправлю потом
		if (env.loadedModules[modulePath]) return; // Не загружаем модули дважды
		env.loadedModules[modulePath] = {
			tests: []
		};
	}
	env.log(`Loading module '${modulePath}'...`)
	if (moduleConfig.requiredModules) {
		for (let requiredModulePath of Object.keys(moduleConfig.requiredModules)) {
			requiredModuleConfig = getModuleConfig(requiredModulePath);
			loadModule(requiredModuleConfig, requiredModulePath);
		}
	}
	objmerge(env.config, moduleConfig);
}

const loadedConfigs = {};
function loadConfig(modulePath) {
	if (loadedConfigs[modulePath]) return loadedConfigs[modulePath]; // Не загружаем модули дважды
	env.log(`Loading config for module '${modulePath}'...`)
	let configPath = `${modulePath}/config.yaml`;
	let out = parseConfig(configPath);
	let requiredModules = out.requiredModules;
	if (requiredModules) {
		for (let requiredModulePath of Object.keys(requiredModules)) {
			requiredModuleConfig = loadConfig(requiredModulePath);
			objmerge(out, requiredModuleConfig)
		}
	}
	loadedConfigs[modulePath] = out;
	return out;
}

function createCore() {
	let coreClass = getClass('dweller');
	let core = new coreClass({ id: 'core', config });
	core.core = core;
	return core
}

let config = loadConfig('.');
env.log(config);
let core = createCore();
let httpServer = core.get('httpServer');
httpServer.run();