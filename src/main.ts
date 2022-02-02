import { App } from "./App";
import { ExceprionFilter } from "./errors/ExceprionFilter";
import { LoggerService } from "./logger/LoggerService";
import { UsersController } from "./users/UsersController";


async function bootstrap() {
  const logger = new LoggerService();
  const app = new App(
    logger,
    new UsersController(logger),
    new ExceprionFilter(logger)
  );
  await app.init();
}

bootstrap();