import Link from "next/link";
import { templates } from "@productix/editor";

export default function DashboardPage() {
  const categoryEmoji: Record<string, string> = {
    marketing: "🚀",
    event: "🎉",
    brand: "🏢",
    social: "📱",
    custom: "✨",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              P
            </div>
            <span className="text-lg font-semibold tracking-tight text-gray-900">Productix</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/editor"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900"
            >
              Editor
            </Link>
            <Link
              href="/preview"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900"
            >
              Preview
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5" />
        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
              <span>✨</span> Freeform Visual Editor
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Design pages with{" "}
              <span className="text-gradient">total freedom.</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Create stunning, layered compositions with our freeform visual editor.
              Place elements anywhere. Overlap, layer, resize — just like a design tool.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/editor"
                className="inline-flex h-11 items-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
              >
                Open Editor
              </Link>
              <Link
                href="/editor?template=product-promo"
                className="inline-flex h-11 items-center rounded-lg border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
              >
                Use a Template
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Starter Templates
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose a template to get started quickly, or create a page from scratch.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <Link
              key={template.meta.id}
              href={`/editor?template=${template.meta.id}`}
              className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5"
            >
              {/* Template Preview */}
              <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                <span className="text-4xl transition-transform duration-200 group-hover:scale-110">
                  {categoryEmoji[template.meta.category] || "✨"}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {template.meta.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                  {template.meta.description}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {template.meta.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}

          {/* Blank Page Card */}
          <Link
            href="/editor"
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 p-5 transition-all duration-200 hover:border-blue-300 hover:bg-white"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              +
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Blank Canvas</h3>
            <p className="mt-1 text-center text-sm text-gray-500">
              Start from scratch with an empty artboard
            </p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Productix. Built with Next.js, Turborepo & a custom canvas engine.
          </p>
        </div>
      </footer>
    </div>
  );
}
