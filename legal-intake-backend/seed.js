const db = require("./src/models");
const { sequelize, User, Case } = db;
const bcrypt = require("bcrypt");

async function seed() {
  try {
    console.log("🌱 Seeding started...");

    // ⚠️ force true clears old data (important for testing)
    await sequelize.sync({ force: true });

    // 🔐 hash password once
    const hashedPassword = await bcrypt.hash("123456", 10);

    // -----------------------------
    // USERS
    // -----------------------------
    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      passwordHash: hashedPassword,
      role: "admin",
    });

    const lawyer = await User.create({
      name: "Lawyer User",
      email: "lawyer@test.com",
      passwordHash: hashedPassword,
      role: "lawyer",
    });

    const client = await User.create({
      name: "Client User",
      email: "client@legal.com",
      passwordHash: hashedPassword,
      role: "client",
    });

    console.log("✅ Users created");

    // -----------------------------
    // CASES
    // -----------------------------
    const case1 = await Case.create({
      caseTitle: "Fraud Case",
      description: "Financial fraud investigation",
      clientName: "Rahul Sharma",
      clientEmail: "rahul@test.com",
      clientPhone: "9999999999",
      category: "Criminal",
      priority: "high",
      userId: client.id,
      assignedLawyerId: lawyer.id,
    });

    const case2 = await Case.create({
      caseTitle: "Property Dispute",
      description: "Land ownership issue",
      clientName: "Amit Verma",
      clientEmail: "amit@test.com",
      clientPhone: "8888888888",
      category: "Civil",
      priority: "medium",
      userId: client.id,
      assignedLawyerId: lawyer.id,
    });

    const case3 = await Case.create({
      caseTitle: "Defamation Case",
      description: "Online defamation complaint",
      clientName: "Sneha Gupta",
      clientEmail: "sneha@test.com",
      clientPhone: "7777777777",
      category: "Civil",
      priority: "low",
      userId: client.id,
    });

    console.log("✅ Cases created");
    console.log("🎉 Seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding:", error);
  } finally {
    await sequelize.close();
  }
}

seed();