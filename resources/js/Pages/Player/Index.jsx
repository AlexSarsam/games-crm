import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function PlayerIndex({ games }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Juegos Disponibles
                </h2>
            }
        >
            <Head title="Jugar" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {games.length === 0 ? (
                        <p className="text-center text-gray-500">No hay juegos disponibles en este momento.</p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {games.map((game) => (
                                <div key={game.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900">{game.title}</h3>
                                        {game.description && (
                                            <p className="mt-2 text-sm text-gray-600">{game.description}</p>
                                        )}
                                        <div className="mt-4">
                                            <Link
                                                href={route('play.show', game.id)}
                                                className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                            >
                                                ¡Jugar!
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
