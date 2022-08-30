"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lowdb_1 = require("lowdb");
const adapter = new lowdb_1.JSONFileSync('./db.json');
const db = new lowdb_1.LowSync(adapter);
db.read();
if (db.data == null) {
    db.data = {
        commandLog: {},
        fuckTemplate: {},
        userDB: {},
    };
}
db.write();
exports.default = db;
