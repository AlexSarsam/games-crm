import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function UsersIndex({ users }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Usuarios
                </h2>
            }
        >
            <Head title="Usuarios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {user.role?.name ?? 'sin rol'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Link
                                                href={route('users.edit', user.id)}
                                                className="rounded bg-blue-100 px-2 py-1 text-blue-800 hover:bg-blue-200"
                                            >
                                                Editar
                                            </Link>
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
