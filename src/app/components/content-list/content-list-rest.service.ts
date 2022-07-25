import { Injectable, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { ContentContext, ContentVariation } from "src/app/editor/designer-entities/mixed-content-context";
import { CollectionResponse } from "src/app/sdk/collection-response";
import { CombinedFilter } from "src/app/sdk/filters/combined-filter";
import { FilterClause, FilterOperators } from "src/app/sdk/filters/filter-clause";
import { OrderBy } from "src/app/sdk/filters/orderby";
import { SdkItem } from "src/app/sdk/sdk-item";
import { ServiceMetadata } from "src/app/sdk/service-metadata";
import { GetAllArgs } from "src/app/sdk/services/get-all-args";
import { RestService } from "src/app/sdk/services/rest.service";
import { DetailItem } from "src/app/services/detail-item";
import { ContentListEntity } from "./content-list-entity";

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

            const filters: Array<CombinedFilter | FilterClause | null> = [mainFilter, additionalFilter, parentFilter];
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
                Filter: bigFilter
            };

            return this.restService.getItems(getAllArgs);
        };

        return EMPTY;
    }

    private getMainFilter(entity: ContentListEntity, variation: ContentVariation): CombinedFilter | null {
        let filter: CombinedFilter | null = null;
        if (variation.Filter) {
            switch (variation.Filter.Key) {
                case "Complex":
                    filter = JSON.parse(variation.Filter.Value);
                    if (filter)
                        filter.Operator = entity.SelectionGroupLogicalOperator;
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

                    filter = {
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
