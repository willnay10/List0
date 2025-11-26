export function SiteFooter() {
    return (
        <footer className="py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-center gap-2 md:h-16 md:flex-row">
                <p className="text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} List0. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
