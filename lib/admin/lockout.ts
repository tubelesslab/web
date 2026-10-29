import { patchCredentials, type Credentials } from "./supabase";

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export function isLocked(row: Credentials): boolean {
  return !!row.locked_until && Date.parse(row.locked_until) > Date.now();
}

export async function registerFailure(row: Credentials): Promise<void> {
  // bloqueio vencido: a contagem recomeca do zero
  const expired = !!row.locked_until && Date.parse(row.locked_until) <= Date.now();
  const attempts = (expired ? 0 : row.failed_attempts) + 1;
  await patchCredentials(row.email, {
    failed_attempts: attempts,
    locked_until: attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCK_MS).toISOString() : null,
  });
}

export async function registerSuccess(email: string): Promise<void> {
  await patchCredentials(email, {
    failed_attempts: 0,
    locked_until: null,
    last_login_at: new Date().toISOString(),
  });
}
