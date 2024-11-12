import { RatingModel } from '@/model/rating.model';
import { Injectable } from '@nestjs/common';
import { RatingResponse, UserResponse } from '../dto/responce.dto';
import { UserModel } from '../model/user.model';

@Injectable()
export class UserFormatter {
  public toUserResponse(user: UserModel): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      rating: this.toUserRatingResponse(user.rating),
    };
  }

  public toUserRatingResponse(rating: RatingModel): RatingResponse {
    return {
      id: rating.id,
      userId: rating.userId,
      recognizedSigns: rating.recognizedSigns,
      addedComments: rating.addedComments,
    };
  }
}
