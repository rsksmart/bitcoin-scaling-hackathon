import { Nullable, Property } from "@tsed/schema";
import { Event } from "../../models/event";
import { Organization } from "../../models/organization";
import { Report } from "../../models/report";
import { ReportType } from "../../models/report-type";
import { User } from "../../models/user";
import { UserResponse } from "./user.response";
import { ReportTypeResponse } from "./report-type.response";
import { EventResponse } from "./event.response";
import { OrganizationResponse } from "./organization.response";

export class ReportResponse implements Report {
  @Property()
  id: string;

  @Property()
  userId: string;

  @Property(() => UserResponse)
  user: User;

  @Property()
  reportTypeId: string;

  @Property(() => ReportTypeResponse)
  reportType: ReportType;

  @Property()
  eventId: string;

  @Property(() => EventResponse)
  event: Event;

  @Property()
  organizationId: string;

  @Property(() => OrganizationResponse)
  organization: Organization;

  @Property()
  description: string;

  @Property()
  status: string;

  @Property()
  createdAt: Date;

  @Property()
  createdBy: string;

  @Property()
  updatedAt: Date;

  @Property()
  updatedBy: string;
}
