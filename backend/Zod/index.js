const zod = require("zod");

const UserZod = zod.object({
    userName: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

exports.moudle = UserZod;