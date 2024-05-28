const zod = require("zod");

const SignInBody = zod.object({
    userName: zod.string().email(),
    password: zod.string()
})

exports.module = SignInBody;