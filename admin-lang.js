const adminTranslations = {
  ru: {
    login_title: "Вход в админ-панель",
    login_text: "Введите пароль администратора",
    login_placeholder: "Введите пароль",
    login_btn: "Войти",
    back_site: "← Вернуться на сайт",

    panel_title: "Административная панель",
    back_site_btn: "Сайтка кайтуу",
    export_btn: "Скачать Excel",
    logout_btn: "Выйти",

    hero_bookings_title: "Бронирования",
    hero_bookings_text:
      "Все брони клиентов отображаются отдельно и управляются в своём блоке.",
    hero_reviews_title: "Отзывы",
    hero_reviews_text:
      "Отзывы полностью отдельно от брони: одобрение, скрытие, удаление.",
    hero_moderation_title: "Модерация",
    hero_moderation_text:
      "На сайт попадают только одобренные отзывы, а брони и отзывы не смешиваются.",

    manage_title: "Управление бронированиями",
    manage_text:
      "Администратор может просматривать, искать, фильтровать, изменять статус, удалять и экспортировать заявки клиентов.",

    total_bookings: "Все заявки",
    new_bookings: "Новые",
    confirmed_bookings: "Подтверждённые",
    cancelled_bookings: "Отменённые",
    completed_bookings: "Завершённые",

    search_placeholder: "Поиск по имени, телефону, email...",
    filter_all: "Все статусы",

    status_new: "Новая",
    status_confirmed: "Подтверждена",
    status_cancelled: "Отменена",
    status_completed: "Завершена",

    th_name: "Имя",
    th_phone: "Телефон",
    th_email: "Email",
    th_room: "Тип номера",
    th_guests: "Гости",
    th_checkin: "Заезд",
    th_checkout: "Выезд",
    th_comment: "Комментарий",
    th_status: "Статус",
    th_created: "Дата заявки",
    th_actions: "Действия",

    loading: "Загрузка заявок...",
    bookings_hint: "Здесь только брони.",

    reviews_manage_title: "Управление отзывами",
    reviews_manage_text:
      "Здесь отзывы клиентов модерируются отдельно от брони.",

    review_th_name: "Имя",
    review_th_rating: "Оценка",
    review_th_text: "Отзыв",
    review_th_status: "Статус",
    review_th_created: "Дата",
    review_th_actions: "Действия",

    reviews_loading: "Загрузка отзывов...",
    reviews_hint: "Здесь только отзывы.",

    review_status_hidden: "Скрыт",
    review_status_approved: "Одобрен",
    review_status_pending: "На модерации",

    login_error: "Неверный пароль",
    login_error_wrong_password: "Неверный пароль",

    bookings_not_found: "Заявки не найдены",
    not_found: "Заявки не найдены",
    booking_status_error: "Не удалось обновить статус заявки",
    update_error: "Не удалось обновить статус заявки",
    booking_delete_confirm: "Удалить эту заявку?",
    delete_confirm: "Удалить эту заявку?",
    booking_delete_error: "Не удалось удалить заявку",
    delete_error: "Не удалось удалить заявку",
    bookings_load_error: "Ошибка загрузки заявок",
    load_error: "Ошибка загрузки заявок",

    reviews_empty: "Отзывов пока нет",
    reviews_not_found: "Отзывов пока нет",
    guest_word: "Гость",
    approve_btn: "Одобрить",
    hide_btn: "Скрыть",
    delete_btn: "Удалить",
    save_btn: "Сохранить",
    review_approve_btn: "Одобрить",
    review_hide_btn: "Скрыть",

    review_approved_msg: "Отзыв одобрен",
    review_hidden_msg: "Отзыв скрыт",
    review_deleted_msg: "Отзыв удалён",

    review_approve_error: "Не удалось одобрить отзыв",
    review_hide_error: "Не удалось скрыть отзыв",
    review_delete_confirm: "Удалить этот отзыв?",
    review_delete_error: "Не удалось удалить отзыв",
    reviews_load_error: "Ошибка загрузки отзывов",

    export_empty: "Нет данных для экспорта",
    no_data: "Нет данных",
    no_date: "Нет даты",
  },

  ky: {
    login_title: "Админ-панелге кирүү",
    login_text: "Администратордун сыр сөзүн киргизиңиз",
    login_placeholder: "Сыр сөздү киргизиңиз",
    login_btn: "Кирүү",
    back_site: "← Сайтка кайтуу",

    panel_title: "Административдик панель",
    back_site_btn: "Сайтка кайтуу",
    export_btn: "Excel жүктөө",
    logout_btn: "Чыгуу",

    hero_bookings_title: "Брондоолор",
    hero_bookings_text:
      "Кардарлардын бардык брондору өзүнчө көрсөтүлөт жана өзүнчө блокто башкарылат.",
    hero_reviews_title: "Пикирлер",
    hero_reviews_text:
      "Пикирлер брондоолордон толугу менен өзүнчө: жактыруу, жашыруу, өчүрүү.",
    hero_moderation_title: "Модерация",
    hero_moderation_text:
      "Сайтка жактырылган пикирлер гана чыгат, ал эми брондоолор менен пикирлер аралашпайт.",

    manage_title: "Брондоолорду башкаруу",
    manage_text:
      "Администратор кардарлардын арыздарын көрө алат, издей алат, чыпкалай алат, статусун өзгөртө алат, өчүрө алат жана экспорттой алат.",

    total_bookings: "Бардык арыздар",
    new_bookings: "Жаңы",
    confirmed_bookings: "Тастыкталган",
    cancelled_bookings: "Жокко чыгарылган",
    completed_bookings: "Аяктаган",

    search_placeholder: "Аты, телефону, email боюнча издөө...",
    filter_all: "Бардык статус",

    status_new: "Жаңы",
    status_confirmed: "Тастыкталды",
    status_cancelled: "Жокко чыгарылды",
    status_completed: "Аяктады",

    th_name: "Аты",
    th_phone: "Телефон",
    th_email: "Email",
    th_room: "Бөлмө түрү",
    th_guests: "Коноктор",
    th_checkin: "Кирүү",
    th_checkout: "Чыгуу",
    th_comment: "Комментарий",
    th_status: "Статус",
    th_created: "Арыз күнү",
    th_actions: "Аракеттер",

    loading: "Арыздар жүктөлүүдө...",
    bookings_hint: "Бул жерде брондоолор гана бар.",

    reviews_manage_title: "Пикирлерди башкаруу",
    reviews_manage_text:
      "Бул жерде кардарлардын пикирлери брондоолордон өзүнчө модерацияланат.",

    review_th_name: "Аты",
    review_th_rating: "Баалоо",
    review_th_text: "Пикир",
    review_th_status: "Статус",
    review_th_created: "Дата",
    review_th_actions: "Аракеттер",

    reviews_loading: "Пикирлер жүктөлүүдө...",
    reviews_hint: "Бул жерде пикирлер гана бар.",

    review_status_hidden: "Жашырылган",
    review_status_approved: "Жактырылган",
    review_status_pending: "Модерацияда",

    login_error: "Туура эмес сыр сөз",
    login_error_wrong_password: "Туура эмес сыр сөз",

    bookings_not_found: "Арыздар табылган жок",
    not_found: "Арыздар табылган жок",
    booking_status_error: "Арыздын статусун өзгөртүү мүмкүн болгон жок",
    update_error: "Арыздын статусун өзгөртүү мүмкүн болгон жок",
    booking_delete_confirm: "Бул арызды өчүрөсүзбү?",
    delete_confirm: "Бул арызды өчүрөсүзбү?",
    booking_delete_error: "Арызды өчүрүү мүмкүн болгон жок",
    delete_error: "Арызды өчүрүү мүмкүн болгон жок",
    bookings_load_error: "Арыздарды жүктөөдө ката кетти",
    load_error: "Арыздарды жүктөөдө ката кетти",

    reviews_empty: "Азырынча пикирлер жок",
    reviews_not_found: "Азырынча пикирлер жок",
    guest_word: "Конок",
    approve_btn: "Жактыруу",
    hide_btn: "Жашыруу",
    delete_btn: "Өчүрүү",
    save_btn: "Сактоо",
    review_approve_btn: "Жактыруу",
    review_hide_btn: "Жашыруу",

    review_approved_msg: "Пикир жактырылды",
    review_hidden_msg: "Пикир жашырылды",
    review_deleted_msg: "Пикир өчүрүлдү",

    review_approve_error: "Пикирди жактыруу мүмкүн болгон жок",
    review_hide_error: "Пикирди жашыруу мүмкүн болгон жок",
    review_delete_confirm: "Бул пикирди өчүрөсүзбү?",
    review_delete_error: "Пикирди өчүрүү мүмкүн болгон жок",
    reviews_load_error: "Пикирлерди жүктөөдө ката кетти",

    export_empty: "Экспорт үчүн маалымат жок",
    no_data: "Маалымат жок",
    no_date: "Дата жок",
  },

  en: {
    login_title: "Admin Panel Login",
    login_text: "Enter the administrator password",
    login_placeholder: "Enter password",
    login_btn: "Login",
    back_site: "← Back to site",

    panel_title: "Administration Panel",
    back_site_btn: "Back to site",
    export_btn: "Download Excel",
    logout_btn: "Logout",

    hero_bookings_title: "Bookings",
    hero_bookings_text:
      "All customer bookings are shown separately and managed in their own section.",
    hero_reviews_title: "Reviews",
    hero_reviews_text:
      "Reviews are fully separate from bookings: approval, hiding, deletion.",
    hero_moderation_title: "Moderation",
    hero_moderation_text:
      "Only approved reviews appear on the website, and bookings and reviews are not mixed.",

    manage_title: "Booking Management",
    manage_text:
      "The administrator can view, search, filter, change status, delete and export customer bookings.",

    total_bookings: "All bookings",
    new_bookings: "New",
    confirmed_bookings: "Confirmed",
    cancelled_bookings: "Cancelled",
    completed_bookings: "Completed",

    search_placeholder: "Search by name, phone, email...",
    filter_all: "All statuses",

    status_new: "New",
    status_confirmed: "Confirmed",
    status_cancelled: "Cancelled",
    status_completed: "Completed",

    th_name: "Name",
    th_phone: "Phone",
    th_email: "Email",
    th_room: "Room type",
    th_guests: "Guests",
    th_checkin: "Check-in",
    th_checkout: "Check-out",
    th_comment: "Comment",
    th_status: "Status",
    th_created: "Created",
    th_actions: "Actions",

    loading: "Loading bookings...",
    bookings_hint: "Only bookings are shown here.",

    reviews_manage_title: "Review Management",
    reviews_manage_text:
      "Customer reviews are moderated here separately from bookings.",

    review_th_name: "Name",
    review_th_rating: "Rating",
    review_th_text: "Review",
    review_th_status: "Status",
    review_th_created: "Date",
    review_th_actions: "Actions",

    reviews_loading: "Loading reviews...",
    reviews_hint: "Only reviews are shown here.",

    review_status_hidden: "Hidden",
    review_status_approved: "Approved",
    review_status_pending: "Pending",

    login_error: "Wrong password",
    login_error_wrong_password: "Wrong password",

    bookings_not_found: "No bookings found",
    not_found: "No bookings found",
    booking_status_error: "Failed to update booking status",
    update_error: "Failed to update booking status",
    booking_delete_confirm: "Delete this booking?",
    delete_confirm: "Delete this booking?",
    booking_delete_error: "Failed to delete booking",
    delete_error: "Failed to delete booking",
    bookings_load_error: "Failed to load bookings",
    load_error: "Failed to load bookings",

    reviews_empty: "No reviews yet",
    reviews_not_found: "No reviews yet",
    guest_word: "Guest",
    approve_btn: "Approve",
    hide_btn: "Hide",
    delete_btn: "Delete",
    save_btn: "Save",
    review_approve_btn: "Approve",
    review_hide_btn: "Hide",

    review_approved_msg: "Review approved",
    review_hidden_msg: "Review hidden",
    review_deleted_msg: "Review deleted",

    review_approve_error: "Failed to approve review",
    review_hide_error: "Failed to hide review",
    review_delete_confirm: "Delete this review?",
    review_delete_error: "Failed to delete review",
    reviews_load_error: "Failed to load reviews",

    export_empty: "No data to export",
    no_data: "No data",
    no_date: "No date",
  },

  tr: {
    login_title: "Yönetici Paneli Girişi",
    login_text: "Yönetici şifresini girin",
    login_placeholder: "Şifreyi girin",
    login_btn: "Giriş Yap",
    back_site: "← Siteye dön",

    panel_title: "Yönetim Paneli",
    back_site_btn: "Siteye dön",
    export_btn: "Excel İndir",
    logout_btn: "Çıkış",

    hero_bookings_title: "Rezervasyonlar",
    hero_bookings_text:
      "Tüm müşteri rezervasyonları ayrı gösterilir ve kendi bölümünde yönetilir.",
    hero_reviews_title: "Yorumlar",
    hero_reviews_text:
      "Yorumlar rezervasyonlardan tamamen ayrıdır: onaylama, gizleme, silme.",
    hero_moderation_title: "Moderasyon",
    hero_moderation_text:
      "Siteye yalnızca onaylanmış yorumlar gelir, rezervasyonlar ve yorumlar karışmaz.",

    manage_title: "Rezervasyon Yönetimi",
    manage_text:
      "Yönetici müşteri başvurularını görüntüleyebilir, arayabilir, filtreleyebilir, durumunu değiştirebilir, silebilir ve dışa aktarabilir.",

    total_bookings: "Tüm başvurular",
    new_bookings: "Yeni",
    confirmed_bookings: "Onaylanan",
    cancelled_bookings: "İptal edilen",
    completed_bookings: "Tamamlanan",

    search_placeholder: "İsim, telefon, email ile ara...",
    filter_all: "Tüm durumlar",

    status_new: "Yeni",
    status_confirmed: "Onaylandı",
    status_cancelled: "İptal edildi",
    status_completed: "Tamamlandı",

    th_name: "İsim",
    th_phone: "Telefon",
    th_email: "Email",
    th_room: "Oda türü",
    th_guests: "Misafir",
    th_checkin: "Giriş",
    th_checkout: "Çıkış",
    th_comment: "Yorum",
    th_status: "Durum",
    th_created: "Başvuru tarihi",
    th_actions: "İşlemler",

    loading: "Başvurular yükleniyor...",
    bookings_hint: "Burada yalnızca rezervasyonlar var.",

    reviews_manage_title: "Yorum Yönetimi",
    reviews_manage_text:
      "Burada müşteri yorumları rezervasyonlardan ayrı olarak yönetilir.",

    review_th_name: "İsim",
    review_th_rating: "Puan",
    review_th_text: "Yorum",
    review_th_status: "Durum",
    review_th_created: "Tarih",
    review_th_actions: "İşlemler",

    reviews_loading: "Yorumlar yükleniyor...",
    reviews_hint: "Burada yalnızca yorumlar var.",

    review_status_hidden: "Gizli",
    review_status_approved: "Onaylandı",
    review_status_pending: "Moderasyonda",

    login_error: "Yanlış şifre",
    login_error_wrong_password: "Yanlış şifre",

    bookings_not_found: "Başvuru bulunamadı",
    not_found: "Başvuru bulunamadı",
    booking_status_error: "Başvuru durumu güncellenemedi",
    update_error: "Başvuru durumu güncellenemedi",
    booking_delete_confirm: "Bu başvuru silinsin mi?",
    delete_confirm: "Bu başvuru silinsin mi?",
    booking_delete_error: "Başvuru silinemedi",
    delete_error: "Başvuru silinemedi",
    bookings_load_error: "Başvurular yüklenemedi",
    load_error: "Başvurular yüklenemedi",

    reviews_empty: "Henüz yorum yok",
    reviews_not_found: "Henüz yorum yok",
    guest_word: "Misafir",
    approve_btn: "Onayla",
    hide_btn: "Gizle",
    delete_btn: "Sil",
    save_btn: "Kaydet",
    review_approve_btn: "Onayla",
    review_hide_btn: "Gizle",

    review_approved_msg: "Yorum onaylandı",
    review_hidden_msg: "Yorum gizlendi",
    review_deleted_msg: "Yorum silindi",

    review_approve_error: "Yorum onaylanamadı",
    review_hide_error: "Yorum gizlenemedi",
    review_delete_confirm: "Bu yorum silinsin mi?",
    review_delete_error: "Yorum silinemedi",
    reviews_load_error: "Yorumlar yüklenemedi",

    export_empty: "Dışa aktarmak için veri yok",
    no_data: "Veri yok",
    no_date: "Tarih yok",
  },
};

