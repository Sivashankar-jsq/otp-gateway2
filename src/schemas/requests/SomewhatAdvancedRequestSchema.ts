import { z } from "zod";

const SomewhatAdvancedRequestSchema = z.object({
  query: z.string(),
  pageSize: z.string(),
});

type SomewhatAdvancedRequestSchemaType = z.infer<
  typeof SomewhatAdvancedRequestSchema
>;

const SomewhatAdvancedRequestSample: SomewhatAdvancedRequestSchemaType = {
  query: "some query",
  pageSize: "10",
};

export {
  SomewhatAdvancedRequestSchema,
  SomewhatAdvancedRequestSchemaType,
  SomewhatAdvancedRequestSample,
};
