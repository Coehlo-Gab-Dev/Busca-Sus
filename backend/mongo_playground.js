// MongoDB Playground

use('Desafio-05');

print("--- Inserindo um novo usuário (se não existir) ---");
db.users.updateOne(
  { email: "teste@example.com" },
  {
    $setOnInsert: {
      username: "UsuarioTeste",
      email: "teste@example.com",
      
      role: "user",
      createdAt: new Date()
    }
  },
  { upsert: true } // Insere se não existir
);

// Inserir um usuário com role de admin para efetur  testes de autorização
db.users.updateOne(
  { email: "admin@example.com" },
  {
    $setOnInsert: {
      username: "AdminUser",
      email: "admin@example.com",
      role: "admin",
      createdAt: new Date()
    }
  },
  { upsert: true }
);

// 2. Buscar todos os usuários
print("\n--- Buscando todos os usuários ---");
db.users.find({});

// 3. Buscar um usuário específico pelo email
print("\n--- Buscando usuário por email ---");
db.users.find({ email: "teste@example.com" });

// 4. Atualizar o papel  de um usuário
print("\n--- Atualizando o papel de um usuário ---");
db.users.updateOne(
  { email: "teste@example.com" },
  { $set: { role: "admin" } }
);

// Verifique a atualização
print("\n--- Verificando o papel atualizado ---");
db.users.find({ email: "teste@example.com" });

print("\n--- Inserindo alguns dados de lugares (se não existirem) ---");
db.places.updateMany(
  {
    $or: [
      { placeId: "test_place_id_1" },
      { placeId: "test_place_id_2" }
    ]
  },
  {
    $setOnInsert: {
      placeId: "test_place_id_1",
      displayName: { text: "Clínica Saúde Boa", languageCode: "pt-BR" },
      formattedAddress: "Rua Exemplo, 10, São Luís - MA",
      nationalPhoneNumber: "+5598123456789",
      municipio: "São Luís",
      category: "Clínica Geral",
      geometry: { location: { lat: -2.53073, lng: -44.3068 }, viewport: {} },
      createdAt: new Date()
    }
  },
  { upsert: true }
);

db.places.updateMany(
  { placeId: "test_place_id_2" },
  {
    $setOnInsert: {
      placeId: "test_place_id_2",
      displayName: { text: "Posto Médico Teste", languageCode: "pt-BR" },
      formattedAddress: "Av. Fictícia, 50, São José de Ribamar - MA",
      nationalPhoneNumber: "+5598987654321",
      municipio: "São José de Ribamar",
      category: "Posto de Saúde",
      geometry: { location: { lat: -2.5936, lng: -44.0531 }, viewport: {} },
      createdAt: new Date()
    }
  },
  { upsert: true }
);


// 2. Buscar todos os lugares
print("\n--- Buscando todos os lugares ---");
db.places.find({});

// 3. Buscar lugares por município e categoria
print("\n--- Buscando lugares em São Luís na categoria 'Clínica Geral' ---");
db.places.find({ municipio: "São Luís", category: "Clínica Geral" });

// 4. Agregações: Contar lugares por município
print("\n--- Contando lugares por município ---");
db.places.aggregate([
  { $group: { _id: "$municipio", count: { $sum: 1 } } }
]);



// ->NÃO IMPLEMENTADO<-
// 5. Deletar lugares de teste (use com cautela!)
//print("\n--- Deletando lugares de teste (use com cautela!) ---");
//db.places.deleteMany({ placeId: { $in: ["test_place_id_1", "test_place_id_2"] } });


// --- Comandos básicos de shell (apenas para referência, execute linha a linha) ---
// show dbs;             // Mostra todos os bancos de dados
// show collections;     // Mostra todas as coleções no banco de dados atual
// db.users.countDocuments({}); // Conta o número de documentos na coleção users
