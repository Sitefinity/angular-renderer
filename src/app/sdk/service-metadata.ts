import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { RootUrlService } from "../services/root-url.service";

@Injectable()
export class ServiceMetadata {
    private serviceMetadataCache!: ServiceMetadataDefinition;

    constructor(private http: HttpClient, private rootUrlService: RootUrlService) {

    }

    public fetch(): Observable<ServiceMetadataDefinition> {
        const serviceUrl = this.rootUrlService.getServiceUrl();
        const metadataUrl = `${serviceUrl}sfmeta`;

        return this.http.get<ServiceMetadataDefinition>(metadataUrl).pipe(tap(x => {
            this.serviceMetadataCache = x;
        }));
    }

    public getSetNameFromType(itemType: string) {
        const definition = this.serviceMetadataCache.definitions[itemType];
        if (definition != null) {
            const sets = this.serviceMetadataCache.entityContainer.entitySets;
            const setName = Object.keys(sets).find((x) => {
                return sets[x]["entityType"]["$ref"].endsWith(itemType);
            });

            return setName;
        }

        return itemType;
    }

    public getParentType(itemType: string) {
        const definition = this.serviceMetadataCache.definitions[itemType];
        if (definition != null) {
            const parent = definition["properties"]["Parent"];
            if (parent != null) {
                const anyOfProperty = parent["anyOf"] as Array<{ $ref: string }>;
                if (anyOfProperty != null && anyOfProperty.length > 0) {
                    var refProperty = anyOfProperty.find(x => x.$ref != null);
                    if (refProperty != null) {
                        return refProperty.$ref.replace("#/definitions/", "");
                    }
                }
            }
        }

        return null;
    }

    public isPropertyACollection(type: string, propName: string) {
        var entityTypeDef = this.serviceMetadataCache.definitions[type];
        var propMeta = entityTypeDef["properties"][propName];
        var propType = propMeta["type"];

        if (!propType)
            return false;

        if (Array.isArray(propType) || propType == "array")
            return true;

        return false;
    }

    public getRelatedTypeEntitySet(type: string, relationName: string) {
        const typeDefinition = this.serviceMetadataCache.definitions[type];

        var properties = typeDefinition["properties"];
        var property = properties[relationName];
        if (typeof property.Type !== 'object')
            return null;

        var relatedReferenceType = property["$ref"];
        if (relatedReferenceType == null) {
            var itemsProperty = property["items"];
            if (itemsProperty != null) {
                relatedReferenceType = itemsProperty["$ref"];
            }
        }

        if (relatedReferenceType == null) {
            var anyOfProperty: Array<any> = property["anyOf"];
            if (anyOfProperty && anyOfProperty.length > 0) {
                var relatedItemProperty = anyOfProperty.find(x => x["$ref"] != null);
                if (relatedItemProperty != null) {
                    relatedReferenceType = relatedItemProperty["$ref"];
                }
            }
        }

        if (relatedReferenceType == null)
            return null;

        var relatedReferenceTypeString = this.serviceMetadataCache.definitions[relatedReferenceType];
        foreach (var prop in sets.Properties())
        {
            if (prop.Value["entityType"]["$ref"].ToString() == relatedReferenceTypeString)
            {
                return prop.Name;
            }
        }

        return null;
    }
}

interface ServiceMetadataDefinition {
    definitions: { [key: string]: any };
    entityContainer: {
        entitySets: { [key: string] : any }
    };
}
