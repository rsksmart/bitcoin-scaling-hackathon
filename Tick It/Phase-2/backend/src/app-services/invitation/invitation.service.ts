import { Inject, Service } from '@tsed/di';
import { InvitationRequest } from '../../dtos/request/invitation.request';
import { InvitationResponse } from '../../dtos/response/invitation.response';
import { INVITATION_REPOSITORY } from '../../repositories/invitation/invitation.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class InvitationService {

    @Inject(INVITATION_REPOSITORY)
    protected repository: INVITATION_REPOSITORY;

    public async getInvitations(filter?: any): Promise<Array<InvitationResponse>> {
        const invitations = filter ? await this.repository.find(filter) : await this.repository.find();
        if (!invitations) return [];
        return invitations;
    }

    public async createInvitation(payload: InvitationRequest): Promise<InvitationResponse> {
        if (payload.id) payload.id = String(payload.id).toLowerCase()
        return await this.repository.save({ ...payload });
    }

    public async updateInvitation(id: string, payload: InvitationRequest): Promise<InvitationResponse> {
        id = id.toLowerCase()
        await this.repository.update({ id: id }, { ...payload });

        const invitation = await this.repository.findOne({ where: { id: id } });
        if (!invitation)
            throw new NotFound("Invitation not found");

        return invitation;
    }

    public async removeInvitation(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const invitation = await this.repository.findOne({ where: { id: id } });
        if (!invitation)
            throw new NotFound("Invitation not found");

        await this.repository.remove(invitation);
        return true;
    }
}