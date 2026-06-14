import { useEffect, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { Icon } from "../components/ui/Icon";
import styles from "../styles/AdminPage.module.css";
import type { Institution } from "../types/institution";
import { getAgencies } from "../api/agencies";
import type { Agency } from "../types/agency";

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
                setIsLoading(true);
                const response = await getAgencies({ limit: 10 });
                if (isMounted && response.success && Array.isArray(response.data)) {
                    const mappedData: Institution[] = response.data.map((agency: Agency) => ({
                        id: agency.id,
                        name: agency.name,
                        type:
                            typeof agency.agencyType === "object" &&
                            agency.agencyType !== null
                                ? agency.agencyType.name
                                : "Державна установа",
                        region: agency.region || "Не вказано",
                        headName: agency.headName || "-",
                        headTitle: agency.headTitle || "Керівник",
                        description: agency.description || "-",
                        address: agency.address || "-",
                        phone: agency.phone || "-",
                        email: agency.email || "-",
                        website: agency.website || "-",
                    }));
                    setInstitutions(mappedData);
                }
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

                        <div className={styles.adminPagination}>
                            <button className={styles.pagBtn} disabled>&lt;</button>
                            <button className={`${styles.pagBtn} ${styles.active}`}>1</button>
                            <button className={styles.pagBtn}>2</button>
                            <button className={styles.pagBtn}>3</button>
                            <span className={styles.pagDots}>...</span>
                            <button className={styles.pagBtn}>10</button>
                            <button className={styles.pagBtn}>&gt;</button>
                        </div>
                    </main>
                </div>
            </PageContainer>
        </main>
    );
}
