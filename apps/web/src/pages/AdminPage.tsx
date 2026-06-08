import { useEffect, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { Icon } from "../components/ui/Icon";
import styles from "../styles/AdminPage.module.css";
import { Institution } from "../types/institution";

const fetchAdminData = (): Promise<Institution[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    tags: ["Державна служба"],
                    title: "Державна митна служба України",
                    desc: "Центральний орган виконавчої влади, який реалізує державну митну політику",
                    manager: "Тарас Висоцький",
                    employees: "18500 співробітників",
                    website: "customs.gov.ua"
                },
                {
                    id: 2,
                    tags: ["Вищий орган виконавчої влади"],
                    title: "Кабінет Міністрів України",
                    desc: "Вищий орган у системі органів виконавчої влади України",
                    manager: "Денис Шмигаль",
                    employees: "450 співробітників",
                    website: "www.kmu.gov.ua"
                },
                {
                    id: 3,
                    tags: ["Обласна рада", "Київ"],
                    title: "Київська міська рада",
                    desc: "Представницький орган місцевого самоврядування у місті Києві",
                    manager: "Віталій Кличко",
                    employees: "450 співробітників",
                    website: "kmr.gov.ua"
                },
                {
                    id: 4,
                    tags: ["Державне підприємство"],
                    title: 'Державне підприємство "Дія"',
                    desc: "Державне підприємство, що забезпечує функціонування цифрових державних послуг",
                    manager: "Євген Федченко",
                    employees: "420 співробітників",
                    website: "diia.gov.ua"
                },
                {
                    id: 5,
                    tags: ["Міністерство"],
                    title: "Міністерство оборони України",
                    desc: "Забезпечує формування та реалізацію державної політики з питань національної безпеки у воєнній сфері, сферах оборони і військового будівництва",
                    manager: "Рустем Умєров",
                    employees: "1 250 співробітників",
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
                                            {inst.tags.map((tag) => (
                                                <span key={tag} className={styles.tagBadge}>{tag}</span>
                                            ))}
                                        </div>
                                        <h3 className={styles.cardTitle}>{inst.title}</h3>
                                        <p className={styles.cardDesc}>{inst.desc}</p>
                                    </div>

                                    <div className={styles.metaDetails}>
                                        <div className={styles.metaItem}>
                                            <Icon name="user" />
                                            <span>{inst.manager}</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <Icon name="users" />
                                            <span>{inst.employees}</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <Icon name="globe" />
                                            <a href={`https://${inst.website}`} target="_blank" rel="noreferrer">{inst.website}</a>
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
