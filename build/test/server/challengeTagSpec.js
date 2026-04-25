"use strict";
/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = require("js-yaml");
const chai_1 = require("chai");
const challenges = (0, js_yaml_1.load)(fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../data/static/challenges.yml'), 'utf8'));
const en = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../frontend/src/assets/i18n/en.json'), 'utf8'));
describe('Challenge Tags', () => {
    it('should be present in en.json', () => {
        challenges.forEach((challenge) => {
            if (challenge.tags) {
                challenge.tags.forEach((tag) => {
                    const tagKey = `TAG_${tag.toUpperCase().replace(/\s/g, '_')}`;
                    (0, chai_1.expect)(en[tagKey], `Challenge "${challenge.name}" uses unsupported tag "${tag}". Only tags listed at https://pwning.owasp-juice.shop/companion-guide/latest/part1/challenges.html#_challenge_tags may be used.`).to.not.equal(undefined);
                });
            }
        });
    });
});
//# sourceMappingURL=challengeTagSpec.js.map