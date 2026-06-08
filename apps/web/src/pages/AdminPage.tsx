import { useEffect, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { Icon } from "../components/ui/Icon";
import styles from "../styles/AdminPage.module.css";
import {Institution} from "../types/institution"

export type Institution = {
	id: number;
	name: string;
	shortName?: string;
	type: string;
	region: string;
	headName: string;
	headTitle: string;
	description: string;
	address: string;
	phone: string;
	email: string;
	website: string;
};

const fetchAdminData = (): Promise<Institution[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    name: "Державна митна служба України",
                    type: "Державна служба",
                    region: "Київська область",
                    headName: "Тарас Висоцький",
                    headTitle: "Голова",
                    description: "Центральний орган виконавчої влади, який реалізує державну митну політику",
                    address: "м. Київ, вул. Дегтярівська, 11г",
                    phone: "+380 44 123 45 67",
                    email: "info@customs.gov.ua",
                    website: "customs.gov.ua"
                },
                {
                    id: 2,
                    name: "Кабінет Міністрів України",
                    type: "Вищий орган виконавчої влади",
                    region: "Київ",
                    headName: "Денис Шмигаль",
                    headTitle: "Прем'єр-міністр",
                    description: "Вищий орган у системі органів виконавчої влади України",
                    address: "м. Київ, вул. Грушевського, 12/2",
                    phone: "1545",
                    email: "contact@kmu.gov.ua",
                    website: "www.kmu.gov.ua"
                },
                {
                    id: 3,
                    name: "Київська міська рада",
                    type: "Місцеве самоврядування",
                    region: "м. Київ",
                    headName: "Віталій Кличко",
                    headTitle: "Міський голова",
                    description: "Представницький орган місцевого самоврядування у місті Києві",
                    address: "м. Київ, вул. Хрещатик, 36",
                    phone: "+380 44 202 70 00",
                    email: "info@kmr.gov.ua",
                    website: "kmr.gov.ua"
                },
                {
                    id: 4,
                    name: 'Державне підприємство "Дія"',
                    type: "Державне підприємство",
                    region: "Київ",
                    headName: "Євген Федченко",
                    headTitle: "Керівник",
                    description: "Державне підприємство, що забезпечує функціонування цифрових державних послуг",
                    address: "м. Київ, вул. Ділова, 24",
                    phone: "+380 44 000 00 00",
                    email: "hello@diia.gov.ua",
                    website: "diia.gov.ua"
                },
                {
                    id: 5,
                    name: "Міністерство оборони України",
                    type: "Міністерство",
                    region: "Київ",
                    headName: "Рустем Умєров",
                    headTitle: "Міністр",
                    description: "Забезпечує формування та реалізацію державної політики з питань национальної безпеки у воєнній сфері",
                    address: "м. Київ, Повітрофлотський проспект, 6",
                    phone: "+380 44 235 68 89",
                    email: "admou@mil.gov.ua",
                    website: "www.mil.gov.ua"
                }
            ]);
        }, 300);
    });
};

function CatalogToolbar() {
    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarHeader}>
                <Icon name="filter" />
                <h2>Панель</h2>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Створення установ</h3>
                <button className={styles.toolbarBtn}>
                    <Icon name="plus" /> Додати установу
                </button>
                <button className={styles.toolbarBtn}>
                    <Icon name="download" /> Імпорт CSV
                </button>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Пошук</h3>
                <div className={styles.inputWrapper}>
                    <input 
                        type="text" 
                        placeholder="Назва установи..." 
                        className={styles.input} 
                    />
                    <div className={styles.searchIcon}>
                        <Icon name="search" />
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Категорія</h3>
                <select className={styles.select}>
                    <option>Усі категорії</option>
                </select>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Тип установи</h3>
                <select className={styles.select}>
                    <option>Усі типи</option>
                </select>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Регіон</h3>
                <select className={styles.select}>
                    <option>Усі регіони</option>
                </select>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Сортування</h3>
                <select className={styles.select}>
                    <option>За назвою</option>
                </select>
            </div>

            <button className={styles.resetBtn}>Скинути фільтри</button>
        </div>
    );
}

export function AdminPage() {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        async function loadAdminData() {
            try {
                const data = await fetchAdminData();
                if (isMounted) setInstitutions(data);
            } catch (error) {
                console.error("Помилка завантаження даних:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadAdminData();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <main className={styles.adminPage}>
            <PageContainer>
                <div className={styles.headerBlock}>
                    <h1 className={styles.title}>Адмін-панель</h1>
                    {!isLoading && (
                        <p className={styles.subtitle}>Знайдено {institutions.length} установ</p>
                    )}
                </div>

                <div className={styles.catalogLayout}>
                    <aside className={styles.sidebarBlock}>
                        <CatalogToolbar />
                    </aside>

                    <main className={styles.catalogContent}>
                        {isLoading ? (
                            <p className={styles.loadingText}>Завантаження списку установ...</p>
                        ) : (
                            institutions.map((inst) => (
                                <article key={inst.id} className={styles.adminCard}>
                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardTags}>
                                            <span className={styles.tagBadge}>{inst.type}</span>
                                            <span className={styles.tagBadge}>{inst.region}</span>
                                        </div>
                                        <h3 className={styles.cardTitle}>{inst.name}</h3>
                                        <p className={styles.cardDesc}>{inst.description}</p>
                                    </div>

                                    <div className={styles.metaDetails}>
                                        <div className={styles.metaItem}>
                                            <Icon name="user" />
                                            <span>{inst.headName} ({inst.headTitle})</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <Icon name="globe" />
                                            <a href={`https://${inst.website}`} target="_blank" rel="noreferrer">{inst.website}</a>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <Icon name="phone" />
                                            <span>{inst.phone}</span>
                                        </div>
                                    </div>

                                    <div className={styles.adminCardActions}>
                                        <button className={`${styles.actionBtn} ${styles.edit}`} title="Редагувати">
                                            <Icon name="edit" />
                                        </button>
                                        <button className={`${styles.actionBtn} ${styles.view}`} title="Переглянути">
                                            <Icon name="eye" />
                                        </button>
                                        <button className={`${styles.actionBtn} ${styles.delete}`} title="Вилучити">
                                            <Icon name="trash" />
                                        </button>
                                    </div>
                                </article>
                            ))
                        )}

                        {!isLoading && (
                            <div className={styles.adminPagination}>
                                <button className={styles.pagBtn} disabled>&lt;</button>
                                <button className={`${styles.pagBtn} ${styles.active}`}>1</button>
                                <button className={styles.pagBtn}>2</button>
                                <button className={styles.pagBtn}>3</button>
                                <span className={styles.pagDots}>...</span>
                                <button className={styles.pagBtn}>10</button>
                                <button className={styles.pagBtn}>&gt;</button>
                            </div>
                        )}
                    </main>
                </div>
            </PageContainer>
        </main>
    );
}
