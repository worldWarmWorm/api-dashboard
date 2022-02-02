import { App } from "./App";
import { LoggerService } from "./logger/LoggerService";


async function bootstrap() {
  const app = new App(new LoggerService);
  await app.init();
}

bootstrap();