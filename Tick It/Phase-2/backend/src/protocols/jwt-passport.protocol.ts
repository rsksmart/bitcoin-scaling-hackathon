import { Inject, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Arg, OnVerify, Protocol } from "@tsed/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { envs } from "../config/envs";
import { USER_REPOSITORY } from "../repositories/user/user.repository";

@Protocol({
    name: "jwt-passport",
    useStrategy: Strategy,
    settings: {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: envs.JWT_KEY,
        issuer: envs.JWT_ISSUER,
        audience: envs.JWT_AUDIENCE,
    },
})
export class JwtPassportProtocol implements OnVerify {
    @Inject(USER_REPOSITORY)
    userRepository: USER_REPOSITORY;

    async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
        const user = this.userRepository.findOne({
            where: {
                id: jwtPayload.sub,
            },
        });

        if (!user) {
            throw new Unauthorized("Invalid JWT token");
        }

        return (req.user = user);
    }
}
