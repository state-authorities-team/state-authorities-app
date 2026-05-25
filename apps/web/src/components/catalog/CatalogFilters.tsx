export function CatalogFilters() {
	return (
		<aside className="filters-panel card">
			<h2>Фільтри</h2>

			<label>
				Пошук
				<input placeholder="Назва установи" />
			</label>

			<label>
				Категорія
				<select>
					<option>Усі категорії</option>
					<option>Міністерства</option>
					<option>Служби</option>
				</select>
			</label>

			<label>
				Регіон
				<select>
					<option>Усі регіони</option>
					<option>Київ</option>
					<option>Львів</option>
				</select>
			</label>

			<button>Скинути фільтри</button>
		</aside>
	);
}
