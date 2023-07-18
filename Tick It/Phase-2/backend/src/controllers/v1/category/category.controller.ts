import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { CategoryService } from "../../../app-services/category/category.service";
import { CategoryRequest } from "../../../dtos/request/category.request";
import { CategoryResponse } from "../../../dtos/response/category.response";
import { Exception } from "@tsed/exceptions";

@Controller("/categories")
@Tags('Category')
export class CategoryController {

    @Inject(CategoryService)
    protected service: CategoryService;

    @Get("/")
    @Returns(200, Array).Of(CategoryResponse)
    public async getCategories(@QueryParams("filter") filter?: string): Promise<CategoryResponse[]> {
        try {
            return filter ? await this.service.getCategories(JSON.parse(filter)) : await this.service.getCategories();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Returns(200, CategoryResponse)
    public async createCategory(@BodyParams() category: CategoryRequest): Promise<CategoryResponse> {
        try {
            return await this.service.createCategory(category);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Returns(200, CategoryResponse)
    public async updateCategory(@PathParams("id") id: string, @BodyParams() category: CategoryRequest): Promise<CategoryResponse> {
        try {
            return await this.service.updateCategory(id, category);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Returns(200, Boolean)
    public async removeCategory(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeCategory(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}