import { Link } from "react-router-dom";
import type { Institution } from "../../types/institution";

type InstitutionCardProps = {
	institution: Institution;
};

export function InstitutionCard({ institution }: InstitutionCardProps) {
	return (
		<article className="institution-card card">
			<div>
				<h2>{institution.name}</h2>
				<p>{institution.description}</p>
			</div>

			<div className="institution-meta">
				<span>{institution.type}</span>
				<span>{institution.region}</span>
			</div>

			<Link to={`/institutions/${institution.id}`}>Детальніше →</Link>
		</article>
	);
}
