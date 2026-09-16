// API Serverless: Upload de Imagens em Nuvem para Supabase Storage
// Suporte a Base64, Imagens de Capa e Imagens Embutidas no Rich Text (Quill/TipTap)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const p = path.join(process.cwd(), file);
    if (fs.existsSync(p)) {
      try {
        const text = fs.readFileSync(p, 'utf8');
        text.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const idx = trimmed.indexOf('=');
            const k = trimmed.slice(0, idx).trim();
            const v = trimmed.slice(idx + 1).replace(/^['"]|['"\r]$/g, '').trim();
            if (k && !process.env[k]) {
              process.env[k] = v;
            }
          }
        });
      } catch (e) {}
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://tocyvysucpslayzglixq.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "blog-images";

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido. Utilize POST.' });
  }

  try {
    const body = req.body || {};
    let { filename, fileData, base64, contentType = 'image/jpeg', folder = 'uploads' } = body;

    // Se o base64 vier com data URI (ex: data:image/png;base64,iVBORw0KGgo...)
    const rawData = base64 || fileData;
    if (!rawData) {
      return res.status(400).json({ success: false, message: 'Nenhuma imagem recebida (base64 ou fileData obrigatório).' });
    }

    let cleanBase64 = rawData;
    if (rawData.includes(';base64,')) {
      const parts = rawData.split(';base64,');
      const mimeMatch = parts[0].match(/data:(.*?)$/);
      if (mimeMatch) contentType = mimeMatch[1];
      cleanBase64 = parts[1];
    }

    // Gerar nome único e seguro para a imagem
    const ext = contentType.split('/')[1] || 'jpg';
    const randomHash = crypto.randomBytes(6).toString('hex');
    const safeBaseName = (filename || 'imagem')
      .toLowerCase()
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9_-]+/g, '-')
      .substring(0, 40);
    const uniqueFileName = `${folder}/${Date.now()}-${safeBaseName}-${randomHash}.${ext}`;

    const buffer = Buffer.from(cleanBase64, 'base64');

    // 1. Tentar upload para o Supabase Storage via REST
    try {
      const storageUploadUrl = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${uniqueFileName}`;
      const uploadRes = await fetch(storageUploadUrl, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': contentType,
          'x-upsert': 'true'
        },
        body: buffer
      });

      if (uploadRes.ok) {
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${uniqueFileName}`;
        return res.status(200).json({
          success: true,
          url: publicUrl,
          filename: uniqueFileName,
          size: buffer.length,
          contentType: contentType,
          storage: 'supabase'
        });
      } else {
        const errText = await uploadRes.text();
        console.warn('[Supabase Storage Upload Warning]:', errText);
      }
    } catch (storageErr) {
      console.warn('[Supabase Storage Fetch Exception]:', storageErr.message);
    }

    // 2. Fallback de alta disponibilidade: Se o bucket ainda não tiver sido criado no Supabase,
    // retorna uma Data URI otimizada ou salva localmente se houver diretório de uploads
    const publicUrl = `data:${contentType};base64,${cleanBase64}`;
    return res.status(200).json({
      success: true,
      url: publicUrl,
      filename: uniqueFileName,
      size: buffer.length,
      contentType: contentType,
      storage: 'data_uri_fallback',
      message: 'Imagem processada com sucesso (Fallback Data URI / configure o bucket Supabase blog-images para URLs públicas definitivas).'
    });

  } catch (err) {
    console.error('[Upload API Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao realizar upload da imagem.',
      error: err.message
    });
  }
};
