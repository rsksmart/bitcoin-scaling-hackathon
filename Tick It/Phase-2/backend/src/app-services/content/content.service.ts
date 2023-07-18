import { Inject, Service } from '@tsed/di';
import { ContentRequest } from '../../dtos/request/content.request';
import { ContentResponse } from '../../dtos/response/content.response';
import { CONTENT_REPOSITORY } from '../../repositories/content/content.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class ContentService {

    @Inject(CONTENT_REPOSITORY)
    protected repository: CONTENT_REPOSITORY;

    public async getContent(filter?: any): Promise<Array<ContentResponse>> {
        const content = filter ? await this.repository.find(filter) : await this.repository.find();
        if (!content) return [];
        return content;
    }

    public async createContent(payload: ContentRequest): Promise<ContentResponse> {
        if (payload.id) payload.id = String(payload.id).toLowerCase();
        return await this.repository.save({ ...payload });
    }

    public async updateContent(id: string, payload: ContentRequest): Promise<ContentResponse> {
        id = id.toLowerCase();
        await this.repository.update({ id: id }, { ...payload });

        const content = await this.repository.findOne({ where: { id: id } });
        if (!content)
            throw new NotFound("Content not found");

        return content;
    }

    public async removeContent(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const content = await this.repository.findOne({ where: { id: id } });
        if (!content)
            throw new NotFound("Content not found");

        await this.repository.remove(content);
        return true;
    }
}