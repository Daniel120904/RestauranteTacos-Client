export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-white">
            <h1 className="text-5xl font-bold text-center text-orange-500 mb-8">
                Restaurante de Tacos :)
            </h1>

            <div className="flex flex-col items-center space-y-6">
                <a
                    href="/pedido"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg shadow-md text-xl"
                >
                    Fazer Novo Pedido
                </a>

                <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">📜 Pedidos Existentes</h2>
                    <p className="text-gray-500">
                        (Aqui futuramente vamos listar todos os pedidos feitos.)
                    </p>
                </div>
            </div>
        </main>
    );
}

