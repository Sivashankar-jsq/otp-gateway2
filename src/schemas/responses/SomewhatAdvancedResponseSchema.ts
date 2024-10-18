import { z } from "zod";

const SomewhatAdvancedResponseSchema = z.object({
  results: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
});

type SomewhatAdvancedResponseSchemaType = z.infer<
  typeof SomewhatAdvancedResponseSchema
>;

const SomewhatAdvancedResponseSample = {
  results: [
    {
      name: "Lorem",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Aliquam",
      description: "Aliquam erat volutpat. Nullam quis.",
    },
  ],
  pageNumber: 1,
  pageSize: 10,
};

export {
  SomewhatAdvancedResponseSchema,
  SomewhatAdvancedResponseSchemaType,
  SomewhatAdvancedResponseSample,
};
