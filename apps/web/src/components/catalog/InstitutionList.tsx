import type { Institution } from "../../types/institution";
import { InstitutionCard } from "./InstitutionCard"; // 👈 Імпортуємо правильну картку з сусіднього файлу

type InstitutionListProps = {
  institutions: Institution[];
};

export function InstitutionList({ institutions }: InstitutionListProps) {
  return (
    <div className="institution-list">
      {institutions.map((institution) => (
        <InstitutionCard key={institution.id} institution={institution} />
      ))}
    </div>
  );
}
