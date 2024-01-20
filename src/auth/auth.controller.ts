import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { SignInDto } from "./dtos/signIn.dto";
import { UpdateUserRoleDto } from "./dtos/update-user-role.dto";
import { Roles } from "./decorator/roles.decorator";
import { UserRole } from "./dtos/role.enum";
import { RolesGuard } from "./guards/roles.guard";
import { Public } from "./decorator/public.decorator";

@Controller("auth")
// @Serialize(UserDto)  -> not used
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("login")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post("/register")
  async createUser(@Body() user: CreateUserDto) {
    const userCreate = await this.authService.signUp(user);
    return userCreate;
  }

  @Get("/profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  @Post("/updateUserRole")
  async updateUserRole(@Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.authService.updateUserRole(updateUserRoleDto);
  }
}

// LOGOUT NOT WORK IN BACK-END
// @UseGuards(AuthGuard)
// @Post("logout")
// logout(@Res() res: Response): void {
//   const cookieName = "your_custom_cookie_name"; // Replace with your custom cookie name

//   // Clear the custom cookie on the server side (assuming you're using cookies)
//   res.clearCookie(cookieName);

//   // Send a response indicating a successful logout
//   res.status(HttpStatus.OK).json({ message: "Logout successful" });
// }

// FOR FRONT-END
// auth.service.ts (Angular example)
// import { Injectable } from "@angular/core";

// @Injectable({
//   providedIn: "root",
// })
// export class AuthService {
//   private token: string | null = null;

//   login(token: string): void {
//     this.token = token;
//   }

//   logout(): void {
//     this.token = null;
//   }

//   getToken(): string | null {
//     return this.token;
//   }
// }
