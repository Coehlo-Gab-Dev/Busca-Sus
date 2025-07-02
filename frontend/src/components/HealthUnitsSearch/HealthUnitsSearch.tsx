import { useState, useEffect } from 'react';
import { fetchHealthUnits, fetchMunicipios } from '../../api';
import GoogleMap from "../Googlemap";
import MessageModal from "../MessageModal";
import './HealthUnitsSearch.css';

interface HealthUnit {
    id: string;
    displayName?: {
        text: string;
    };
    formattedAddress?: string;
    nationalPhoneNumber?: string;
}

interface HealthUnitSearchProps {
    onClose?: () => void;
}

const HealthUnitsSearch = ({ onClose }: HealthUnitSearchProps) => {
    const [category, setCategory] = useState<string>('');
    const [municipio, setMunicipio] = useState<string>('todos');
    const [municipios, setMunicipios] = useState<string[]>([]);
    const [healthUnits, setHealthUnits] = useState<Record<string, HealthUnit[]>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedDestination, setSelectedDestination] = useState<{
        place_id: string;
        name: string;
        formatted_address: string;
    } | null>(null);
    const [totalResults, setTotalResults] = useState<number>(0);

    // Adiciona listener para tecla ESC
    useEffect(() => {
        if (!onClose) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const showMessageModal = (message: string) => {
        setModalMessage(message);
        setShowModal(true);
    };

    const populateMunicipios = async () => {
        try {
            const municipiosData = await fetchMunicipios();
            setMunicipios(municipiosData.sort());
        } catch (e) {
            console.error("Erro ao carregar municípios:", e);
            showMessageModal("Erro ao carregar lista de municípios.");
        }
    };

    const fetchUnits = async () => {
        if (!category) {
            return;
        }

        setLoading(true);
        try {
            const dataByMunicipality = await fetchHealthUnits(category, municipio);
            setHealthUnits(dataByMunicipality);

            const total = (Object.values(dataByMunicipality) as HealthUnit[][])
                .reduce((sum, unitsArray) => sum + unitsArray.length, 0);

            setTotalResults(total);

        } catch (e) {
            console.error("Erro ao buscar unidades:", e);
            showMessageModal("Ocorreu um erro ao buscar os dados.");
            setHealthUnits({});
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    };

    const handleTraceRoute = (unit: HealthUnit) => {
        setSelectedDestination({
            place_id: unit.id,
            name: unit.displayName?.text || "Nome não disponível",
            formatted_address: unit.formattedAddress || "Não informado",
        });
    };

    useEffect(() => {
        populateMunicipios();
    }, []);

    useEffect(() => {
        if (category) {
            fetchUnits();
        }
    }, [category, municipio]);

    const renderResults = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Buscando unidades...</p>
                </div>
            );
        }

        if (!category) {
            return (
                <div className="empty-state">
                    <p>Selecione uma categoria para começar.</p>
                </div>
            );
        }

        if (Object.keys(healthUnits).length === 0) {
            return (
                <div className="empty-state">
                    <p>Nenhuma unidade encontrada.</p>
                </div>
            );
        }

        return (
            <div className='results-container'>
                <div className="total-results">
                    <p>Total: {totalResults} unidades</p>
                </div>

                {Object.keys(healthUnits).map((municipioName) => (
                    <div key={municipioName} className="municipio-section">
                        <h2 className="municipio-title">{municipioName}</h2>
                        {healthUnits[municipioName].map((unit) => (
                            <div key={unit.id} className="unit-card">
                                <h3 className="unit-name">{unit.displayName?.text || "Unidade de Saúde"}</h3>
                                <p className="unit-address">{unit.formattedAddress || "Endereço não disponível"}</p>
                                {unit.nationalPhoneNumber && (
                                    <p className="unit-phone">Telefone: {unit.nationalPhoneNumber}</p>
                                )}
                                <button
                                    onClick={() => handleTraceRoute(unit)}
                                    className="route-button"
                                >
                                    Traçar Rota
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="consulta-container">
            {/* Botão de fechar */}
            {onClose && (
                <button 
                    className="close-button"
                    onClick={onClose}
                    aria-label="Fechar busca de unidades de saúde"
                    title="Fechar"
                    style={{height: '50px', width: '50px', borderRadius: '20%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'}}
                >
                    X
                </button>
            )}
 
            <div className="background-container">
                <img
                    src={require("../../images/home.png")}
                    alt="Background"
                    className="background-image"
                />
            </div>
            <div className="form-container">
                <div className="form-group">
                    <label htmlFor="category-select" className="form-label">
                        Selecione a Categoria:
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Selecione uma categoria</option>
                        <option value="Clínica Geral">Clínica Geral</option>
                        <option value="Hospital">Hospital</option>
                        <option value="Farmácia">Farmácia</option>
                        <option value="Posto de Saúde">Posto de Saúde</option>
                        <option value="Laboratório">Laboratório</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="municipio-select" className="form-label">
                        Selecione o Município:
                    </label>
                    <select
                        id="municipio-select"
                        value={municipio}
                        onChange={(e) => setMunicipio(e.target.value)}
                        className="form-select"
                    >
                        <option value="todos">Todos</option>
                        {municipios.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="results-section">
                {renderResults()}
            </div>

            <GoogleMap
                destination={selectedDestination}
                onRouteCleared={() => setSelectedDestination(null)}
                showMessage={showMessageModal}
            />
            <MessageModal
                message={modalMessage}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />

            <section className="footer-section">
                <footer className="footer">
                    <div className="footer-logos">
                        <img src={require("../../images/inova.png")} alt="Logo INOVA" className="footer-logo" />
                        <img src={require("../../images/icon2.png")} alt="Logo Governo" className="footer-logo" />
                        <img src={require("../../images/secti.png")} alt="Logo SECTI" className="footer-logo" />
                    </div>
                    <div className="footer-contact">Contato: buscasusgp2@gmail.com</div>
                </footer>
            </section>
        </div>
    );
};

export default HealthUnitsSearch;