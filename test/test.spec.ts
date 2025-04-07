import assert from "node:assert"
import fs from "node:fs"
import path from "node:path"
import { type Stats, rspack } from "@rspack/core"
import ReactRefreshPlugin, { type PluginOptions } from "@rspack/plugin-react-refresh"

type Outputs = {
	reactRefresh: string,
	fixture: string,
	runtime: string,
	vendor: string
}

type CompilationCallback = (error: Error | null, stats: Stats | undefined, outputs: Outputs) => void

const uniqueName = "ReactRefreshLibrary";

const compileWithReactRefresh = (fixturePath: string, refreshOptions: PluginOptions, callback: CompilationCallback) => {
	let dist = path.join(fixturePath, "dist");
	rspack(
		{
			mode: "development",
			context: fixturePath,
			entry: {
				fixture: path.join(fixturePath, "index.js")
			},
			output: {
				path: dist,
				uniqueName
			},
			plugins: [new ReactRefreshPlugin(refreshOptions)],
			optimization: {
				runtimeChunk: {
					name: "runtime"
				},
				splitChunks: {
					cacheGroups: {
						reactRefresh: {
							test: /[\\/](react-refresh|rspack-plugin-react-refresh\/client|react-refresh-webpack-plugin)[\\/]/,
							name: "react-refresh",
							chunks: "all",
							priority: -1000
						},
						foo: {
							test: /[\\/]node_modules[\\/]foo/,
							name: "vendor",
							chunks: "all",
							priority: -500,
							enforce: true
						}
					}
				}
			}
		},
		(error, stats) => {
			expect(error).toBeFalsy();
			assert(stats, "stats is not defined");
			const statsJson = stats.toJson({ all: true });
			expect(statsJson.errors).toHaveLength(0);
			expect(statsJson.warnings).toHaveLength(0);
			callback(error, stats, {
				reactRefresh: fs.readFileSync(
					path.join(fixturePath, "dist", "react-refresh.js"),
					"utf-8"
				),
				fixture: fs.readFileSync(
					path.join(fixturePath, "dist", "fixture.js"),
					"utf-8"
				),
				runtime: fs.readFileSync(
					path.join(fixturePath, "dist", "runtime.js"),
					"utf-8"
				),
				vendor: fs.readFileSync(
					path.join(fixturePath, "dist", "vendor.js"),
					"utf-8"
				)
			});
		}
	);
};

describe("react-refresh-rspack-plugin", () => {
	it("should exclude node_modules when compiling with default options", done => {
		compileWithReactRefresh(
			path.join(__dirname, "fixtures/default"),
			{},
			(_, __, { reactRefresh, fixture, runtime, vendor }) => {
				expect(vendor).not.toContain("function $RefreshReg$");
				done();
			}
		);
	});

	it("should include non node_modules when compiling with default options", done => {
		compileWithReactRefresh(
			path.join(__dirname, "fixtures/default"),
			{},
			(_, __, {  fixture }) => {
				expect(fixture).toContain("function $RefreshReg$");
				done();
			}
		);
	});

	it("should add library to make sure work in Micro-Frontend", done => {
		compileWithReactRefresh(
			path.join(__dirname, "fixtures/default"),
			{},
			(_, __, { reactRefresh }) => {
				expect(reactRefresh).toContain(uniqueName);
				done();
			}
		);
	});

	it("should include selected file when compiling", done => {
		compileWithReactRefresh(
			path.join(__dirname, "fixtures/custom"),
			{
				exclude: null,
				include: path.join(__dirname, "fixtures/node_modules/foo")
			},
			(_, __, { vendor }) => {
				expect(vendor).toContain("function $RefreshReg$");
				done();
			}
		);
	});

	it("should exclude selected file when compiling", done => {
		compileWithReactRefresh(
			path.join(__dirname, "fixtures/custom"),
			{
				exclude: path.join(__dirname, "fixtures/custom/index.js")
			},
			(_, __, { reactRefresh, fixture, runtime, vendor }) => {
				expect(fixture).not.toContain("function $RefreshReg$");
				done();
			}
		);
	});

	it("should allow custom inject loader when compiling", done => {
		expect(ReactRefreshPlugin.loader).toBe("builtin:react-refresh-loader");
		compileWithReactRefresh(
			path.join(__dirname, "fixtures/custom"),
			{
				injectLoader: false,
			},
			(_, __, { reactRefresh, fixture, runtime, vendor }) => {
				expect(fixture).not.toContain("function $RefreshReg$");
				done();
			}
		);
	});

	it("should allow custom inject entry when compiling", done => {
		compileWithReactRefresh(
			path.join(__dirname, "fixtures/custom"),
			{
				injectEntry: false,
			},
			(_, __, { reactRefresh, fixture, runtime, vendor }) => {
				expect(reactRefresh).not.toContain("RefreshRuntime.injectIntoGlobalHook(safeThis)");
				done();
			}
		);
	});

	it("should always exclude react-refresh related modules", done => {
		compileWithReactRefresh(
			path.join(__dirname, "fixtures/custom"),
			{
				exclude: null
			},
			(_, __, { reactRefresh, fixture, runtime, vendor }) => {
				expect(reactRefresh).not.toContain("function $RefreshReg$");
				done();
			}
		);
	});

	it("should include entries for webpack-hot-middleware", done => {
		compileWithReactRefresh(
			path.join(__dirname, "fixtures/custom"),
			{
				overlay: {
					sockIntegration: 'whm'
				}
			},
			(_, __, { fixture }) => {
				expect(fixture).toContain("webpack-hot-middleware/client");
				expect(fixture).toContain("WHMEventSource.js");
				done();
			}
		);
	});
});
