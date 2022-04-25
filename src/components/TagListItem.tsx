type TagListItemProps = {
    id: number,
    serial: string,
    timestamp: string,
}

export function TagListItem({ id, serial, timestamp }: TagListItemProps) {
    return (
        <li className="hover:bg-slate-600 hover:bg-opacity-50 transition duration-100 p-4 max-w-lg rounded-md cursor-pointer">
            <div className='font-bold text-slate-400'>SCAN@{timestamp}</div>
            <div className='text-xl font-bold'>{serial}</div>
            <div className='text-slate-400 text-sm font-medium'>Serial Number</div>
            <div className='text-slate-100 text-xs font-medium'>#{id}</div>
        </li>
    )
}