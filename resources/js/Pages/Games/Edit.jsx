import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function GamesEdit({ game }) {
    const { data, setData, patch, processing, errors } = useForm({
        title: game.title,
        description: game.description ?? '',
        url: game.url,
    });

    function handleSubmit(event) {
        event.preventDefault();
        patch(route('games.update', game.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Editar Juego
                </h2>
            }
        >
            <Head title="Editar Juego" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Titulo
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(event) =>
                                        setData('title', event.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Descripcion
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(event) =>
                                        setData(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    URL o ruta del juego
                                </label>
                                <input
                                    type="text"
                                    value={data.url}
                                    onChange={(event) =>
                                        setData('url', event.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="https://ejemplo.com/juego o /Runner3D/dist/index.html"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Puedes usar una URL externa o una ruta
                                    interna que empiece por /.
                                </p>
                                {errors.url && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.url}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <Link
                                    href={route('games.index')}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
