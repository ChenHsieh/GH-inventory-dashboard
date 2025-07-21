import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchPlantInventory = async () => {
  try {
    const { data, error } = await supabase
      .from('plant_inventory')
      .select('*')
      .eq('Group', 'LSG');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch plant inventory:', error);
    throw error;
  }
};
