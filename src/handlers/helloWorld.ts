import { IServiceRequestContext } from "@jsq/jsq-lib-core/build/ServiceRequestContext";
import { IServerContext } from "src/services/ServerContext";

export default async function helloWorld(
  serverContext: IServerContext,
  requestContext: IServiceRequestContext
) {
  requestContext.log.info(
    __filename,
    "Received request to helloWorld handler",
    {}
  );

  return {
    hello: "world",
  };
}
