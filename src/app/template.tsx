// Page-enter animation (CSS only, runs on every navigation, no hydration cost).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