function applyAdminTranslations(lang) {
  const dict = adminTranslations[lang] || adminTranslations.ru;

  document.querySelectorAll("[data-i18n-admin]").forEach((element) => {
    const key = element.getAttribute("data-i18n-admin");
    if (key && dict[key] !== undefined) {
      element.textContent = dict[key];
    }
  });

  document
    .querySelectorAll("[data-i18n-admin-placeholder]")
    .forEach((element) => {
      const key = element.getAttribute("data-i18n-admin-placeholder");
      if (key && dict[key] !== undefined) {
        element.placeholder = dict[key];
      }
    });
}

function setActiveAdminLangButton(lang) {
  document.querySelectorAll(".admin-lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

window.adminT = function adminT(key) {
  const lang = localStorage.getItem("adminLanguage") || "ru";
  const dict = adminTranslations[lang] || adminTranslations.ru;
  return dict[key] !== undefined ? dict[key] : key;
};

function setAdminLanguage(lang) {
  const currentLang = adminTranslations[lang] ? lang : "ru";
  localStorage.setItem("adminLanguage", currentLang);
  document.documentElement.lang = currentLang;
  setActiveAdminLangButton(currentLang);
  applyAdminTranslations(currentLang);

  window.dispatchEvent(
    new CustomEvent("admin-language-changed", {
      detail: { lang: currentLang },
    }),
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("adminLanguage") || "ru";
  setAdminLanguage(savedLang);

  document.querySelectorAll(".admin-lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      setAdminLanguage(btn.dataset.lang);
    });
  });
});
