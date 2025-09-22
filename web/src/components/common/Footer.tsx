export default function Footer() {
    return (
        <footer className="mt-10 bg-blue-700 dark:bg-zinc-900 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-white/70 dark:text-zinc-400 flex items-center justify-between">
                <p>© {new Date().getFullYear()} OneShoe</p>
                <nav className="flex gap-4">
                    <a href="#" className="hover:underline">CGU</a>
                    <a href="#" className="hover:underline">Confidentialité</a>
                    <a href="#" className="hover:underline">Contact</a>
                </nav>
            </div>
        </footer>
    )
}
