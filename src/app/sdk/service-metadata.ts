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

    public getRelatedType(type: string, relationName: string): string | null {
        const typeDefinition = this.serviceMetadataCache.definitions[type];

        var properties = typeDefinition["properties"];
        var property = properties[relationName];
        if (typeof property !== 'object')
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

        relatedReferenceType = relatedReferenceType.replace("#/definitions/", "");

        if (this.serviceMetadataCache.definitions.hasOwnProperty(relatedReferenceType)) {
            return relatedReferenceType;
        }

        return null;
    }

    private isRelatedProperty(type: string, propName: string) {
        return !!this.getRelatedType(type, propName);
    }

    private isPrimitiveProperty(type: string, propName: string)
    {
        const definition = this.serviceMetadataCache.definitions[type];
        var properties = definition["properties"];
        var property = properties[propName];
        if (property == null)
            throw new Error(`The field - ${propName} is not recognized as a property of the current type - ${type}`);

        return (typeof property === 'object') && !this.isRelatedProperty(type, propName);
    }

    public serializeFilterValue(type: string, propName: string, value: any) {
        const definition = this.serviceMetadataCache.definitions[type];

        if (this.isPrimitiveProperty(type, propName))
        {
            const propMeta = definition["properties"][propName];
            const propType = propMeta["type"];
            const propFormat = propMeta["format"];
            let propFormatToString = null;
            if (propFormat != null)
                propFormatToString = propFormat.toString();

            if (propType == null)
                return null;

            const propTypeArray: string[] = propType;
            const propTypeString = propType.toString();
            if (Array.isArray(propType) && propType.length > 0) {
                if (propTypeArray.some(x => x === 'null') && value === null) {
                    return 'null';
                }

                if (propTypeArray.some(x => x === 'string')) {
                    return `'${value}'`;
                }
            }
            else if (propTypeString == "array") {
                if (propMeta.items && propMeta.items.format) {
                    switch (propMeta.items.format) {
                        case 'string':
                            return `'${value}'`;
                        default:
                            return value.toString();
                    }
                }
            }
            else if (propFormatToString == "date-time" && value instanceof Date) {
                return value.toISOString();
            }
            else if (value !== null) {
                return value.toString();
            }
        }

        return null;
    }

    public getSimpleFields(type: string): string[] {
        var definition = this.serviceMetadataCache.definitions[type];
        var propertiesObject = definition["properties"];

        return <string[]>Object.keys(propertiesObject).map((key) => {
            if (this.isPrimitiveProperty(type, key)) {
                return key;
            }

            return null;
        }).filter(x => !!x);
    }

    public getRelationFields(type: string): string[] {
        var definition = this.serviceMetadataCache.definitions[type];
        var propertiesObject = definition["properties"];

        return <string[]>Object.keys(propertiesObject).map((key) => {
            if (this.isRelatedProperty(type, key)) {
                return key;
            }

            return null;
        }).filter(x => !!x);
    }
}

interface ServiceMetadataDefinition {
    definitions: { [key: string]: any };
    entityContainer: {
        entitySets: { [key: string] : any }
    };
}
