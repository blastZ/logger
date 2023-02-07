import { $ } from "zx";

await $`cd ..`.quiet();

await $`rm -rf ./output`.quiet();

await $`rollup --config ./rollup.config.js`;

await $`cp ./package.json README.md ./output`.quiet();

await $`printf "{\n  \\"type\\": \\"commonjs\\"\n}\n" > ./output/cjs/package.json`.quiet();
