# Palavra do Dia

Projeto separado em frontend (React + Vite) e backend (Node + Express).

## Como executar

Em dois terminais:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

O frontend abre em `http://localhost:5173` e conversa com a API em `http://localhost:3001`.

## APIs de versículos e imagens

O projeto consulta [Free.Bible](https://free.bible/pt/developers/) para buscar versículos em português. É uma API pública, sem chave e com URLs estáveis. Há mensagens locais de reserva para que a experiência não pare caso a API externa falhe.

Cada categoria também busca uma imagem correspondente na [Openverse](https://api.openverse.org/). Somente fotos do Flickr com licença compatível com uso comercial são usadas, e os créditos são exibidos abaixo do cartão.

## Banco de dados recomendado

Para começar, recomendo **PostgreSQL + Cloudinary**:

- PostgreSQL: usuários, acessos, categorias, versículos salvos e metadados das imagens.
- Cloudinary: armazena e entrega as imagens com CDN; o banco guarda apenas a URL e dados da imagem.

Alternativas: Supabase (Postgres + Storage, muito prático), ou MongoDB Atlas + Cloudinary. Evite salvar os arquivos de imagem dentro do banco: armazene-os em object storage e salve as URLs no banco.
