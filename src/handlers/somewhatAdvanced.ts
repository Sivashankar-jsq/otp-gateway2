import { IServiceRequestContext } from "@jsq/jsq-lib-core/build/ServiceRequestContext";
import { IServerContext } from "src/services/ServerContext";
import { SomewhatAdvancedRequestSchema } from "../schemas/requests/SomewhatAdvancedRequestSchema";
import { SomewhatAdvancedResponseSample } from "../schemas/responses/SomewhatAdvancedResponseSchema";

export default async function somewhatAdvanced(
  serverContext: IServerContext,
  requestContext: IServiceRequestContext
) {
  const { query, pageSize } = SomewhatAdvancedRequestSchema.parse(
    requestContext.queryString
  );

  requestContext.log.info(
    __filename,
    "Received request to somewhatAdvanced handler",
    { query, pageSize }
  );

  // Perhaps call into a downstream service to fetch some results?
  // if registered, serverContext would have the downstream services

  // Since this is a sample service, returning a canned sample
  return SomewhatAdvancedResponseSample;
}
