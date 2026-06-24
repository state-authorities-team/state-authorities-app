import type { Institution } from "../../types/institution";
import { InstitutionCard } from "./InstitutionCard";
import css from "../../styles/InstitutionList.module.css";

type InstitutionListProps = {
  institutions: Institution[];
};

export function InstitutionList({ institutions }: InstitutionListProps) {
  return (
    <div className={css.listContainer}>
      {institutions.map((institution) => (
        <InstitutionCard key={institution.id} institution={institution} />
      ))}
    </div>
  );
}
