import { Component, Input, OnInit } from "@angular/core";
import { ImageItem } from "src/app/sdk/image-item";
import { SdkItem } from "src/app/sdk/sdk-item";
import { ServiceMetadata } from "src/app/sdk/service-metadata";
import { CardItemModel, CardsListModel } from "./cards-list/cards-list-model";
import { ContentListModelMaster } from "./content-list-master-model";

@Component({
    templateUrl: "content-list-master.component.html",
    selector: "app-content-list-master"
})
export class ContentListMasterComponent implements OnInit {
    @Input() listModel!: ContentListModelMaster;
    cardsListModel: CardsListModel | null = null;

    ngOnInit(): void {
        let attributes: { [key: string]: string } = {};
        if (this.listModel.Attributes) {
            this.listModel.Attributes.forEach((pair) => {
                attributes[pair.Key] = pair.Value;
            });
        }

        this.listModel.Items$.subscribe((response) => {
            if (this.listModel.ViewName === "CardsList") {
                this.cardsListModel = {
                    Attributes: attributes,
                    OpenDetails: this.listModel.OpenDetails,
                    Items: response.Items.map((x) => {
                        let url!: string;
                        const image: ImageItem = x[this.listModel.FieldMap["Image"]];
                        if (image) {
                            if (image.Thumbnails && image.Thumbnails.length > 0) {
                                url = image.Thumbnails[0].Url;
                            } else {
                                url = image.Url;
                            }
                        }

                        return <CardItemModel>{
                            Title: {
                                Value: x[this.listModel.FieldMap["Title"]],
                                Css: 'card-title' + (x[this.listModel.FieldCssClassMap["Title"]] || ''),
                                Link: ""
                            },
                            Image: {
                                Title: image?.Title,
                                Url: url,
                                AlternativeText: image?.AlternativeText,
                                Css: x[this.listModel.FieldCssClassMap["Image"]],
                            },
                            Text: {
                                Value: x[this.listModel.FieldMap["Text"]],
                                Css: 'card-text ' + `${x[this.listModel.FieldCssClassMap["Text"]] || ''}`,
                            }
                        }
                    })
                };
            }
        });
    }
}
