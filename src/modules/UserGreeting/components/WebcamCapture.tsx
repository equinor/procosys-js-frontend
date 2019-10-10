import React, {useState, useEffect, RefObject, PropsWithChildren} from 'react'

interface WebcamProps {
    onCapture(blob : Blob | null, base64EncodedUri : string): void
    setCaptureTrigger?: Function
}

const WebcamCapture : React.FC<WebcamProps> = (props : PropsWithChildren<WebcamProps>) => {
    const [error, setError] = useState<any>();
    const videoRef = React.createRef<HTMLVideoElement>();
    const [processingImage, setProccessingImage] = useState(false);

    useEffect(() => {
        if (!props.setCaptureTrigger) return;
        props.setCaptureTrigger(() => grabPhoto(videoRef));
    }, [videoRef, props.setCaptureTrigger]);

    navigator.mediaDevices.getUserMedia({video: true})
    .then((mediaStream) => {
        if (videoRef.current && (videoRef.current.srcObject != mediaStream)) {
            console.log("Setting current stream", mediaStream);
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
        }
        if (error) setError(null);
        
    })
    .catch((error) => {
        setError(error);
    });

    if (error) {
        return (
            <div>
                <h3>Error loading video</h3>
                <pre>{error.message}</pre>
            </div>
        )
    }


    const grabPhoto = (videoRef : RefObject<HTMLVideoElement>) : Promise<Blob|null> => {
        setProccessingImage(true);
        setTimeout(() => {
            setProccessingImage(false);
        },1000);
        console.log("Checcking");
        if (!videoRef.current) return Promise.reject("Missing video reference");
        const stream = videoRef.current.srcObject;
        if (!stream) return Promise.reject("Unable to get webcamstream");
        var canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 640;
        const context = canvas.getContext("2d");
        if (!context) return Promise.reject("Unable to set up context");
        context.drawImage(videoRef.current,0,0,640,640);
        const dataUri = canvas.toDataURL('image/jpeg');

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                context.fillStyle = "#FFF";
                context.fillRect(0,0,640,640);
                setTimeout(() => {
                    context.clearRect(0,0,640,640);
                },10000);
                resolve(blob);
                if (props.onCapture) {
                    props.onCapture(blob, dataUri);
                }
            });
        });
    }

    return (
        <div className="video-responsive" style={{position: 'relative'}}>
            {processingImage && (<div style={
                {
                    position:'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#FFF',
                    opacity: 0.8
                }
                }>

            </div>)}
            <video id="#v" width="100%" ref={videoRef} />
            {props.children}
        </div>
    )
}

export default WebcamCapture
