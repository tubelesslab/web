"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearSessionCookie } from "@/lib/admin/cookie";
import { requireSession } from "@/lib/admin/guard";
import { refreshSnapshot } from "@/lib/admin/supabase";

export async function refreshAction(): Promise<void> {
  await requireSession();
  await refreshSnapshot();
  revalidatePath("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
