import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RootUrlService } from "../../services/root-url.service";
import { GenericContentItem } from "../generic-content-item";
import { SdkItem } from "../sdk-item";

export class RestSdkTypes {
    public static readonly Video: string = "Telerik.Sitefinity.Libraries.Model.Video";
    public static readonly Image: string = "Telerik.Sitefinity.Libraries.Model.Image";
    public static readonly News: string = "Telerik.Sitefinity.News.Model.NewsItem";
    public static readonly GenericContent: string = "Telerik.Sitefinity.GenericContent.Model.ContentItem";
    public static readonly Pages: string = "Telerik.Sitefinity.Pages.Model.PageNode";
}

@Injectable()
export class RestService {
    constructor(private http: HttpClient, private rootUrlService: RootUrlService) {

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

    public getSharedContent(id: string, cultureName: string): Observable<GenericContentItem> {
        let queryParamsForMethod = {
            sf_culture: cultureName,
            sf_fallback_prop_names: "Content"
        };

        return this.http.get<GenericContentItem>(`${this.buildItemBaseUrl(RestSdkTypes.GenericContent)}/Default.GetItemById(itemId=${id})${this.buildQueryParams(queryParamsForMethod)}`);
    }

    public buildItemBaseUrl(itemType: string): string {
        const serviceUrl = this.rootUrlService.getServiceUrl();
        const setName = this.getSetNameForType(itemType);

        return `${serviceUrl}${setName}`;
    }

    public buildQueryParams(queryParams: { [key: string]: string }) {
        let result = "";
        Object.keys(queryParams).forEach((key) => {
            result += `${key}=${queryParams[key]}&`;
        });

        if (result !== "") {
            result = "?" + result;
            result = result.substring(0, result.length - 2);
        }

        return result;
    }

    public getSetNameForType(itemType: string) {
        switch (itemType) {
            case RestSdkTypes.Image:
                return "images";
            case RestSdkTypes.Video:
                return "videos";
            case RestSdkTypes.News:
                return "newsitems";
            case RestSdkTypes.GenericContent:
                return "contentitems";
            case RestSdkTypes.Pages:
                return "pages";
            default:
                return null;
        }
    }
}
