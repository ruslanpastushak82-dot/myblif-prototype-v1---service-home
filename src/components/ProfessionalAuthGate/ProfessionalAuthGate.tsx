import { FormEvent, ReactNode, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type ProfessionalAuthGateProps = {
  children: ReactNode;
};

type GateState = "checking" | "authorized" | "unauthorized";

const hasProfessionalProfile = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return false;
  }

  return data?.account_type === "professional";
};

export const ProfessionalAuthGate = ({
  children,
}: ProfessionalAuthGateProps): JSX.Element => {
  const [gateState, setGateState] = useState<GateState>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const checkCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !user) {
        setGateState("unauthorized");
        return;
      }

      const allowed = await hasProfessionalProfile(user.id);
      if (!active) return;

      setGateState(allowed ? "authorized" : "unauthorized");
    };

    void checkCurrentUser();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setErrorMessage("Невірний email або пароль.");
      setSubmitting(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      await supabase.auth.signOut();
      setErrorMessage("Не вдалося підтвердити поточну сесію.");
      setSubmitting(false);
      return;
    }

    const allowed = await hasProfessionalProfile(user.id);

    if (!allowed) {
      await supabase.auth.signOut();
      setErrorMessage("Цей акаунт не має доступу до Professional Cabinet.");
      setSubmitting(false);
      return;
    }

    setPassword("");
    setSubmitting(false);
    setGateState("authorized");
  };

  if (gateState === "checking") {
    return <div style={{ padding: 32 }}>Перевірка доступу…</div>;
  }

  if (gateState === "authorized") {
    return <>{children}</>;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f7f7f5",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 380,
          display: "grid",
          gap: 16,
          padding: 28,
          border: "1px solid #deded8",
          borderRadius: 16,
          background: "#ffffff",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>MYBLIF Service</h1>
          <p style={{ margin: "8px 0 0" }}>Professional sign in</p>
        </div>

        <label style={{ display: "grid", gap: 6 }}>
          Email
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{ padding: 12, fontSize: 16 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{ padding: 12, fontSize: 16 }}
          />
        </label>

        {errorMessage ? (
          <p role="alert" style={{ margin: 0 }}>
            {errorMessage}
          </p>
        ) : null}

        <button type="submit" disabled={submitting} style={{ padding: 12 }}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
};
