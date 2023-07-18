import { Property } from "@tsed/schema";
import { Content } from "../../models/content";


export class ContentResponse implements Content {
    @Property()
    id: string;

    @Property()
    contentName: string;

    @Property()
    contentType: number;

    @Property()
    contentJson: string;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}