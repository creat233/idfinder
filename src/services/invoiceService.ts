import { supabase } from '@/integrations/supabase/client';
import { Invoice, InvoiceCreateData, InvoiceStats, InvoiceAnalytics } from '@/types/invoice';

export const fetchInvoices = async (mcardId: string): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('mcard_invoices')
    .select(`
      *,
      mcard_invoice_items (*)
    `)
    .eq('mcard_id', mcardId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data?.map(invoice => ({
    ...invoice,
    items: invoice.mcard_invoice_items || []
  })) || [];
};

export const createInvoice = async (invoiceData: InvoiceCreateData): Promise<Invoice> => {
  // Générer le numéro de facture
  const { data: invoiceNumber, error: numberError } = await supabase
    .rpc('generate_invoice_number');

  if (numberError) throw numberError;

  // Calculer le montant total
  const totalAmount = invoiceData.items.reduce((sum, item) => 
    sum + (item.quantity * item.unit_price), 0
  );

  // Préparer les données de la facture sans les items
  const { items, ...invoiceDataWithoutItems } = invoiceData;

  // Créer la facture
  const { data: invoice, error: invoiceError } = await supabase
    .from('mcard_invoices')
    .insert({
      ...invoiceDataWithoutItems,
      invoice_number: invoiceNumber,
      amount: totalAmount,
      status: 'pending',
      currency: 'FCFA'
    })
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // Créer les lignes de facture
  const itemsWithInvoiceId = items.map(item => ({
    ...item,
    invoice_id: invoice.id,
    total_price: item.quantity * item.unit_price
  }));

  const { data: invoiceItems, error: itemsError } = await supabase
    .from('mcard_invoice_items')
    .insert(itemsWithInvoiceId)
    .select();

  if (itemsError) throw itemsError;

  return {
    ...invoice,
    items: invoiceItems || []
  };
};

export const updateInvoice = async (id: string, updates: Partial<Invoice>): Promise<Invoice> => {
  const { data, error } = await supabase
    .from('mcard_invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteInvoice = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('mcard_invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getInvoiceStats = async (mcardId: string): Promise<InvoiceStats> => {
  const { data, error } = await supabase
    .from('mcard_invoices')
    .select('amount, status')
    .eq('mcard_id', mcardId);

  if (error) throw error;

  const stats = {
    total_invoices: data?.length || 0,
    total_amount: 0,
    paid_amount: 0,
    pending_amount: 0,
    overdue_amount: 0
  };

  data?.forEach(invoice => {
    stats.total_amount += invoice.amount;
    
    if (invoice.status === 'paid') {
      stats.paid_amount += invoice.amount;
    } else if (invoice.status === 'overdue') {
      stats.overdue_amount += invoice.amount;
    } else {
      stats.pending_amount += invoice.amount;
    }
  });

  return stats;
};

export const getInvoiceAnalytics = async (
  mcardId: string, 
  period: 'day' | 'week' | 'month' | 'year'
): Promise<InvoiceAnalytics[]> => {
  let dateFormat: string;
  let interval: string;

  switch (period) {
    case 'day':
      dateFormat = 'YYYY-MM-DD';
      interval = '30 days';
      break;
    case 'week':
      dateFormat = 'YYYY-"W"WW';
      interval = '12 weeks';
      break;
    case 'month':
      dateFormat = 'YYYY-MM';
      interval = '12 months';
      break;
    case 'year':
      dateFormat = 'YYYY';
      interval = '5 years';
      break;
  }

  // Calculer la date limite selon l'intervalle
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'day':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 jours
      break;
    case 'week':
      startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000); // 12 semaines
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate()); // 12 mois
      break;
    case 'year':
      startDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()); // 5 ans
      break;
  }

  const { data, error } = await supabase
    .from('mcard_invoices')
    .select('amount, status, created_at')
    .eq('mcard_id', mcardId)
    .gte('created_at', startDate.toISOString());

  if (error) throw error;

  // Grouper les données par période
  const grouped = data?.reduce((acc, invoice) => {
    const date = new Date(invoice.created_at);
    let periodKey: string;

    switch (period) {
      case 'day':
        periodKey = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        periodKey = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        periodKey = date.getFullYear().toString();
        break;
    }

    if (!acc[periodKey]) {
      acc[periodKey] = {
        period: periodKey,
        total_amount: 0,
        invoice_count: 0,
        paid_count: 0
      };
    }

    acc[periodKey].total_amount += invoice.amount;
    acc[periodKey].invoice_count += 1;
    
    if (invoice.status === 'paid') {
      acc[periodKey].paid_count += 1;
    }

    return acc;
  }, {} as Record<string, InvoiceAnalytics>) || {};

  return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));
};