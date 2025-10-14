import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.16';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Appeler la fonction de suppression des cartes inactives
    const { error } = await supabase.rpc('delete_inactive_mcards');

    if (error) {
      console.error('Erreur lors de la suppression des cartes inactives:', error);
      throw error;
    }

    console.log('✅ Cartes inactives supprimées avec succès');

    return new Response(
      JSON.stringify({ success: true, message: 'Cartes inactives supprimées' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
