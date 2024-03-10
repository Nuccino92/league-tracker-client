import classNames from "classnames";
import Link from "next/link";

type Props = {
  links: {
    label: string;
    href: string;
  }[];
};

export default function Breadcrumb({ links }: Props) {
  return (
    <div className="my-4 flex items-center text-sm space-x-1 font-medium">
      {links.map((link, index) => (
        <div key={link.href}>
          <Link
            className={classNames(
              index + 1 === links.length && "text-secondary",
              "hover:underline"
            )}
            href={link.href}
          >
            {link.label}
          </Link>{" "}
          {index + 1 !== links.length && (
            <span className="text-zinc-400">/</span>
          )}
        </div>
      ))}
    </div>
  );
}
