export default function AuthInput({
  icon,
  rightIcon,
  type,
  placeholder,
  name,
  register,
}) {
  return (
    <div className="flex h-[64px] items-center gap-4 rounded-[28px] border border-white/5 bg-[#182237]/95 px-6 text-[#9AA7BA] shadow-inner shadow-white/[0.02] transition focus-within:border-violet-400/50 focus-within:ring-2 focus-within:ring-violet-500/20">
      <span className="flex shrink-0 items-center text-[#9AA7BA]">{icon}</span>

      <input
        name={name}
        {...register}
        type={type}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent text-[17px] text-white placeholder:text-[#97A3B5] outline-none"
      />

      {rightIcon ? (
        <span className="flex shrink-0 items-center text-[#9AA7BA]">
          {rightIcon}
        </span>
      ) : null}
    </div>
  );
}
