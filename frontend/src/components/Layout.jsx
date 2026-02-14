import BottomNav from "./BottomNav";

export default function Layout({ children }) {
  return (
    <div className="relative h-screen bg-blue-50 text-blue-900 overflow-hidden">
      <main className="h-full pb-28">{children}</main>
      <BottomNav />
    </div>
  );
}
