export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  styles: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    headerStyle: 'modern' | 'classic' | 'minimal' | 'corporate';
    layout: 'standard' | 'compact' | 'detailed';
    fontFamily: string;
  };
  customColors?: string[]; // Max 5 couleurs personnalisées
}

export const invoiceTemplates: InvoiceTemplate[] = [
  {
    id: 'modern',
    name: 'Moderne',
    description: 'Design moderne avec dégradés et style contemporain',
    preview: '/templates/modern-preview.png',
    styles: {
      primaryColor: 'hsl(var(--primary))',
      backgroundColor: 'hsl(var(--background))',
      textColor: 'hsl(var(--foreground))',
      borderColor: 'hsl(var(--border))',
      headerStyle: 'modern',
      layout: 'standard',
      fontFamily: 'Inter'
    }
  },
  {
    id: 'classic',
    name: 'Classique',
    description: 'Style professionnel et intemporel',
    preview: '/templates/classic-preview.png',
    styles: {
      primaryColor: 'hsl(220, 70%, 50%)',
      backgroundColor: 'hsl(0, 0%, 100%)',
      textColor: 'hsl(0, 0%, 15%)',
      borderColor: 'hsl(220, 13%, 91%)',
      headerStyle: 'classic',
      layout: 'standard',
      fontFamily: 'serif'
    }
  },
  {
    id: 'minimal',
    name: 'Minimaliste',
    description: 'Design épuré et minimal',
    preview: '/templates/minimal-preview.png',
    styles: {
      primaryColor: 'hsl(0, 0%, 20%)',
      backgroundColor: 'hsl(0, 0%, 100%)',
      textColor: 'hsl(0, 0%, 20%)',
      borderColor: 'hsl(0, 0%, 90%)',
      headerStyle: 'minimal',
      layout: 'compact',
      fontFamily: 'sans-serif'
    }
  },
  {
    id: 'corporate',
    name: 'Entreprise',
    description: 'Style formel pour les grandes entreprises',
    preview: '/templates/corporate-preview.png',
    styles: {
      primaryColor: 'hsl(215, 84%, 34%)',
      backgroundColor: 'hsl(0, 0%, 98%)',
      textColor: 'hsl(0, 0%, 10%)',
      borderColor: 'hsl(215, 20%, 80%)',
      headerStyle: 'corporate',
      layout: 'detailed',
      fontFamily: 'sans-serif'
    }
  },
  {
    id: 'creative',
    name: 'Créatif',
    description: 'Design coloré et créatif',
    preview: '/templates/creative-preview.png',
    styles: {
      primaryColor: 'hsl(271, 76%, 53%)',
      backgroundColor: 'hsl(0, 0%, 100%)',
      textColor: 'hsl(0, 0%, 15%)',
      borderColor: 'hsl(271, 30%, 85%)',
      headerStyle: 'modern',
      layout: 'standard',
      fontFamily: 'sans-serif'
    }
  },
  {
    id: 'elegant',
    name: 'Élégant',
    description: 'Design raffiné et élégant',
    preview: '/templates/elegant-preview.png',
    styles: {
      primaryColor: 'hsl(350, 100%, 45%)',
      backgroundColor: 'hsl(0, 0%, 99%)',
      textColor: 'hsl(0, 0%, 12%)',
      borderColor: 'hsl(350, 20%, 85%)',
      headerStyle: 'classic',
      layout: 'detailed',
      fontFamily: 'serif'
    }
  }
];