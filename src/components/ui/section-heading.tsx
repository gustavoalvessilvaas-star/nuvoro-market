import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, children, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-2 text-balance text-3xl font-black leading-tight text-ink sm:text-4xl">{title}</h2>
      {children ? <div className="mt-3 text-pretty text-base leading-7 text-ink/70">{children}</div> : null}
    </div>
  );
}
