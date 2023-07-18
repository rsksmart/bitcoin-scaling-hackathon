import { Inject, Service } from "@tsed/di";
import { CategoryRequest } from "../../dtos/request/category.request";
import { CategoryResponse } from "../../dtos/response/category.response";
import { CATEGORY_REPOSITORY } from "../../repositories/category/category.repository";
import { NotFound } from "@tsed/exceptions";

@Service()
export class CategoryService {
  @Inject(CATEGORY_REPOSITORY)
  protected repository: CATEGORY_REPOSITORY;

  /**
   * @method getCategories
   * @param filter
   * @returns Promise<CategoryResponse[]>
   * @example
   *  const categories = await getCategories({
   *    where: {name: "art"}
   *  })
   */
  public async getCategories(filter?: any): Promise<Array<CategoryResponse>> {
    const categories = filter ? await this.repository.find(filter) : await this.repository.find();
    if (!categories) return [];
    return categories;
  }

  /**
   * @method createCategory
   * @param payload CategoryRequest
   * @returns Promise<CategoryResponse>
   * @example
   *  const category = await createCategory({
   *      name: "music"
   *  })
   */
  public async createCategory(payload: CategoryRequest): Promise<CategoryResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.repository.save({ ...payload });
  }

  /**
   * @method updateCategory
   * @param id string
   * @param payload CategoryRequest
   * @returns Promise<CategoryResponse>
   * @example
   *  const category = await updateCategory("d0de0c5f-afc0-4980-9016-e6420a36036e", {
   *      name: "sports"
   *  })
   */
  public async updateCategory(id: string, payload: CategoryRequest): Promise<CategoryResponse> {
    id = id.toLowerCase();
    await this.repository.update({ id: id }, { ...payload });

    const category = await this.repository.findOne({ where: { id: id } });
    if (!category) throw new NotFound("Category not found");

    return category;
  }

  /**
   * @method removeCategory
   * @param id string
   * @returns Promise<boolean>
   * @example
   *  const category = await removeCategory("d0de0c5f-afc0-4980-9016-e6420a36036e")
   */
  public async removeCategory(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const category = await this.repository.findOne({ where: { id: id } });
    if (!category) throw new NotFound("Category not found");

    await this.repository.remove(category);
    return true;
  }
}
