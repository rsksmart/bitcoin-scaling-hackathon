import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { Category } from "../../models/category";

export const CategoryRepository = PostgresDataSource.getRepository(Category);

export const CATEGORY_REPOSITORY = Symbol.for("CategoryRepository");
export type CATEGORY_REPOSITORY = typeof CategoryRepository;

registerProvider({
    provide: CATEGORY_REPOSITORY,
    useValue: CategoryRepository
});