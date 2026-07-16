import {
  useState,
  type FormEvent,
} from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";
import { Button, H1, Text, Field, Input } from "../components/ui";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await signup(username, email, password);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "Unable to create account"
        );
      } else {
        setError("Unable to create account");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-5 py-12">
      <div className="w-full">
        <H1>
          Join Akhyan.
        </H1>

        <Text className="mt-3 text-muted">
          Stories worth telling. A place to share yours.
        </Text>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5"
        >
          <Field label="Username" required>
            <Input
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              required
              minLength={3}
              maxLength={30}
            />
          </Field>

          <Field label="Email" required>
            <Input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </Field>

          <Field label="Password" required helperText="At least 8 characters.">
            <Input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              minLength={8}
              maxLength={72}
            />
          </Field>

          {error && (
            <p className="text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          <Button
            type="submit"
            loading={submitting}
            className="w-full"
          >
            Create account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-ink underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}