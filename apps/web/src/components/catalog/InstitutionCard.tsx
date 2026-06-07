import { Icon } from "../ui/Icon";
import type { Institution } from "../../types/institution";

type InstitutionCardProps = {
  institution: Institution & { count?: number };
};

export function InstitutionCard({ institution }: InstitutionCardProps) {
  const getTypeIcon = (type: string) => {
    const lowerType = type ? type.toLowerCase() : "";
    if (lowerType.includes("міністерство") || lowerType.includes("кабмін"))
      return "CabMin";
    if (lowerType.includes("служб") || lowerType.includes("державн"))
      return "StateEnterpr";
    if (lowerType.includes("суд") || lowerType.includes("юстиц"))
      return "Court";
    return "Institutions";
  };

  const formatHeadName = (fullName: string) => {
    if (!fullName || fullName === "-") return "";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1]}`;
    }
    return fullName;
  };

  return (
    <article className="institution-card card">
      {/* ЛІВА ЧАСТИНА (ТЕГИ ЗВЕРХУ, НАЗВА ТА ОПИС ЗНИЗУ) */}
      <div className="card-left-content">
        <div className="tags-row">
          <div className="tag-item type-tag">
            <Icon name={getTypeIcon(institution.type)} className="meta-icon" />
            <span>{institution.type}</span>
          </div>
          <div className="tag-item region-tag">
            <Icon name="Regions" className="meta-icon" />
            <span>{institution.region}</span>
          </div>
        </div>

        <div className="title-section">
          <h2>{institution.name}</h2>
          <p>{institution.description}</p>
        </div>
      </div>

      {/* ПРАВА ЧАСТИНА (САЙТ, КЕРІВНИК, СПІВРОБІТНИКИ) */}
      <div className="card-right-content">
        {/* 1. Сайт */}
        {institution.website && institution.website !== "-" && (
          <a
            href={institution.website}
            target="_blank"
            rel="noopener noreferrer"
            className="meta-link"
          >
            <Icon name="Website" className="meta-icon" />
            <span>{institution.website.replace(/^https?:\/\//, "")}</span>
          </a>
        )}

        {/* 2. Керівник (без по батькові) */}
        {institution.headName && institution.headName !== "-" && (
          <div className="right-meta-item">
            <Icon name="Worker" className="meta-icon leader-icon" />
            <span>{formatHeadName(institution.headName)}</span>
          </div>
        )}

        {/* 3. Кількість співробітників */}
        <div className="right-meta-item">
          <Icon name="Workers" className="meta-icon" />
          <span>{institution.count || 142} співробітників</span>
        </div>
      </div>
    </article>
  );
}
