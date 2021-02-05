import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import { uglify } from "rollup-plugin-uglify";

const packageJson = require("./package.json");

export default {
    input: "./index.ts",
    output: {
        file: packageJson.main,
        format: "cjs",
        exports: "named",
        sourcemap: process.env.NODE_ENV === "development",
    },
    plugins: [
        resolve(),
        peerDepsExternal(),
        commonjs({
            include: ["node_modules/**"],
            extensions: [".js", ".ts"],
        }),
        typescript({ tsconfig: "build.tsconfig.json" }),
        postcss(),
        process.env.NODE_ENV === "production" && uglify(),
    ],
    external: ["draftjs-conductor", "draft-js"],
};
