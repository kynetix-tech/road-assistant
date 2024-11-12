export class RatingModel {
  constructor(
    public readonly recognizedSigns: number,
    public readonly addedComments: number,
    public readonly userId: string,
    public readonly id: number = 0,
  ) {}
}
