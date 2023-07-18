import { Inject, Service } from '@tsed/di';
import { OrganizationRequest } from '../../dtos/request/organization.request';
import { OrganizationResponse } from '../../dtos/response/organization.response';
import { ORGANIZATION_REPOSITORY } from '../../repositories/organization/organization.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class OrganizationService {

    @Inject(ORGANIZATION_REPOSITORY)
    protected repository: ORGANIZATION_REPOSITORY;

    public async getOrganizations(filter?: any): Promise<Array<OrganizationResponse>> {
        const organizations = filter ? await this.repository.find(filter) : await this.repository.find();
        if (!organizations) return [];
        return organizations;
    }

    public async createOrganization(payload: OrganizationRequest): Promise<OrganizationResponse> {
        if (payload.id) payload.id = String(payload.id).toLowerCase();
        return await this.repository.save({ ...payload });
    }

    public async updateOrganization(id: string, payload: OrganizationRequest): Promise<OrganizationResponse> {
        id = id.toLowerCase()
        await this.repository.update({ id: id }, { ...payload });

        const organization = await this.repository.findOne({ where: { id: id } });
        if (!organization)
            throw new NotFound("Organization not found");

        return organization;
    }

    public async removeOrganization(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const organization = await this.repository.findOne({ where: { id: id } });
        if (!organization)
            throw new NotFound("Organization not found");

        await this.repository.remove(organization);
        return true;
    }
}