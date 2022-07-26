import { Injectable, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { ContentContext, ContentVariation } from "src/app/editor/designer-entities/mixed-content-context";
import { CollectionResponse } from "src/app/sdk/collection-response";
import { CombinedFilter } from "src/app/sdk/filters/combined-filter";
import { FilterClause, FilterOperators } from "src/app/sdk/filters/filter-clause";
import { OrderBy } from "src/app/sdk/filters/orderby";
import { RelationFilter } from "src/app/sdk/filters/relation-filter";
import { SdkItem } from "src/app/sdk/sdk-item";
import { ServiceMetadata } from "src/app/sdk/service-metadata";
import { GetAllArgs } from "src/app/sdk/services/get-all-args";
import { ODataFilterSerializer } from "src/app/sdk/services/odata-filter-serializer";
import { RestService } from "src/app/sdk/services/rest.service";
import { DetailItem } from "src/app/services/detail-item";
import { ContentListEntity } from "./content-list-entity";
import { DateOffsetPeriod } from "./date-offset-period";

@Injectable()
export class ContentListRestService {
    constructor(private serviceMetadata: ServiceMetadata, private restService: RestService) {

    }

    getItems(entity: ContentListEntity, detailItem: DetailItem | null): Observable<CollectionResponse<SdkItem>> {
        if (entity.SelectedItems && entity.SelectedItems.Content && entity.SelectedItems.Content.length > 0) {
            const selectedContent = entity.SelectedItems.Content[0];
            const variation = selectedContent.Variations[0];


            const mainFilter = this.getMainFilter(entity, variation);
            const additionalFilter = this.getAdditionalFilter(entity);
            const parentFilter = this.getParentFilterExpression(selectedContent, variation, detailItem);

            const filters: Array<CombinedFilter | FilterClause | RelationFilter | null> = [mainFilter, additionalFilter, parentFilter];
            let bigFilter: CombinedFilter = {
                Operator: entity.SelectionGroupLogicalOperator,
                ChildFilters: filters.filter(x => x) as Array<CombinedFilter | FilterClause>
            };

            const skipAndTakeParams = this.getSkipAndTake(entity, 1);
            const getAllArgs: GetAllArgs = {
                Skip: skipAndTakeParams.Skip,
                Take: skipAndTakeParams.Take,
                Count: skipAndTakeParams.Count,
                Type: selectedContent.Type,
                Provider: variation.Source,
                OrderBy: <OrderBy[]>[this.getOrderByExpression(entity)].filter(x => x),
                Fields: this.getSelectExpression(entity),
                Filter: bigFilter,
            };

            return this.restService.getItems(getAllArgs);
        };

        return EMPTY;
    }

    private getMainFilter(entity: ContentListEntity, variation: ContentVariation): CombinedFilter | FilterClause | RelationFilter | null {
        let filter: CombinedFilter | FilterClause | RelationFilter | null = null;
        if (variation.Filter && variation.Filter.Value) {
            switch (variation.Filter.Key) {
                case "Complex":
                    filter = this.parseComplexFilter(JSON.parse(variation.Filter.Value))
                    break;
                case "Ids":
                    const itemIds = variation.Filter.Value.split(',');
                    const filters = itemIds.map((x) => {
                        return <FilterClause>{
                            FieldName: "Id",
                            FieldValue: x.trim(),
                            Operator: FilterOperators.Equal
                        }
                    });

                    filter = <CombinedFilter>{
                        Operator: "OR",
                        ChildFilters: filters
                    }
                    break;
                default:
                    break;
            }
        }

        return filter;
    }

    private parseComplexFilter(filter: any): CombinedFilter | FilterClause | RelationFilter {
        if (filter.hasOwnProperty("FieldName") && filter.hasOwnProperty("FieldValue")) {
            const filterClause = <FilterClause>filter;
            return filterClause;
        } else if (filter.hasOwnProperty("Name") && filter.hasOwnProperty("Operator")) {
            var relationFilter = <RelationFilter>filter;
            if (relationFilter.ChildFilter) {
                relationFilter.ChildFilter = this.parseComplexFilter(relationFilter.ChildFilter);
            }

            return relationFilter;
        } else if (filter.hasOwnProperty("DateFieldName")) {

            const datePeriod = <DateOffsetPeriod>filter;
            const combinedFilter: CombinedFilter = {
                Operator: "AND",
                ChildFilters: []
            };

            const currentTime = new Date();
            switch (datePeriod.OffsetType) {
                case "years":
                    currentTime.setFullYear(currentTime.getFullYear() - datePeriod.OffsetValue);
                    break;
                case "months":
                    currentTime.setMonth(currentTime.getMonth() - datePeriod.OffsetValue);
                    break;
                case "weeks":
                    currentTime.setDate(currentTime.getDate() - (datePeriod.OffsetValue * 7));
                    break;
                case "days":
                    currentTime.setDate(currentTime.getDate() - datePeriod.OffsetValue);
                    break;
            }

            const fromDateFilter: FilterClause = {
                FieldName: datePeriod.DateFieldName,
                Operator: FilterOperators.GreaterThanOrEqual,
                FieldValue: currentTime.toISOString()
            };

            const toDateFilter: FilterClause = {
                FieldName: datePeriod.DateFieldName,
                Operator: FilterOperators.LessThanOrEqual,
                FieldValue: new Date().toISOString()
            };

            combinedFilter.ChildFilters = [ fromDateFilter, toDateFilter ];
            return combinedFilter;
        } else {
            const parsedCombined = <CombinedFilter>filter;
            const newCollection = new Array(parsedCombined.ChildFilters.length);

            for (let i = 0; i < parsedCombined.ChildFilters.length; i++) {
                var currentChildFilter = parsedCombined.ChildFilters[i];
                const parsed = this.parseComplexFilter(currentChildFilter);
                newCollection[i] = parsed;
            }

            parsedCombined.ChildFilters = newCollection;

            return parsedCombined;
        }
    }

    private getAdditionalFilter(entity: ContentListEntity): CombinedFilter | FilterClause | null {
        if (entity.FilterExpression) {
            return JSON.parse(entity.FilterExpression);
        }

        return null;
    }

    private getParentFilterExpression(selectedContent: ContentContext, variation: ContentVariation, detailItem: DetailItem | null): FilterClause | null {
        let filterByParentExpressionSerialized = null;
        if (variation.DynamicFilterByParent) {
            var parentType = this.serviceMetadata.getParentType(selectedContent.Type);

            if (parentType != null && detailItem != null && detailItem.ItemType === parentType) {
                return <FilterClause>{
                    FieldName: "ParentId",
                    FieldValue: detailItem.Id,
                    Operator: FilterOperators.Equal,
                };
            }
        }

        return filterByParentExpressionSerialized;
    }

    private getSkipAndTake(entity: ContentListEntity, pageNumber: number): { Skip?: number, Take?: number, Count?: boolean, ShowPager?: boolean } {
        let retVal: { Skip?: number, Take?: number, ShowPager?: boolean, Count?: boolean } | null = {};
        let currentPage = 1;
        switch (entity.ListSettings.DisplayMode)
        {
            case "Paging":
                retVal.ShowPager = true;
                retVal.Take = entity.ListSettings.ItemsPerPage;

                currentPage = pageNumber;

                if (currentPage > 1)
                {
                    retVal.Skip = entity.ListSettings.ItemsPerPage * (currentPage - 1);
                }

                retVal.Count = true;
                break;
            case "Limit":
                retVal.Take = entity.ListSettings.LimitItemsCount;
                break;
        }

        return retVal;
    }

    private getOrderByExpression(entity: ContentListEntity): OrderBy | null {
        if (entity.OrderBy == "Manually")
            return null;

        const sortExpression = entity.OrderBy == "Custom" ?
            entity.SortExpression :
            entity.OrderBy;

        if (!sortExpression)
            return null;

        var sortExpressionParts = sortExpression.split(" ");
        if (sortExpressionParts.length != 2)
            return null;

        var sortOrder = sortExpressionParts[1].toUpperCase();

        var orderBy: OrderBy = {
            Name: sortExpressionParts[0],
            Type: sortOrder
        };

        return orderBy;
    }

    private getSelectExpression(entity: ContentListEntity): string[] {
        var splitExpressions = entity.SelectExpression.split(';');
        const fields = splitExpressions.map((split) => {
            return split.trim();
        });

        return fields;
    }
}
