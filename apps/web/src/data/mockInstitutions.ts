import type { Institution } from "../types/institution";

export const mockInstitutions: Institution[] = [
	{
		id: 1,
		name: "Кабінет Міністрів України",
		shortName: "КМУ",
		type: "Центральний орган влади",
		region: "Київ",
		headName: "Денис Шмигаль",
		headTitle: "Прем’єр-міністр України",
		description: "Вищий орган у системі органів виконавчої влади України.",
		address: "м. Київ, вул. М. Грушевського, 12/2",
		phone: "+380 44 256 63 33",
		email: "info@kmu.gov.ua",
		website: "https://www.kmu.gov.ua",
	},
	{
		id: 2,
		name: "Міністерство освіти і науки України",
		shortName: "МОН",
		type: "Міністерство",
		region: "Київ",
		headName: "Оксен Лісовий",
		headTitle: "Міністр освіти і науки України",
		description: "Центральний орган виконавчої влади у сфері освіти і науки.",
		address: "м. Київ, просп. Берестейський, 10",
		phone: "+380 44 481 32 21",
		email: "mon@mon.gov.ua",
		website: "https://mon.gov.ua",
	},
];
