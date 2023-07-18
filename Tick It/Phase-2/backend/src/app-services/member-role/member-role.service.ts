import { Inject, Service } from '@tsed/di';
import { MemberRoleRequest } from '../../dtos/request/member-role.request';
import { MemberRoleResponse } from '../../dtos/response/member-role.response';
import { MEMBER_ROLE_REPOSITORY } from '../../repositories/member-role/member-role.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class MemberRoleService {

    @Inject(MEMBER_ROLE_REPOSITORY)
    protected repository: MEMBER_ROLE_REPOSITORY;

    public async getMemberRoles(filter?: any): Promise<Array<MemberRoleResponse>> {
        const memberRoles = filter ? await this.repository.find(filter) : await this.repository.find();
        if (!memberRoles) return [];
        return memberRoles;
    }

    public async createMemberRole(payload: MemberRoleRequest): Promise<MemberRoleResponse> {
        if (payload.id) payload.id = String(payload.id).toLowerCase()
        return await this.repository.save({ ...payload });
    }

    public async updateMemberRole(id: string, payload: MemberRoleRequest): Promise<MemberRoleResponse> {
        id = id.toLowerCase()
        await this.repository.update({ id: id }, { ...payload });

        const memberRole = await this.repository.findOne({ where: { id: id } });
        if (!memberRole)
            throw new NotFound("MemberRole not found");

        return memberRole;
    }

    public async removeMemberRole(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const memberRole = await this.repository.findOne({ where: { id: id } });
        if (!memberRole)
            throw new NotFound("MemberRole not found");

        await this.repository.remove(memberRole);
        return true;
    }
}