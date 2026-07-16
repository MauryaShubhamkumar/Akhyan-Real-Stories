import { useState, type FormEvent } from "react";
import axios from "axios";

import type { ProfileData } from "../../types";
import Dialog from "../ui/Dialog";
import { Button, Field, Textarea } from "../ui";
import { updateProfile } from "../../features/profile/api";

interface Props {
  profile: ProfileData;
  onClose: () => void;
  onUpdated: (profile: ProfileData) => void;
}

export default function EditProfileModal({
  profile,
  onClose,
  onUpdated,
}: Props) {
  const [form, setForm] = useState({
    bio: profile.bio ?? "",
    employment: profile.employment ?? "",
    education: profile.education ?? "",
    location: profile.location ?? "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const data = await updateProfile(form);

      onUpdated({
        ...profile,
        ...data.profile,
      });

      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ?? "Unable to update profile"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog isOpen={true} onClose={onClose} title="Edit profile" size="md">
      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        <ProfileField
          label="Bio"
          value={form.bio}
          maxLength={300}
          rows={3}
          onChange={(value) => updateField("bio", value)}
        />

        <ProfileField
          label="Employment"
          value={form.employment}
          maxLength={150}
          rows={2}
          onChange={(value) => updateField("employment", value)}
        />

        <ProfileField
          label="Education"
          value={form.education}
          maxLength={150}
          rows={2}
          onChange={(value) => updateField("education", value)}
        />

        <ProfileField
          label="Location"
          value={form.location}
          maxLength={100}
          rows={2}
          onChange={(value) => updateField("location", value)}
        />

        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

        <div className="flex justify-end gap-3 pt-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save profile
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string;
  maxLength: number;
  rows?: number;
  onChange: (value: string) => void;
}

function ProfileField({
  label,
  value,
  maxLength,
  rows = 2,
  onChange,
}: ProfileFieldProps) {
  return (
    <Field
      label={label}
      helperText={`${value.length}/${maxLength}`}
    >
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        rows={rows}
        className="resize-none"
      />
    </Field>
  );
}
