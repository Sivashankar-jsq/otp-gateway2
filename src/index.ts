import JsqApp from "@jsq/jsq-lib-core/build/JsqApp";
import * as promClient from "prom-client/index";
import helloWorld from "./handlers/helloWorld";
import somewhatAdvanced from "./handlers/somewhatAdvanced";
import {
  Handler,
  HttpVerb,
  registerRequestHandler,
} from "./registerRequestHandler";
import { ServerContext } from "./services/ServerContext";

function getConfig(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw Error(`Missing configuration: ${key}`);
  }
  return value;
}

const HTTP_OK = 200;
const APP_PORT = 8080;
const METRICS_PORT = 8081;
const MAX_REQUEST_SIZE = "100kb";
const SVC_NAME = "jsq-svc-sample";
const SVC_VERSION = getConfig("VERSION");

(async () => {
  const app = await JsqApp.create((log) => ServerContext.create(log), {
    appServer: {
      livenessCheck: {
        handler: (res) =>
          res.status(HTTP_OK).send("A sample service liveness check..."),
      },
      readinessCheck: {
        handler: (res) =>
          res.status(HTTP_OK).send("A sample service readiness check..."),
      },
      swaggerOptions: {
        serviceName: SVC_NAME,
        serviceVersion: SVC_VERSION,
      },
      initialization: (_app, registry, serverContext) => {
        const requestCounter = new promClient.Counter({
          name: "api_requests_total",
          help: "Total API requests",
          labelNames: ["statusCode", "apiName"],
          registers: [registry],
        });

        const latencyCounter = new promClient.Summary({
          name: "api_latency_seconds",
          help: "Time taken to process API requests",
          labelNames: ["statusCode", "apiName"],
          registers: [registry],
        });

        const registrations: {
          method: HttpVerb;
          api: string;
          fn: Handler;
        }[] = [
          // Register all handlers here
          // For ex: { method: "GET", api: "hello", fn: hello }

          /**
           *  @openapi
           *  /helloWorld:
           *    get:
           *      description: this is a hello world endpoint
           *      responses:
           *        200:
           *          description: Success
           */
          { method: "GET", api: "helloWorld", fn: helloWorld },

          /**
           *  @openapi
           *  /somewhatAdvanced:
           *    get:
           *      description: this is a somewhat advanced endpoint
           *      parameters:
           *        - in: query
           *          name: query
           *          required: true
           *        - in: query
           *          name: pageSize
           *          required: true
           *      responses:
           *        200:
           *          description: Success
           */
          { method: "GET", api: "somewhatAdvanced", fn: somewhatAdvanced },
        ];

        registrations.map((_) =>
          registerRequestHandler({
            app: _app,
            requestCounter,
            latencyCounter,
            verb: _.method,
            name: _.api,
            serverContext,
            handler: _.fn,
          })
        );
      },
      jsonPost: { limit: MAX_REQUEST_SIZE },
      port: APP_PORT,
    },
    metricsServer: { port: METRICS_PORT },
  });

  process.on("SIGTERM", async () => app.shutdown());
})();
