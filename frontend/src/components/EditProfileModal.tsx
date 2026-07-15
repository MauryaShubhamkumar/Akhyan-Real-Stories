import {
  useState,
  type FormEvent,
} from "react";

import { X } from "lucide-react";
import axios from "axios";

import { api } from "../api/client";
import type { ProfileData } from "../types";

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

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await api.patch(
        "/profile",
        form
      );

      onUpdated({
        ...profile,
        ...response.data.profile,
      });

      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "Unable to update profile"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-paper p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold">
            Edit profile
          </h2>

          <button
            onClick={onClose}
            className="text-muted hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <ProfileField
            label="Bio"
            value={form.bio}
            maxLength={300}
            onChange={(value) =>
              updateField("bio", value)
            }
          />

          <ProfileField
            label="Employment"
            value={form.employment}
            maxLength={150}
            onChange={(value) =>
              updateField("employment", value)
            }
          />

          <ProfileField
            label="Education"
            value={form.education}
            maxLength={150}
            onChange={(value) =>
              updateField("education", value)
            }
          />

          <ProfileField
            label="Location"
            value={form.location}
            maxLength={100}
            onChange={(value) =>
              updateField("location", value)
            }
          />

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary rounded-full px-5 py-2.5 text-sm"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              className="btn-primary rounded-full px-6 py-2.5 text-sm font-medium"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
}

function ProfileField({
  label,
  value,
  maxLength,
  onChange,
}: ProfileFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        maxLength={maxLength}
        rows={label === "Bio" ? 3 : 2}
        className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:border-accent"
      />

      <p className="mt-1 text-right text-xs text-muted">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
