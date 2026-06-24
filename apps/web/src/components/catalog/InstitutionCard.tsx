import { useNavigate } from "react-router-dom";
import { Icon } from "../ui/Icon";
import type { Institution } from "../../types/institution";

type InstitutionCardProps = {
  institution: Institution;
};

export function InstitutionCard({ institution }: InstitutionCardProps) {
  const navigate = useNavigate();

  const getTypeIcon = (type: string) => {
    const lowerType = type ? type.toLowerCase() : "";

    if (lowerType.includes("міністерство") || lowerType.includes("кабмін")) {
      return "CabMin";
    }

    if (lowerType.includes("служб") || lowerType.includes("державн")) {
      return "StateEnterpr";
    }

    if (lowerType.includes("суд") || lowerType.includes("юстиц")) {
      return "Court";
    }

    return "Institutions";
  };

  const formatHeadName = (fullName: string) => {
    if (!fullName || fullName === "-" || fullName === "Не вказано") {
      return "Не вказано";
    }

    const parts = fullName.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1]}`;
    }

    return fullName;
  };

  const handleCardClick = () => {
    navigate(`/institutions/${institution.id}`);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className="institution-card card"
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      {/* ЛІВА ЧАСТИНА */}
      <div className="card-left-content">
        <div className="tags-row">
          <div className="tag-item type-tag">
            <Icon name={getTypeIcon(institution.type)} className="meta-icon" />
            <span>{institution.type}</span>
          </div>
        </div>

        <div className="title-section">
          <h2>{institution.name}</h2>
          <p>{institution.description}</p>
        </div>
      </div>

      {/* ПРАВА ЧАСТИНА (САЙТ ТА КЕРІВНИК) */}
      <div className="card-right-content">
        {institution.website && institution.website !== "-" && (
          <a
            href={institution.website}
            target="_blank"
            rel="noopener noreferrer"
            className="meta-link"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <Icon name="Website" className="meta-icon" />
            <span>{institution.website.replace(/^https?:\/\//, "")}</span>
          </a>
        )}

        <div className="right-meta-item">
          <Icon name="Worker" className="meta-icon leader-icon" />
          <span>{formatHeadName(institution.headName)}</span>
        </div>
      </div>
    </article>
  );
}