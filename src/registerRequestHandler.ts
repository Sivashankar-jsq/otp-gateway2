import {
  IServiceRequestContext,
  ServiceRequestContext,
} from "@jsq/jsq-lib-core/build/ServiceRequestContext";
import * as express from "express";
import * as promClient from "prom-client";
import { IServerContext } from "./services/ServerContext";

const HTTP_OK = 200;
const HTTP_INTERNAL_SERVER_ERROR = 500;

export type QueryString = {
  [key: string]: undefined | string | string[] | QueryString | QueryString[];
};

export type Handler = (
  serverContext: IServerContext,
  requestContext: IServiceRequestContext
) => Promise<unknown>;

export type HttpVerb = "GET" | "POST" | "DELETE";

interface RequestHandlerOptions {
  app: express.Express;
  requestCounter: promClient.Counter<"statusCode" | "apiName">;
  latencyCounter: promClient.Summary<"statusCode" | "apiName">;
  verb: HttpVerb;
  name: string;
  serverContext: IServerContext;
  handler: Handler;
}

/*
 * Registers a handler for an API path.
 *
 * The path can expect HTTP GET or POST requests (as specified in the `verb`
 * parameter).  The result of invoking `handler` is JSON serialized and sent
 * back to the client.
 *
 * All requests (and any errors) are logged.  Counters are incremented for
 * all requests and errors, and handler duration is measured.
 */
export function registerRequestHandler({
  app,
  requestCounter,
  latencyCounter,
  verb,
  name,
  serverContext,
  handler,
}: RequestHandlerOptions) {
  const apiName = name.toLowerCase().replace(/[^a-z0-9]/gu, "_");

  const expressHandler = async (
    request: express.Request,
    response: express.Response
  ) => {
    let { log } = serverContext;
    let error = false;
    const start = new Date();

    try {
      const { query } = request;
      const { body } = request;
      const requestContext = new ServiceRequestContext(request);

      ({ log } = requestContext);
      requestContext.log.info(__filename, "Processing request", {
        request: JSON.stringify({ query, body }),
      });

      response.send(await handler(serverContext, requestContext));
    } catch (e) {
      error = true;
      log.error(__filename, "Unexpected error", {}, e);
      response.status(HTTP_INTERNAL_SERVER_ERROR).send("Internal server error");
    } finally {
      const end = new Date();
      const duration = (end.getTime() - start.getTime()) / 1000.0;

      latencyCounter
        .labels({
          apiName,
          statusCode: error ? HTTP_INTERNAL_SERVER_ERROR : HTTP_OK,
        })
        .observe(duration);

      requestCounter
        .labels({
          apiName,
          statusCode: error ? HTTP_INTERNAL_SERVER_ERROR : HTTP_OK,
        })
        .inc();
    }
  };

  if (verb === "GET") {
    app.get(`/${apiName}`, expressHandler);
  } else if (verb === "POST") {
    app.post(`/${apiName}`, expressHandler);
  } else if (verb === "DELETE") {
    app.delete(`/${apiName}`, expressHandler);
  }
}
