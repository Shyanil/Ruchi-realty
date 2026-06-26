import { supabase } from './supabase';

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

    const { error } = await supabase
      .from('leads')
      .insert([payload]);
    return { data: error ? null : payload, error };
  },

  async getAllLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateLeadStatus(id, status) {
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select();
    return { data: data ? data[0] : null, error };
  },

  async deleteLead(id) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    return { error };
  },
};
