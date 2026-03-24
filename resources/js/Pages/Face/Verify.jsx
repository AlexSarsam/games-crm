import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Verify({ hasEnrolled }) {
    const { flash } = usePage().props;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [captured, setCaptured] = useState(null);

    const { setData, post, processing, errors } = useForm({ image: '' });

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
        video.srcObject?.getTracks().forEach((t) => t.stop());
        setStreaming(false);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('face.verify.check'));
    };

    if (!hasEnrolled) {
        return (
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Verificación Facial</h2>}>
                <Head title="Verificación Facial" />
                <div className="py-12">
                    <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <p className="text-gray-600">
                                Aún no tienes una imagen facial registrada.{' '}
                                <a href={route('face.enroll')} className="text-indigo-600 underline">
                                    Regístrala aquí
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Verificación Facial</h2>}>
            <Head title="Verificación Facial" />

            <div className="py-12">
                <div className="mx-auto max-w-lg space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg space-y-4">
                        <p className="text-gray-600 text-sm">
                            Captura una foto con tu cámara para verificar tu identidad.
                        </p>

                        {flash?.verified !== undefined && (
                            <div className={`rounded p-3 text-sm font-medium ${flash.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {flash.verified
                                    ? `Verificación correcta (distancia: ${flash.distance?.toFixed(3)})`
                                    : `Verificación fallida (distancia: ${flash.distance?.toFixed(3)}, umbral: ${flash.threshold?.toFixed(3)})`}
                            </div>
                        )}

                        {!streaming && !captured && (
                            <button onClick={startCamera} className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                                Activar cámara
                            </button>
                        )}

                        <video ref={videoRef} className={`w-full rounded ${streaming ? '' : 'hidden'}`} style={{ transform: 'scaleX(-1)' }} />
                        <canvas ref={canvasRef} className="hidden" />

                        {streaming && (
                            <button onClick={capture} className="w-full rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
                                Capturar foto
                            </button>
                        )}

                        {captured && (
                            <div className="space-y-3">
                                <img src={captured} alt="Vista previa" className="w-full rounded border" />
                                <form onSubmit={submit} className="space-y-3">
                                    {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Verificando...' : 'Verificar identidad'}
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
