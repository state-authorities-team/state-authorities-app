type CatalogToolbarProps = {
  count: number;
};

const getInstitutionLabel = (count: number): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return "установ";
  }
  if (mod10 === 1) {
    return "установа";
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return "установи";
  }
  return "установ";
};

export function CatalogToolbar({ count }: CatalogToolbarProps) {
  return (
    <div className="catalog-toolbar">
      <span>
        Знайдено {count} {getInstitutionLabel(count)}
      </span>
    </div>
  );
}
