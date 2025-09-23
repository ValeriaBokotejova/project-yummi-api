import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from 'path';

const docsDir = path.resolve('src', 'docs');

const swaggerDocument = YAML.load(path.join(docsDir, "swagger.yaml"));

export { swaggerUi, swaggerDocument };