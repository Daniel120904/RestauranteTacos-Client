"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link";

export default function Pedido() {
    const [abaAtiva, setAbaAtiva] = useState("tacos")
    const [tacos, setTacos] = useState([])
    const [bebidas, setBebidas] = useState([])
    const [acompanhamentos, setAcompanhamentos] = useState([])

    const [pedido, setPedido] = useState({
        tacos: {},
        bebidas: {},
        acompanhamentos: {},
    })

    const [nomeCliente, setNomeCliente] = useState("")
    const [statusMensagem, setStatusMensagem] = useState("")

    // 🔄 Carregar dados da API
    useEffect(() => {
        axios.get("http://localhost:8080/api/tacos").then((res) => setTacos(res.data))
        axios.get("http://localhost:8080/api/bebidas").then((res) => setBebidas(res.data))
        axios.get("http://localhost:8080/api/acompanhamentos").then((res) => setAcompanhamentos(res.data))
    }, [])

    // ➕ Adicionar item
    const adicionarItem = (categoria, id) => {
        setPedido((prev) => ({
            ...prev,
            [categoria]: { ...prev[categoria], [id]: (prev[categoria][id] || 0) + 1 },
        }))
    }

    // ➖ Remover item
    const removerItem = (categoria, id) => {
        setPedido((prev) => {
            const quantidadeAtual = prev[categoria][id] || 0
            if (quantidadeAtual <= 1) {
                const { [id]: _, ...rest } = prev[categoria]
                return { ...prev, [categoria]: rest }
            }
            return {
                ...prev,
                [categoria]: { ...prev[categoria], [id]: quantidadeAtual - 1 },
            }
        })
    }

    // 🔍 Obter itens da aba ativa
    const obterItens = () => {
        switch (abaAtiva) {
            case "tacos":
                return tacos
            case "bebidas":
                return bebidas
            case "acompanhamentos":
                return acompanhamentos
            default:
                return []
        }
    }

    // 💰 Calcular valor total
    const calcularTotal = () => {
        const calcularCategoria = (categoria, dados) => {
            return Object.entries(pedido[categoria] || {}).reduce((acc, [id, qtd]) => {
                const item = dados.find((i) => i.id === id)
                return acc + (item ? item.preco * qtd : 0)
            }, 0)
        }

        const total =
            calcularCategoria("tacos", tacos) +
            calcularCategoria("bebidas", bebidas) +
            calcularCategoria("acompanhamentos", acompanhamentos)

        return total
    }

    // 🚀 Enviar pedido para backend
    const finalizarPedido = async () => {
        try {
            const tacosIds = Object.keys(pedido.tacos)
            const bebidasIds = Object.keys(pedido.bebidas)
            const acompanhamentosIds = Object.keys(pedido.acompanhamentos)

            const payload = {
                nomeCliente,
                tacosIds,
                bebidasIds,
                acompanhamentosIds,
            }

            await axios.post("http://localhost:8080/api/pedidos", payload)

            setStatusMensagem("✅ Pedido realizado com sucesso!")
            setPedido({ tacos: {}, bebidas: {}, acompanhamentos: {} })
            setNomeCliente("")
        } catch (error) {
            console.error("Erro ao finalizar pedido:", error)
            setStatusMensagem("❌ Erro ao finalizar pedido.")
        }
    }

    const renderizarItens = () => {
        const itens = obterItens()
        const categoria = abaAtiva

        return itens.map((item) => (
            <div
                key={item.id}
                className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-4"
            >
                <div>
                    <h3 className="text-lg font-semibold">{item.nome || item.descricao}</h3>
                    <p className="text-gray-500">R$ {item.preco.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => removerItem(categoria, item.id)}
                    >
                        -
                    </button>
                    <span className="font-semibold">
            {pedido[categoria][item.id] || 0}
          </span>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => adicionarItem(categoria, item.id)}
                    >
                        +
                    </button>
                </div>
            </div>
        ))
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-6">
                {/* 🔙 Botão de voltar */}
                <Link href="/" className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    ⬅️ Voltar para Home
                </Link>
            {/* 🔥 Header */}
            <header className="bg-red-600 text-white py-4 shadow-md">
                <div className="max-w-4xl mx-auto flex justify-around">
                    <button
                        className={`${
                            abaAtiva === "tacos" ? "font-bold underline" : ""
                        }`}
                        onClick={() => setAbaAtiva("tacos")}
                    >
                        🌮 Tacos
                    </button>
                    <button
                        className={`${
                            abaAtiva === "bebidas" ? "font-bold underline" : ""
                        }`}
                        onClick={() => setAbaAtiva("bebidas")}
                    >
                        🥤 Bebidas
                    </button>
                    <button
                        className={`${
                            abaAtiva === "acompanhamentos" ? "font-bold underline" : ""
                        }`}
                        onClick={() => setAbaAtiva("acompanhamentos")}
                    >
                        🍟 Acompanhamentos
                    </button>
                </div>
            </header>

            {/* 🗒️ Conteúdo */}
            <section className="max-w-4xl mx-auto p-6 flex-1">
                <h2 className="text-2xl font-bold mb-4 capitalize">{abaAtiva}</h2>
                {renderizarItens()}
            </section>

            {/* 🛒 Resumo do Carrinho */}
            <footer className="bg-white shadow-md p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col space-y-2">
                        <input
                            type="text"
                            className="border rounded px-3 py-2"
                            placeholder="Nome do Cliente"
                            value={nomeCliente}
                            onChange={(e) => setNomeCliente(e.target.value)}
                        />

                        <div className="flex justify-between">
              <span className="font-semibold">
                Total: R$ {calcularTotal().toFixed(2)}
              </span>
                            <button
                                onClick={finalizarPedido}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                Finalizar Pedido
                            </button>
                        </div>

                        {statusMensagem && (
                            <p className="text-center text-sm">{statusMensagem}</p>
                        )}
                    </div>
                </div>
            </footer>
            </div>
        </main>
    )
}
