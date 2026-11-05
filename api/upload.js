// API Serverless: Upload de Imagens em Nuvem para Supabase Storage
// Suporte a Base64, Imagens de Capa e Imagens Embutidas no Rich Text (Quill/TipTap)
const { requireAdmin } = require('./_authorization');
const { getDbPool } = require('../lib/db-pool');
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
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
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

  if (req.body != null && (typeof req.body !== 'object' || Array.isArray(req.body))) {
    return res.status(400).json({ error: 'Corpo JSON deve ser um objeto.' });
  }

  if (!await requireAdmin(req, res, {url:SUPABASE_URL,anonKey:SUPABASE_ANON_KEY})) return;

  try {
    const body = req.body || {};
    let { filename, fileData, base64, contentType = 'image/jpeg', folder = 'uploads' } = body;

    if ((filename != null && typeof filename !== 'string') ||
        typeof contentType !== 'string' || typeof folder !== 'string' ||
        !/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(folder)) {
      return res.status(400).json({ success: false, message: 'Nome, tipo ou pasta de imagem inválidos.' });
    }

    // Se o base64 vier com data URI (ex: data:image/png;base64,iVBORw0KGgo...)
    const rawData = base64 || fileData;
    if (typeof rawData !== 'string' || !rawData) {
      return res.status(400).json({ success: false, message: 'Nenhuma imagem recebida (base64 ou fileData obrigatório).' });
    }

    let cleanBase64 = rawData;
    if (rawData.includes(';base64,')) {
      const parts = rawData.split(';base64,');
      const mimeMatch = parts[0].match(/data:(.*?)$/);
      if (mimeMatch) contentType = mimeMatch[1];
      cleanBase64 = parts[1];
    }

    // Bound encoded size before regex/decoding to avoid excessive work.
    if (cleanBase64.length > Math.ceil(10485760 / 3) * 4) return res.status(413).json({success:false,message:'Imagem excede 10 MiB.'});
    // MIME participa da extensão e da URL: não aceitar separadores ou parâmetros.
    if (!/^image\/[A-Za-z0-9.+-]+$/.test(contentType) ||
        (cleanBase64.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) ||
        !cleanBase64) {
      return res.status(400).json({ success: false, message: 'Tipo ou conteúdo base64 de imagem inválido.' });
    }

    // Existing documented blog-images bucket limit: 10 MiB; no active SVG uploads.
    const imageBytes = Buffer.from(cleanBase64, 'base64');
    if (imageBytes.length > 10485760) return res.status(413).json({success:false,message:'Imagem excede 10 MiB.'});
    const signatures = {
      'image/jpeg': b => b.length >= 3 && b[0]===255 && b[1]===216 && b[2]===255,
      'image/png': b => b.length >= 8 && b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
      'image/gif': b => b.length >= 6 && /^(GIF87a|GIF89a)$/.test(b.subarray(0,6).toString('ascii')),
      'image/webp': b => b.length >= 12 && b.subarray(0,4).toString('ascii')==='RIFF' && b.subarray(8,12).toString('ascii')==='WEBP'
    };
    if (!signatures[contentType]?.(imageBytes)) return res.status(415).json({success:false,message:'Formato de imagem não permitido ou assinatura incompatível.'});

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

    // 1. Tentar upload para o Supabase Storage via REST com Pool
    if (SUPABASE_SERVICE_KEY) {
      try {
        const storageUploadUrl = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${uniqueFileName}`;
        const uploadRes = await getDbPool().fetchWithPool(storageUploadUrl, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': contentType,
            'x-upsert': 'true'
          },
          body: buffer
        }, { timeoutMs: 12000 });

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
      message: 'Erro interno ao realizar upload da imagem.'
    });
  }
};
