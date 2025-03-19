import { GraphQLError } from "graphql";
import { _resolveAuthorizationToken } from "./auth";
import { Types } from "mongoose";


export interface IAppContext {
    user: string | Types.ObjectId;
    type: "User";
}

const context = async ({ req }) => {
    let __context: Partial<IAppContext> = {};
    
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const authorizationToken = (
            authorizationHeader.startsWith("Bearer")
                ? authorizationHeader.replace("Bearer", "")
                : authorizationHeader
        ).trim();
        const authorization = await _resolveAuthorizationToken({
            authorizationToken,
        });
        if (authorization) {
            __context.user = authorization?.userId;
            __context.type = authorization?.type;
        } else {
            throw new GraphQLError("Your session has expired", {
                extensions: {
                    code: "UNAUTHENTICATED",
                    myExtension: "",
                },
            });
        }
    }
    return __context;
};





export default context;
