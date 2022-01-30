"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var Block = /** @class */ (function () {
    function Block(prevHash, transaction) {
        this.nonce = Math.round(Math.random() * 999999999);
        this.timestamps = Date.now();
        this.prevHash = prevHash;
        this.transaction = transaction;
        this.hash = this.getHash();
    }
    // hash block's content
    Block.prototype.getHash = function () {
        // convert object to a JSON string for hashing
        var blockData = [this.prevHash, this.transaction, this.timestamps];
        var str = JSON.stringify(blockData);
        // hash block
        var hasher = crypto.createHash("SHA256");
        hasher.update(str).end();
        return hasher.digest("hex");
    };
    // proof of work
    // find a number that, when added to the block's nonce
    // produces a hash that starts with a certain amount of 0
    Block.prototype.mine = function (difficulty) {
        console.log("⛏ mining...");
        while (true) {
            var hasher = crypto.createHash("MD5"); // use MD5 because 128 bits hence faster to compute than SHA256
            hasher.update((this.nonce).toString()).end();
            var attempt = hasher.digest("hex");
            var substToMatch = new Array(difficulty).fill(0).join("");
            // return solution if found
            if (attempt.substr(0, difficulty) === substToMatch) {
                console.log("Block mined: ".concat(this.hash));
                return;
            }
            // else, try another solution
            this.nonce++;
        }
    };
    return Block;
}());
exports.default = Block;
