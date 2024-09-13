"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./module/app.module");
const config_1 = require("@nestjs/config");
const oauth_middleware_1 = require("./middleware/oauth.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT');
    app.use(new oauth_middleware_1.OAuthMiddleware().use);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map