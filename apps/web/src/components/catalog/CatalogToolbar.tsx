type CatalogToolbarProps = {
  count: number;
};

export function CatalogToolbar({ count }: CatalogToolbarProps) {
  return (
    <div className="catalog-toolbar">
      <span>Знайдено {count} установи</span>
    </div>
  );
}
