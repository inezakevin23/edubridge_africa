import { Bell, Check, CheckCheck, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchNotifications } from "../../services/notificationService";
import { acceptChallengeInvite } from "../../services/teamService";

export default function NotificationMenu({ tone = "amber" }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [inviteActions, setInviteActions] = useState({});

  const load = async () => {
    try {
      setLoading(true);
      const resp = await fetchNotifications();
      const list = Array.isArray(resp) ? resp : resp?.results || [];
      setNotifications(list);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const resp = await fetchNotifications();
        const list = Array.isArray(resp) ? resp : resp?.results || [];
        if (!cancelled) setNotifications(list);
      } catch {
        if (!cancelled) setNotifications([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const unread = notifications.filter((item) => !item.is_read).length;
  const markAllRead = () => {
    const next = notifications.map((item) => ({ ...item, is_read: true }));
    setNotifications(next);
  };

  const acceptInvite = async (notification) => {
    try {
      setAcceptingId(notification.id);
      await acceptChallengeInvite(notification.related_object_id);
      setInviteActions((current) => ({
        ...current,
        [notification.id]: "accepted",
      }));
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item,
        ),
      );
    } catch (error) {
      const isTeamFull = /maximum team size|team has reached/i.test(
        error.message,
      );
      setInviteActions((current) => ({
        ...current,
        [notification.id]: isTeamFull ? "full" : "error",
      }));
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-label="Notifications"
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#B5C0D2] transition hover:bg-white/[0.06] hover:text-white"
        onClick={() =>
          setOpen((value) => {
            if (!value) load();
            return !value;
          })
        }
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
                  {item.notification_type === "challenge_invitation" &&
                  item.related_object_id ? (
                    <button
                      className="mt-3 flex h-8 items-center gap-1 rounded-lg bg-[#35266A] px-3 text-[12px] font-bold text-[#D7C5FF] transition hover:bg-[#44317F] disabled:opacity-50"
                      disabled={
                        acceptingId === item.id ||
                        ["accepted", "full"].includes(inviteActions[item.id])
                      }
                      onClick={() => acceptInvite(item)}
                      type="button"
                    >
                      <Check size={14} />
                      {acceptingId === item.id
                        ? "Accepting..."
                        : inviteActions[item.id] === "accepted"
                          ? "Accepted"
                          : inviteActions[item.id] === "full"
                            ? "Team is full"
                            : inviteActions[item.id] === "error"
                              ? "Try again"
                              : "Accept invite"}
                    </button>
                  ) : null}
                  {item.notification_type === "job_offer" && item.job_link ? (
                    <a
                      className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600/20 px-3 text-[12px] font-bold text-emerald-400 transition hover:bg-emerald-600/30"
                      href={
                        item.job_link.startsWith("http://") ||
                        item.job_link.startsWith("https://")
                          ? item.job_link
                          : `https://${item.job_link}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink size={14} />
                      View Job Offer
                    </a>
                  ) : item.notification_type === "job_offer" &&
                    !item.job_link ? (
                    <span className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600/10 px-3 text-[12px] font-bold text-emerald-400/70">
                      <Check size={14} />
                      Job Offered
                    </span>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
