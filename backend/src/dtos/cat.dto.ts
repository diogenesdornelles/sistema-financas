export class CreateCatDto {
  name!: string;
  description!: string;
  user!: string;
  obs?: string;
}

export class UpdateCatDto {
  name?: string;
  description?: string;
  user?: string;
  obs?: string;
  status?: boolean;
}

export class CatResponseDto {
  id!: string;
  name!: string;
  description!: string;
  user!: string;
  status!: boolean;
  obs!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
