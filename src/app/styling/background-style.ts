import { Position } from "@angular/compiler";
import { SdkItem } from "../sdk/sdk-item";
import { Background } from "./background";

export interface BackgroundStyle {
    BackgroundType: Background,
    Color: string,
    ImageItem: SdkItem;
    VideoItem: SdkItem;
    Position: Position;
}
