import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Verify({ hasEnrolled, redirectTo }) {
    const { flash } = usePage().props;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [captured, setCaptured] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        image: '',
        redirect: redirectTo ?? '',
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
        video.srcObject?.getTracks().forEach((track) => track.stop());
        setStreaming(false);
    };

    const submit = (event) => {
        event.preventDefault();
        post(route('face.verify.check'));
    };

    if (!hasEnrolled) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold text-gray-800">
                        Verificacion Facial
                    </h2>
                }
            >
                <Head title="Verificacion Facial" />
                <div className="py-12">
                    <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                        <div className="rounded-lg bg-white p-6 shadow">
                            <p className="text-gray-600">
                                Todavia no tienes una imagen facial registrada.{' '}
                                <Link
                                    href={route('face.enroll')}
                                    className="text-indigo-600 underline"
                                >
                                    Registrala aqui
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Verificacion Facial
                </h2>
            }
        >
            <Head title="Verificacion Facial" />

            <div className="py-12">
                <div className="mx-auto max-w-lg space-y-6 sm:px-6 lg:px-8">
                    <div className="space-y-4 rounded-lg bg-white p-6 shadow">
                        <p className="text-sm text-gray-600">
                            Captura una foto con tu camara para verificar tu
                            identidad antes de entrar al juego.
                        </p>

                        {flash?.verified !== undefined && (
                            <div
                                className={`rounded p-3 text-sm font-medium ${
                                    flash.verified
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {flash.verified
                                    ? `Verificacion correcta (distancia: ${flash.distance?.toFixed(3)})`
                                    : `Verificacion fallida (distancia: ${flash.distance?.toFixed(3)}, umbral: ${flash.threshold?.toFixed(3)})`}
                            </div>
                        )}

                        {!streaming && !captured && (
                            <button
                                onClick={startCamera}
                                className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                            >
                                Activar camara
                            </button>
                        )}

                        <video
                            ref={videoRef}
                            className={`w-full rounded ${
                                streaming ? '' : 'hidden'
                            }`}
                            style={{ transform: 'scaleX(-1)' }}
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {streaming && (
                            <button
                                onClick={capture}
                                className="w-full rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                            >
                                Capturar foto
                            </button>
                        )}

                        {captured && (
                            <div className="space-y-3">
                                <img
                                    src={captured}
                                    alt="Vista previa"
                                    className="w-full rounded border"
                                    style={{ transform: 'scaleX(-1)' }}
                                />
                                <form
                                    onSubmit={submit}
                                    className="space-y-3"
                                >
                                    <input
                                        type="hidden"
                                        value={data.redirect}
                                        readOnly
                                    />
                                    {errors.image && (
                                        <p className="text-sm text-red-600">
                                            {errors.image}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Verificando...'
                                            : 'Verificar identidad'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCaptured(null);
                                            setData('image', '');
                                        }}
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
