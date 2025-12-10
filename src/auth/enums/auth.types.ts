import { User } from "src/users/entities/user.entity";

export interface FindUserResult {
  user: User | null;
  message: string;
}
