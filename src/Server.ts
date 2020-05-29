import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";

import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";

import express, { Request, Response, NextFunction, Application } from "express";
import { BAD_REQUEST } from "http-status-codes";
import "express-async-errors";
import { buildProviderModule } from "inversify-binding-decorators"

import logger from "@shared/logger";

import "@config/diContext"

import { Container } from "inversify";

// Init express
const container = new Container()
container.load(buildProviderModule())

const server = new InversifyExpressServer(container)

server.setConfig((app: Application) => {
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(cookieParser())

    // Show routes called in console during development
    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"))
    }

    // Security
    if (process.env.NODE_ENV === "production") {
        app.use(helmet())
    }

    const viewsDir = path.join(__dirname, "views");
    app.set("views", viewsDir);
    const staticDir = path.join(__dirname, "public");
    app.use(express.static(staticDir));
})
.setErrorConfig((app: Application) => {
    // Print API errorsw
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    });
})

const app = server.build()

// Export express instance
export default app
