import { Position } from "@angular/compiler";
import { SdkItem } from "../sdk/sdk-item";
import { Background } from "./background";
import { ImagePosition } from "./position";

export interface BackgroundStyle {
    BackgroundType: "None" | "Color" | "Image" | "Video";
    Color: string,
    ImageItem: SdkItem;
    VideoItem: SdkItem;
    Position: ImagePosition;
}
