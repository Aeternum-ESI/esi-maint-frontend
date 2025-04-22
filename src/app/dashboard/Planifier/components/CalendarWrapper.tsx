"use client";

import { createPreventiveTask, CreatePreventiveTaskData } from '@/app/actions/tasks.action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset, Category } from '@/lib/types';
import { useState } from 'react';
import { Calendar } from './Calendar';
import { PlanificationForm } from './PlanificationForm';

export function CalendarWrapper({ 
  assets, 
  categories 
}: { 
  assets: Asset[];
  categories: Category[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSubmit = async (data: CreatePreventiveTaskData) => {
    try {
      const result = await createPreventiveTask(data);
      return result;
    } catch (error) {
      console.error('Error submitting task:', error);
      return { success: false, message: "Une erreur est survenue" };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Date de début</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            minDate={new Date()}
          />
          
          {selectedDate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-medium">Date sélectionnée:</p>
              <p>{selectedDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Détails de la tâche</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanificationForm
            selectedDate={selectedDate}
            onSubmit={handleSubmit}
            assets={assets}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}