import { Link, useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { mockInstitutions } from "../data/mockInstitutions";

export function InstitutionPage() {
	const { id } = useParams();

	const institution =
		mockInstitutions.find((item) => item.id === Number(id)) ??
		mockInstitutions[0];

	return (
		<main className="section">
			<PageContainer>
				<Link className="back-link" to="/catalog">
					← Назад
				</Link>

				<div className="institution-title">
					<p className="eyebrow">Картка установи</p>
					<h1>{institution.name}</h1>
					<p>{institution.description}</p>
				</div>

				<div className="institution-layout">
					<section className="institution-main">
						<div className="card">
							<h2>Основна інформація</h2>

							<dl className="info-list">
								<div>
									<dt>Тип</dt>
									<dd>{institution.type}</dd>
								</div>
								<div>
									<dt>Регіон</dt>
									<dd>{institution.region}</dd>
								</div>
								<div>
									<dt>Адреса</dt>
									<dd>{institution.address}</dd>
								</div>
								<div>
									<dt>Телефон</dt>
									<dd>{institution.phone}</dd>
								</div>
								<div>
									<dt>Email</dt>
									<dd>{institution.email}</dd>
								</div>
								<div>
									<dt>Сайт</dt>
									<dd>{institution.website}</dd>
								</div>
							</dl>
						</div>

						<div className="card">
							<h2>Про установу</h2>
							<p>
								Короткий опис установи. Тут буде розміщена інформація про
								функції, повноваження, напрямки діяльності та роль установи в
								системі державного управління.
							</p>
						</div>
					</section>

					<aside className="institution-sidebar">
						<div className="card">
							<h2>Керівництво</h2>
							<div className="avatar-placeholder">Фото</div>
							<h3>{institution.headName}</h3>
							<p>{institution.headTitle}</p>
						</div>

						<div className="card">
							<h2>Пов’язані установи</h2>
							<ul>
								<li>Міністерство цифрової трансформації</li>
								<li>Міністерство фінансів України</li>
								<li>Міністерство юстиції України</li>
							</ul>
						</div>
					</aside>
				</div>
			</PageContainer>
		</main>
	);
}
