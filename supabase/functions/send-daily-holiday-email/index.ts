
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface Holiday {
  date: string; // MM-DD format
  subject: string;
  message: string;
}

// NOTE: Pour l'instant, nous ne gérons que les fêtes à date fixe.
// Les fêtes mobiles (Pâques, Ramadan, etc.) doivent être envoyées manuellement.
const holidays: Holiday[] = [
  {
    date: '01-01',
    subject: "Bonne Année ! ✨ Meilleurs vœux pour la nouvelle année !",
    message: `<h1>Bonne et Heureuse Année !</h1>
<p>Bonjour,</p>
<p>Toute l'équipe de FinderID vous souhaite une excellente nouvelle année !</p>
<p>Que cette année vous apporte la santé, le bonheur et la réussite dans tous vos projets.</p>
<p>Nous sommes ravis de vous compter parmi nous et nous vous remercions pour votre confiance.</p>
<p>À une nouvelle année de sécurité et de sérénité pour vos documents !</p>
<p>L'équipe FinderID</p>`
  },
  {
    date: '02-14',
    subject: "💖 Célébrez l'amour avec FinderID !",
    message: `<h1>Joyeuse Saint-Valentin !</h1>
<p>Bonjour,</p>
<p>En cette journée dédiée à l'amour, toute l'équipe de FinderID vous souhaite une magnifique Saint-Valentin.</p>
<p>Protégez ce qui compte le plus, y compris les cadeaux que vous offrez à vos proches.</p>
<p>Avec tout notre amour,</p>
<p>L'équipe FinderID</p>`
  },
  {
    date: '03-08',
    subject: "♀️ Bonne Journée Internationale des Femmes !",
    message: `<h1>Bonne Fête à toutes les femmes !</h1>
<p>Bonjour,</p>
<p>En cette Journée Internationale des Droits des Femmes, FinderID célèbre toutes les femmes qui, par leur force et leur résilience, inspirent le monde.</p>
<p>Nous sommes fiers de compter tant de femmes extraordinaires dans notre communauté.</p>
<p>L'équipe FinderID</p>`
  },
  {
    date: '04-04',
    subject: "🇸🇳 Bonne Fête de l'Indépendance du Sénégal !",
    message: `<h1>Joyeuse Fête de l'Indépendance !</h1>
<p>Bonjour,</p>
<p>En ce jour de fête nationale, toute l'équipe de FinderID souhaite une excellente Fête de l'Indépendance à toute la communauté sénégalaise.</p>
<p>Ensemble, continuons de construire un avenir sûr et serein.</p>
<p>L'équipe FinderID</p>`
  },
  {
    date: '05-01',
    subject: "Bonne Fête du Travail ! - FinderID",
    message: `<h1>Bonne Fête du 1er Mai !</h1>
<p>Bonjour,</p>
<p>En ce jour de la Fête du Travail, l'équipe de FinderID salue le dévouement et les efforts de tous les travailleurs.</p>
<p>Votre contribution est essentielle à la construction d'un avenir meilleur. Nous vous souhaitons une excellente journée de repos bien mérité.</p>
<p>L'équipe FinderID</p>`
  },
  {
    date: '08-15',
    subject: "Bonne fête de l'Assomption ! - FinderID",
    message: `<h1>Bonne Fête de l'Assomption !</h1>
<p>Bonjour,</p>
<p>L'équipe de FinderID souhaite une très belle fête de l'Assomption à toute la communauté chrétienne.</p>
<p>Que cette journée vous soit douce et sereine.</p>
<p>Cordialement,</p>
<p>L'équipe FinderID</p>`
  },
  {
    date: '09-21',
    subject: "🕊️ Célébrons la Journée Internationale de la Paix avec FinderID",
    message: `<h1>Journée Internationale de la Paix</h1>
<p>Bonjour,</p>
<p>En cette Journée Internationale de la Paix, unissons nos voix pour un monde plus sûr et plus serein.</p>
<p>FinderID s'engage pour la sécurité de vos biens, une petite contribution à la tranquillité d'esprit.</p>
<p>Ensemble, cultivons la paix.</p>
<p>L'équipe FinderID</p>`
  },
  {
    date: '11-01',
    subject: "En cette fête de la Toussaint - FinderID",
    message: `<h1>Fête de la Toussaint</h1>
<p>Bonjour,</p>
<p>En ce jour de la Toussaint, l'équipe de FinderID vous accompagne de ses pensées.</p>
<p>Nous souhaitons une journée de recueillement et de paix à tous ceux qui célèbrent.</p>
<p>Cordialement,</p>
<p>L'équipe FinderID</p>`
  },
  {
    date: '12-25',
    subject: "Joyeux Noël de la part de l'équipe FinderID ! 🎄",
    message: `<h1>Joyeux Noël !</h1>
<p>Bonjour,</p>
<p>Toute l'équipe de FinderID vous souhaite un très joyeux Noël rempli de joie, de paix et de moments chaleureux avec vos proches.</p>
<p>Que la magie de Noël illumine votre foyer.</p>
<p>Cordialement,</p>
<p>L'équipe FinderID</p>`
  },
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (_req: Request) => {
  if (_req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const today = new Date();
    const month = String(today.getUTCMonth() + 1).padStart(2, '0');
    const day = String(today.getUTCDate()).padStart(2, '0');
    const todayDateString = `${month}-${day}`;
    
    console.log(`Checking for holidays on: ${todayDateString}`);

    const holiday = holidays.find(h => h.date === todayDateString);

    if (holiday) {
      console.log(`Today is a holiday: ${holiday.subject}. Sending bulk email.`);
      
      const { error: functionError } = await supabaseClient.functions.invoke('send-bulk-email', {
        body: { subject: holiday.subject, htmlContent: holiday.message },
      });

      if (functionError) {
        throw new Error(`Failed to invoke send-bulk-email: ${functionError.message}`);
      }
      
      return new Response(JSON.stringify({ message: `Successfully triggered bulk email for ${holiday.subject}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      console.log('No fixed-date holiday today.');
      return new Response(JSON.stringify({ message: 'No fixed-date holiday today.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
  } catch (error) {
    console.error('Error in holiday email function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
