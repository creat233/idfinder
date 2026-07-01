// Admin-triggered: broadcasts an "update available" notification to every user.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

// APK hosted on GitHub in the `/mise-a-jour/` folder of the main branch.
const DEFAULT_APK_URL =
  'https://github.com/finderid-app/finderid/raw/main/mise-a-jour/finderid-latest.apk';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Verify caller is an admin
    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace('Bearer ', '');
    if (!jwt) {
      return new Response(JSON.stringify({ error: 'unauthenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const caller = userData?.user;
    if (!caller) {
      return new Response(JSON.stringify({ error: 'unauthenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: adminRow } = await admin
      .from('admin_permissions')
      .select('user_id')
      .eq('user_id', caller.id)
      .maybeSingle();

    if (!adminRow) {
      return new Response(JSON.stringify({ error: 'forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const apkUrl: string = body.apk_url || DEFAULT_APK_URL;
    const version: string = body.version || 'nouvelle version';
    const title = `📲 Mise à jour disponible (${version})`;
    const message = `Une nouvelle version de Finder ID est disponible. Cliquez pour télécharger et installer l'APK.`;

    // Fetch all profiles in pages of 1000
    let from = 0;
    const pageSize = 1000;
    let totalInserted = 0;

    while (true) {
      const { data: profiles, error } = await admin
        .from('profiles')
        .select('id')
        .range(from, from + pageSize - 1);
      if (error) throw error;
      if (!profiles || profiles.length === 0) break;

      const rows = profiles.map((p) => ({
        user_id: p.id,
        type: 'app_update',
        title,
        message,
        is_read: false,
        action_url: apkUrl,
      }));

      const { error: insertErr } = await admin.from('notifications').insert(rows);
      if (insertErr) throw insertErr;

      totalInserted += rows.length;
      if (profiles.length < pageSize) break;
      from += pageSize;
    }

    return new Response(JSON.stringify({ ok: true, notified: totalInserted, apk_url: apkUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('broadcast-app-update error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
