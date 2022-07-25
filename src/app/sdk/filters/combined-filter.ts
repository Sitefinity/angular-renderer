import { FilterClause } from "./filter-clause";

export interface CombinedFilter {
    Operator: "AND" | "OR" | "NOT";
    ChildFilters: Array<CombinedFilter | FilterClause>
}
