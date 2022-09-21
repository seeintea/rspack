const cp = require("child_process");
const log = require("./log");
const { Command } = require("commander");

const COMMANDER_VERSION = "2.20.3";

function checkCommandVersion() {
	const pkgInfo = require(require.resolve("commander/package.json"));
	if (pkgInfo.version !== COMMANDER_VERSION) {
		log.error(
			`expected the version of Commander is 2.20.3, yours is ${pkgInfo.version}`
		);
		process.exit(1);
	}
}

function createCLI() {
	checkCommandVersion();

	const cli = new Command();

	cli.description("cli to control project").version("0.1.0");

	cli
		.command("install")
		.alias("i")
		.description("install node dependencies")
		.action(() => {
			const COMMAND = "pnpm i";
			log.info(`start install deps by '${COMMAND}'`);
			cp.execSync(COMMAND, {
				stdio: "inherit"
			});
			log.info("finish install deps");
		});

	cli
		.command("test")
		.option("rust", "run all rust test")
		.option("example", "test arco pro in rust side")
		.option("js", "test all js packages")
		.action(args => {
			let command;
			switch (args) {
				case "rust":
					command = "cargo test --all -- --nocapture";
					break;
				case "js":
					command = "pnpm -r run test";
					break;
				case "example":
					command = "cargo run --example arco_pro";
					break;
				default:
					log.error("invalid args, see `./x test -h` to get more information");
			}
			if (!command) {
				return;
			}
			log.info(`start test by '${command}'`);
			cp.execSync(command, {
				stdio: "inherit"
			});
			log.info("test finished");
		});

	cli
		.command("build")
		.option("binding", "build binding between rust and js")
		.option("cli", "build @rspack/core which located in js side")
		.option("bundle", "build example directory in rust side")
		.option("webpack", "build webpack-example directory")
		.action(args => {
			let command;
			switch (args) {
				case "binding":
					command = "pnpm --filter @rspack/binding build";
					break;
				case "cli":
					command = "pnpm --filter @rspack/core... build";
					break;
				case "bundle":
					command = "cargo run --package rspack --example bundle";
					break;
				case "webpack":
					command = "cd webpack-examples && node buildAll.js && cd -";
					break;
				default:
					log.error("invalid args, see `./x build -h` to get more information");
			}
			if (!command) {
				return;
			}
			log.info(`start build by '${command}'`);
			cp.execSync(command, {
				stdio: "inherit"
			});
			log.info("build finished");
		});

	cli
		.command("format")
		.option("rs", "format rust code")
		.option("js", "format js code")
		.action(args => {
			let command;
			switch (args) {
				case "js":
					command = 'npx prettier "packages/**/*.{ts,js}" --check --write';
					break;
				case "rs":
					command = "pnpm --filter @rspack/core... build";
					break;
				default:
					log.error(
						"invalid args, see `./x format -h` to get more information"
					);
			}
			if (!command) {
				return;
			}
			log.info(`start format by '${command}'`);
			cp.execSync(command, {
				stdio: "inherit"
			});
			log.info("format finished");
		});

	cli
		.command("lint")
		.option("js", "lint js code")
		.option("rs", "lint rust code")
		.action(args => {
			let command;
			switch (args) {
				case "js":
					command = 'npx prettier "packages/**/*.{ts,js}" --check';
					break;
				case "rs":
					command = "cargo clippy --all -- --deny warnings";
					break;
				default:
					log.error(
						"invalid args, see `./x format -h` to get more information"
					);
			}
			if (!command) {
				return;
			}
			log.info(`start format by '${command}'`);
			cp.execSync(command, {
				stdio: "inherit"
			});
			log.info("format finished");
		});

	return cli;
}

module.exports = { createCLI };