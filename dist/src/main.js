"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./module/app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            origin: "*",
            methods: "GET,POST,PUT,PATCH,DELETE",
            preflightContinue: false,
            optionsSuccessStatus: 204
        }
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT');
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map