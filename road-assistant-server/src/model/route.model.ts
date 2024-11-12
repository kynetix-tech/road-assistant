import { Coordinates, SignItem } from '@/entity/interface/sign-coord.interface';
import { CommentModel } from '@/model/comment.model';

export class RouteModel {
  constructor(
    public readonly text: string,
    public readonly startPoint: Coordinates,
    public readonly endPoint: Coordinates,
    public readonly recognizedSigns: Array<SignItem>,
    public readonly userId: string,
    public readonly id: number = 0,
    public readonly createdAt: Date = null,
    public readonly comments: Array<CommentModel> = null,
  ) {}
}
