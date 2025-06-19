"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link";

export default function Pedidos() {
    const [pedidos, setPedidos] = useState([])
    const [tiposPagamento, setTiposPagamento] = useState({})
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState({}) // { pedidoId: tipoPagamentoId }
    const [statusMensagem, setStatusMensagem] = useState("")

    // 🔄 Buscar pedidos SEM pagamento
    useEffect(() => {
        axios.get("http://localhost:8080/api/pedidos").then((res) => {
            const pedidosSemPagamento = res.data.filter((p) => p.pagamento === null)
            setPedidos(pedidosSemPagamento)
        })

        axios.get("http://localhost:8080/api/tipo-pagamento").then((res) => {
            const pagamentos = {}
            res.data.forEach((p) => {
                pagamentos[p.id] = p.nome
            })
            setTiposPagamento(pagamentos)
        })
    }, [])

    // 🔗 Finalizar pagamento
    const finalizarPagamento = async (pedidoId) => {
        try {
            const tipoPagamentoId = pagamentoSelecionado[pedidoId]
            if (!tipoPagamentoId) {
                alert("Selecione um tipo de pagamento antes de finalizar!")
                return
            }

            await axios.post(
                `http://localhost:8080/api/pedidos/${pedidoId}/pagamento`,
                { tipoPagamentoId: tipoPagamentoId }
            )

            setStatusMensagem("✅ Pagamento realizado com sucesso!")
            setPedidos((prev) => prev.filter((p) => p.id !== pedidoId))
        } catch (error) {
            console.error(error)
            setStatusMensagem("❌ Erro ao finalizar pagamento.")
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="p-6">
                {/* 🔙 Botão de voltar */}
                <Link href="/" className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    ⬅️ Voltar para Home
                </Link>
            <h1 className="text-3xl font-bold mb-6">📜 Pedidos em Andamento</h1>

            {pedidos.length === 0 ? (
                <p className="text-gray-500">Nenhum pedido em andamento.</p>
            ) : (
                <div className="space-y-6">
                    {pedidos.map((pedido) => (
                        <div
                            key={pedido.id}
                            className="bg-white p-6 rounded-lg shadow flex flex-col space-y-3"
                        >
                            <h2 className="text-xl font-semibold">
                                Cliente: {pedido.nomeCliente}
                            </h2>
                            <p className="text-gray-600">
                                Valor Total: <strong>R$ {pedido.valorTotal.toFixed(2)}</strong>
                            </p>

                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    💳 Selecione o pagamento:
                                </label>
                                <select
                                    className="border rounded px-3 py-2 w-full"
                                    value={pagamentoSelecionado[pedido.id] || ""}
                                    onChange={(e) =>
                                        setPagamentoSelecionado((prev) => ({
                                            ...prev,
                                            [pedido.id]: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="">Selecione...</option>
                                    {Object.entries(tiposPagamento).map(([id, nome]) => (
                                        <option key={id} value={id}>
                                            {nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                disabled={!pagamentoSelecionado[pedido.id]}
                                onClick={() => finalizarPagamento(pedido.id)}
                                className={`${
                                    pagamentoSelecionado[pedido.id]
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                } text-white py-2 px-4 rounded`}
                            >
                                ✅ Finalizar Pagamento
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {statusMensagem && (
                <p className="mt-6 text-center text-sm">{statusMensagem}</p>
            )}
                </div>
        </main>
    )
}
