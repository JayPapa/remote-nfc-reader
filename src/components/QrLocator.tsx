export function QrLocator({ url }: { url: string }) {
    return (
        <div className="relative flex items-center mx-auto w-56 h-56 rounded-[2rem] transition hover:scale-150 overflow-hidden mt-20 border border-transparent">
            <div className="absolute left-0 top-0 animate-scan w-64 h-24 -rotate-4 bg-gradient-to-br from-purple-500 via-green-400 to-yellow-500 blur-sm"></div>
            <div className="relative w-52 h-52 bg-gray-700 bg-opacity-80 rounded-3xl flex m-auto backdrop-blur-lg">
                {url && <img src={url} alt="QrCode" className="w-full h-full p-4 rounded-3xl opacity-60 hover:opacity-90" />}
            </div>
        </div>
    )
}