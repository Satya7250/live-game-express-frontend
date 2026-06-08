import Link from "next/link";
import styles from "./NeonButton.module.css";

interface NeonButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function NeonButton({
  href,
  children,
}: NeonButtonProps) {
  return (
    <Link href={href} className={styles.button}>
      <span />
      <span />
      <span />
      <span />
      {children}
    </Link>
  );
}