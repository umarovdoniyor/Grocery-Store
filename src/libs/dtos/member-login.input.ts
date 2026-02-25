import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class MemberLoginInput {
  @Field()
  @IsNotEmpty({ message: "Email or phone is required" })
  @IsString()
  identifier: string; // Can be email or phone number

  @Field()
  @IsNotEmpty({ message: "Password is required" })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  memberPassword: string;
}
