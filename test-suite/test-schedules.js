#!/usr/bin/env node

const axios = require("axios");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const fs = require("fs");
const path = require("path");

const apiEndpoint = "https://bcferriesapi.ca/v2/";

async function validateSchema() {
  // Fetch data from the API
  const response = await axios.get(apiEndpoint);
  const data = response.data;

  // Load schema files
  const schemaFiles = ["bc-ferries-api-v2-schema.json"];
  const schemas = schemaFiles.map((file) => {
    const filePath = path.join(__dirname, "..", "schema", file);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  });

  // Initialize ajv and add formats
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  // Validate data against each schema
  schemas.forEach((schema) => {
    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
      console.log(`Validation errors for ${schema.title}:`, validate.errors);
    } else {
      console.log(`Data successfully validated against ${schema.title}`);
    }
  });
}

validateSchema().catch((error) => {
  console.error(error);
});
