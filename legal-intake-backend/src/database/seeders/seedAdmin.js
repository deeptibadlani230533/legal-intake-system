const bcrypt = require("bcrypt");
const { User } = require("../../models");

async function seedAdmin() {
  try {
    const existingAdmin = await User.findOne({
      where: { role: "admin" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      await User.create({
        name: "System Admin",
        email: "admin@legal.com",
        passwordHash: hashedPassword,
        role: "admin",
      });

      console.log("✅ Admin user created successfully");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
}

module.exports = seedAdmin;