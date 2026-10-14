import fs from "node:fs";
import { products } from "../src/lib/eco-content.ts";

fs.writeFileSync(
  new URL("../.tmp-product-data.json", import.meta.url),
  JSON.stringify(products, null, 2),
);
console.log(`Exported ${products.length} products to .tmp-product-data.json`);
