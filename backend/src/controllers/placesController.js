import fetch from 'node-fetch';
import Place from '../models/Place.js'; 

const MUNICIPIOS_MA = [
    "São Luís",
    "São José de Ribamar",
    "Paço do Lumiar",
    
];

/**
 * Obtém a lista de municípios.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
export const getMunicipios = (req, res) => {
    const sortedMunicipios = [...MUNICIPIOS_MA].sort();
    res.json(sortedMunicipios);
};

/**
 * @param {Object} req
 * @param {Object} res 
 */
export const searchHealthUnits = async (req, res) => {
    const { category, municipio } = req.query;

    if (!category) {
        return res.status(400).json({ message: 'A categoria é obrigatória.' });
    }

    const apiKey = process.env.PLACES_API_KEY;
    if (!apiKey) {
        console.error('Chave de API do Places não configurada no servidor.');
        return res.status(500).json({ message: 'Chave de API não configurada no servidor.' });
    }

    let municipiosToSearch;
    if (municipio && municipio !== 'todos') {
        municipiosToSearch = [municipio];
    } else {
        municipiosToSearch = MUNICIPIOS_MA;
    }

    const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
    const resultsByMunicipality = {};

    const searchPromises = municipiosToSearch.map(async (muni) => {
        const requestBody = {
            textQuery: `${category} em ${muni}, Maranhão`,
            languageCode: 'pt-BR',
        };

        try {
            const googleResponse = await fetch(searchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.id'
                },
                body: JSON.stringify(requestBody),
            });

            if (!googleResponse.ok) {
                const errorBody = await googleResponse.text();
                console.error(`Erro na busca em ${muni} (${googleResponse.status}): ${googleResponse.statusText} - Corpo do erro: ${errorBody}`);

                // Fallback de dados: Tenta buscar do banco de dados
                const fallbackData = await Place.find({ municipio: muni, category: category });
                if (fallbackData.length > 0) {
                    console.warn(`Usando dados de fallback para ${muni} (${category}).`);
                    resultsByMunicipality[muni] = fallbackData.map(p => ({
                        displayName: p.displayName,
                        formattedAddress: p.formattedAddress,
                        nationalPhoneNumber: p.nationalPhoneNumber,
                        id: p.placeId // Garante que o ID do lugar esteja presente para traçar rota
                    }));
                }
                return;
            }

            const data = await googleResponse.json();
            if (data.places && data.places.length > 0) {
                resultsByMunicipality[muni] = data.places;

                // Armazena ou atualiza os resultados 
                for (const placeData of data.places) {
                    try {
                        await Place.findOneAndUpdate(
                            { placeId: placeData.id },
                            {
                                displayName: placeData.displayName,
                                formattedAddress: placeData.formattedAddress,
                                nationalPhoneNumber: placeData.nationalPhoneNumber,
                                municipio: muni,
                                category: category,
                                },
                            { upsert: true, new: true }
                        );
                    } catch (dbError) {
                        console.error(`Erro ao salvar/atualizar lugar no DB para ${placeData.id}:`, dbError);
                    }
                }
            }
        } catch (error) {
            console.error(`Erro na requisição para o município ${muni}:`, error);
            const fallbackData = await Place.find({ municipio: muni, category: category });
            if (fallbackData.length > 0) {
                console.warn(`Usando dados de fallback para ${muni} (${category}).`);
                resultsByMunicipality[muni] = fallbackData.map(p => ({
                    displayName: p.displayName,
                    formattedAddress: p.formattedAddress,
                    nationalPhoneNumber: p.nationalPhoneNumber,
                    id: p.placeId 
                }));
            }
        }
    });

    try {
        await Promise.all(searchPromises);
        res.json(resultsByMunicipality);
    } catch (error) {
        console.error("Erro geral ao processar as buscas:", error);
        res.status(500).json({ message: 'Erro interno do servidor ao processar buscas.' });
    }
};
