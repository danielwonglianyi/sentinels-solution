"use strict";
/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HintModelInit = exports.HintModel = void 0;
const sequelize_1 = require("sequelize");
/* jslint node: true */
class Hint extends sequelize_1.Model {
}
exports.HintModel = Hint;
const HintModelInit = (sequelize) => {
    Hint.init({
        ChallengeId: {
            type: sequelize_1.DataTypes.INTEGER
        },
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: sequelize_1.DataTypes.STRING
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            validate: {
                isInt: true,
                min: 1
            }
        },
        unlocked: sequelize_1.DataTypes.BOOLEAN
    }, {
        tableName: 'Hints',
        sequelize
    });
};
exports.HintModelInit = HintModelInit;
//# sourceMappingURL=hint.js.map