// app/api/employee/update-employee/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  try {
    const { id, name, role, department, monthlySalary, isFieldCollector } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    // Update employee in Supabase - use correct column name "updatedAt"
    const { data, error } = await supabase
      .from('employee')
      .update({
        name,
        role,
        department,
        monthlySalary,
        isFieldCollector,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating employee:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Employee updated successfully',
      employee: data,
    });
  } catch (error: any) {
    console.error('Error in update employee API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
