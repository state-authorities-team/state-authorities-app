type CatalogToolbarProps = {
	count: number;
};

export function CatalogToolbar({ count }: CatalogToolbarProps) {
	return (
		<div className="catalog-toolbar">
			<input placeholder="Шукати в каталозі..." />
			<span>Знайдено {count} установи</span>
		</div>
	);
}
