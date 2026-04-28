import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pb-5 pt-3 md:px-6">
        <section className="animate-fade-in-up rounded-[28px] border border-[#c9c2ff] bg-[#d7d1ff] p-3 shadow-[0_18px_36px_rgba(32,25,90,0.22)] md:p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <Sidebar />
            <main className="min-w-0 flex-1 rounded-[24px] border border-[#ded8ff] bg-[#e9e4ff] p-4 shadow-[0_16px_30px_rgba(45,35,110,0.16)] md:p-6">
              {children}
            </main>
          </div>
        </section>
      </div>
    </div>
  );
}
