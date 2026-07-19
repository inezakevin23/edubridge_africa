import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchNotifications } from "../../services/notificationService";

export default function NotificationMenu({ tone = "amber" }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const resp = await fetchNotifications();
      const list = Array.isArray(resp) ? resp : resp?.results || [];
      setNotifications(list);
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const unread = notifications.filter((item) => !item.is_read).length;
  const markAllRead = () => {
    const next = notifications.map((item) => ({ ...item, is_read: true }));
    setNotifications(next);
  };

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-label="Notifications"
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#B5C0D2] transition hover:bg-white/[0.06] hover:text-white"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Bell size={21} />
        {unread ? (
          <span
            className={`absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full ${tone === "violet" ? "bg-[#8B5CF6]" : "bg-[#F59E0B]"}`}
          />
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 top-13 z-40 w-[320px] rounded-[18px] border border-white/[0.1] bg-[#131C2E] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-extrabold text-white">
              Notifications
            </h2>
            <button
              className="flex items-center gap-1 text-[12px] font-bold text-[#A78BFA] hover:text-white"
              onClick={markAllRead}
              type="button"
            >
              <CheckCheck size={15} /> Mark all read
            </button>
          </div>
          <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
            {loading ? (
              <p className="text-[13px] text-[#9AA7BA]">Loading...</p>
            ) : (
              notifications.map((item) => (
                <article
                  className={`rounded-xl p-3 ${item.is_read ? "bg-white/[0.03]" : "bg-violet-500/10"}`}
                  key={item.id}
                >
                  <p className="text-[13px] font-bold text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-[#AAB5C7]">
                    {item.message}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
