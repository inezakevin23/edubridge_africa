const storageKey = "edubridgeNotifications";

export function addLocalNotification(notification) {
  const current = JSON.parse(localStorage.getItem(storageKey) || "[]");
  localStorage.setItem(
    storageKey,
    JSON.stringify([{ id: crypto.randomUUID(), is_read: false, ...notification }, ...current]),
  );
  window.dispatchEvent(new Event("edubridge-notifications"));
}
