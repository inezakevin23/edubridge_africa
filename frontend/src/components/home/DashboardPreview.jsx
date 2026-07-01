export default function DashboardPreview() {
  return (
    <section className="pb-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl border border-[#25334D] bg-[#121A2F] shadow-2xl overflow-hidden">
          {/* Browser */}

          <div className="flex gap-2 p-5 border-b border-[#25334D]">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>

            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>

            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>

          <div className="grid lg:grid-cols-4">
            {/* Sidebar */}

            <div className="bg-[#0F172A] p-6 space-y-5">
              <div className="h-10 rounded-lg bg-violet-600"></div>

              <div className="h-4 rounded bg-slate-700"></div>

              <div className="h-4 rounded bg-slate-700"></div>

              <div className="h-4 rounded bg-slate-700"></div>

              <div className="h-4 rounded bg-slate-700"></div>
            </div>

            {/* Main */}

            <div className="lg:col-span-3 p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-[#1E293B] h-44"></div>

                <div className="rounded-2xl bg-[#1E293B] h-44"></div>

                <div className="rounded-2xl bg-[#1E293B] h-44"></div>
              </div>

              <div className="mt-8 rounded-2xl bg-[#1E293B] h-72"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
