import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RootUrlService } from "../services/root-url.service";
import { SdkItem } from "./sdk-item";

export class RestSdkTypes {
    public static readonly Video: string = "Telerik.Sitefinity.Libraries.Model.Video";
}

@Injectable()
export class RestService {
    private readonly serviceApi = "api/default";
    constructor(private http: HttpClient, private rootUrlService: RootUrlService) {

    }

    getItemWithFallback<T extends SdkItem>(itemType: string, id: string, provider: string): Observable<T> {
        const rootUrl = this.rootUrlService.getUrl();
        const setName = this.getSetNameForType(itemType);
        const wholeUrl = `${rootUrl}/${this.serviceApi}/${setName}(${id})/Default.GetItemWithFallback()?sf_provider=${provider}&sf_fallback_prop_names=*&$select=*`

        return this.http.get<T>(wholeUrl);
    }

    private getSetNameForType(itemType: string) {
        if (itemType === RestSdkTypes.Video) {
            return "videos";
        }

        return null;
    }
}
