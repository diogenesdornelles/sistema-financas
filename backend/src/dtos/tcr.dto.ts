export class CreateTcrDto {
  name!: string;
}

export class UpdateTcrDto {
  name?: string;
  status?: boolean;
}

export class TcrResponseDto {
  id!: string;
  name!: string;
  status!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
