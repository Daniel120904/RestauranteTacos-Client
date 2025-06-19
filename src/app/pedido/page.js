"use client"
import { useState, useEffect } from "react"
import axios from "axios"

export default function Pedido() {
    const [abaAtiva, setAbaAtiva] = useState("tacos")
    const [tacos, setTacos] = useState([])
    const [bebidas, setBebidas] = useState([])
    const [acompanhamentos, setAcompanhamentos] = useState([])

    const [pedido, setPedido] = useState({ tacos: {}, bebidas: {}, acompanhamentos: {} })

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

    // 🔍 Função para obter os dados da aba ativa
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
        <main className="min-h-screen bg-gray-50">
            {/* 🔥 Header */}
            <header className="bg-orange-500 text-white py-4 shadow-md">
                <div className="max-w-4xl mx-auto flex justify-around">
                    <button
                        className={`${
                            abaAtiva === "tacos" ? "font-bold underline" : ""
                        }`}
                        onClick={() => setAbaAtiva("tacos")}
                    >
                        Tacos
                    </button>
                    <button
                        className={`${
                            abaAtiva === "bebidas" ? "font-bold underline" : ""
                        }`}
                        onClick={() => setAbaAtiva("bebidas")}
                    >
                        Bebidas
                    </button>
                    <button
                        className={`${
                            abaAtiva === "acompanhamentos" ? "font-bold underline" : ""
                        }`}
                        onClick={() => setAbaAtiva("acompanhamentos")}
                    >
                        Acompanhamentos
                    </button>
                </div>
            </header>

            {/* 🗒️ Conteúdo */}
            <section className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4 capitalize">
                    {abaAtiva}
                </h2>
                {renderizarItens()}
            </section>
        </main>
    )
}

