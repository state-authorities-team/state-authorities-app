import { useEffect, useState } from "react";
import type { Agency, AgencyPayload, AgencyType } from "../../types/agency";
import styles from "./AdminAgencyForm.module.css";

type AdminAgencyFormProps = {
  isOpen: boolean;
  agency: Agency | null;
  agencyTypes: AgencyType[];
  isSaving: boolean;
  readOnly?: boolean;
  onClose: () => void;
  onSubmit: (payload: AgencyPayload) => Promise<void>;
};

type FormState = {
  name: string;
  shortName: string;
  typeId: string;
  headName: string;
  headTitle: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  region: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  name: "",
  shortName: "",
  typeId: "",
  headName: "",
  headTitle: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  region: "",
};

export function AdminAgencyForm({
  isOpen,
  agency,
  agencyTypes,
  isSaving,
  readOnly = false,
  onClose,
  onSubmit,
}: AdminAgencyFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) return;

    queueMicrotask(() => {
        setErrors({});

        if (agency) {
        setForm({
          name: agency.name || "",
          shortName: agency.shortName || "",
          typeId: agency.typeId ? String(agency.typeId) : "",
          headName: agency.headName || "",
          headTitle: agency.headTitle || "",
          description: agency.description || "",
          address: agency.address || "",
          phone: agency.phone || "",
          email: agency.email || "",
          website: agency.website || "",
          region: agency.region || "",
        });

        return;
      }

      setForm(emptyForm);
    });
  }, [agency, agencyTypes, isOpen]);

  if (!isOpen) return null;

  const updateField = (field: keyof FormState, value: string) => {
    if (readOnly) return;

    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Вкажіть назву установи.";
    }

    if (!form.typeId) {
      nextErrors.typeId = "Оберіть тип установи.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (readOnly) return;

    if (!validateForm()) return;

    const payload: AgencyPayload = {
      name: form.name.trim(),
      typeId: Number(form.typeId),
    };

    const addOptionalField = (key: keyof AgencyPayload, value: string) => {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        payload[key] = trimmedValue as never;
      }
    };

    addOptionalField("shortName", form.shortName);
    addOptionalField("headName", form.headName);
    addOptionalField("headTitle", form.headTitle);
    addOptionalField("description", form.description);
    addOptionalField("address", form.address);
    addOptionalField("phone", form.phone);
    addOptionalField("email", form.email);
    addOptionalField("website", form.website);
    addOptionalField("region", form.region);

    await onSubmit(payload);
  };

  const title = readOnly
    ? "Перегляд картки установи"
    : agency
      ? "Редагувати установу"
      : "Додати установу";

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{title}</h2>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрити"
          >
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label
            className={`${styles.field} ${
              errors.name ? styles.fieldError : ""
            }`}
          >
            <span>Назва установи *</span>
            <input
              value={form.name}
              disabled={readOnly}
              onChange={(event) => updateField("name", event.target.value)}
            />
            {errors.name && (
              <span className={styles.errorText}>{errors.name}</span>
            )}
          </label>

          <label className={styles.field}>
            <span>Коротка назва</span>
            <input
              value={form.shortName}
              disabled={readOnly}
              onChange={(event) => updateField("shortName", event.target.value)}
            />
          </label>

          <label
            className={`${styles.field} ${
              errors.typeId ? styles.fieldError : ""
            }`}
          >
            <span>Тип установи *</span>
            <select
              value={form.typeId}
              disabled={readOnly}
              onChange={(event) => updateField("typeId", event.target.value)}
            >
              <option value="">Оберіть тип</option>

              {agencyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.typeId && (
              <span className={styles.errorText}>{errors.typeId}</span>
            )}
          </label>

          <label className={styles.field}>
            <span>Керівник</span>
            <input
              value={form.headName}
              disabled={readOnly}
              onChange={(event) => updateField("headName", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Посада керівника</span>
            <input
              value={form.headTitle}
              disabled={readOnly}
              onChange={(event) => updateField("headTitle", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Регіон</span>
            <input
              value={form.region}
              disabled={readOnly}
              onChange={(event) => updateField("region", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Адреса</span>
            <input
              value={form.address}
              disabled={readOnly}
              onChange={(event) => updateField("address", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Телефон</span>
            <input
              value={form.phone}
              disabled={readOnly}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              disabled={readOnly}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Вебсайт</span>
            <input
              value={form.website}
              disabled={readOnly}
              onChange={(event) => updateField("website", event.target.value)}
            />
          </label>

          <label className={styles.fieldFull}>
            <span>Опис</span>
            <textarea
              rows={4}
              value={form.description}
              disabled={readOnly}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
            />
          </label>

          <div className={styles.actions}>
            <button
              type="button"
              className={readOnly ? styles.submitButton : styles.cancelButton}
              onClick={onClose}
            >
              {readOnly ? "Закрити" : "Скасувати"}
            </button>

            {!readOnly && (
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSaving}
              >
                {isSaving ? "Збереження..." : "Зберегти"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}