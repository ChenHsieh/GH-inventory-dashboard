import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Since this is a public dashboard
    autoRefreshToken: false,
  },
  db: {
    schema: 'public'
  }
});

export const fetchPlantInventory = async () => {
  try {
    // Use more specific query with error handling
    const { data, error, count } = await supabase
      .from('plant_inventory')
      .select('*', { count: 'exact' })
      .eq('Group', 'LSG')
      .order('Plant #', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }

    console.log(`Successfully fetched ${count} LSG plants from Supabase`);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch plant inventory:', error);
    throw error;
  }
};

// Optional: Add a function to test the connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('plant_inventory')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    return { success: true, message: 'Connection successful' };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown connection error' 
    };
  }
};

// Add real-time subscription capability (optional)
export const subscribeToPlantUpdates = (callback: (payload: any) => void) => {
  return supabase
    .channel('plant_inventory_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'plant_inventory',
        filter: 'Group=eq.LSG'
      },
      callback
    )
    .subscribe();
};
