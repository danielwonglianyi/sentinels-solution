"use strict";
/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityQuestion = void 0;
const securityAnswer_1 = require("../models/securityAnswer");
const user_1 = require("../models/user");
const securityQuestion_1 = require("../models/securityQuestion");
function securityQuestion() {
    return async ({ query }, res, next) => {
        const email = query.email;
        try {
            const answer = await securityAnswer_1.SecurityAnswerModel.findOne({
                include: [{
                        model: user_1.UserModel,
                        where: { email: email?.toString() }
                    }]
            });
            if (answer != null) {
                const question = await securityQuestion_1.SecurityQuestionModel.findByPk(answer.SecurityQuestionId);
                res.json({ question });
            }
            else {
                res.json({});
            }
        }
        catch (error) {
            next(error);
        }
    };
}
exports.securityQuestion = securityQuestion;
//# sourceMappingURL=securityQuestion.js.map