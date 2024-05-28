const zod = require("zod");

const UserZod = zod.object({
    userName: zod.string().email(), // Validate as an email
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6) // Minimum 6 characters for password
});

module.exports = { UserZod }; // Corrected export statement
