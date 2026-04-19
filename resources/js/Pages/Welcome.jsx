import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canLogin,
    canRegister,
    laravelVersion,
    phpVersion,
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Games CRM" />

            <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eef4ff_0%,#f8fafc_45%,#e5e7eb_100%)] text-slate-900">
                <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
                    <header className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
                                Games CRM
                            </p>
                            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                                Plataforma de juegos con Laravel, API y tiempo
                                real
                            </h1>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                                >
                                    Ir al panel
                                </Link>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link
                                            href={route('login')}
                                            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
                                        >
                                            Iniciar sesion
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={route('register')}
                                            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                                        >
                                            Crear cuenta
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="grid flex-1 gap-8 py-14 lg:grid-cols-[1.3fr_0.9fr]">
                        <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
                            <p className="max-w-2xl text-lg leading-8 text-slate-600">
                                Este proyecto usa Laravel como nucleo de una
                                plataforma de juegos: gestiona usuarios, roles,
                                juegos, sesiones, eventos de emocion, chat en
                                tiempo real y un microservicio externo para
                                reconocimiento facial.
                            </p>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                <FeatureCard
                                    title="Backend con criterio"
                                    text="Separacion clara entre vistas, API, permisos, sesiones y persistencia."
                                />
                                <FeatureCard
                                    title="Juego desacoplado"
                                    text="El juego cliente vive aparte y consume Laravel como un cliente real."
                                />
                                <FeatureCard
                                    title="Biometria integrada"
                                    text="Laravel coordina la verificacion y Python compara rostros desde Docker."
                                />
                                <FeatureCard
                                    title="Tiempo real"
                                    text="El chat usa Reverb y solo deja entrar a usuarios con acceso valido."
                                />
                            </div>
                        </section>

                        <aside className="space-y-6">
                            <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
                                <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
                                    Roles
                                </p>
                                <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
                                    <li>
                                        <strong className="text-white">
                                            Admin:
                                        </strong>{' '}
                                        gestiona usuarios, roles y el estado
                                        general del sistema.
                                    </li>
                                    <li>
                                        <strong className="text-white">
                                            Gestor:
                                        </strong>{' '}
                                        crea, edita y publica juegos desde el
                                        CRM.
                                    </li>
                                    <li>
                                        <strong className="text-white">
                                            Jugador:
                                        </strong>{' '}
                                        accede a juegos publicados, juega y
                                        genera datos de uso.
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                                    Stack
                                </p>
                                <p className="mt-4 text-sm leading-7 text-slate-600">
                                    Laravel {laravelVersion}, PHP {phpVersion},
                                    PostgreSQL, Inertia, React, Reverb, Python,
                                    DeepFace, Three.js y face-api.js.
                                </p>
                            </div>
                        </aside>
                    </main>
                </div>
            </div>
        </>
    );
}

function FeatureCard({ title, text }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
        </div>
    );
}
