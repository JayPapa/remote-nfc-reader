import { useEffect, useState } from 'react';
import { SpinningAtoms } from './components/SpinningAtoms'
import NFCImage from './nfc.png'
import { v4 as uuid } from 'uuid'

function MobileApp({ socket }: any) {
  const [tag, setTag] = useState<any>(null)
  const [error, setError] = useState('')
  const [channelId, setChannelId] = useState('')
  const [nfcState, setNfcState] = useState(false)

  useEffect(() => {
    setChannelId(window.location.search.split('?channel=')[1])
  }, [])

  const activateNFCReader = async () => {
    if ("NDEFReader" in window) {
      const ndef = new window.NDEFReader();
      try {
        // Activate the nfc reader
        await ndef.scan()
        console.log('NFC Ready')
        setNfcState(true)

        // Act on the nfc reading
        ndef.onreading = (event: any) => {
          const decoder = new TextDecoder();
          for (const record of event.message.records) {
            console.log('New NFC Tag has been read', event.serialNumber)
            const newTag = {
              id: uuid(),
              channelId: channelId,
              serialNumber: event.serialNumber,
              mediaType: record.mediaType,
              recordType: record.recordType,
              data: decoder.decode(record.data),
              timestamp: new Date().toISOString(),
            }
            console.log('▶ Sending NFC Data...')
            setTag(newTag)
            socket.emit('new_tag', newTag)
          }
        }
      } catch (error: any) {
        setError(`Sorry, there was an error. ${error?.message ?? ''}`)
        console.log('[NFC Error]: ❌', error);
      }
    } else {
      setError("Web NFC is not supported.");
      console.log("Web NFC is not supported.");
    }
  }

  return (
    <div className="bg-gray-900 h-screen w-screen overflow-y-auto">
      <main className="flex flex-col text-white pb-20">
        <div className="relative flex items-center mx-auto w-56 h-56 min-h-max rounded-full transition overflow-hidden mt-20 border border-transparent">
          {nfcState &&
            <div className={"absolute left-0 top-0 animate-scan w-64 h-24 -rotate-4 bg-gradient-to-r from-pink-500 via-indigo-400 to-green-500 blur-sm"}></div>
          }
          <div className="relative w-52 h-52 bg-gray-700 bg-opacity-20 rounded-full flex m-auto backdrop-blur-lg">
            <img src={NFCImage} alt="NFC Icon" className="w-2/3 h-2/3 p-2 m-auto opacity-40 rounded-3xl" />
          </div>
        </div>
        <div className="w-full text-center my-6 px-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Scan the NFC Tag</h1>
            <div className='font-semibold'>make sure NFC is enabled</div>
            <SpinningAtoms />
            <div className="mt-2 bg-gray-800 rounded-md py-4 px-4 space-y-2">
              <div className='font-bold uppercase rounded-md'>Connected Channel</div>
              <div className='bg-gray-700 w-full py-2 rounded-md text-sm'>{channelId ?? 'NONE'}</div>
            </div>
          </div>
          {tag &&
            <div className='my-4 space-y-4 bg-gray-800 p-4 rounded-md'>
              <div className="space-y-1">
                <div className='font-bold uppercase rounded-md'>Type</div>
                <div className='bg-gray-700 w-full py-1 rounded-md text-sm'>{tag.recordType ?? 'NONE'}</div>
              </div>
              <div className="space-y-1">
                <div className='font-bold uppercase rounded-md'>Serial Number</div>
                <div className='bg-gray-700 w-full py-1 rounded-md text-sm'>{tag.serialNumber ?? 'NONE'}</div>
              </div>
              <div className="space-y-1">
                <div className='font-bold uppercase rounded-md'>Media Type</div>
                <div className='bg-gray-700 w-full py-1 rounded-md text-sm'>{tag.mediaType ?? 'NONE'}</div>
              </div>
            </div>
          }
          <div className='fixed bottom-0 left-0 w-full px-6 pb-4 bg-gradient-to-t from-gray-900 to-transparent'>
            <button onClick={async () => await activateNFCReader()} className='font-semibold text-2xl text-white text-opacity-100 bg-gradient-to-tr from-sky-400 via-indigo-600 to-purple-400 py-4 w-full max-w-lg mx-auto block rounded-md'>
              Activate NFC
            </button>
            {error &&
              <div role="alert" className='bg-red-500 bg-opacity-50 py-1 rounded-sm'>
                {error}
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  )
}

export default MobileApp
