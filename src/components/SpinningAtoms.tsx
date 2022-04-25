import logo from './../logo.svg'

export function SpinningAtoms() {
    return (
        <div className="flex justify-center mx-auto my-2">
            <img src={logo} className="animate-spin w-12 h-12" alt="logo" />
            <img src={logo} className="animate-spin w-12 h-12" alt="logo" />
            <img src={logo} className="animate-spin w-12 h-12" alt="logo" />
        </div>
    )
}