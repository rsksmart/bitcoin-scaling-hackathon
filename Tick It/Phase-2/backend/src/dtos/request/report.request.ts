import { Property } from "@tsed/schema";

export class ReportRequest {
  @Property()
  id?: string;

  @Property()
  userId: string;

  @Property()
  reportTypeId: string;

  @Property()
  eventId?: string;

  @Property()
  organizationId?: string;

  @Property()
  description?: string;

  @Property()
  status: string;

  @Property()
  createdBy?: string;

  @Property()
  updatedby?: string;
}
