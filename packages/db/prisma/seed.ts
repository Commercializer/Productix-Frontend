import 'dotenv/config';
import { prisma } from '../src/client';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log("🌱 Seeding Productix database...\n");

  // ── 1. Create Super Admin user ──────────────────────────────
  const superAdminEmail = "admin@productix.com";
  const superAdminPassword = "ChangeMe123!"; // MUST be changed after first login

  console.log(`Creating/Updating Super Admin: ${superAdminEmail}`);

  try {
    const passwordHash = await bcrypt.hash(superAdminPassword, 10);
    
    const user = await prisma.user.upsert({
      where: { email: superAdminEmail },
      update: {
        passwordHash,
        role: "SUPER_ADMIN",
      },
      create: {
        email: superAdminEmail,
        passwordHash,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    console.log(`   ✅ Super Admin ready: ${user.id}\n`);

    // ── 2. Create a sample Tenant ──────────────────────────────
    console.log("Creating/Updating sample tenant...");

    // Usually upsert requires a unique field. ID is not provided manually here so we can findFirst or create.
    // For simplicity, we find First matching email or create
    let tenant = await prisma.tenant.findFirst({
      where: { email: "demo@productix.com" }
    });

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: "Productix Demo",
          email: "demo@productix.com",
          tenantType: "CORPORATE",
          maximumBrandProfiles: 10,
          maximumProducts: 100,
          isActive: true,
        }
      });
      console.log(`   ✅ Tenant created: ${tenant.id}\n`);
    } else {
      console.log(`   ✅ Tenant exists: ${tenant.id}\n`);
    }

    // ── 3. Link Super Admin to Tenant ──────────────────────────
    console.log("Linking Super Admin to tenant...");
    
    await prisma.tenantAdmin.upsert({
      where: { userId: user.id },
      update: { tenantId: tenant.id },
      create: {
        userId: user.id,
        tenantId: tenant.id
      }
    });
    console.log("   ✅ Super Admin linked to tenant.\n");

    // ── 4. Create a sample Company ──────────────────────────────
    console.log("Creating/Updating sample company...");
    
    let company = await prisma.company.findFirst({
      where: { businessUsername: "demo-company" }
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          tenantId: tenant.id,
          name: "Demo Company",
          email: "company@productix.com",
          businessUsername: "demo-company",
          subscriptionPlan: "PREMIUM",
          subscriptionStatus: "ACTIVE",
          maximumBrandProfiles: 5,
          maximumProducts: 50,
          maximumUsers: 10,
          isActive: true,
        }
      });
      console.log(`   ✅ Company created: ${company.id}\n`);
    } else {
      console.log(`   ✅ Company exists: ${company.id}\n`);
    }

    console.log("─────────────────────────────────────────");
    console.log("🎉 Seed complete!");
    console.log("");
    console.log("Super Admin credentials:");
    console.log(`  Email:    ${superAdminEmail}`);
    console.log(`  Password: ${superAdminPassword}`);
    console.log("");
    console.log("⚠️  Change the password immediately after first login!");
    console.log("─────────────────────────────────────────");
    
  } catch (error) {
    console.error("   ❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
