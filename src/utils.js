import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export const getValidFilters = (filters, documentType) => {
  const haveFilters = {};
  
  switch (documentType) {
    case "product": {
      if (filters.category) {
        if (typeof categories === "string") {
          haveFilters["category"] = { $in: [filters.category] };
        } else {
          haveFilters["category"] = { $in: filters.category };
        }
      }
      if (filters.gte) {
        haveFilters["price"] = { $gte: filters.gte };
      }
      if (filters.price) {
        haveFilters["price"] = filters.price;
      }
      return haveFilters;
    }
  }
};
export default __dirname;
