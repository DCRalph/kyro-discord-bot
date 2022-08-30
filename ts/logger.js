"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const log = console.log;
const red = chalk_1.default.red;
const green = chalk_1.default.green;
const yellow = chalk_1.default.yellow;
const blue = chalk_1.default.blue;
const magenta = chalk_1.default.magenta;
const cyan = chalk_1.default.cyan;
const white = chalk_1.default.white;
exports.default = {
    c: {
        red,
        green,
        yellow,
        blue,
        magenta,
        cyan,
        white,
    },
    log: log,
    error: (...args) => log(red(...args)),
    warning: (...args) => log(yellow(...args)),
    info: (...args) => log(blue(...args)),
    success: (...args) => log(green(...args)),
    debug: (...args) => log(magenta(...args)),
};
