"use client";

interface PostAuthorHeaderProps {
  author: { name: string; avatar: string | null };
  date: string;
  variant: "mobile" | "desktop";
}

export function PostAuthorHeader({ author, date, variant }: PostAuthorHeaderProps) {
  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#111111]/10 flex items-center justify-center">
          {author.avatar ? (
            <img src={author.avatar} alt={author.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-manrope)]">{author.name[0]}</span>
          )}
        </div>
        <div>
          <p className="font-semibold font-[family-name:var(--font-manrope)]">{author.name}</p>
          <p className="text-sm text-[#8E8E93] font-[family-name:var(--font-manrope)]">{date}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center">
        {author.avatar ? (
          <img src={author.avatar} alt={author.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-[20px] font-semibold text-[#E53935] font-[family-name:var(--font-manrope)]">{author.name[0]}</span>
        )}
      </div>
      <div>
        <p className="font-semibold text-[17px] text-[#111111] font-[family-name:var(--font-manrope)]">{author.name}</p>
        <p className="text-[14px] text-[#8E8E93] font-[family-name:var(--font-manrope)]">{date}</p>
      </div>
    </div>
  );
}
