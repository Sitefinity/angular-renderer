import { Position } from "@angular/compiler";
import { SdkItem } from "../sdk/sdk-item";
import { Background } from "./background";

export interface BackgroundStyle {
    BackgroundType: "None" | "Color" | "Image" | "Video";
    Color: string,
    ImageItem: SdkItem;
    VideoItem: SdkItem;
    Position: Position;
}
