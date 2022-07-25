import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RootUrlService } from "../../services/root-url.service";
import { CollectionResponse } from "../collection-response";
import { GenericContentItem } from "../generic-content-item";
import { ODataWrapper } from "../odata-wrapper";
import { SdkItem } from "../sdk-item";
import { ServiceMetadata } from "../service-metadata";
import { GetAllArgs } from "./get-all-args";

export class RestSdkTypes {
    public static readonly Video: string = "Telerik.Sitefinity.Libraries.Model.Video";
    public static readonly Image: string = "Telerik.Sitefinity.Libraries.Model.Image";
    public static readonly News: string = "Telerik.Sitefinity.News.Model.NewsItem";
    public static readonly GenericContent: string = "Telerik.Sitefinity.GenericContent.Model.ContentItem";
    public static readonly Pages: string = "Telerik.Sitefinity.Pages.Model.PageNode";
}

@Injectable()
export class RestService {
    constructor(private http: HttpClient, private rootUrlService: RootUrlService, private serviceMetadata: ServiceMetadata) {

    }

    getItemWithFallback<T extends SdkItem>(itemType: string, id: string, provider: string): Observable<T> {
        const wholeUrl = `${this.buildItemBaseUrl(itemType)}(${id})/Default.GetItemWithFallback()${this.buildQueryParams({
            sf_provider: provider,
            sf_fallback_prop_names: "*",
            $select: "*"
        })}`;

        return this.http.get<T>(wholeUrl);
    }

    getItemWithStatus<T extends SdkItem>(itemType: string, id: string, provider: string, queryParams: {[key: string]: string}): Observable<T> {
        let queryParamsForMethod = {
            sf_provider: provider,
            $select: "*"
        };

        queryParamsForMethod = Object.assign(queryParamsForMethod, queryParams)
        const wholeUrl = `${this.buildItemBaseUrl(itemType)}(${id})/Default.GetItemWithStatus()${this.buildQueryParams(queryParamsForMethod)}`

        return this.http.get<T>(wholeUrl);
    }

    getItem<T extends SdkItem>(itemType: string, id: string, provider: string): Observable<T> {
        let queryParamsForMethod = {
            sf_provider: provider,
            $select: "*"
        };

        const wholeUrl = `${this.buildItemBaseUrl(itemType)}(${id})${this.buildQueryParams(queryParamsForMethod)}`

        return this.http.get<T>(wholeUrl);
    }

    getItems<T extends SdkItem>(args: GetAllArgs): Observable<CollectionResponse<T>> {
        const baseUrl = this.buildItemBaseUrl(args.Type);

        let queryParamsForMethod: { [key: string]: any } = {
            "$count": args.Count,
            "$orderby": args.OrderBy ? args.OrderBy.map(x => `${x.Name} ${x.Type}`) : null,
            "sf_provider": args.Provider,
            "sf_culture": args.Culture,
            "$select": "*",
            "$expand": "*",
            "$skip": null,
            "$take": null,
            "$filter": null
        };

        queryParamsForMethod = Object.assign(queryParamsForMethod, args.AdditionalQueryParams);

        const wholeUrl = `${this.buildItemBaseUrl(args.Type)}${this.buildQueryParams(queryParamsForMethod)}`

        return this.http.get<ODataWrapper<T[]>>(wholeUrl).pipe(map(x => <CollectionResponse<T>>{ Items: x.value, TotalCount: x["@odata.count"] }));
    }

    public getSharedContent(id: string, cultureName: string): Observable<GenericContentItem> {
        let queryParamsForMethod = {
            sf_culture: cultureName,
            sf_fallback_prop_names: "Content"
        };

        return this.http.get<GenericContentItem>(`${this.buildItemBaseUrl(RestSdkTypes.GenericContent)}/Default.GetItemById(itemId=${id})${this.buildQueryParams(queryParamsForMethod)}`);
    }

    public buildItemBaseUrl(itemType: string): string {
        const serviceUrl = this.rootUrlService.getServiceUrl();
        const setName = this.serviceMetadata.getSetNameFromType(itemType);

        return `${serviceUrl}${setName}`;
    }

    public buildQueryParams(queryParams: { [key: string]: string }) {
        let result = "";
        Object.keys(queryParams).forEach((key) => {
            const value = queryParams[key];
            if (value)
                result += `${key}=${value}&`;
        });

        if (result !== "") {
            result = "?" + result;
            result = result.substring(0, result.length - 1);
        }

        return result;
    }
}
