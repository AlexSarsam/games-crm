import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Enroll({ hasEnrolled }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [captured, setCaptured] = useState(null);

    const { setData, post, processing, errors, recentlySuccessful } = useForm({
        image: '',
    });

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
    };

    const capture = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCaptured(dataUrl);
        setData('image', dataUrl);

        // Stop camera
        video.srcObject?.getTracks().forEach((t) => t.stop());
        setStreaming(false);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('face.enroll.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Registro Facial</h2>}>
            <Head title="Registro Facial" />

            <div className="py-12">
                <div className="mx-auto max-w-lg space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        {hasEnrolled && (
                            <div className="mb-4 rounded bg-green-100 p-3 text-green-800 text-sm">
                                Ya tienes una imagen facial registrada. Puedes reemplazarla capturando una nueva.
                            </div>
                        )}

                        <p className="mb-4 text-gray-600 text-sm">
                            Captura una foto con tu cámara para registrar tu identidad facial. Esta imagen se usará
                            para verificarte en el futuro.
                        </p>

                        {!streaming && !captured && (
                            <button
                                onClick={startCamera}
                                className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                            >
                                Activar cámara
                            </button>
                        )}

                        <video ref={videoRef} className={`mt-4 w-full rounded ${streaming ? '' : 'hidden'}`} style={{ transform: 'scaleX(-1)' }} />
                        <canvas ref={canvasRef} className="hidden" />

                        {streaming && (
                            <button
                                onClick={capture}
                                className="mt-3 w-full rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                            >
                                Capturar foto
                            </button>
                        )}

                        {captured && (
                            <div className="mt-4 space-y-4">
                                <img src={captured} alt="Vista previa" className="w-full rounded border" />
                                <form onSubmit={submit} className="space-y-3">
                                    {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar imagen facial'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setCaptured(null); setData('image', ''); }}
                                        className="w-full rounded border px-4 py-2 text-gray-700 hover:bg-gray-50"
                                    >
                                        Repetir captura
                                    </button>
                                </form>
                            </div>
                        )}

                        {recentlySuccessful && (
                            <p className="mt-3 text-emerald-600 text-sm font-medium">
                                Imagen registrada correctamente.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
