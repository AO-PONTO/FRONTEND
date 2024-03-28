import { EleButton, EleInput } from '@/components'
import React from 'react'
import Webcam from 'react-webcam'


const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
};

const ViewCozinha = () => {
  const webcamRef = React.useRef<Webcam>(null)
  const [currentDate, setCurrentDate] = React.useState<string>('')

  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  React.useEffect(() => {
    setCurrentDate(getCurrentDate())
  }, [])
  
  const capture = React.useCallback(() => {
    if (webcamRef.current !== null) {
        const a = document.createElement('a')
        a.href = webcamRef.current.getScreenshot() || ''
        a.download = `captured_image_${currentDate}.jpg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        }
  }, [webcamRef, currentDate])

  return (
    <>
      <EleInput 
        label='Data de Hoje' 
        type='date' 
        name='data'
        value={currentDate}
        disabled
      />
      <div className='p-2'>
          <Webcam
              audio={false}
              height={720}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={1280}
              videoConstraints={videoConstraints}
          />
      </div>
      <EleButton onClick={capture}>Captura de Foto</EleButton>
    </>
  )
}

export default ViewCozinha