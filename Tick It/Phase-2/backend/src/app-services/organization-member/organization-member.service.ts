import { Inject, Service } from '@tsed/di';
import { OrganizationMemberRequest } from '../../dtos/request/organization-member.request';
import { OrganizationMemberResponse } from '../../dtos/response/organization-member.response';
import { ORGANIZATION_MEMBER_REPOSITORY } from '../../repositories/organization-member/organization-member.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class OrganizationMemberService {

    @Inject(ORGANIZATION_MEMBER_REPOSITORY)
    protected repository: ORGANIZATION_MEMBER_REPOSITORY;

    public async getOrganizationMembers(filter?: any): Promise<Array<OrganizationMemberResponse>> {
        const organizationMembers = filter ? await this.repository.find(filter) : await this.repository.find();
        if (!organizationMembers) return [];
        return organizationMembers;
    }

    public async createOrganizationMember(payload: OrganizationMemberRequest): Promise<OrganizationMemberResponse> {
        if (payload.id) payload.id = String(payload.id).toLowerCase();
        return await this.repository.save({ ...payload });
    }

    public async updateOrganizationMember(id: string, payload: OrganizationMemberRequest): Promise<OrganizationMemberResponse> {
        id = id.toLowerCase()
        await this.repository.update({ id: id }, { ...payload });

        const organizationMember = await this.repository.findOne({ where: { id: id } });
        if (!organizationMember)
            throw new NotFound("OrganizationMember not found");

        return organizationMember;
    }

    public async removeOrganizationMember(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const organizationMember = await this.repository.findOne({ where: { id: id } });
        if (!organizationMember)
            throw new NotFound("OrganizationMember not found");

        await this.repository.remove(organizationMember);
        return true;
    }
}