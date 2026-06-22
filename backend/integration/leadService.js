import { supabase } from './supabase';

const isMockEnabled = () => {
  return false;
};

const getLocalLeads = () => {
  const leads = localStorage.getItem('madhavam_leads');
  return leads ? JSON.parse(leads) : [];
};

const saveLocalLeads = (leads) => {
  localStorage.setItem('madhavam_leads', JSON.stringify(leads));
};

export const leadService = {
  async submitLead(leadData) {
    const payload = {
      name: leadData.name?.trim(),
      email: leadData.email?.trim(),
      phone: leadData.phone?.trim(),
      interest: leadData.interest || leadData.project || 'General',
      // Which form/page the enquiry came from, and the specific project (if any),
      // so the admin can tell which form was filled for which project.
      source: leadData.source || null,
      project_slug: leadData.project_slug || null,
      status: 'new',
      notes: leadData.notes || null,
    };

    if (isMockEnabled()) {
      const leads = getLocalLeads();
      const newLead = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...payload,
      };
      leads.push(newLead);
      saveLocalLeads(leads);
      return { data: newLead, error: null };
    }

    const { error } = await supabase
      .from('leads')
      .insert([payload]);
    return { data: error ? null : payload, error };
  },

  async getAllLeads() {
    if (isMockEnabled()) {
      return { data: getLocalLeads().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), error: null };
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateLeadStatus(id, status) {
    if (isMockEnabled()) {
      const leads = getLocalLeads();
      const index = leads.findIndex((l) => l.id === id);
      if (index !== -1) {
        leads[index].status = status;
        saveLocalLeads(leads);
        return { data: leads[index], error: null };
      }
      return { data: null, error: new Error('Lead not found') };
    }

    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select();
    return { data: data ? data[0] : null, error };
  },

  async deleteLead(id) {
    if (isMockEnabled()) {
      let leads = getLocalLeads();
      leads = leads.filter((l) => l.id !== id);
      saveLocalLeads(leads);
      return { error: null };
    }

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    return { error };
  },
};
