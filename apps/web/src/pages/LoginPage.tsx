import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { Icon } from "../components/ui/Icon";
import { useAdminAuth } from "../auth/useAdminAuth";
import css from "../styles/LoginPage.module.css";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminAuth();

  const state = location.state as LocationState | null;
  const redirectTo = state?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const success = await login(email, password);

      if (!success) {
        setError("Невірний email або пароль адміністратора");
        return;
      }

      navigate(redirectTo, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={css.page}>
      <PageContainer>
        <section className={css.loginCard}>
          <div className={css.iconBox}>
            <Icon name="Worker" size={36} />
          </div>

          <h1>Авторизація адміністратора</h1>

          <p>
            Увійдіть, щоб отримати доступ до адмін-панелі керування каталогом.
          </p>

          <form className={css.form} onSubmit={handleSubmit}>
            <label className={css.field}>
              <span>Email</span>
              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className={css.field}>
              <span>Пароль</span>
              <input
                type="password"
                placeholder="Введіть пароль"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {error && <p className={css.error}>{error}</p>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Вхід..." : "Увійти"}
            </button>
          </form>
        </section>
      </PageContainer>
    </main>
  );
}