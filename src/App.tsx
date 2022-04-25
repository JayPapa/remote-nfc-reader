import { useEffect, useState } from 'react'
import QRCode from 'qrcode';
import { SpinningAtoms } from './components/SpinningAtoms'
import { TagListItem } from './components/TagListItem'
import { QrLocator } from './components/QrLocator';
import { io } from 'socket.io-client';

let socket: any
let socketEndpoint: string = `https://${window.location.hostname}:5000`
console.log('true', socketEndpoint)
socket = io(socketEndpoint)
console.log('socket', socket)
socket.connect()

function App() {
  const [url, setUrl] = useState('')
  const [channelId, setChannelId] = useState(null)
  const [tagList, setTagList] = useState<any>([])

  useEffect(() => {
    if (socket.id != undefined) setChannelId(socket.id)

    socket.on('receive_new_tag', (data: any) => {
      // console.log('New tag listed: ', data)
      setTagList((currList: any) => (
        currList?.every((el: any) => el.id !== data.id)
          ? [...currList, data]
          : [...currList]
      ))
    })

    socket.on('getMe', (data: any) => {
      console.log('Socket new id: ', data)
      setChannelId(data.id)
    })
  }, [socket])

  useEffect(() => {
    console.log('socketId', channelId)
    if (channelId != undefined) {
      QRCode.toDataURL(`${window.location.protocol}//${window.location.hostname}:3000?channel=${socket.id}`).then((data) => {
        setUrl(data)
      })
    } else {
      console.log('Cannot read id')
      socket.emit('whoAmI')
    }
  }, [channelId])

  return (
    <div className="bg-gray-900 h-screen w-screen">
      <main className="flex h-full">
        <aside className="w-4/12 text-white">
          <QrLocator url={url} />
          <div className="w-full text-center my-12 mx-auto max-w-sm">
            <h1 className="text-3xl font-bold">Scan the QR Code</h1>
            <div className='font-semibold'>using an NFC capable device</div>
            {socket?.id &&
              <div className='text-center bg-gray-800 mt-12 space-y-2 p-4 pt-3 rounded-lg'>
                <div className='font-semibold text-xl uppercase'>Channel Id</div>
                <div className='font-semibold py-1 px-4 text-base mx-auto bg-gray-700 mt-1 rounded'>{socket.id}</div>
              </div>
            }
          </div>
          <SpinningAtoms />
        </aside>
        <section className="relative text-white bg-gradient-to-bl from-gray-800 via-gray-800 to-gray-800 overflow-y-auto opacity-80 w-8/12 rounded-l-4xl my-8 py-0 px-20">
          <div className="fixed z-10 bg-white bg-opacity-0 rounded-lg backdrop-blur-sm py-6 px-4">
            <h2 className='text-2xl font-bold uppercase'>Your NFC scans will appear here 🤳 👇 </h2>
            <div className="flex space-x-3 my-2">
            </div>
            <button onClick={() => setTagList([])} className="py-1 px-4 bg-gray-700 hover:bg-gray-600 text-white text-base rounded-full">Clear all</button>
          </div>
          <ul className='relative top-32 text-white grid grid-flow-row sm:grid-cols-1 place-content-start lg:grid-cols-2 xl:grid-cols-3 gap-1 h-auto w-full'>
            {tagList?.map((tag: any) => (
              <TagListItem
                key={tag.id}
                id={tag.id}
                serial={tag.serialNumber}
                timestamp={tag.timestamp}
              />
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App