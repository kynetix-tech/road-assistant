import { Coordinates } from '@/entity/interface/sign-coord.interface';

export class CommentModel {
  constructor(
    public readonly text: string,
    public readonly routeId: number,
    public readonly userId: string,
    public readonly coordinates: Coordinates,
    public readonly id: number = 0,
    public readonly createdAt: Date = null,
  ) {}
}
