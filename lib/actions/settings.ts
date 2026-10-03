"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ActionResult = { success: true } | { success: false; error: string };

export async function updatePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated." };
    }

    if (data.newPassword.length < 8) {
      return {
        success: false,
        error: "New password must be at least 8 characters.",
      };
    }
    if (data.newPassword !== data.confirmPassword) {
      return { success: false, error: "New passwords don't match." };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return { success: false, error: "User not found." };
    }

    const isCurrentValid = await bcrypt.compare(
      data.currentPassword,
      user.password
    );
    if (!isCurrentValid) {
      return { success: false, error: "Current password is incorrect." };
    }

    const newHash = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHash },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
}
