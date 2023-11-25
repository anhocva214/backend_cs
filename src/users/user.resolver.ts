import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class UserResolver {
  @Query((returns) => String)
  async users(): Promise<string> {
    return "Hello world!";
  }
}