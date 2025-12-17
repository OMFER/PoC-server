import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { Role } from "../../common/rol.enums";
import { AuthGuard } from "../guard/auth.guard";
import { RolesGuard } from "../guard/roles.guard";
import { Roles } from "./roles.decorator";

export function Auth(role: Role) {
    return applyDecorators(UseGuards(AuthGuard, RolesGuard), Roles(role),)
}