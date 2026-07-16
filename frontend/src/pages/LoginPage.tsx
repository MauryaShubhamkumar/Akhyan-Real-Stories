import {
  useState,
  type FormEvent,
} from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";
import { Button, H1, Text, Field, Input } from "../components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

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
      await login(email, password);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "Unable to login"
        );
      } else {
        setError("Unable to login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-5 py-12">
      <div className="w-full">
        <H1>
          Welcome back.
        </H1>

        <Text className="mt-3 text-muted">
          Continue reading and sharing stories on Akhyan.
        </Text>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5"
        >
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

          <Field label="Password" required>
            <Input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
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
            Sign in
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          New here?{" "}
          <Link
            to="/signup"
            className="font-medium text-ink underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}