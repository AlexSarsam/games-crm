import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import * as faceapi from 'face-api.js';
import { useEffect, useRef, useState } from 'react';

const EMOTION_INTERVAL_MS = 3000;

export default function PlayerPlay({ game }) {
    // Session state
    const [sessionId, setSessionId] = useState(null);
    const [score, setScore] = useState('');
    const [ended, setEnded] = useState(false);
    const [error, setError] = useState(null);

    // Emotion detection state
    const [currentEmotion, setCurrentEmotion] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    // Escuchar puntuación del juego en iframe
    useEffect(() => {
        function onMessage(e) {
            if (e.data?.type === 'gameOver') setScore(String(e.data.score));
        }
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, []);

    // Refs
    const startedRef = useRef(false);
    const videoRef = useRef(null);
    const sessionIdRef = useRef(null);
    const emotionIntervalRef = useRef(null);
    const iframeRef = useRef(null);

    useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);

    // Load face-api models
    useEffect(() => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ])
            .then(() => setModelsLoaded(true))
            .catch(() => setError('Detección de emociones no disponible.'));
    }, []);

    // Start game session
    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        fetch(`/api/games/${game.id}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
            credentials: 'same-origin',
        })
            .then((r) => r.json())
            .then((d) => setSessionId(d.session_id))
            .catch(() => setError('No se pudo iniciar la sesión.'));
    }, [game.id]);

    // Webcam + emotion detection
    useEffect(() => {
        if (!modelsLoaded || ended) return;

        let streamCamara = null;
        navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
            .then((camara) => {
                streamCamara = camara;
                if (videoRef.current) { videoRef.current.srcObject = camara; videoRef.current.play(); }
            })
            .catch(() => {});

        emotionIntervalRef.current = setInterval(async () => {
            if (!videoRef.current || !sessionIdRef.current) return;
            try {
                const deteccion = await faceapi
                    .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions();
                if (!deteccion) return;
                const [emocion, confianza] = topEmotion(deteccion.expressions);
                setCurrentEmotion(emocion);
                fetch(`/api/games/${game.id}/sessions/${sessionIdRef.current}/emotions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
                    credentials: 'same-origin',
                    body: JSON.stringify({ emotion: emocion, confidence: confianza, detected_at: new Date().toISOString() }),
                }).catch(() => {});
            } catch (_) {}
        }, EMOTION_INTERVAL_MS);

        return () => {
            clearInterval(emotionIntervalRef.current);
            streamCamara?.getTracks().forEach((pista) => pista.stop());
        };
    }, [modelsLoaded, ended, game.id]);

    function handleEndSession(e) {
        e.preventDefault();
        if (!sessionId) return;
        clearInterval(emotionIntervalRef.current);
        fetch(`/api/games/${game.id}/sessions/${sessionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
            credentials: 'same-origin',
            body: JSON.stringify({ score: parseInt(score, 10) }),
        })
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then(() => setEnded(true))
            .catch(() => setError('No se pudo guardar la puntuación.'));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('play.index')} className="text-sm text-indigo-600 hover:underline">
                        ← Volver
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">{game.title}</h2>
                    {currentEmotion && (
                        <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs text-indigo-700 capitalize">
                            {currentEmotion}
                        </span>
                    )}
                </div>
            }
        >
            <Head title={game.title} />

            {/* Hidden webcam for emotion detection */}
            <video ref={videoRef} className="hidden" muted playsInline />

            <div className="p-4">
                <div className="flex flex-col gap-4">
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div onClick={() => iframeRef.current?.focus()} className="cursor-pointer">
                        <iframe
                            ref={iframeRef}
                            src={game.url}
                            title={game.title}
                            className="h-[700px] w-full rounded-lg border shadow"
                            allowFullScreen
                            onLoad={() => iframeRef.current?.focus()}
                        />
                    </div>

                    {!ended ? (
                        <form onSubmit={handleEndSession} className="flex items-center gap-4">
                            <input
                                type="number"
                                min="0"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                placeholder="Tu puntuación"
                                required
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={!sessionId}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Terminar partida
                            </button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <p className="text-lg font-semibold text-green-700">¡Partida guardada! Puntuación: {score}</p>
                            <Link href={route('play.index')} className="mt-2 inline-block text-indigo-600 hover:underline">
                                Volver a los juegos
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return '';
}

// Recibe el objeto de expresiones { happy: 0.9, sad: 0.1, ... }
// y devuelve la emoción con mayor puntuación
function topEmotion(expressions) {
    return Object.entries(expressions).sort((a, b) => b[1] - a[1])[0];
}
