import type { Institution } from "../../types/institution";
import { InstitutionCard } from "./InstitutionCard";

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
