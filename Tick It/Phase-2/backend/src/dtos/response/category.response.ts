import { Property } from "@tsed/schema";
import { Category } from "../../models/category";


export class CategoryResponse implements Category {
    @Property()
    id: string;

    @Property()
    name: string;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}