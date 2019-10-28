import express = require('express');
import cls = require("cls-hooked");

import { MainRouter } from "./routes/main.router";
import { requestIdInterceptor } from './services/logger/request-id-interceptor';
import { logIncomingRequest, logRequestEnd } from './services/logger/log-request';
import { logger } from './services/logger/LoggerProvider';


const cors = require('cors');

const port = process.env.PORT;

async function bootstrap() {
    const ns = cls.createNamespace("global");
    const app = express();

    // Setup server.
    app.use(cors());

    // Setup logging.
    app.use(requestIdInterceptor(ns));
    app.use(logIncomingRequest);
    app.use(logRequestEnd);

    // Mount routes.
    app.use(MainRouter);

    // Start.
    app.listen(port, () => logger.info(`VideoApp API listening on port ${port}`));
}

bootstrap();



