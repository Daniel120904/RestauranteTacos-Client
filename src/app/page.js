import Link from "next/link"

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow p-8 text-center">
                <h1 className="text-3xl font-bold mb-6">🌮 Restaurante de Tacos</h1>

                <div className="flex flex-col space-y-4">
                    <Link
                        href="/criarPedido"
                        className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg"
                    >
                        🍽️ Fazer Novo Pedido
                    </Link>

                    <Link
                        href="/listarPedidos"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg"
                    >
                        📜 Pedidos em Andamento
                    </Link>
                </div>
            </div>
        </main>
    )
}
