"use client";

import { useState, useTransition } from "react";
import { updatePassword } from "@/lib/actions/settings";
import { useToast } from "../_components/Toast";
import { Field, TextInput, SaveButton } from "../_components/FormFields";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (result.success) {
        showToast("Password updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(result.error);
        showToast(result.error, "error");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md rounded-[18px] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <Field label="Current password" htmlFor="currentPassword">
        <TextInput
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </Field>

      <Field label="New password" htmlFor="newPassword">
        <TextInput
          id="newPassword"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
        />
      </Field>

      <Field label="Confirm new password" htmlFor="confirmPassword">
        <TextInput
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={8}
          required
        />
      </Field>

      {error && (
        <p className="mb-4 text-[13px] text-[#d70015]" role="alert">
          {error}
        </p>
      )}

      <SaveButton loading={isPending}>Update password</SaveButton>
    </form>
  );
}
