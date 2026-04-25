"use strict";
/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageList = void 0;
const locales_json_1 = __importDefault(require("../data/static/locales.json"));
const promises_1 = require("node:fs/promises");
const logger_1 = __importDefault(require("../lib/logger"));
const utils = __importStar(require("../lib/utils"));
function getLanguageList() {
    return async (req, res, next) => {
        try {
            const languages = [];
            const enContentStr = await (0, promises_1.readFile)('frontend/dist/frontend/assets/i18n/en.json', 'utf-8');
            const enContent = JSON.parse(enContentStr);
            let backendEnContent = null;
            try {
                const backendEnContentStr = await (0, promises_1.readFile)('i18n/en.json', 'utf-8');
                backendEnContent = JSON.parse(backendEnContentStr);
            }
            catch (e) {
                logger_1.default.warn('Backend translations not available, will use frontend-only percentages: ' + utils.getErrorMessage(e));
            }
            const languageFiles = await (0, promises_1.readdir)('frontend/dist/frontend/assets/i18n/');
            const languagePromises = languageFiles.map(async (fileName) => {
                const content = await (0, promises_1.readFile)('frontend/dist/frontend/assets/i18n/' + fileName, 'utf-8');
                const fileContent = JSON.parse(content);
                const frontendPercentage = calcPercentage(fileContent, enContent);
                const key = fileName.substring(0, fileName.indexOf('.'));
                const locale = locales_json_1.default.find((l) => l.key === key);
                let backendPercentage = 0;
                if (backendEnContent !== null) {
                    try {
                        const backendContent = await (0, promises_1.readFile)('i18n/' + fileName, 'utf-8');
                        const backendFileContent = JSON.parse(backendContent);
                        backendPercentage = calcPercentage(backendFileContent, backendEnContent);
                    }
                    catch {
                        backendPercentage = 0;
                    }
                }
                const percentage = Math.round(backendEnContent !== null ? (frontendPercentage + backendPercentage) / 2 : frontendPercentage);
                const gauge = (percentage > 80 ? 'full' : (percentage > 60 ? 'three-quarters' : (percentage > 40 ? 'half' : (percentage > 20 ? 'quarter' : 'empty'))));
                const lang = {
                    key,
                    lang: fileContent.LANGUAGE,
                    icons: locale?.icons,
                    shortKey: locale?.shortKey,
                    percentage,
                    gauge
                };
                if (!(fileName === 'en.json' || fileName === 'tlh_AA.json')) {
                    return lang;
                }
                return null;
            });
            const results = await Promise.all(languagePromises);
            results.forEach((lang) => {
                if (lang !== null) {
                    languages.push(lang);
                }
            });
            languages.push({ key: 'en', icons: ['gb', 'us'], shortKey: 'EN', lang: 'English', percentage: 100, gauge: 'full' });
            languages.sort((a, b) => a.lang.localeCompare(b.lang));
            res.status(200).json(languages);
        }
        catch (err) {
            next(err);
        }
    };
    function calcPercentage(fileContent, enContent) {
        const totalStrings = Object.keys(enContent).length;
        let differentStrings = 0;
        for (const key in fileContent) {
            if (Object.prototype.hasOwnProperty.call(fileContent, key) && fileContent[key] !== enContent[key]) {
                differentStrings++;
            }
        }
        return (differentStrings / totalStrings) * 100;
    }
}
exports.getLanguageList = getLanguageList;
//# sourceMappingURL=languages.js.map