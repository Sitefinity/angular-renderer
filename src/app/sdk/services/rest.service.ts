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
import { ODataFilterSerializer } from "./odata-filter-serializer";

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

        const filteredSimpleFields = this.getSimpleFields(args.Type, args.Fields || []);
        const filteredRelatedFields = this.getRelatedFields(args.Type, args.Fields || []);

        let queryParamsForMethod: { [key: string]: any } = {
            "$count": args.Count,
            "$orderby": args.OrderBy ? args.OrderBy.map(x => `${x.Name} ${x.Type}`) : null,
            "sf_provider": args.Provider,
            "sf_culture": args.Culture,
            "$select": filteredSimpleFields.join(','),
            "$expand": filteredRelatedFields.join(','),
            "$skip": args.Skip,
            "$take": args.Take,
            "$filter": new ODataFilterSerializer(this.serviceMetadata).serialize({ Type: args.Type, Filter: args.Filter })
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

    private getSimpleFields(type: string, fields: string[]): string[] {
        var star = "*";
        if (fields != null && fields.length == 1 && fields[0] == star)
            return [star];

        var simpleFields = this.serviceMetadata.getSimpleFields(type);
        return fields.filter(x => simpleFields.some(y => y === x));
    }

    private getRelatedFields(type: string, fields: string[]): string[] {
        var star = "*";
        if (fields != null && fields.length == 1 && fields[0] == star)
            return [star];

        const result: string[] = [];
        const relatedFields = this.serviceMetadata.getRelationFields(type);
        const pattern = /(?<fieldName>.+?)\((?<nested>.+)\)/;
        fields.forEach((field) => {
            const fieldMatch = field.match(pattern);
            if (!fieldMatch && relatedFields.some(x => x === field)) {
                result.push(field);
            } else if (fieldMatch && fieldMatch.groups) {
                const fieldName = fieldMatch.groups["fieldName"];
                if (relatedFields.some(x => x === fieldName))
                {
                    const innerFields = fieldMatch.groups["nested"];
                    const relatedFieldsInput = this.parseInnerFields(innerFields);

                    const relatedTypeName = this.serviceMetadata.getRelatedType(type, fieldName);
                    if (relatedTypeName) {
                        let relatedSimpleFields = this.serviceMetadata.getSimpleFields(relatedTypeName);
                        relatedSimpleFields = relatedFieldsInput.filter(x => relatedSimpleFields.some(y => y === x));

                        let simpleFieldsJoined: string | null = null;
                        if (relatedSimpleFields.length > 0) {
                            simpleFieldsJoined = relatedSimpleFields.join(",");
                            simpleFieldsJoined = `$select=${simpleFieldsJoined}`;
                        }

                        const relatedRelationFields = this.getRelatedFields(relatedTypeName, relatedFieldsInput);
                        let relatedRelationFieldsJoined: string | null = null;
                        if (relatedRelationFields.length > 0) {
                            relatedRelationFieldsJoined = relatedRelationFields.join(",");
                            relatedRelationFieldsJoined = `$expand=${relatedRelationFieldsJoined}`;
                        }

                        let resultString: string | null = null;
                        if (relatedRelationFieldsJoined && simpleFieldsJoined) {
                            resultString = `${fieldName}(${simpleFieldsJoined};${relatedRelationFieldsJoined})`;
                        } else if (relatedRelationFieldsJoined) {
                            resultString = `${fieldName}(${relatedRelationFieldsJoined})`;
                        } else if (simpleFieldsJoined) {
                            resultString = `${fieldName}(${simpleFieldsJoined})`;
                        }

                        if (resultString)
                            result.push(resultString);
                    }
                }
            }
        });

        return result;
    }

    private parseInnerFields(input: string): string[] {
        const allFields: string[] = [];

        let fieldStartIndex = 0;
        let charIterator = 0;
        let openingBraceCounter = 0;
        let closingBraceCounter = 0;

        for (let i = 0; i < input.length; i++) {
            charIterator++;
            const character = input[i];
            if (character === '(')
                openingBraceCounter++;

            if (character === ')')
                closingBraceCounter++;

            if (character === ',') {
                if (openingBraceCounter > 0 && openingBraceCounter === closingBraceCounter)
                {
                    var relatedField = input.substring(fieldStartIndex, charIterator - fieldStartIndex - 1).trim();
                    allFields.push(relatedField);
                    fieldStartIndex = charIterator + 1;
                    openingBraceCounter = 0;
                    closingBraceCounter = 0;
                }
                else if (openingBraceCounter === 0 && closingBraceCounter === 0)
                {
                    var basicField = input.substring(fieldStartIndex, charIterator - fieldStartIndex - 1).trim();
                    allFields.push(basicField);
                    fieldStartIndex = charIterator + 1;
                }
            }
        }

        if (fieldStartIndex < charIterator)
        {
            var lastField = input.substring(fieldStartIndex, charIterator - fieldStartIndex).trim();
            allFields.push(lastField);
        }

        return allFields;
    }
}
