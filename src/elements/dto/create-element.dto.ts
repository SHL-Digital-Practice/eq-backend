export class CreateElementDto {
  applicationId: string;
  type: string;
  properties: Record<string, any>;
}
