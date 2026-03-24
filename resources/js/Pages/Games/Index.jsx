import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function GamesIndex({ games }) {
    function handleDelete(game) {
        if (confirm(`¿Eliminar "${game.title}"?`)) {
            router.delete(route('games.destroy', game.id));
        }
    }

    function handleToggle(game) {
        router.patch(route('games.togglePublish', game.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Gestión de Juegos
                    </h2>
                    <Link
                        href={route('games.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        + Nuevo Juego
                    </Link>
                </div>
            }
        >
            <Head title="Juegos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Título</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Creador</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {games.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No hay juegos registrados.</td>
                                    </tr>
                                )}
                                {games.map((game) => (
                                    <tr key={game.id}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{game.title}</div>
                                            <div className="text-sm text-gray-500">{game.description}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {game.creator?.name ?? '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                    game.is_published
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {game.is_published ? 'Publicado' : 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="space-x-2 px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleToggle(game)}
                                                className="rounded bg-yellow-100 px-2 py-1 text-yellow-800 hover:bg-yellow-200"
                                            >
                                                {game.is_published ? 'Despublicar' : 'Publicar'}
                                            </button>
                                            <Link
                                                href={route('games.edit', game.id)}
                                                className="rounded bg-blue-100 px-2 py-1 text-blue-800 hover:bg-blue-200"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(game)}
                                                className="rounded bg-red-100 px-2 py-1 text-red-800 hover:bg-red-200"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
