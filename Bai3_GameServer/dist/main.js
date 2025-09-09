"use strict";
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = __importStar(require("express"));
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const ROOT = process.cwd();
    const WEB_DIR = (0, path_1.join)(ROOT, 'client', 'web');
    const CSS_DIR = (0, path_1.join)(ROOT, 'client', 'css');
    // serve static
    app.use('/css', express.static(CSS_DIR));
    app.use(express.static(WEB_DIR));
    // fallback cho "/": mở menu chọn game
    const server = app.getHttpAdapter().getInstance();
    server.get('/', (_req, res) => res.sendFile((0, path_1.join)(WEB_DIR, 'index.html')));
    // (tuỳ chọn)
    server.get('/line98.html', (_req, res) => res.sendFile((0, path_1.join)(WEB_DIR, 'line98', 'line98.html')));
    server.get('/caro.html', (_req, res) => res.sendFile((0, path_1.join)(WEB_DIR, 'caro', 'caro.html')));
    await app.listen(3000);
    console.log('🚀 http://localhost:3000');
}
bootstrap();
//# sourceMappingURL=main.js.map